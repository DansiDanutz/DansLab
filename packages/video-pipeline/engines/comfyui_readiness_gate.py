#!/usr/bin/env python3.13
"""ComfyUI / WAN image-to-video readiness gate.

Checks repo workflow JSON, HTTP ``/system_stats``, and WAN-related weights on disk.
Never starts ComfyUI or downloads models — report-only.

Run from repo root::

    python dashboard/engines/comfyui_readiness_gate.py --root .

Port defaults match ``engines/comfyui_paths.py``: ``COMFYUI_HOST`` or
``COMFYUI_PORT`` + ``127.0.0.1``.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

_REQUIRED_WORKFLOWS = (
    'comfyui-workflows/sd15-base-frames-api.json',
    'comfyui-workflows/wan21-img2vid.json',
)
_OPTIONAL_WORKFLOWS = (
    'comfyui-workflows/flux-base-frames.json',
)


def _default_endpoint() -> str:
    h = (os.environ.get('COMFYUI_HOST') or '').strip().rstrip('/')
    if h:
        return h
    port = (os.environ.get('COMFYUI_PORT') or '8000').strip() or '8000'
    bind = (os.environ.get('COMFYUI_BIND') or '127.0.0.1').strip() or '127.0.0.1'
    return f'http://{bind}:{port}'


def probe_endpoint(url: str) -> dict:
    try:
        base = url.rstrip('/')
        with urllib.request.urlopen(f'{base}/system_stats', timeout=3) as r:
            body = r.read(2048).decode('utf-8', errors='replace')
            return {'ok': True, 'status': r.status, 'sample': body[:300]}
    except Exception as e:
        return {'ok': False, 'error': type(e).__name__, 'message': str(e)[:300]}


def _models_base_from_env_or_home(root: Path) -> Path:
    raw = (os.environ.get('COMFYUI_MODEL_BASE') or '').strip()
    if raw:
        return Path(raw).expanduser().resolve()
    candidates = []
    home = Path.home()
    candidates.extend([
        home / 'Documents' / 'ComfyUI' / 'models',
        home / 'ComfyUI' / 'models',
        root / 'ComfyUI' / 'models',
        root / 'comfyui' / 'models',
    ])
    return next((p.resolve() for p in candidates if p.exists()), home / 'Documents' / 'ComfyUI' / 'models')


def scan_models(models_base: Path) -> dict:
    candidates: list[dict] = []
    if not models_base.exists():
        return {'count': 0, 'models_base': str(models_base), 'candidates': [], 'note': 'models directory missing'}
    for p in models_base.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.safetensors', '.ckpt', '.pt', '.pth', '.bin'}:
            rel = str(p)
            low = rel.lower()
            if any(h in low for h in ('wan2.', 'wan_2.', 'umt5', 'clip_vision', 'flux', '.gguf')):
                candidates.append({'path': rel, 'bytes': p.stat().st_size})
    return {'count': len(candidates), 'models_base': str(models_base.resolve()), 'candidates': candidates[:50]}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', default='.', help='Repository root containing comfyui-workflows/')
    ap.add_argument('--endpoint', default=_default_endpoint(), help='ComfyUI HTTP base URL')
    ap.add_argument('--out', default='')
    args = ap.parse_args()
    root = Path(args.root).resolve()

    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    required_status = []
    for rel in _REQUIRED_WORKFLOWS:
        p = root / rel
        required_status.append({
            'path': str(p),
            'exists': p.exists(),
            'bytes': p.stat().st_size if p.exists() else 0,
        })
    optional_status = []
    for rel in _OPTIONAL_WORKFLOWS:
        p = root / rel
        optional_status.append({
            'path': str(p),
            'exists': p.exists(),
            'bytes': p.stat().st_size if p.exists() else 0,
        })

    endpoint = probe_endpoint(args.endpoint)
    models = scan_models(_models_base_from_env_or_home(root))

    hard_fails: list[str] = []
    if not all(w['exists'] for w in required_status):
        hard_fails.append('missing_repo_workflow_json')
    if not endpoint['ok']:
        hard_fails.append('comfyui_endpoint_not_running')
    # Models are optional gate for "WAN ready" — warn heavily if zero
    if models['count'] == 0:
        hard_fails.append('wan_or_clip_models_not_found_under_models_dir')

    result = {
        'created_at': datetime.now(timezone.utc).isoformat(),
        'passed': not hard_fails,
        'hard_fails': hard_fails,
        'endpoint': endpoint,
        'endpoint_hint': (
            'Set COMFYUI_HOST or COMFYUI_PORT if Comfy listens on non-default '
            '(e.g. Desktop app often :8000, some builds :8188).'
        ),
        'workflows_required': required_status,
        'workflows_optional': optional_status,
        'models': models,
        'decision': (
            'Local WAN / ComfyUI I2V is viable when workflows exist, API is up, '
            'and model weights are under COMFYUI_MODEL_BASE (or ~/Documents/ComfyUI/models).'
        ),
    }
    text = json.dumps(result, indent=2)
    if args.out:
        out_p = Path(args.out)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_text(text)
    print(text)
    return 0 if result['passed'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
