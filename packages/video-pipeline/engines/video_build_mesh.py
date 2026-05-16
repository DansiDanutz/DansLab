#!/usr/bin/env python3.13
"""Shared video-build mesh for design, motion, render, and QA stages.

This module is intentionally metadata-first. The current production renderer is
still Remotion for legacy compositions, while HyperFrames is the preferred
handoff/render target for new HTML-native video work. The mesh keeps those
lanes connected without breaking the existing render path.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import time
from html import escape
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
AGENT_SKILLS_DIR = Path.home() / '.agents' / 'skills'
VERSION = '2026-05-11.video-build-mesh.v1'

HYPERFRAMES_SKILLS = [
    'hyperframes',
    'hyperframes-cli',
    'hyperframes-media',
    'hyperframes-registry',
    'website-to-hyperframes',
    'gsap',
    'three',
    'lottie',
    'animejs',
    'css-animations',
    'waapi',
    'tailwind',
]

DESIGN_SKILLS = [
    'video-design-stack',
    'hyperframes-handoff',
    'ui-ux-pro-max',
    'ckm-design',
    'ckm-design-system',
    'ckm-ui-styling',
    'ckm-brand',
    'design-brief',
    'critique',
    'tweaks',
    'web-prototype',
    'mobile-app',
    'dashboard',
    'saas-landing',
]

MEDIA_SKILLS = [
    'motion-frames',
    'video-shortform',
    'image-poster',
    'audio-jingle',
    'social-carousel',
    'sprite-animation',
    'html-ppt',
    'simple-deck',
    'magazine-web-ppt',
]

REMOTION_SKILLS = [
    'remotion-best-practices',
    'remotion-to-hyperframes',
]


def _skill_installed(name: str) -> bool:
    return (AGENT_SKILLS_DIR / name / 'SKILL.md').exists()


def _installed(names: list[str]) -> list[str]:
    return [name for name in names if _skill_installed(name)]


def _missing(names: list[str]) -> list[str]:
    return [name for name in names if not _skill_installed(name)]


def _hyperframes_version(timeout: int = 20) -> str:
    npx = shutil.which('npx') or shutil.which('npx.cmd')
    if not npx:
        return ''
    try:
        proc = subprocess.run(
            [npx, '--yes', 'hyperframes', '--version'],
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding='utf-8',
            errors='replace',
        )
    except Exception:
        return ''
    if proc.returncode != 0:
        return ''
    return (proc.stdout or proc.stderr or '').strip().splitlines()[-1].strip()


def status() -> dict:
    hyperframes_version = _hyperframes_version()
    installed = {
        'hyperframes': _installed(HYPERFRAMES_SKILLS),
        'design': _installed(DESIGN_SKILLS),
        'media': _installed(MEDIA_SKILLS),
        'remotion': _installed(REMOTION_SKILLS),
    }
    missing = {
        'hyperframes': _missing(HYPERFRAMES_SKILLS),
        'design': _missing(DESIGN_SKILLS),
        'media': _missing(MEDIA_SKILLS),
        'remotion': _missing(REMOTION_SKILLS),
    }
    return {
        'ok': bool(hyperframes_version and installed['design']),
        'version': VERSION,
        'skills_dir': str(AGENT_SKILLS_DIR),
        'project_root': str(PROJECT_ROOT),
        'current_handoff': _current_handoff_status(),
        'hyperframes_cli': {
            'available': bool(hyperframes_version),
            'version': hyperframes_version,
        },
        'installed_skills': installed,
        'missing_skills': missing,
        'default_policy': {
            'preferred_new_video_engine': 'hyperframes',
            'legacy_composition_engine': 'remotion',
            'open_design_handoff': True,
            'ui_ux_gate': True,
            'qa_gate': 'ffprobe + visual/audio/caption sync + mesh checks',
        },
        'commands': {
            'hyperframes_doctor': 'npx hyperframes doctor',
            'hyperframes_lint': 'npx hyperframes lint <composition.html>',
            'hyperframes_preview': 'npx hyperframes preview <composition.html>',
            'hyperframes_render': 'npx hyperframes render <composition.html>',
            'remotion_legacy_build': 'npm run build',
        },
    }


def mesh_context(stage: str) -> dict:
    return {
        'version': VERSION,
        'stage': stage,
        'policy': 'single connected video build mesh',
        'roles': {
            'brief_and_strategy': ['design-brief', 'video-design-stack'],
            'visual_system': ['ui-ux-pro-max', 'ckm-design-system', 'ckm-ui-styling', 'ckm-brand'],
            'open_design_artifacts': ['web-prototype', 'mobile-app', 'dashboard', 'saas-landing', 'critique', 'tweaks'],
            'motion_and_media': ['motion-frames', 'video-shortform', 'image-poster', 'audio-jingle', 'social-carousel'],
            'primary_new_video_engine': ['hyperframes', 'hyperframes-cli', 'hyperframes-media', 'hyperframes-registry'],
            'website_to_video': ['website-to-hyperframes'],
            'runtime_adapters': ['gsap', 'three', 'lottie', 'animejs', 'css-animations', 'waapi', 'tailwind'],
            'legacy_video_engine': ['remotion-best-practices'],
            'migration_path': ['remotion-to-hyperframes'],
        },
        'flow': [
            'brief -> visual system',
            'visual system -> scene manifest',
            'scene manifest -> HyperFrames handoff + Remotion legacy compatibility',
            'assets/audio/captions -> render spec',
            'render output -> technical QA + design QA + learnings',
        ],
    }


def attach_to_design_system(design_system: dict | None, *, notes: str = '') -> dict:
    design = dict(design_system or {})
    tools = list(design.get('tools_recommended') or [])
    for tool in ['HyperFrames', 'Open Design', 'UI/UX Pro Max', 'Remotion legacy compatibility', 'ffprobe QA']:
        if tool not in tools:
            tools.append(tool)
    design['tools_recommended'] = tools

    # Design agent orchestrator integration (Phase 3)
    auto_design = (os.environ.get('AUTO_DESIGN_AGENTS') or 'false').strip().lower() not in {'0', 'false', 'no', 'off'}
    if auto_design and 'design_agent_orchestrator' not in design:
        try:
            from .design_agent_orchestrator import orchestrate
            orch = orchestrate(
                design.get('brief') or design.get('topic') or {},
                topic=design.get('topic', ''),
                notes=notes,
            )
            if orch.get('ok'):
                design['design_agent_orchestrator'] = orch.get('design_system', {})
        except Exception:
            pass

    design['video_build_mesh'] = {
        **mesh_context('step3_visual'),
        'notes': notes[:500],
        'required_outputs': [
            'brand-safe palette and typography',
            'motion principles using transform/opacity/filter/clip-path',
            'Open Design prototype or motion-frame direction when useful',
            'HyperFrames handoff readiness for downstream render',
            'Design agent orchestrator critique when AUTO_DESIGN_AGENTS=1',
        ],
    }
    return design


def attach_to_scene_manifest(manifest: dict | None, *, design_system: dict | None = None) -> dict:
    scene_manifest = dict(manifest or {})
    scene_manifest.setdefault('render_target', scene_manifest.get('render_target') or 'remotion')
    scene_manifest['preferred_render_engine'] = 'hyperframes'
    scene_manifest['legacy_render_engine'] = scene_manifest.get('render_target', 'remotion')
    scene_manifest['video_build_mesh'] = {
        **mesh_context('step4_scenes'),
        'handoff_targets': {
            'hyperframes': {
                'enabled': True,
                'composition_dir': 'out/hyperframes-handoff',
                'entry': 'index.html',
                'validate': ['npx hyperframes lint index.html', 'npx hyperframes preview index.html'],
                'render': 'npx hyperframes render index.html',
            },
            'remotion_legacy': {
                'enabled': True,
                'composition': 'src/index.tsx',
                'render': 'npm run build',
            },
        },
        'design_system_attached': bool(design_system),
    }
    return scene_manifest


def attach_to_render_spec(render_spec: dict | None, *, scene_manifest: dict | None = None) -> dict:
    spec = dict(render_spec or {})
    spec.setdefault('render_engine', spec.get('render_engine') or 'remotion')
    spec['preferred_new_video_engine'] = 'hyperframes'
    spec['compatibility_render_engine'] = spec.get('render_engine', 'remotion')
    spec['video_build_mesh'] = {
        **mesh_context('step7_render'),
        'scene_count': _scene_count(scene_manifest),
        'requires': [
            'audio_spec from Step 5',
            'subtitle_spec from Step 6 when subtitles are enabled',
            'scene_manifest from Step 4',
            'ffprobe-readable output',
        ],
    }
    spec['hyperframes_handoff'] = {
        'enabled': True,
        'status': 'planned',
        'output_dir': 'out/hyperframes-handoff',
        'entry': 'index.html',
        'commands': [
            'npx hyperframes lint out/hyperframes-handoff/index.html',
            'npx hyperframes preview out/hyperframes-handoff/index.html',
            'npx hyperframes render out/hyperframes-handoff/index.html',
        ],
        'note': 'Use for new HTML-native video builds; current Remotion render path remains active for legacy StoryV3/ZmartyBitcoin compositions.',
    }
    return spec


def attach_handoff_report(render_spec: dict | None, handoff_report: dict | None) -> dict:
    spec = dict(render_spec or {})
    report = dict(handoff_report or {})
    existing = dict(spec.get('hyperframes_handoff') or {})
    spec['hyperframes_handoff'] = {
        **existing,
        **report,
        'enabled': True,
        'status': 'ready' if report.get('ok') else report.get('status', 'failed'),
    }
    return spec


def write_hyperframes_handoff(
    scene_manifest: dict | None,
    render_spec: dict | None = None,
    audio_spec: dict | None = None,
    subtitle_spec: dict | None = None,
    *,
    output_dir: str | Path | None = None,
    run_lint: bool | None = None,
    timeout: int = 90,
) -> dict:
    """Write a runnable HyperFrames handoff composition from a scene manifest.

    The output is intentionally conservative: one standalone `index.html`,
    deterministic GSAP timeline, relative asset paths, and a sidecar JSON with
    the source manifest summary. This gives the pipeline a concrete HyperFrames
    artifact every time Step 7 runs, even while Remotion remains the legacy
    execution path.
    """
    started = time.time()
    scene_manifest = scene_manifest or {}
    render_spec = render_spec or {}
    audio_spec = audio_spec or {}
    subtitle_spec = subtitle_spec or {}
    out_dir = Path(output_dir or (PROJECT_ROOT / 'out' / 'hyperframes-handoff')).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    scenes = _normalise_scenes(scene_manifest)
    if not scenes:
        return {
            'ok': False,
            'status': 'failed',
            'stage': 'scene_manifest',
            'error': 'scene_manifest has no scenes or beats to export',
            'output_dir': str(out_dir),
            'elapsed_seconds': round(time.time() - started, 3),
        }

    fps = int(scene_manifest.get('fps') or render_spec.get('fps') or 30)
    total_duration = _total_duration_seconds(scene_manifest, render_spec, scenes)
    width, height = _resolution(scene_manifest, render_spec)
    composition_id = _slug(scene_manifest.get('composition_id') or 'youtube-pipeline-handoff')
    design = scene_manifest.get('design_system') or {}
    palette = _palette(design, scenes)
    audio_src = _asset_src(_audio_path(audio_spec), out_dir)

    html = _render_hyperframes_html(
        composition_id=composition_id,
        scenes=scenes,
        out_dir=out_dir,
        total_duration=total_duration,
        width=width,
        height=height,
        fps=fps,
        palette=palette,
        audio_src=audio_src,
        title=scene_manifest.get('subject') or render_spec.get('title') or 'YouTube Pipeline Handoff',
    )
    index_path = out_dir / 'index.html'
    index_path.write_text(html, encoding='utf-8')

    sidecar = {
        'version': VERSION,
        'created_at_unix': round(time.time(), 3),
        'composition_id': composition_id,
        'scene_count': len(scenes),
        'total_duration_seconds': total_duration,
        'fps': fps,
        'resolution': {'width': width, 'height': height},
        'source_render_engine': render_spec.get('render_engine', 'remotion'),
        'preferred_render_engine': 'hyperframes',
        'input_output_file': render_spec.get('output_file'),
        'subtitle_spec_attached': bool(subtitle_spec),
    }
    (out_dir / 'mesh-manifest.json').write_text(json.dumps(sidecar, indent=2), encoding='utf-8')

    lint_report = {'skipped': True, 'reason': 'run_lint=false'}
    if run_lint is None:
        run_lint = (os.environ.get('STEP7_HYPERFRAMES_LINT') or 'true').strip().lower() not in {'0', 'false', 'no', 'off'}
    if run_lint:
        lint_report = _run_hyperframes_lint(out_dir, timeout=timeout)

    # Auto-render if enabled (Phase 1: HyperFrames primary render engine)
    render_report: dict = {'skipped': True, 'reason': 'auto_render=off'}
    auto_render = (os.environ.get('STEP7_HYPERFRAMES_AUTO_RENDER') or 'true').strip().lower() not in {'0', 'false', 'no', 'off'}
    if auto_render:
        try:
            from .hyperframes_render_engine import render_composition
            render_report = render_composition(
                out_dir,
                output_path=out_dir / 'render.mp4',
                width=width,
                height=height,
                fps=fps,
            )
        except Exception as e:
            render_report = {'ok': False, 'error': f'{type(e).__name__}: {e}'}

    ok = bool(
        index_path.exists()
        and index_path.stat().st_size > 0
        and lint_report.get('ok', True) is not False
        and (not auto_render or render_report.get('ok', False))
    )
    return {
        'ok': ok,
        'status': 'ready' if ok else 'failed',
        'output_dir': str(out_dir),
        'entry': str(index_path),
        'relative_entry': str(index_path.relative_to(PROJECT_ROOT)) if index_path.is_relative_to(PROJECT_ROOT) else str(index_path),
        'composition_id': composition_id,
        'scene_count': len(scenes),
        'total_duration_seconds': total_duration,
        'commands': {
            'lint': f'npx hyperframes lint {out_dir}',
            'inspect': f'npx hyperframes inspect {out_dir}',
            'preview': f'npx hyperframes preview {out_dir}',
            'render': f'npx hyperframes render {out_dir} --output {out_dir / "render.mp4"}',
        },
        'lint': lint_report,
        'render': render_report,
        'elapsed_seconds': round(time.time() - started, 3),
    }


def mesh_qa_checks(render_spec: dict | None, scene_manifest: dict | None) -> dict:
    spec = render_spec or {}
    manifest = scene_manifest or {}
    return {
        'version': VERSION,
        'checks': [
            {
                'id': 'mesh-metadata-present',
                'pass': bool(spec.get('video_build_mesh') or manifest.get('video_build_mesh')),
                'why': 'render and scene artifacts must declare the connected build mesh',
            },
            {
                'id': 'hyperframes-handoff-declared',
                'pass': bool(spec.get('hyperframes_handoff') or (manifest.get('video_build_mesh') or {}).get('handoff_targets', {}).get('hyperframes')),
                'why': 'new video work needs an explicit HyperFrames path even when Remotion executes the legacy render',
            },
            {
                'id': 'scene-count-visible',
                'pass': _scene_count(manifest) > 0,
                'why': 'QA must know how many scenes or beats should be covered',
            },
        ],
    }


def _normalise_scenes(scene_manifest: dict) -> list[dict]:
    raw = scene_manifest.get('beats') or scene_manifest.get('scenes') or []
    if isinstance(raw, dict):
        values = list(raw.values())
    elif isinstance(raw, list):
        values = raw
    else:
        values = []
    scenes: list[dict] = []
    cursor = 0.0
    fps = int(scene_manifest.get('fps') or 30)
    fallback_total = float(scene_manifest.get('length_seconds') or scene_manifest.get('target_seconds') or 0)
    fallback_duration = max(3.0, fallback_total / len(values)) if values else 6.0
    for index, item in enumerate(values):
        if not isinstance(item, dict):
            continue
        duration = _duration_for_scene(item, fps, fallback_duration)
        start = _start_for_scene(item, fps, cursor)
        scene_id = _slug(item.get('scene_id') or item.get('id') or f'scene-{index + 1:03d}')
        image_path = item.get('motion_clip_path') or item.get('motion_clip') or item.get('image_path') or ''
        scenes.append({
            'id': scene_id,
            'index': index,
            'start': round(start, 3),
            'duration': round(duration, 3),
            'label': str(item.get('label') or item.get('title') or scene_id.replace('-', ' ').title()),
            'narration': str(item.get('narration_excerpt') or item.get('voiceover') or item.get('description') or ''),
            'visual_focus': str(item.get('visual_focus') or item.get('image_prompt') or item.get('notes') or ''),
            'bg_color': str(item.get('bg_color') or ''),
            'text_color': str(item.get('text_color') or ''),
            'accent_color': str(item.get('accent_color') or ''),
            'asset_path': str(image_path),
            'is_video': str(image_path).lower().endswith(('.mp4', '.mov', '.webm', '.m4v')),
        })
        cursor = max(cursor, start + duration)
    return scenes


def _duration_for_scene(scene: dict, fps: int, fallback: float) -> float:
    for key in ('duration_seconds', 'duration_s', 'duration'):
        try:
            value = float(scene.get(key) or 0)
            if value > 0:
                return max(0.5, value)
        except Exception:
            pass
    try:
        frame_start = float(scene.get('frame_start') or 0)
        frame_end = float(scene.get('frame_end') or 0)
        if frame_end > frame_start:
            return max(0.5, (frame_end - frame_start) / max(fps, 1))
    except Exception:
        pass
    return fallback


def _start_for_scene(scene: dict, fps: int, fallback: float) -> float:
    for key in ('start_seconds', 'start_s', 'start'):
        try:
            value = float(scene.get(key))
            if value >= 0:
                return value
        except Exception:
            pass
    try:
        frame_start = float(scene.get('frame_start') or 0)
        if frame_start > 0:
            return frame_start / max(fps, 1)
    except Exception:
        pass
    return fallback


def _total_duration_seconds(scene_manifest: dict, render_spec: dict, scenes: list[dict]) -> float:
    for obj in (render_spec, scene_manifest):
        for key in ('expected_duration_seconds', 'target_seconds', 'length_seconds', 'duration_seconds', 'duration_s'):
            try:
                value = float(obj.get(key) or 0)
                if value > 0:
                    return round(value, 3)
            except Exception:
                pass
    return round(max(s['start'] + s['duration'] for s in scenes), 3)


def _resolution(scene_manifest: dict, render_spec: dict) -> tuple[int, int]:
    for obj in (render_spec, scene_manifest):
        value = obj.get('resolution')
        if isinstance(value, dict):
            try:
                return int(value.get('width') or 1920), int(value.get('height') or 1080)
            except Exception:
                pass
        if isinstance(value, str) and 'x' in value:
            try:
                w, h = value.lower().split('x', 1)
                return int(w.strip()), int(h.strip())
            except Exception:
                pass
    return 1920, 1080


def _palette(design: dict, scenes: list[dict]) -> dict:
    colors: list[str] = []
    for item in design.get('color_palette') or design.get('colors') or []:
        if isinstance(item, dict) and item.get('hex'):
            colors.append(str(item['hex']))
        elif isinstance(item, str):
            colors.append(item)
    for scene in scenes:
        for key in ('bg_color', 'text_color', 'accent_color'):
            if scene.get(key):
                colors.append(scene[key])
    colors = [c for c in colors if isinstance(c, str) and c.startswith('#')]
    colors = list(dict.fromkeys(colors))
    return {
        'bg': colors[0] if colors else '#08111F',
        'text': colors[1] if len(colors) > 1 else '#F8FAFC',
        'accent': colors[2] if len(colors) > 2 else '#35D3F4',
        'muted': colors[3] if len(colors) > 3 else '#94A3B8',
    }


def _audio_path(audio_spec: dict) -> str:
    for key in ('output_file', 'audio_file', 'path'):
        if audio_spec.get(key):
            return str(audio_spec[key])
    assembly = audio_spec.get('master_assembly')
    if isinstance(assembly, dict) and assembly.get('output_file'):
        return str(assembly['output_file'])
    return ''


def _asset_src(path_value: str, out_dir: Path) -> str:
    if not path_value:
        return ''
    path = Path(path_value)
    if not path.is_absolute():
        path = (PROJECT_ROOT / path).resolve()
    try:
        return path.relative_to(out_dir).as_posix()
    except ValueError:
        return os.path.relpath(path, out_dir).replace(os.sep, '/')


def _render_hyperframes_html(
    *,
    composition_id: str,
    scenes: list[dict],
    out_dir: Path,
    total_duration: float,
    width: int,
    height: int,
    fps: int,
    palette: dict,
    audio_src: str,
    title: str,
) -> str:
    scene_html: list[str] = []
    timeline_js: list[str] = []
    for scene in scenes:
        sid = scene['id']
        asset_src = _asset_src(scene.get('asset_path', ''), out_dir)
        scene_bg = scene.get('bg_color') or palette['bg']
        scene_text = scene.get('text_color') or palette['text']
        scene_accent = scene.get('accent_color') or palette['accent']
        media = ''
        if asset_src:
            if scene.get('is_video'):
                media = f'<video class="scene-media" src="{escape(asset_src)}" muted playsinline></video>'
            else:
                media = f'<img class="scene-media" src="{escape(asset_src)}" alt="" />'
        else:
            media = '<div class="scene-media scene-media-fallback"></div>'
        narration = scene.get('narration') or scene.get('visual_focus') or ''
        scene_html.append(f'''
      <section
        id="{escape(sid)}"
        class="hf-scene"
        data-start="{scene['start']}"
        data-duration="{scene['duration']}"
        data-track-index="1"
        data-layout-allow-overflow="true"
        style="--scene-bg: {escape(scene_bg)}; --scene-text: {escape(scene_text)}; --scene-accent: {escape(scene_accent)};"
      >
        {media}
        <div class="scene-panel">
          <div class="scene-kicker">Scene {scene['index'] + 1:02d}</div>
          <h1>{escape(scene['label'])}</h1>
          <p>{escape(narration[:260])}</p>
        </div>
      </section>''')
        start = scene['start']
        dur = scene['duration']
        exit_at = max(start + dur - 0.6, start + 0.1)
        timeline_js.append(
            f'''tl.fromTo("#{sid} .scene-panel", {{ y: 54, opacity: 0, scale: 0.985 }}, {{ y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }}, {start});'''
        )
        timeline_js.append(
            f'''tl.fromTo("#{sid} .scene-media", {{ scale: 1.045, opacity: 0.88 }}, {{ scale: 1.0, opacity: 1, duration: {max(dur - 0.2, 0.5):.3f}, ease: "none" }}, {start});'''
        )
        timeline_js.append(
            f'''tl.to("#{sid} .scene-panel", {{ y: -30, opacity: 0, duration: 0.42, ease: "power2.in" }}, {exit_at:.3f});'''
        )
    audio_html = ''
    if audio_src:
        audio_html = f'\n      <audio id="narration-audio" data-start="0" data-duration="{total_duration}" data-track-index="2" src="{escape(audio_src)}" data-volume="1"></audio>'
    return f'''<!doctype html>
<html lang="en" data-composition-variables='[
  {{"id":"title","type":"string","label":"Title","default":"{escape(title)}"}},
  {{"id":"accent","type":"color","label":"Accent","default":"{escape(palette['accent'])}"}}
]'>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{escape(title)} — HyperFrames Handoff</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      :root {{
        --bg: {escape(palette['bg'])};
        --text: {escape(palette['text'])};
        --accent: {escape(palette['accent'])};
        --muted: {escape(palette['muted'])};
      }}
      * {{ box-sizing: border-box; }}
      body {{ margin: 0; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
      [data-composition-id="{escape(composition_id)}"] {{ position: relative; width: {width}px; height: {height}px; overflow: hidden; background: var(--bg); }}
      .hf-scene {{ position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; background: var(--scene-bg); color: var(--scene-text); }}
      .scene-media {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.02); }}
      .scene-media-fallback {{ background: radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--scene-accent), white 18%), transparent 30%), linear-gradient(135deg, var(--scene-bg), #020617); }}
      .hf-scene::after {{ content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.12) 48%, rgba(0,0,0,.42)); pointer-events: none; }}
      .scene-panel {{ position: absolute; z-index: 2; left: 104px; bottom: 96px; width: min(980px, calc(100% - 208px)); padding: 40px 44px 42px; border: 1px solid rgba(255,255,255,.18); background: rgba(5, 10, 18, .68); backdrop-filter: blur(18px); box-shadow: 0 30px 80px rgba(0,0,0,.36); }}
      .scene-kicker {{ color: var(--scene-accent); font-size: 22px; font-weight: 800; letter-spacing: 0; text-transform: uppercase; margin-bottom: 16px; }}
      h1 {{ margin: 0; max-width: 900px; font-size: 76px; line-height: .96; letter-spacing: 0; }}
      p {{ margin: 22px 0 0; max-width: 820px; color: rgba(255,255,255,.88); font-size: 28px; line-height: 1.32; letter-spacing: 0; }}
    </style>
  </head>
  <body>
    <div
      id="composition-root"
      data-composition-id="{escape(composition_id)}"
      data-start="0"
      data-duration="{total_duration}"
      data-width="{width}"
      data-height="{height}"
      data-fps="{fps}"
    >
{''.join(scene_html)}{audio_html}
      <script>
        window.__timelines = window.__timelines || {{}};
        const tl = gsap.timeline({{ paused: true }});
        {"".join(timeline_js)}
        window.__timelines["{escape(composition_id)}"] = tl;
      </script>
    </div>
  </body>
</html>
'''


def _run_hyperframes_lint(out_dir: Path, *, timeout: int) -> dict:
    npx = shutil.which('npx') or shutil.which('npx.cmd')
    if not npx:
        return {'ok': False, 'skipped': False, 'error': 'npx unavailable'}
    try:
        proc = subprocess.run(
            [npx, '--yes', 'hyperframes', 'lint', str(out_dir)],
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding='utf-8',
            errors='replace',
        )
        return {
            'ok': proc.returncode == 0,
            'returncode': proc.returncode,
            'stdout': (proc.stdout or '')[-4000:],
            'stderr': (proc.stderr or '')[-4000:],
        }
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}'}


def _slug(value: object) -> str:
    raw = ''.join(ch.lower() if ch.isalnum() else '-' for ch in str(value or 'composition'))
    while '--' in raw:
        raw = raw.replace('--', '-')
    return raw.strip('-') or 'composition'


def _scene_count(scene_manifest: dict | None) -> int:
    if not isinstance(scene_manifest, dict):
        return 0
    beats = scene_manifest.get('beats')
    if isinstance(beats, list):
        return len(beats)
    scenes = scene_manifest.get('scenes')
    if isinstance(scenes, dict):
        return len(scenes)
    if isinstance(scenes, list):
        return len(scenes)
    return 0


def status_json() -> str:
    return json.dumps(status(), indent=2, sort_keys=True)


def _current_handoff_status() -> dict:
    handoff_dir = PROJECT_ROOT / 'out' / 'hyperframes-handoff'
    index_path = handoff_dir / 'index.html'
    manifest_path = handoff_dir / 'mesh-manifest.json'
    payload: dict = {
        'output_dir': str(handoff_dir),
        'entry': str(index_path),
        'exists': index_path.exists() and index_path.stat().st_size > 0,
    }
    if manifest_path.exists():
        try:
            payload['manifest'] = json.loads(manifest_path.read_text(encoding='utf-8'))
        except Exception as e:
            payload['manifest_error'] = str(e)
    return payload
