"""Path-safety tests for project_id validation."""
from __future__ import annotations

import safety


def test_valid_project_ids():
    assert safety.validate_project_id('bitcoin-demo-a1b2c3') == (True, 'bitcoin-demo-a1b2c3')
    assert safety.validate_project_id('x') == (True, 'x')
    assert safety.validate_project_id('my_project-01') == (True, 'my_project-01')


def test_rejects_traversal_and_invalid():
    assert safety.validate_project_id('../etc')[0] is False
    assert safety.validate_project_id('foo/bar')[0] is False
    assert safety.validate_project_id('')[0] is False
    assert safety.validate_project_id('UPPER')[0] is False
    assert safety.validate_project_id('-leading')[0] is False


def test_projects_module_rejects_bad_ids(isolated_home):
    import importlib

    from engines import projects

    projects = importlib.reload(projects)

    assert projects._project_dir('valid-id-abc123') is not None
    assert projects._project_dir('../escape') is None
    assert projects._project_dir('bad/slash') is None
