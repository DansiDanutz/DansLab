"""Local runtime path helpers for bundled pipeline tools."""

from __future__ import annotations

import os
import subprocess
import shutil
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

LOCAL_TOOL_DIRS = [
    PROJECT_ROOT / "tools" / "whisper" / "build" / "bin",
    Path("/opt/homebrew/bin"),
    Path("/opt/homebrew/sbin"),
    Path("/usr/local/bin"),
    Path("/usr/bin"),
    Path("/bin"),
]

LOCAL_DYLD_DIRS = [
    PROJECT_ROOT / "tools" / "whisper" / "build" / "src",
    PROJECT_ROOT / "tools" / "whisper" / "build" / "ggml" / "src",
    PROJECT_ROOT / "tools" / "whisper" / "build" / "ggml" / "src" / "ggml-blas",
    PROJECT_ROOT / "tools" / "whisper" / "build" / "ggml" / "src" / "ggml-metal",
    Path("/opt/homebrew/lib"),
]


def ensure_local_tools_on_path() -> str:
    """Prepend bundled tool directories and dylib paths for media CLIs."""
    existing = os.environ.get("PATH", "")
    parts = [str(path) for path in LOCAL_TOOL_DIRS if path.exists()]
    current = existing.split(os.pathsep) if existing else []
    merged = parts + [part for part in current if part and part not in parts]
    os.environ["PATH"] = os.pathsep.join(merged)
    existing_dyld = os.environ.get("DYLD_LIBRARY_PATH", "")
    dylib_parts = [str(path) for path in LOCAL_DYLD_DIRS if path.exists()]
    current_dyld = existing_dyld.split(os.pathsep) if existing_dyld else []
    os.environ["DYLD_LIBRARY_PATH"] = os.pathsep.join(
        dylib_parts + [part for part in current_dyld if part and part not in dylib_parts]
    )
    return os.environ["PATH"]


def which(binary: str) -> str:
    ensure_local_tools_on_path()
    return shutil.which(binary) or ""


def command_works(command: str, *args: str, timeout: int = 5) -> bool:
    ensure_local_tools_on_path()
    if not command:
        return False
    try:
        proc = subprocess.run(
            [command, *args],
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
        return proc.returncode == 0
    except Exception:
        return False


def piper_voice_dirs() -> list[Path]:
    return [
        PROJECT_ROOT / "tools" / "piper",
        Path.home() / ".local" / "share" / "piper",
        Path.home() / "piper",
        Path("/usr/share/piper"),
        Path("/opt/piper"),
    ]


def whisper_model_dirs() -> list[Path]:
    return [
        PROJECT_ROOT / "tools" / "whisper" / "models",
        Path.home() / ".cache" / "whisper",
        Path.home() / "whisper",
        Path("/usr/share/whisper"),
        Path.home() / "whisper-cpp" / "models",
        Path("/opt/whisper/models"),
    ]
