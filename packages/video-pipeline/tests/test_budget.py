"""Budget ledger and preflight gate tests."""
from __future__ import annotations

import budget


def test_local_lane_always_allowed(isolated_home):
    gate = budget.preflight_charge('demo', 'local')
    assert gate['allowed'] is True
    assert gate['credits'] == 0


def test_preflight_blocks_over_cap(isolated_home):
    budget.reset_ledger('demo')
    budget.record_charge('demo', 'comfy_cloud_image', 18)
    gate = budget.preflight_charge('demo', 'comfy_cloud_image', credits=6)
    assert gate['allowed'] is False
    assert 'exceeded' in gate['reason']


def test_preflight_allows_within_cap(isolated_home):
    budget.reset_ledger('demo2')
    gate = budget.preflight_charge('demo2', 'comfy_cloud_video', credits=10)
    assert gate['allowed'] is True
    assert gate['cap'] == 20


def test_invalid_project_rejected(isolated_home):
    import pytest

    with pytest.raises(ValueError):
        budget.preflight_charge('../bad', 'comfy_cloud_image')
