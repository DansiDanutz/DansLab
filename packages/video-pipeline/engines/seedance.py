#!/usr/bin/env python3.13
"""Seedance 2.0 video generation client (ByteDance / BytePlus).

Image-to-video / text-to-video generation. Used by Step 7 (render) to
optionally turn each scene's hero image into a short motion clip before
Remotion compositing.

Two transports:

1. **Gateway** — ``POST {SEEDANCE_API_URL}/img2vid`` (e.g. 9router). Set
   ``SEEDANCE_API_URL`` to your proxy base.

2. **BytePlus ModelArk (native)** — async tasks at
   ``{api_v3_base}/contents/generations/tasks`` + poll GET until ``succeeded``.
   Enable when **any** of these is true:
   - ``SEEDANCE_USE_MODELARK=1`` (or ``true`` / ``yes`` / ``on``),
   - ``SEEDANCE_API_URL`` points at ModelArk (URL contains ``bytepluses.com``
     and ``/api/v3``), or
   - a shared ``BYTEPLUS_API_KEY`` / ``ARK_API_KEY`` is configured and no
     gateway URL is set.

   Base URL resolution: explicit ``SEEDANCE_API_URL`` if it matches ModelArk;
   else ``SEEDANCE_MODELARK_BASE_URL``; else ``ARK_BASE_URL`` / default from
   ``byteplus_ark``.

Configuration (env or ``~/.openclaw/fleet.env``, plus Keychain via
``engines._secrets``):

  - SEEDANCE_API_URL / SEEDANCE_URL — gateway base **or** ModelArk ``.../api/v3`` root
  - SEEDANCE_API_KEY / SEEDANCE_KEY — optional if ``BYTEPLUS_API_KEY`` / ``ARK_API_KEY`` set
  - SEEDANCE_MODEL — default ``dreamina-seedance-2-0-260128``
  - SEEDANCE_RESOLUTION — default ``720p`` (``480p`` | ``720p`` | ``1080p``)
  - SEEDANCE_RATIO — default ``adaptive`` for i2v
  - SEEDANCE_POLL_INTERVAL — seconds between polls (default ``8``)
  - SEEDANCE_TASK_TIMEOUT — max seconds to wait for a **ModelArk** task (default
    ``1200`` when ``timeout`` is omitted on ``img2vid``; gateway default stays ``240``)
  - SEEDANCE_GENERATE_AUDIO — ``1`` / ``true`` to send ``generate_audio: true`` (1.5 Pro)

**Console:** If the key works but tasks say the service needs activation, enable
**Seedance** in **BytePlus Ark Console** before spending resource packs.

If unconfigured, functions return a graceful ``skipped`` response.
"""
from __future__ import annotations

import base64
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

HOME = Path.home()
FLEET_ENV = HOME / '.openclaw' / 'fleet.env'


def _load_fleet_env() -> dict:
    env: dict = {}
    if not FLEET_ENV.exists():
        return env
    try:
        for raw in FLEET_ENV.read_text(errors='ignore').splitlines():
            line = raw.strip()
            if not line or line.startswith('#'):
                continue
            if line.startswith('export '):
                line = line[len('export '):]
            if '=' not in line:
                continue
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    except Exception:
        pass
    return env


_FLEET = _load_fleet_env()


def _key(*names: str) -> str:
    for name in names:
        v = os.environ.get(name) or _FLEET.get(name) or ''
        if v:
            return v
    return ''


def _truthy(name: str) -> bool:
    v = (_key(name) or '').strip().lower()
    return v in ('1', 'true', 'yes', 'on')


def _auth_key() -> str:
    """Bearer token: explicit Seedance vars, else shared BytePlus ModelArk key."""
    k = _key('SEEDANCE_API_KEY', 'SEEDANCE_KEY')
    if k:
        return k
    try:
        from . import _secrets as _sec
        return _sec.resolve('BYTEPLUS_API_KEY', 'ARK_API_KEY')
    except Exception:
        return ''


def _looks_like_modelark_api_root(url: str) -> bool:
    u = (url or '').strip().lower()
    return 'bytepluses.com' in u and '/api/v3' in u


def _use_modelark_tasks(url: str) -> bool:
    if _truthy('SEEDANCE_USE_MODELARK') or _looks_like_modelark_api_root(url):
        return True
    return not (url or '').strip() and bool(_auth_key())


def _resolve_img2vid_timeout(cfg_url: str, timeout: int | None) -> int:
    """Per-transport defaults: ModelArk jobs often exceed 240s; gateway stays snappy."""
    if _use_modelark_tasks(cfg_url):
        if timeout is not None:
            return int(timeout)
        return max(120, int(_key('SEEDANCE_TASK_TIMEOUT') or '1200'))
    if timeout is not None:
        return int(timeout)
    return max(30, int(_key('SEEDANCE_GATEWAY_TIMEOUT') or '240'))


def _modelark_api_base(url_from_config: str) -> str:
    """OpenAI-style API v3 root (no trailing slash)."""
    if _looks_like_modelark_api_root(url_from_config):
        return url_from_config.strip().rstrip('/')
    extra = _key('SEEDANCE_MODELARK_BASE_URL', 'SEEDANCE_ARK_BASE_URL')
    if extra.strip():
        return extra.strip().rstrip('/')
    try:
        from . import byteplus_ark as _ba
        return _ba.ark_base_url()
    except Exception:
        return 'https://ark.ap-southeast.bytepluses.com/api/v3'


def _image_mime(path: Path) -> str:
    suf = path.suffix.lower().lstrip('.') or 'jpeg'
    if suf in ('jpg', 'jpeg'):
        return 'image/jpeg'
    if suf == 'png':
        return 'image/png'
    if suf == 'webp':
        return 'image/webp'
    return 'image/jpeg'


def image_to_data_url(image_path: Path) -> str:
    """Public for tests: local file → data URL for ModelArk ``image_url``."""
    mime = _image_mime(image_path)
    b64 = base64.b64encode(image_path.read_bytes()).decode('ascii')
    return f'data:{mime};base64,{b64}'


def build_modelark_i2v_task_body(
    *,
    model: str,
    prompt: str,
    image_data_url: str,
    duration_s: float,
    resolution: str,
    ratio: str,
    generate_audio: bool | None,
) -> dict:
    """JSON body for POST .../contents/generations/tasks (image-to-video)."""
    d = int(round(float(duration_s)))
    d = max(2, min(12, d))
    body: dict = {
        'model': model,
        'content': [
            {'type': 'text', 'text': prompt[:4000]},
            {
                'type': 'image_url',
                'image_url': {'url': image_data_url},
                'role': 'first_frame',
            },
        ],
        'ratio': ratio,
        'duration': d,
        'resolution': resolution,
    }
    if generate_audio is not None:
        body['generate_audio'] = bool(generate_audio)
    return body


def _http_json(
    method: str,
    url: str,
    *,
    api_key: str,
    body: dict | None = None,
    timeout: int = 120,
) -> tuple[bool, dict | str]:
    data = None if body is None else json.dumps(body).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        err = e.read().decode('utf-8', errors='replace')[:2000]
        payload: dict = {'http_status': e.code, 'raw': err}
        try:
            parsed = json.loads(err)
        except json.JSONDecodeError:
            parsed = {}
        if isinstance(parsed, dict):
            detail = parsed.get('error') or parsed
            if isinstance(detail, dict):
                message = str(detail.get('message') or '')
                payload.update({
                    'error_code': detail.get('code') or parsed.get('code'),
                    'message': message,
                    'error_type': detail.get('type') or parsed.get('type'),
                    'request_id': detail.get('request_id') or parsed.get('request_id'),
                })
                if (payload.get('error_code') == 'ModelNotOpen'
                        or 'activate the model service' in message.lower()):
                    payload['activation_required'] = True
        return False, payload
    except Exception as e:
        return False, f'{type(e).__name__}: {e}'
    try:
        return True, json.loads(raw)
    except json.JSONDecodeError:
        return False, raw[:500]


def _error_result(err: dict | str, *, elapsed: float, task_id: str | None = None) -> dict:
    if not isinstance(err, dict):
        out = {'ok': False, 'error': str(err), 'elapsed': round(elapsed, 1)}
        if task_id:
            out['task_id'] = task_id
        return out

    msg = str(err.get('message') or err.get('raw') or err)
    activation_required = (
        err.get('activation_required') is True
        or err.get('error_code') == 'ModelNotOpen'
        or 'activate the model service' in msg.lower()
    )
    out = {
        'ok': False,
        'error': msg,
        'elapsed': round(elapsed, 1),
    }
    if task_id:
        out['task_id'] = task_id
    for key in ('http_status', 'error_code', 'error_type', 'request_id', 'activation_required'):
        if err.get(key) is not None:
            out[key] = err[key]
    if activation_required:
        out['activation_required'] = True
    return out


def _model_wants_audio_flag(model: str) -> bool | None:
    """``generate_audio`` is documented for Seedance 1.5 Pro; omit for others unless forced."""
    m = model.lower()
    if '1-5-pro' in m or '1_5_pro' in m:
        if _truthy('SEEDANCE_GENERATE_AUDIO'):
            return True
        if _key('SEEDANCE_GENERATE_AUDIO').strip().lower() in ('0', 'false', 'no'):
            return False
        return False
    if _truthy('SEEDANCE_GENERATE_AUDIO'):
        return True
    return None


def _img2vid_modelark_tasks(
    *,
    api_base: str,
    api_key: str,
    model: str,
    image_path: Path,
    prompt: str,
    out_path: Path,
    duration_s: float,
    timeout: int,
) -> dict:
    t0 = time.time()
    data_url = image_to_data_url(image_path)
    resolution = (_key('SEEDANCE_RESOLUTION') or '720p').strip()
    ratio = (_key('SEEDANCE_RATIO') or 'adaptive').strip()
    poll_iv = max(3, int(_key('SEEDANCE_POLL_INTERVAL') or '8'))
    ga = _model_wants_audio_flag(model)
    create_url = f'{api_base}/contents/generations/tasks'
    body = build_modelark_i2v_task_body(
        model=model,
        prompt=prompt,
        image_data_url=data_url,
        duration_s=duration_s,
        resolution=resolution,
        ratio=ratio,
        generate_audio=ga,
    )
    ok, res = _http_json('POST', create_url, api_key=api_key, body=body, timeout=60)
    if not ok:
        return _error_result(res, elapsed=time.time() - t0)
    if not isinstance(res, dict):
        return {'ok': False, 'error': 'unexpected create response', 'elapsed': round(time.time() - t0, 1)}
    task_id = (res.get('id') or res.get('task_id') or '').strip()
    if not task_id:
        return {'ok': False, 'error': res.get('error') or res.get('message') or 'no task id in response',
                'raw': res, 'elapsed': round(time.time() - t0, 1)}

    status_url = f'{api_base}/contents/generations/tasks/{task_id}'
    deadline = time.time() + float(timeout)
    last_status = ''
    while time.time() < deadline:
        ok2, st = _http_json('GET', status_url, api_key=api_key, timeout=60)
        if not ok2:
            return _error_result(st, elapsed=time.time() - t0, task_id=task_id)
        if not isinstance(st, dict):
            return {'ok': False, 'error': 'unexpected poll response', 'task_id': task_id,
                    'elapsed': round(time.time() - t0, 1)}
        last_status = str(st.get('status') or '').lower()
        if last_status == 'succeeded':
            content = st.get('content') or {}
            video_url = content.get('video_url') or st.get('video_url')
            if not video_url:
                return {'ok': False, 'error': 'succeeded but no video_url', 'task_id': task_id,
                        'raw': st, 'elapsed': round(time.time() - t0, 1)}
            try:
                with urllib.request.urlopen(str(video_url), timeout=300) as vr:
                    blob = vr.read()
            except Exception as e:
                return {'ok': False, 'error': f'download failed: {e}', 'task_id': task_id,
                        'elapsed': round(time.time() - t0, 1)}
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(blob)
            return {'ok': True, 'path': str(out_path), 'model': model, 'task_id': task_id,
                    'elapsed': round(time.time() - t0, 1)}
        if last_status in ('failed', 'expired', 'cancelled'):
            err = st.get('error') or {}
            msg = err.get('message') if isinstance(err, dict) else str(err)
            out = {'ok': False, 'error': msg or last_status, 'task_id': task_id,
                   'status': last_status, 'raw': st, 'elapsed': round(time.time() - t0, 1)}
            if isinstance(err, dict):
                code = err.get('code')
                if code:
                    out['error_code'] = code
                if code == 'ModelNotOpen' or 'activate the model service' in (msg or '').lower():
                    out['activation_required'] = True
            return out
        time.sleep(poll_iv)

    return {'ok': False, 'error': f'timeout after {timeout}s (last status: {last_status!r})',
            'task_id': task_id, 'elapsed': round(time.time() - t0, 1)}


def _config() -> dict:
    return {
        'url':   _key('SEEDANCE_API_URL', 'SEEDANCE_URL'),
        'key':   _auth_key(),
        'model': _key('SEEDANCE_MODEL') or 'dreamina-seedance-2-0-260128',
    }


def is_configured() -> bool:
    cfg = _config()
    if not cfg['key']:
        return False
    if _use_modelark_tasks(cfg['url']):
        return True
    return bool(cfg['url'])


def status() -> dict:
    cfg = _config()
    mode = 'modelark_tasks' if _use_modelark_tasks(cfg['url']) else 'gateway_img2vid'
    base = _modelark_api_base(cfg['url']) if mode == 'modelark_tasks' else (cfg['url'] or '(unset)')
    return {
        'configured': is_configured(),
        'url':        cfg['url'] or ('(unset — using ARK_BASE_URL)' if mode == 'modelark_tasks' else '(unset)'),
        'model':      cfg['model'],
        'mode':       mode,
        'api_base':   base if mode == 'modelark_tasks' else cfg['url'],
    }


def img2vid(image_path: str, prompt: str, out_path: str,
            duration_s: float = 5.0, timeout: int | None = None) -> dict:
    """Generate a short motion clip from a static hero image.

    ``timeout`` is optional. Omitted → 240s gateway / 1200s ModelArk (override with
    ``SEEDANCE_TASK_TIMEOUT`` / ``SEEDANCE_GATEWAY_TIMEOUT``). Pass an explicit int
    to cap wait time for tests or tight SLAs.

    Returns {ok, path, model, elapsed} or {ok: False, skipped|error}.
    """
    cfg = _config()
    path = Path(image_path)
    out = Path(out_path)
    eff_timeout = _resolve_img2vid_timeout(cfg['url'], timeout)

    if not cfg['key']:
        return {'ok': False, 'skipped': True,
                'reason': 'no SEEDANCE_API_KEY / BYTEPLUS_API_KEY / ARK_API_KEY'}
    if not path.exists():
        return {'ok': False, 'error': f'image not found: {image_path}'}

    if _use_modelark_tasks(cfg['url']):
        api_base = _modelark_api_base(cfg['url'])
        return _img2vid_modelark_tasks(
            api_base=api_base,
            api_key=cfg['key'],
            model=cfg['model'],
            image_path=path,
            prompt=prompt,
            out_path=out,
            duration_s=duration_s,
            timeout=eff_timeout,
        )

    if not cfg['url']:
        return {'ok': False, 'skipped': True,
                'reason': 'SEEDANCE_API_URL unset (or set SEEDANCE_USE_MODELARK=1 for ModelArk tasks)'}

    t0 = time.time()
    img_b64 = base64.b64encode(path.read_bytes()).decode('ascii')
    body = json.dumps({
        'model':        cfg['model'],
        'image_base64': img_b64,
        'prompt':       prompt[:1500],
        'duration_s':   duration_s,
    }).encode('utf-8')
    try:
        req = urllib.request.Request(
            f'{cfg["url"].rstrip("/")}/img2vid',
            data=body,
            headers={
                'Authorization': f'Bearer {cfg["key"]}',
                'Content-Type':  'application/json',
                'Accept':        'video/mp4',
            },
        )
        with urllib.request.urlopen(req, timeout=eff_timeout) as r:
            ct = (r.headers.get('Content-Type') or '').lower()
            payload = r.read()
        out.parent.mkdir(parents=True, exist_ok=True)
        if 'video/' in ct:
            out.write_bytes(payload)
            return {'ok': True, 'path': str(out), 'model': cfg['model'],
                    'elapsed': round(time.time() - t0, 1)}
        try:
            data = json.loads(payload)
        except Exception:
            return {'ok': False, 'error': 'unrecognized response format'}
        if data.get('video_url'):
            with urllib.request.urlopen(data['video_url'], timeout=120) as ir:
                out.write_bytes(ir.read())
            return {'ok': True, 'path': str(out), 'model': cfg['model'],
                    'elapsed': round(time.time() - t0, 1)}
        return {'ok': False, 'error': data.get('error') or 'no video in response'}
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}',
                'elapsed': round(time.time() - t0, 1)}
