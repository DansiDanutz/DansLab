#!/usr/bin/env python3.13
"""BytePlus ModelArk — OpenAI-compatible chat API (optional paid lane).

Docs: https://docs.byteplus.com/en/docs/ModelArk/

Default chat model (override with ``ARK_MODEL`` or ``BYTEPLUS_ARK_MODEL``):

  seed-2-0-lite-260228

Set ``BYTEPLUS_API_KEY`` or ``ARK_API_KEY`` (Keychain: ``openclaw.byteplus_ark``,
or ``~/.openclaw/fleet.env``). Base URL defaults to Southeast ModelArk; override
with ``ARK_BASE_URL`` if your console shows a different region.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

# Public chat model from the official ModelArk OpenAI-compatible examples.
DEFAULT_ARK_MODEL = 'seed-2-0-lite-260228'

# BytePlus OpenAI-compatible root (no trailing slash); append /chat/completions.
DEFAULT_ARK_BASE = 'https://ark.ap-southeast.bytepluses.com/api/v3'


def _api_key() -> str:
    try:
        from . import _secrets

        return _secrets.resolve('BYTEPLUS_API_KEY', 'ARK_API_KEY')
    except Exception:
        return (os.environ.get('BYTEPLUS_API_KEY') or os.environ.get('ARK_API_KEY') or '').strip()


def ark_base_url() -> str:
    return (os.environ.get('ARK_BASE_URL') or DEFAULT_ARK_BASE).strip().rstrip('/')


def _looks_like_api_key(value: str) -> bool:
    value = (value or '').strip()
    return value.startswith('ark-') and value.count('-') >= 5


def ark_model() -> str:
    configured = (
        os.environ.get('ARK_MODEL')
        or os.environ.get('BYTEPLUS_ARK_MODEL')
        or DEFAULT_ARK_MODEL
    ).strip()
    if _looks_like_api_key(configured):
        return DEFAULT_ARK_MODEL
    return configured


def is_configured() -> bool:
    return bool(_api_key())


def status() -> dict:
    key = _api_key()
    base = ark_base_url()
    model = ark_model()
    note = ''
    if not key:
        note = 'set BYTEPLUS_API_KEY or ARK_API_KEY (fleet.env or Keychain openclaw.byteplus_ark)'
    return {
        'available': bool(key),
        'base_url': base,
        'model': model,
        'note': note,
    }


def chat_completions(
    messages: list[dict[str, Any]],
    *,
    model: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 4096,
    timeout_s: int = 120,
) -> dict:
    """POST /chat/completions. Returns ``{ok, content, raw, error}``."""
    key = _api_key()
    if not key:
        return {'ok': False, 'error': 'BYTEPLUS_API_KEY / ARK_API_KEY not set', 'content': ''}
    mid = (model or ark_model()).strip()
    url = f'{ark_base_url()}/chat/completions'
    body = json.dumps({
        'model': mid,
        'messages': messages,
        'temperature': float(temperature),
        'max_tokens': int(max_tokens),
    }).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {key}',
        },
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as r:
            raw = json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='replace')[:800]
        return {'ok': False, 'error': f'HTTP {e.code}: {err_body}', 'content': ''}
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}', 'content': ''}

    try:
        choices = raw.get('choices') or []
        msg = (choices[0].get('message') or {}) if choices else {}
        content = (msg.get('content') or '').strip()
    except Exception:
        content = ''
    return {'ok': bool(content), 'content': content, 'raw': raw, 'error': '' if content else 'empty choices'}
