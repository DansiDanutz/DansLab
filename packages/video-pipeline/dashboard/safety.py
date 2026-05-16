#!/usr/bin/env python3
"""Strict project_id validation for multi-project workspaces.

Prevents path traversal and unsafe characters before any filesystem path is built.
Complements engines/projects.py, which rejects invalid project IDs before joining paths.
"""
from __future__ import annotations

import re

# Multi-tenant safe slug: lowercase alnum, underscore, hyphen.
PROJECT_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,63}$")


def validate_project_id(project_id: str) -> tuple[bool, str]:
    """Return (ok, normalized_id_or_error_message)."""
    pid = (project_id or "").strip()
    if not pid:
        return False, "empty project id"
    if "/" in pid or "\\" in pid or ".." in pid:
        return False, "path traversal rejected"
    if not PROJECT_ID_RE.fullmatch(pid):
        return False, "invalid project id"
    return True, pid


def assert_project_id(project_id: str) -> str:
    ok, value = validate_project_id(project_id)
    if not ok:
        raise ValueError(value)
    return value
