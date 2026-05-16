#!/usr/bin/env python3.13
"""HyperFrames render engine — primary video renderer for HTML-native compositions.

Wraps `npx hyperframes render` with progress polling, timeout handling,
retry logic, and ffprobe validation. Designed to be called from Step 7
as a first-class render path alongside (or replacing) Remotion.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import time
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DEFAULT_TIMEOUT = int(os.environ.get('HF_RENDER_TIMEOUT', '600'))
DEFAULT_RETRIES = int(os.environ.get('HF_RENDER_RETRIES', '1'))
TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080
TARGET_FPS = 30


def _npx() -> str:
    return shutil.which('npx') or shutil.which('npx.cmd') or 'npx'


def _hf_version(timeout: int = 20) -> str:
    npx = _npx()
    try:
        proc = subprocess.run(
            [npx, '--yes', 'hyperframes', '--version'],
            capture_output=True, text=True, timeout=timeout,
            encoding='utf-8', errors='replace',
        )
    except Exception:
        return ''
    if proc.returncode != 0:
        return ''
    return (proc.stdout or proc.stderr or '').strip().splitlines()[-1].strip()


def hyperframes_available() -> bool:
    return bool(_hf_version(timeout=10))


def render_composition(
    composition_dir: str | Path,
    output_path: str | Path | None = None,
    *,
    width: int = TARGET_WIDTH,
    height: int = TARGET_HEIGHT,
    fps: int = TARGET_FPS,
    timeout: int = DEFAULT_TIMEOUT,
    retries: int = DEFAULT_RETRIES,
    extra_args: list[str] | None = None,
) -> dict:
    """Render a HyperFrames composition to MP4.

    Args:
        composition_dir: Directory containing index.html (or path to HTML file)
        output_path: Where to write the MP4. Defaults to composition_dir/render.mp4
        width: Output width in pixels
        height: Output height in pixels
        fps: Output frame rate
        timeout: Max seconds to wait for render
        retries: Number of retry attempts on failure
        extra_args: Additional CLI args passed to `hyperframes render`

    Returns:
        Dict with keys: ok, output_file, bytes, elapsed_seconds, stages, ffprobe
    """
    started = time.time()
    comp_dir = Path(composition_dir).resolve()
    if not comp_dir.exists():
        return {'ok': False, 'stage': 'validate', 'error': f'composition dir not found: {comp_dir}'}

    # If composition_dir is an HTML file, use its parent directory
    if comp_dir.is_file() and comp_dir.suffix.lower() == '.html':
        comp_dir = comp_dir.parent

    out_file = Path(output_path) if output_path else comp_dir / 'render.mp4'
    out_file.parent.mkdir(parents=True, exist_ok=True)

    npx = _npx()
    stages: list[dict] = []

    for attempt in range(1, retries + 1):
        cmd = [
            npx, '--yes', 'hyperframes', 'render', str(comp_dir),
            '--output', str(out_file),
            '--width', str(width),
            '--height', str(height),
            '--fps', str(fps),
        ]
        if extra_args:
            cmd.extend(extra_args)

        stage_name = 'render' if retries == 1 else f'render_attempt_{attempt}'
        try:
            proc = subprocess.run(
                cmd,
                cwd=str(PROJECT_ROOT),
                capture_output=True,
                text=True,
                timeout=timeout,
                encoding='utf-8',
                errors='replace',
            )
        except subprocess.TimeoutExpired:
            stages.append({
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'error': f'timeout after {timeout}s', 'cmd': cmd,
            })
            if attempt < retries:
                time.sleep(2)
                continue
            return {
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'error': f'timeout after {timeout}s (all {retries} attempts)',
                'stages': stages, 'elapsed_seconds': round(time.time() - started, 1),
            }
        except Exception as e:
            stages.append({
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'error': f'{type(e).__name__}: {e}', 'cmd': cmd,
            })
            if attempt < retries:
                time.sleep(2)
                continue
            return {
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'error': f'{type(e).__name__}: {e}', 'stages': stages,
                'elapsed_seconds': round(time.time() - started, 1),
            }

        if proc.returncode == 0:
            stages.append({
                'ok': True, 'stage': stage_name, 'attempt': attempt,
                'stdout': (proc.stdout or '')[-1000:],
                'cmd': cmd,
            })
            break
        else:
            stages.append({
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'exit_code': proc.returncode,
                'stdout': (proc.stdout or '')[-2000:],
                'stderr': (proc.stderr or '')[-2000:],
                'cmd': cmd,
            })
            if attempt < retries:
                time.sleep(2)
                continue
            return {
                'ok': False, 'stage': stage_name, 'attempt': attempt,
                'error': f'hyperframes render failed (exit {proc.returncode})',
                'stages': stages,
                'elapsed_seconds': round(time.time() - started, 1),
            }

    # Validate output file exists
    if not out_file.exists() or out_file.stat().st_size <= 0:
        return {
            'ok': False, 'stage': 'file',
            'error': f'render finished but output file missing or empty: {out_file}',
            'stages': stages,
            'elapsed_seconds': round(time.time() - started, 1),
        }

    # ffprobe validation
    ffprobe = shutil.which('ffprobe') or shutil.which('ffprobe.exe')
    probe: dict = {'available': bool(ffprobe)}
    if ffprobe:
        try:
            p = subprocess.run(
                [ffprobe, '-v', 'quiet', '-print_format', 'json',
                 '-show_format', '-show_streams', str(out_file)],
                capture_output=True, text=True, timeout=30,
                encoding='utf-8', errors='replace',
            )
            probe['ok'] = p.returncode == 0
            parsed = json.loads(p.stdout or '{}') if p.returncode == 0 else {}
            probe['streams'] = parsed.get('streams', [])
            probe['format'] = parsed.get('format', {})
            if p.returncode != 0:
                probe['error'] = (p.stderr or '')[:500]
        except Exception as e:
            probe = {'available': True, 'ok': False, 'error': str(e)[:500]}

    return {
        'ok': True,
        'stage': 'complete',
        'output_file': str(out_file),
        'bytes': out_file.stat().st_size,
        'elapsed_seconds': round(time.time() - started, 1),
        'stages': stages,
        'ffprobe': probe,
        'composition_dir': str(comp_dir),
    }


def lint_composition(composition_dir: str | Path, timeout: int = 60) -> dict:
    """Run `npx hyperframes lint` on a composition directory."""
    comp_dir = Path(composition_dir).resolve()
    if not comp_dir.exists():
        return {'ok': False, 'error': f'composition dir not found: {comp_dir}'}
    if comp_dir.is_file() and comp_dir.suffix.lower() == '.html':
        comp_dir = comp_dir.parent

    npx = _npx()
    cmd = [npx, '--yes', 'hyperframes', 'lint', str(comp_dir)]
    try:
        proc = subprocess.run(
            cmd, cwd=str(PROJECT_ROOT), capture_output=True,
            text=True, timeout=timeout, encoding='utf-8', errors='replace',
        )
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}', 'cmd': cmd}

    return {
        'ok': proc.returncode == 0,
        'exit_code': proc.returncode,
        'stdout': proc.stdout or '',
        'stderr': proc.stderr or '',
        'cmd': cmd,
    }


def preview_composition(composition_dir: str | Path, timeout: int = 30) -> dict:
    """Run `npx hyperframes preview` on a composition directory (non-blocking check)."""
    comp_dir = Path(composition_dir).resolve()
    if not comp_dir.exists():
        return {'ok': False, 'error': f'composition dir not found: {comp_dir}'}
    if comp_dir.is_file() and comp_dir.suffix.lower() == '.html':
        comp_dir = comp_dir.parent

    npx = _npx()
    cmd = [npx, '--yes', 'hyperframes', 'preview', str(comp_dir)]
    try:
        proc = subprocess.run(
            cmd, cwd=str(PROJECT_ROOT), capture_output=True,
            text=True, timeout=timeout, encoding='utf-8', errors='replace',
        )
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}', 'cmd': cmd}

    return {
        'ok': proc.returncode == 0,
        'exit_code': proc.returncode,
        'stdout': proc.stdout or '',
        'stderr': proc.stderr or '',
        'cmd': cmd,
    }


def doctor() -> dict:
    """Run `npx hyperframes doctor` and return structured results."""
    npx = _npx()
    cmd = [npx, '--yes', 'hyperframes', 'doctor']
    try:
        proc = subprocess.run(
            cmd, cwd=str(PROJECT_ROOT), capture_output=True,
            text=True, timeout=60, encoding='utf-8', errors='replace',
        )
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}', 'cmd': cmd}

    stdout = proc.stdout or ''
    stderr = proc.stderr or ''
    ok = proc.returncode == 0 and 'RESULT: OK' in stdout
    return {
        'ok': ok,
        'exit_code': proc.returncode,
        'stdout': stdout,
        'stderr': stderr,
        'cmd': cmd,
    }


def status() -> dict:
    """Quick status check for the HyperFrames CLI and runtime environment."""
    version = _hf_version()
    npx_path = shutil.which('npx') or ''
    return {
        'available': bool(version),
        'version': version,
        'npx': npx_path,
        'project_root': str(PROJECT_ROOT),
    }
