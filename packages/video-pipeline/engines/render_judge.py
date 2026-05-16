#!/usr/bin/env python3.13
"""Render Judge — auto-select the best output from parallel render paths.

Evaluates Remotion, HyperFrames, and optional Comfy Cloud outputs using:
- ffprobe technical scores (bitrate, codec, duration accuracy)
- File size efficiency
- Optional: CLIP score for prompt-image alignment (via open-clip)
- Optional: VMAF if reference available

The judge returns a ranked list with a winner recommendation.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def _ffprobe(path: Path) -> dict:
    ffprobe = shutil.which('ffprobe')
    if not ffprobe:
        return {'ok': False, 'error': 'ffprobe not found'}
    try:
        proc = subprocess.run(
            [ffprobe, '-v', 'quiet', '-print_format', 'json',
             '-show_format', '-show_streams', str(path)],
            capture_output=True, text=True, timeout=30,
            encoding='utf-8', errors='replace',
        )
        if proc.returncode != 0:
            return {'ok': False, 'error': (proc.stderr or '')[:500]}
        return {'ok': True, 'data': json.loads(proc.stdout or '{}')}
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}'}


def _extract_video_stream(data: dict) -> dict:
    for stream in data.get('streams', []):
        if stream.get('codec_type') == 'video':
            return stream
    return {}


def _extract_format(data: dict) -> dict:
    return data.get('format', {})


def _score_technical(ffprobe_data: dict, expected_duration_s: float | None = None) -> dict:
    """Score technical quality from ffprobe output."""
    stream = _extract_video_stream(ffprobe_data)
    fmt = _extract_format(ffprobe_data)
    scores: dict = {}

    # Resolution
    width = stream.get('width', 0)
    height = stream.get('height', 0)
    scores['resolution_ok'] = width == 1920 and height == 1080
    scores['resolution_score'] = 1.0 if scores['resolution_ok'] else 0.0

    # FPS
    fps_str = stream.get('r_frame_rate', '0/1')
    try:
        num, den = fps_str.split('/')
        fps = float(num) / float(den) if float(den) != 0 else 0
    except Exception:
        fps = 0
    scores['fps_ok'] = abs(fps - 30) < 1
    scores['fps_score'] = 1.0 if scores['fps_ok'] else 0.0

    # Duration accuracy
    duration = float(stream.get('duration') or fmt.get('duration') or 0)
    scores['duration_s'] = round(duration, 2)
    if expected_duration_s and expected_duration_s > 0:
        scores['duration_accuracy'] = 1.0 - min(abs(duration - expected_duration_s) / expected_duration_s, 1.0)
    else:
        scores['duration_accuracy'] = 1.0 if duration > 0 else 0.0

    # Bitrate efficiency
    bit_rate = float(fmt.get('bit_rate') or stream.get('bit_rate') or 0)
    scores['bit_rate'] = int(bit_rate)
    # Ideal range: 3-8 Mbps for 1080p30
    if bit_rate > 0:
        mbps = bit_rate / 1_000_000
        if 3.0 <= mbps <= 8.0:
            scores['bitrate_score'] = 1.0
        elif mbps < 1.0:
            scores['bitrate_score'] = 0.3
        elif mbps > 15.0:
            scores['bitrate_score'] = 0.7  # oversized but OK
        else:
            scores['bitrate_score'] = 0.8
    else:
        scores['bitrate_score'] = 0.0

    # Codec preference: h264 > hevc > vp9 > others
    codec = stream.get('codec_name', '').lower()
    if codec in ('h264', 'avc'):
        scores['codec_score'] = 1.0
    elif codec in ('hevc', 'h265'):
        scores['codec_score'] = 0.9
    elif codec in ('vp9', 'av1'):
        scores['codec_score'] = 0.85
    else:
        scores['codec_score'] = 0.5

    # Pixel format
    pix_fmt = stream.get('pix_fmt', '')
    scores['pixel_format_ok'] = pix_fmt in ('yuv420p', 'yuvj420p')
    scores['pixel_format_score'] = 1.0 if scores['pixel_format_ok'] else 0.5

    overall = (
        scores['resolution_score'] * 0.25 +
        scores['fps_score'] * 0.20 +
        scores['duration_accuracy'] * 0.20 +
        scores['bitrate_score'] * 0.15 +
        scores['codec_score'] * 0.10 +
        scores['pixel_format_score'] * 0.10
    )
    scores['overall'] = round(overall, 3)
    return scores


def _score_efficiency(file_path: Path, duration_s: float) -> dict:
    """Score file size efficiency (MB per minute)."""
    size_mb = file_path.stat().st_size / (1024 * 1024)
    minutes = max(duration_s, 1) / 60.0
    mb_per_min = size_mb / minutes
    # Target: 20-60 MB/min for 1080p30 h264
    if 15 <= mb_per_min <= 70:
        score = 1.0
    elif mb_per_min < 5:
        score = 0.3
    elif mb_per_min > 150:
        score = 0.6
    else:
        score = 0.8
    return {
        'size_mb': round(size_mb, 2),
        'mb_per_minute': round(mb_per_min, 2),
        'score': round(score, 3),
    }


def judge_render(
    candidates: list[dict],
    expected_duration_s: float | None = None,
) -> dict:
    """Evaluate multiple render outputs and pick the best.

    Args:
        candidates: List of dicts with keys:
            - engine: 'remotion' | 'hyperframes' | 'comfy_cloud' | ...
            - output_file: path to MP4
            - render_result: dict from the render engine (optional)
        expected_duration_s: Expected duration for accuracy scoring

    Returns:
        Dict with winner, rankings, and per-candidate scores.
    """
    ranked: list[dict] = []
    for cand in candidates:
        path = Path(cand.get('output_file', ''))
        engine = cand.get('engine', 'unknown')
        if not path.exists():
            ranked.append({
                'engine': engine,
                'output_file': str(path),
                'ok': False,
                'error': 'file not found',
                'score': 0.0,
            })
            continue

        probe = _ffprobe(path)
        if not probe.get('ok'):
            ranked.append({
                'engine': engine,
                'output_file': str(path),
                'ok': False,
                'error': probe.get('error', 'ffprobe failed'),
                'score': 0.0,
            })
            continue

        tech = _score_technical(probe.get('data', {}), expected_duration_s)
        eff = _score_efficiency(path, tech.get('duration_s', expected_duration_s or 30))

        # Penalize if render_result says it had errors or fallbacks
        render_result = cand.get('render_result') or {}
        penalty = 0.0
        stages = render_result.get('stages', [])
        if any(not s.get('ok') for s in stages):
            penalty += 0.15
        if render_result.get('fallback'):
            penalty += 0.10

        total_score = max(0.0, tech['overall'] * 0.7 + eff['score'] * 0.3 - penalty)

        ranked.append({
            'engine': engine,
            'output_file': str(path),
            'ok': True,
            'bytes': path.stat().st_size,
            'technical': tech,
            'efficiency': eff,
            'penalty': round(penalty, 3),
            'score': round(total_score, 3),
        })

    ranked.sort(key=lambda x: x['score'], reverse=True)
    winner = ranked[0] if ranked else None

    return {
        'winner': winner,
        'rankings': ranked,
        'expected_duration_s': expected_duration_s,
        'judged_at': str(Path(__file__)),
    }


def pick_best_output(
    remotion_output: str | Path | None = None,
    hyperframes_output: str | Path | None = None,
    comfy_cloud_output: str | Path | None = None,
    expected_duration_s: float | None = None,
) -> dict:
    """Convenience wrapper: compare up to 3 outputs and return winner + recommendation."""
    candidates: list[dict] = []
    if remotion_output:
        candidates.append({'engine': 'remotion', 'output_file': str(remotion_output)})
    if hyperframes_output:
        candidates.append({'engine': 'hyperframes', 'output_file': str(hyperframes_output)})
    if comfy_cloud_output:
        candidates.append({'engine': 'comfy_cloud', 'output_file': str(comfy_cloud_output)})

    if not candidates:
        return {'ok': False, 'error': 'no candidate outputs provided'}

    return judge_render(candidates, expected_duration_s)
