"""Pytest fixtures — isolated ~/.openclaw for scoring/budget tests."""
from __future__ import annotations

import importlib
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
DASHBOARD = REPO_ROOT / 'dashboard'

if str(DASHBOARD) not in sys.path:
    sys.path.insert(0, str(DASHBOARD))


@pytest.fixture
def isolated_home(tmp_path, monkeypatch):
    """Point HOME at a temp dir so scoring/budget ledgers do not touch real data."""
    monkeypatch.setenv('HOME', str(tmp_path))
    monkeypatch.setenv('ZMARTY_BUDGET_CAP', '20')
    monkeypatch.setenv('ZMARTY_PERFECTION_STARS', '4.0')

    import budget
    import engines.scoring as scoring
    import safety

    importlib.reload(safety)
    importlib.reload(budget)
    importlib.reload(scoring)

    return tmp_path
