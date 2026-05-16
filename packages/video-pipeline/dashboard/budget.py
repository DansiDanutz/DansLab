#!/usr/bin/env python3
"""Per-project cost ledger and preflight charge gate.

Tracks estimated paid-lane credits so opt-in cloud runs cannot silently exceed a cap.
Local-only work records zero credits by default.

Storage: ~/.openclaw/budget/{project_slug}.json
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from safety import validate_project_id

BUDGET_DIR = Path.home() / ".openclaw" / "budget"

# Default estimated credits per lane. Callers may override via preflight_charge(..., credits=N).
LANE_DEFAULT_CREDITS: dict[str, int] = {
    "comfy_cloud_image": 6,
    "comfy_cloud_video": 12,
    "comfy_cloud_music": 3,
    "comfy_cloud_upscale": 4,
    "elevenlabs_tts": 1,
    "seedance_video": 8,
    "fal_image": 2,
    "fal_video": 6,
    "local": 0,
}


def _slug(project: str) -> str:
    project = (project or "default").strip()
    if project == "default":
        return "default"
    ok, value = validate_project_id(project)
    if not ok:
        raise ValueError(value)
    return value


def credit_cap() -> int | None:
    """None = unlimited. Set ZMARTY_BUDGET_CAP=0 or unset for unlimited."""
    raw = os.environ.get("ZMARTY_BUDGET_CAP", "").strip()
    if raw in ("", "unlimited", "none"):
        return None
    try:
        cap = int(raw)
    except ValueError:
        return None
    if cap <= 0:
        return None
    return cap


def _path(project: str) -> Path:
    return BUDGET_DIR / f"{_slug(project)}.json"


def _ensure_dir() -> None:
    BUDGET_DIR.mkdir(parents=True, exist_ok=True)


def _empty_state(project: str) -> dict:
    return {
        "project_slug": _slug(project),
        "spent_credits": 0,
        "cap": credit_cap(),
        "charges": [],
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


def get_ledger(project: str) -> dict:
    _ensure_dir()
    p = _path(project)
    if not p.exists():
        return _empty_state(project)
    try:
        state = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return _empty_state(project)
    state["cap"] = credit_cap()
    remaining = None
    cap = state.get("cap")
    spent = int(state.get("spent_credits", 0) or 0)
    if cap is not None:
        remaining = max(0, int(cap) - spent)
    state["remaining_credits"] = remaining
    return state


def reset_ledger(project: str) -> dict:
    _ensure_dir()
    state = _empty_state(project)
    _path(project).write_text(json.dumps(state, indent=2), encoding="utf-8")
    return get_ledger(project)


def record_charge(
    project: str,
    lane: str,
    credits: int,
    *,
    notes: str = "",
    meta: dict | None = None,
) -> dict:
    """Append a charge after a paid lane succeeds. Returns updated ledger."""
    _ensure_dir()
    slug = _slug(project)
    credits = max(0, int(credits))
    state = get_ledger(slug)
    state["spent_credits"] = int(state.get("spent_credits", 0)) + credits
    state["charges"].append({
        "ts": datetime.now(timezone.utc).isoformat(),
        "lane": str(lane),
        "credits": credits,
        "notes": str(notes)[:300],
        "meta": dict(meta or {}),
    })
    state["last_updated"] = datetime.now(timezone.utc).isoformat()
    state["cap"] = credit_cap()
    _path(slug).write_text(json.dumps(state, indent=2), encoding="utf-8")
    return get_ledger(slug)


def preflight_charge(
    project: str,
    lane: str,
    credits: int | None = None,
) -> dict:
    """Return {allowed, reason, spent, cap, remaining, lane, credits}."""
    est = int(credits) if credits is not None else LANE_DEFAULT_CREDITS.get(lane, 1)
    est = max(0, est)
    if lane == "local" or est == 0:
        return {
            "allowed": True,
            "reason": "local lane — no budget charge",
            "lane": lane,
            "credits": 0,
            "spent": get_ledger(project).get("spent_credits", 0),
            "cap": credit_cap(),
            "remaining": None,
        }
    cap = credit_cap()
    ledger = get_ledger(project)
    spent = int(ledger.get("spent_credits", 0) or 0)
    if cap is None:
        return {
            "allowed": True,
            "reason": "no budget cap configured",
            "lane": lane,
            "credits": est,
            "spent": spent,
            "cap": None,
            "remaining": None,
        }
    remaining = max(0, cap - spent)
    allowed = spent + est <= cap
    return {
        "allowed": allowed,
        "reason": (
            f"within cap ({spent + est} <= {cap})"
            if allowed else
            f"budget exceeded: {spent} spent + {est} requested > cap {cap}"
        ),
        "lane": lane,
        "credits": est,
        "spent": spent,
        "cap": cap,
        "remaining": remaining,
    }
