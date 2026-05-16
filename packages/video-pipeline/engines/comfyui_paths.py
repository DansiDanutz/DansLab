"""Single source for local ComfyUI API URL and on-disk layout.

The pipeline defaults to the ComfyUI desktop app layout on macOS
(~/Documents/ComfyUI/models) and common clone layout (~/ComfyUI/models).

Override with:
  COMFYUI_HOST=http://127.0.0.1:8188          # full base URL (no trailing slash)
  COMFYUI_PORT=8188 COMFYUI_BIND=127.0.0.1     # shorthand when HOST unset
  COMFYUI_MODEL_BASE=/path/to/ComfyUI/models # models directory (WAN/VAE/etc.)
"""
from __future__ import annotations

import os
import sys
from pathlib import Path


def comfyui_api_base() -> str:
    """HTTP base URL for ComfyUI /prompt, /system_stats, /view APIs."""
    explicit = (os.environ.get('COMFYUI_HOST') or '').strip().rstrip('/')
    if explicit:
        return explicit
    port = (os.environ.get('COMFYUI_PORT') or '8000').strip() or '8000'
    bind = (os.environ.get('COMFYUI_BIND') or '127.0.0.1').strip() or '127.0.0.1'
    return f'http://{bind}:{port}'


def _home() -> Path:
    return Path.home()


def comfyui_models_dir() -> Path:
    """Resolved path to ComfyUI's top-level ``models`` directory."""
    raw = (os.environ.get('COMFYUI_MODEL_BASE') or '').strip()
    if raw:
        return Path(raw).expanduser().resolve()

    candidates: list[Path] = []
    if sys.platform == 'darwin':
        candidates.append(_home() / 'Documents' / 'ComfyUI' / 'models')
    if os.name == 'nt':
        la = (os.environ.get('LOCALAPPDATA') or '').strip()
        if la:
            candidates.append(Path(la) / 'ComfyUI' / 'models')
    candidates.extend([
        _home() / 'ComfyUI' / 'models',
        _home() / '.local' / 'share' / 'ComfyUI' / 'models',
    ])

    for c in candidates:
        if c.exists():
            return c.resolve()

    # Predictable default for macOS/Desktop app installs (folder may not exist yet)
    if sys.platform == 'darwin':
        return (_home() / 'Documents' / 'ComfyUI' / 'models').resolve()
    return (_home() / 'ComfyUI' / 'models').resolve()


def comfyui_install_roots() -> list[Path]:
    """Candidate ComfyUI install roots (parent of ``models``)."""
    m = comfyui_models_dir()
    roots: list[Path] = []
    seen: set[str] = set()

    def add(p: Path) -> None:
        rp = p.resolve()
        key = str(rp)
        if key not in seen:
            seen.add(key)
            roots.append(rp)

    if m.name == 'models':
        add(m.parent)

    # Extra guesses when MODEL_BASE pointed at a subfolder / custom tree
    for guess in (
        _home() / 'Documents' / 'ComfyUI',
        _home() / 'ComfyUI',
    ):
        add(guess)

    return roots


def find_comfy_doctor_script() -> Path | None:
    """Locate optional comfy-doctor.py shipped with some Comfy installs."""
    for root in comfyui_install_roots():
        cand = root / 'user' / 'comfy-doctor.py'
        if cand.is_file():
            return cand
    return None


def vibevoice_models_parent() -> Path:
    """Directory containing ``VibeVoice-1.5B/`` etc. Default: models/vibevoice."""
    raw = (os.environ.get('VIBEVOICE_MODEL_DIR') or '').strip()
    if raw:
        return Path(raw).expanduser().resolve()
    return comfyui_models_dir() / 'vibevoice'
