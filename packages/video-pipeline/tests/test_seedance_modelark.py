"""Seedance ModelArk task helpers (no network)."""

from __future__ import annotations

from pathlib import Path

from engines import seedance as sd


def test_looks_like_modelark_api_root():
    assert sd._looks_like_modelark_api_root('https://ark.ap-southeast.bytepluses.com/api/v3')
    assert sd._looks_like_modelark_api_root('https://ARK.AP-SOUTHEAST.bytepluses.com/api/v3/')
    assert not sd._looks_like_modelark_api_root('http://localhost:9999')
    assert not sd._looks_like_modelark_api_root('')


def test_use_modelark_tasks_flag(monkeypatch):
    monkeypatch.delenv('SEEDANCE_USE_MODELARK', raising=False)
    monkeypatch.setenv('SEEDANCE_USE_MODELARK', '1')
    assert sd._use_modelark_tasks('') is True


def test_use_modelark_tasks_url(monkeypatch):
    monkeypatch.delenv('SEEDANCE_USE_MODELARK', raising=False)
    u = 'https://ark.ap-southeast.bytepluses.com/api/v3'
    assert sd._use_modelark_tasks(u) is True


def test_use_modelark_tasks_key_only(monkeypatch):
    monkeypatch.delenv('SEEDANCE_USE_MODELARK', raising=False)
    monkeypatch.setattr(sd, '_auth_key', lambda: 'test-key')
    assert sd._use_modelark_tasks('') is True


def test_build_modelark_i2v_task_body_omits_audio_when_none():
    b = sd.build_modelark_i2v_task_body(
        model='dreamina-seedance-2-0-260128',
        prompt='hello',
        image_data_url='data:image/jpeg;base64,xx',
        duration_s=5.0,
        resolution='720p',
        ratio='adaptive',
        generate_audio=None,
    )
    assert 'generate_audio' not in b
    assert b['duration'] == 5
    assert b['content'][1]['role'] == 'first_frame'


def test_build_modelark_i2v_task_body_clamps_duration():
    b = sd.build_modelark_i2v_task_body(
        model='m',
        prompt='p',
        image_data_url='data:image/png;base64,xx',
        duration_s=99.0,
        resolution='480p',
        ratio='16:9',
        generate_audio=False,
    )
    assert b['duration'] == 12
    assert b['generate_audio'] is False


def test_error_result_marks_model_activation_required():
    res = sd._error_result(
        {
            'http_status': 404,
            'error_code': 'ModelNotOpen',
            'message': 'Please activate the model service in the Ark Console.',
            'error_type': 'Not Found',
        },
        elapsed=1.234,
    )
    assert res['ok'] is False
    assert res['activation_required'] is True
    assert res['http_status'] == 404
    assert res['error_code'] == 'ModelNotOpen'
    assert 'activate the model service' in res['error']


def test_image_to_data_url_png(tmp_path: Path):
    p = tmp_path / 'x.png'
    p.write_bytes(b'\x89PNG\r\n\x1a\n' + b'\x00' * 20)
    url = sd.image_to_data_url(p)
    assert url.startswith('data:image/png;base64,')


def test_is_configured_modelark_without_gateway_url(monkeypatch):
    monkeypatch.delenv('SEEDANCE_API_URL', raising=False)
    monkeypatch.delenv('SEEDANCE_URL', raising=False)
    monkeypatch.setenv('ARK_API_KEY', 'test-key-placeholder')
    assert sd.is_configured() is True


def test_is_configured_requires_key_for_modelark(monkeypatch):
    monkeypatch.delenv('SEEDANCE_API_URL', raising=False)
    monkeypatch.delenv('SEEDANCE_URL', raising=False)
    monkeypatch.setenv('SEEDANCE_USE_MODELARK', 'true')
    monkeypatch.setattr(sd, '_auth_key', lambda: '')
    assert sd.is_configured() is False
