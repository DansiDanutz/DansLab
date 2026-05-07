#!/usr/bin/env python3
"""
Generate all 25 V2 character hero shots LOCALLY on Mac Studio via a running
ComfyUI instance, using FLUX.1-dev + IP-Adapter for style consistency.

Cost: $0 marginal. ~30–90s per render on M-series GPU.

Usage on Mac Studio:
    1. Install ComfyUI: https://github.com/comfyanonymous/ComfyUI
    2. Download FLUX.1-dev weights into ComfyUI/models/unet/
       https://huggingface.co/black-forest-labs/FLUX.1-dev
    3. Download FLUX VAE + CLIP-L + T5-XXL into ComfyUI/models/{vae,clip,clip}/
    4. Install ComfyUI-IPAdapter-plus extension (for style reference)
    5. Start ComfyUI: python main.py --listen 127.0.0.1 --port 8188
    6. Run: python scripts/generate_characters_local.py

Outputs to public/series/characters/<id>.jpg via the ComfyUI HTTP API.
The script chains renders so the first character becomes the IP-Adapter
style anchor for everyone after.

Prereq: pip install requests websocket-client
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

import uuid

REPO = Path(__file__).resolve().parent.parent
PROMPTS_PATH = REPO / "scripts" / "character-prompts.json"
WORKFLOW_PATH = REPO / "scripts" / "comfyui-workflows" / "character-hero.json"
OUT_DIR = REPO / "public" / "series" / "characters"

COMFY_HOST = os.environ.get("COMFY_HOST", "127.0.0.1:8188")


def load(p: Path) -> dict[str, Any]:
    with p.open() as f:
        return json.load(f)


def queue_prompt(workflow: dict[str, Any], client_id: str) -> str:
    """Submits a workflow to ComfyUI; returns prompt_id."""
    payload = json.dumps({"prompt": workflow, "client_id": client_id}).encode("utf-8")
    req = urllib.request.Request(
        f"http://{COMFY_HOST}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["prompt_id"]


def wait_for(client_id: str, prompt_id: str, timeout_s: int = 600) -> dict[str, Any]:
    """Polls history until prompt_id has outputs. Returns the history entry."""
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        with urllib.request.urlopen(
            f"http://{COMFY_HOST}/history/{prompt_id}", timeout=10
        ) as r:
            hist = json.loads(r.read())
        if prompt_id in hist:
            return hist[prompt_id]
        time.sleep(2)
    raise TimeoutError(f"comfy did not finish prompt {prompt_id} in {timeout_s}s")


def fetch_image(filename: str, subfolder: str, image_type: str) -> bytes:
    qs = urllib.parse.urlencode(
        {"filename": filename, "subfolder": subfolder, "type": image_type}
    )
    with urllib.request.urlopen(f"http://{COMFY_HOST}/view?{qs}", timeout=30) as r:
        return r.read()


def upload_image(local_path: Path) -> str:
    """Upload a local image to ComfyUI as input. Returns its filename for ref."""
    boundary = "----------DANSLAB"
    body_lines = [
        f"--{boundary}",
        f'Content-Disposition: form-data; name="image"; filename="{local_path.name}"',
        "Content-Type: image/jpeg",
        "",
    ]
    head = ("\r\n".join(body_lines) + "\r\n").encode()
    tail = ("\r\n--" + boundary + "--\r\n").encode()
    payload = head + local_path.read_bytes() + tail
    req = urllib.request.Request(
        f"http://{COMFY_HOST}/upload/image",
        data=payload,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["name"]


def patch_workflow(
    workflow: dict[str, Any],
    *,
    positive_prompt: str,
    negative_prompt: str,
    style_ref_filename: str | None,
    seed: int,
) -> dict[str, Any]:
    """
    Mutates a copy of the workflow in place with the new prompt + ref + seed.
    The shipped workflow uses well-known node titles so this stays simple.
    """
    wf = json.loads(json.dumps(workflow))  # deep copy
    for node_id, node in wf.items():
        title = node.get("_meta", {}).get("title", "")
        if title == "POSITIVE_PROMPT":
            node["inputs"]["text"] = positive_prompt
        elif title == "NEGATIVE_PROMPT":
            node["inputs"]["text"] = negative_prompt
        elif title == "SEED":
            node["inputs"]["noise_seed"] = seed
        elif title == "STYLE_REF" and style_ref_filename:
            node["inputs"]["image"] = style_ref_filename
    return wf


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ids", nargs="*", help="character ids (default: all 25)")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--no-style-ref",
        action="store_true",
        help="don't chain renders — pure text-to-image each time",
    )
    parser.add_argument(
        "--seed", type=int, default=88001, help="base seed (incremented per character)"
    )
    args = parser.parse_args()

    spec = load(PROMPTS_PATH)
    workflow = load(WORKFLOW_PATH)

    if args.ids:
        wanted = set(args.ids)
        chars = [c for c in spec["characters"] if c["id"] in wanted]
        unknown = wanted - {c["id"] for c in chars}
        if unknown:
            sys.exit(f"unknown ids: {sorted(unknown)}")
    else:
        chars = list(spec["characters"])

    chars.sort(key=lambda c: (not c.get("is_anchor"), c["render_order"]))
    print(f"rendering {len(chars)}: {', '.join(c['id'] for c in chars)}")

    if args.dry_run:
        for c in chars:
            print(f"\n=== {c['id']} (#{c['render_order']}) ===")
            print(spec["global_style"])
            print()
            print(c["prompt"])
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    client_id = str(uuid.uuid4())
    style_ref: str | None = None

    for i, c in enumerate(chars, start=1):
        full_prompt = spec["global_style"] + "\n\n" + c["prompt"]
        ref = None if args.no_style_ref else style_ref
        wf = patch_workflow(
            workflow,
            positive_prompt=full_prompt,
            negative_prompt=spec["global_negative"],
            style_ref_filename=ref,
            seed=args.seed + c["render_order"],
        )
        print(f"\n[{i}/{len(chars)}] {c['id']} "
              f"({'anchor' if not ref else 'ref=' + ref})")
        t0 = time.time()
        prompt_id = queue_prompt(wf, client_id)
        result = wait_for(client_id, prompt_id, timeout_s=600)
        outputs = result["outputs"]
        # Find any node whose outputs include images.
        saved_filename = None
        for _node_id, node_out in outputs.items():
            if "images" in node_out:
                img_meta = node_out["images"][0]
                saved_filename = img_meta["filename"]
                image_bytes = fetch_image(
                    img_meta["filename"], img_meta["subfolder"], img_meta["type"]
                )
                dest = OUT_DIR / f"{c['id']}.jpg"
                dest.write_bytes(image_bytes)
                print(f"  saved {dest.relative_to(REPO)} in {time.time()-t0:.1f}s")
                break
        if saved_filename is None:
            print("  warning: no image returned, skipping ref-chain update")
            continue
        if style_ref is None and not args.no_style_ref:
            # Upload the freshly-saved local file as the IP-Adapter ref.
            style_ref = upload_image(OUT_DIR / f"{c['id']}.jpg")
            print(f"  set style_ref → {style_ref}")

    print("\ndone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
