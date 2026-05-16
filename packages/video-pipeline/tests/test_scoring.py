"""Scoring gate contract tests."""
from __future__ import annotations

from engines import scoring


def test_can_advance_threshold(isolated_home):
    scoring.reset_score('demo')
    gate = scoring.can_advance('demo', predicted_score=7)
    assert gate['advance'] is False
    assert gate['threshold'] == 8

    gate_ok = scoring.can_advance('demo', predicted_score=8)
    assert gate_ok['advance'] is True


def test_lock_increments_only_on_clean_fleet(isolated_home):
    scoring.reset_score('demo')
    # Step 1: perfect fleet, no reds, stars at perfection
    state = scoring.lock_step_from_run(
        'demo', step=1,
        fleet={'verdicts': {'GREEN': 4, 'YELLOW': 0, 'RED': 0}},
        stars=4.0,
    )
    assert state['cumulative_score'] == 1
    assert state['history'][-1]['verdict'] == 'locked'

    # Step 2 blocked until step 1 locked — already locked, try step 2
    state2 = scoring.lock_step_from_run(
        'demo', step=2,
        fleet={'verdicts': {'GREEN': 4, 'YELLOW': 0, 'RED': 0}},
        stars=4.0,
    )
    assert state2['cumulative_score'] == 2


def test_red_fleet_loops_without_increment(isolated_home):
    scoring.reset_score('loop-demo')
    before = scoring.get_score('loop-demo')['cumulative_score']
    scoring.lock_step_from_run(
        'loop-demo', step=1,
        fleet={'verdicts': {'GREEN': 2, 'YELLOW': 0, 'RED': 1}},
        stars=5.0,
    )
    after = scoring.get_score('loop-demo')['cumulative_score']
    assert after == before
    assert scoring.get_score('loop-demo')['history'][-1]['verdict'] == 'looped'
