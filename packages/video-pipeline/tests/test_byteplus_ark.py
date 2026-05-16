"""BytePlus ModelArk status defaults."""

from __future__ import annotations

import engines.byteplus_ark as ark


def test_default_endpoint_id():
    assert ark.DEFAULT_ARK_MODEL == 'seed-2-0-lite-260228'
    assert ark.ark_model() == ark.DEFAULT_ARK_MODEL


def test_status_without_key(monkeypatch):
    monkeypatch.delenv('BYTEPLUS_API_KEY', raising=False)
    monkeypatch.delenv('ARK_API_KEY', raising=False)
    monkeypatch.setattr(ark, '_api_key', lambda: '')
    s = ark.status()
    assert s['available'] is False
    assert s['model'] == ark.DEFAULT_ARK_MODEL
    assert 'BYTEPLUS_API_KEY' in s.get('note', '') or 'ARK_API_KEY' in s.get('note', '')


def test_model_env_rejects_api_key_shape(monkeypatch):
    monkeypatch.setenv('ARK_MODEL', 'ark-test-a-b-c-d-e')
    assert ark.ark_model() == ark.DEFAULT_ARK_MODEL
