#!/usr/bin/env python3.13
"""ComfyUI MCP Client — automation layer for ComfyUI workflow generation & execution.

Provides:
  - list_workflows()        → discover available workflows
  - generate_workflow()     → auto-generate optimal workflows via MCP/DSL
  - run_workflow()          → execute a workflow via ComfyUI API
  - swap_model()            → programmatic model substitution
  - get_model_status()      → check what's installed vs required

Falls back to hardcoded workflow JSON when MCP is unavailable.
"""
from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

COMFYUI_HOST = os.environ.get('COMFYUI_HOST', 'http://127.0.0.1:8000')


def _fetch_json(path: str, timeout: int = 20) -> dict:
    base = COMFYUI_HOST.rstrip('/')
    try:
        with urllib.request.urlopen(f'{base}{path}', timeout=timeout) as r:
            return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}'}


def _post_json(path: str, data: dict, timeout: int = 30) -> dict:
    base = COMFYUI_HOST.rstrip('/')
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(
        f'{base}{path}', data=body,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {'ok': False, 'error': f'{type(e).__name__}: {e}'}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def comfyui_reachable(timeout: int = 5) -> bool:
    try:
        r = _fetch_json('/system_stats', timeout=timeout)
        return 'system' in r
    except Exception:
        return False


def list_workflows() -> list[dict]:
    """List available workflow files in the repo's comfyui-workflows/ directory."""
    wf_dir = PROJECT_ROOT / 'comfyui-workflows'
    if not wf_dir.exists():
        return []
    out = []
    for p in sorted(wf_dir.glob('*.json')):
        try:
            data = json.loads(p.read_text(encoding='utf-8'))
            # Extract model references for quick scanning
            models = _extract_model_refs(data)
            out.append({
                'name': p.stem,
                'path': str(p),
                'size': p.stat().st_size,
                'models_referenced': models,
            })
        except Exception:
            out.append({'name': p.stem, 'path': str(p), 'size': p.stat().st_size, 'models_referenced': []})
    return out


def list_installed_models() -> dict:
    """Query ComfyUI API for available models by type."""
    if not comfyui_reachable():
        return {'ok': False, 'error': 'ComfyUI not reachable'}

    model_types = ['CheckpointLoaderSimple', 'UNETLoader', 'VAELoader', 'CLIPLoader', 'UnetLoaderGGUF']
    result: dict = {'ok': True, 'models': {}}
    for mt in model_types:
        try:
            info = _fetch_json(f'/object_info/{mt}', timeout=10)
            if mt in info and 'input' in info[mt] and 'required' in info[mt]['input']:
                req = info[mt]['input']['required']
                # Find the model name field (first required field)
                for key, val in req.items():
                    if isinstance(val, list) and len(val) > 0 and isinstance(val[0], list):
                        result['models'][mt] = val[0]
                        break
        except Exception:
            pass
    return result


def get_model_status() -> dict:
    """Compare workflow-referenced models against installed models."""
    workflows = list_workflows()
    installed = list_installed_models()
    if not installed.get('ok'):
        return {'ok': False, 'error': installed.get('error', 'unknown')}

    installed_flat: set[str] = set()
    for model_list in installed.get('models', {}).values():
        if isinstance(model_list, list):
            installed_flat.update(str(m) for m in model_list)

    report: list[dict] = []
    for wf in workflows:
        missing = [m for m in wf.get('models_referenced', []) if m not in installed_flat]
        report.append({
            'workflow': wf['name'],
            'referenced': wf.get('models_referenced', []),
            'missing': missing,
            'ready': len(missing) == 0,
        })

    return {
        'ok': True,
        'workflows': report,
        'installed_models': sorted(installed_flat),
        'all_ready': all(r['ready'] for r in report),
    }


def generate_workflow(
    prompt: str,
    model_type: str = 'flux',
    width: int = 1920,
    height: int = 1080,
) -> dict:
    """Generate a ComfyUI workflow JSON optimized for the given prompt and model.

    model_type: 'flux' | 'sd15' | 'wan' | 'sdxl'
    Falls back to hardcoded templates when MCP/DSL generation is unavailable.
    """
    # Try MCP/DSL generation if available (placeholder for future integration)
    mcp_result = _try_mcp_generate(prompt, model_type, width, height)
    if mcp_result.get('ok'):
        return mcp_result

    # Fallback: return hardcoded workflow path reference
    wf_map = {
        'flux': 'flux-base-frames.json',
        'sd15': 'sd15-base-frames-api.json',
        'wan': 'wan21-img2vid.json',
    }
    wf_name = wf_map.get(model_type, 'sd15-base-frames-api.json')
    wf_path = PROJECT_ROOT / 'comfyui-workflows' / wf_name

    if not wf_path.exists():
        return {'ok': False, 'error': f'workflow file not found: {wf_path}'}

    try:
        workflow = json.loads(wf_path.read_text(encoding='utf-8'))
    except Exception as e:
        return {'ok': False, 'error': f'failed to parse workflow: {e}'}

    # Inject prompt into the workflow
    workflow = _inject_prompt(workflow, prompt)
    workflow = _set_dimensions(workflow, width, height)

    return {
        'ok': True,
        'workflow': workflow,
        'source': f'hardcoded:{wf_name}',
        'model_type': model_type,
    }


def run_workflow(workflow: dict, *, timeout: int = 300) -> dict:
    """Submit a workflow to ComfyUI and poll for completion."""
    if not comfyui_reachable():
        return {'ok': False, 'error': 'ComfyUI not reachable'}

    submit = _post_json('/prompt', {'prompt': workflow, 'client_id': 'pipeline-mcp'}, timeout=15)
    if 'prompt_id' not in submit:
        return {'ok': False, 'error': f'prompt submission failed: {submit.get("error", "unknown")}'}

    prompt_id = submit['prompt_id']

    # Poll for completion
    import time
    started = time.time()
    while time.time() - started < timeout:
        history = _fetch_json(f'/history/{prompt_id}', timeout=10)
        if prompt_id in history:
            entry = history[prompt_id]
            status = entry.get('status', {})
            if status.get('completed'):
                outputs = entry.get('outputs', {})
                images = []
                for node_id, node_outputs in outputs.items():
                    if 'images' in node_outputs:
                        for img in node_outputs['images']:
                            images.append({
                                'filename': img.get('filename'),
                                'subfolder': img.get('subfolder', ''),
                                'type': img.get('type', 'output'),
                                'url': f'{COMFYUI_HOST}/view?filename={img["filename"]}&subfolder={img.get("subfolder", "")}&type={img.get("type", "output")}',
                            })
                return {
                    'ok': True,
                    'prompt_id': prompt_id,
                    'outputs': images,
                    'elapsed_seconds': round(time.time() - started, 1),
                }
            elif 'execution_error' in str(entry):
                return {
                    'ok': False,
                    'prompt_id': prompt_id,
                    'error': 'execution error during workflow run',
                    'details': entry,
                }
        time.sleep(2)

    return {'ok': False, 'prompt_id': prompt_id, 'error': f'timeout after {timeout}s'}


def swap_model(workflow: dict, old_model: str, new_model: str) -> dict:
    """Replace all occurrences of old_model with new_model in a workflow.

    Returns: {ok, replacements, workflow}
    """
    wf_str = json.dumps(workflow)
    count = wf_str.count(old_model)
    if count == 0:
        return {'ok': True, 'replacements': 0, 'workflow': workflow}
    wf_str = wf_str.replace(old_model, new_model)
    try:
        new_workflow = json.loads(wf_str)
        return {'ok': True, 'replacements': count, 'workflow': new_workflow}
    except Exception as e:
        return {'ok': False, 'error': f'workflow became invalid after swap: {e}'}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _extract_model_refs(data: object) -> list[str]:
    """Recursively extract .safetensors / .gguf / .ckpt references from workflow JSON."""
    refs: list[str] = []
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, str) and any(v.endswith(ext) for ext in ('.safetensors', '.gguf', '.ckpt', '.pt', '.pth')):
                refs.append(v)
            else:
                refs.extend(_extract_model_refs(v))
    elif isinstance(data, list):
        for item in data:
            refs.extend(_extract_model_refs(item))
    return refs


def _inject_prompt(workflow: dict, prompt: str) -> dict:
    """Inject prompt into the first CLIPTextEncode or FluxGuidance node."""
    wf = dict(workflow)
    # Handle both API format (node_id keys) and UI format (nodes array)
    if 'nodes' in wf:
        for node in wf.get('nodes', []):
            if node.get('type') in ('CLIPTextEncode', 'FluxGuidance', 'CLIPTextEncodeFlux'):
                widgets = node.get('widgets_values', [])
                if widgets and isinstance(widgets, list):
                    widgets[0] = prompt
                    break
    else:
        for node_id, node in wf.items():
            if isinstance(node, dict) and node.get('class_type') in ('CLIPTextEncode', 'FluxGuidance', 'CLIPTextEncodeFlux'):
                inputs = node.get('inputs', {})
                if 'text' in inputs:
                    inputs['text'] = prompt
                    break
    return wf


def _set_dimensions(workflow: dict, width: int, height: int) -> dict:
    """Set EmptyLatentImage or EmptySD3LatentImage dimensions."""
    wf = dict(workflow)
    if 'nodes' in wf:
        for node in wf.get('nodes', []):
            if node.get('type') in ('EmptyLatentImage', 'EmptySD3LatentImage', 'EmptyLatentImageSDXL'):
                widgets = node.get('widgets_values', [])
                if len(widgets) >= 2:
                    widgets[0] = width
                    widgets[1] = height
                    break
    else:
        for node_id, node in wf.items():
            if isinstance(node, dict) and node.get('class_type') in ('EmptyLatentImage', 'EmptySD3LatentImage', 'EmptyLatentImageSDXL'):
                inputs = node.get('inputs', {})
                if 'width' in inputs:
                    inputs['width'] = width
                if 'height' in inputs:
                    inputs['height'] = height
                break
    return wf


def _try_mcp_generate(prompt: str, model_type: str, width: int, height: int) -> dict:
    """Placeholder for MCP/DSL workflow generation.

    In a full implementation, this would connect to:
    - ComfyUI-Copilot API
    - ComfyUI MCP server (SamuraiBuddha/mcp-comfyui)
    - ComfyGPT workflow generator
    """
    # Check if MCP server is configured
    mcp_config = os.environ.get('COMFYUI_MCP_SERVER')
    if not mcp_config:
        return {'ok': False, 'reason': 'COMFYUI_MCP_SERVER not configured'}
    return {'ok': False, 'reason': 'MCP generation not yet implemented'}


def status() -> dict:
    """Return ComfyUI MCP client status."""
    return {
        'comfyui_reachable': comfyui_reachable(),
        'host': COMFYUI_HOST,
        'mcp_configured': bool(os.environ.get('COMFYUI_MCP_SERVER')),
        'workflows_available': len(list_workflows()),
        'note': 'Set COMFYUI_MCP_SERVER to enable MCP workflow generation',
    }
