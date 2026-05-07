#!/usr/bin/env python3
"""
Generate all 25 V2 character hero shots via fal.ai using existing fal credits.

Cost: ~$0.04 per render with FLUX Pro 1.1 Ultra (~$1.00 for the full batch).
Style consistency: each render after the first uses the David hero shot as
an IP-Adapter style reference, so the whole set looks like one art direction.

Usage:
    export FAL_KEY=...                    # from your fal.ai dashboard
    python scripts/generate_characters_fal.py                  # all 25
    python scripts/generate_characters_fal.py david hermes nano # subset
    python scripts/generate_characters_fal.py --dry-run        # show prompts only

Outputs to public/series/characters/<id>.jpg.

Prereq: pip install fal-client requests
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parent.parent
PROMPTS_PATH = REPO / "scripts" / "character-prompts.json"
OUT_DIR = REPO / "public" / "series" / "characters"


def load_prompts() -> dict[str, Any]:
    with PROMPTS_PATH.open() as f:
        return json.load(f)


def build_full_prompt(spec: dict[str, Any], character: dict[str, Any]) -> str:
    return f"{spec['global_style']}\n\n{character['prompt']}"


def select_characters(
    spec: dict[str, Any], ids: list[str] | None
) -> list[dict[str, Any]]:
    chars = sorted(spec["characters"], key=lambda c: c["render_order"])
    if not ids:
        return chars
    wanted = set(ids)
    found = [c for c in chars if c["id"] in wanted]
    missing = wanted - {c["id"] for c in found}
    if missing:
        sys.exit(f"unknown character ids: {sorted(missing)}")
    # Anchor (David) first if present so subsequent renders can reference it.
    found.sort(key=lambda c: (not c.get("is_anchor", False), c["render_order"]))
    return found


def generate_one(
    fal_client: Any,
    full_prompt: str,
    negative: str,
    style_ref_url: str | None,
) -> str:
    """Returns the URL of the generated image."""
    # FLUX Pro 1.1 Ultra is fal-ai/flux-pro/v1.1-ultra. For style consistency
    # we use the IP-Adapter variant when a reference is available; otherwise
    # the plain endpoint produces the anchor.
    if style_ref_url:
        endpoint = "fal-ai/flux-pro/v1.1-ultra/redux"
        payload = {
            "prompt": full_prompt,
            "image_url": style_ref_url,
            "image_size": "square_hd",
            "num_images": 1,
            "safety_tolerance": "5",
            "output_format": "jpeg",
        }
    else:
        endpoint = "fal-ai/flux-pro/v1.1-ultra"
        payload = {
            "prompt": full_prompt,
            "aspect_ratio": "1:1",
            "num_images": 1,
            "safety_tolerance": "5",
            "output_format": "jpeg",
        }
    result = fal_client.subscribe(endpoint, arguments=payload, with_logs=False)
    images = result.get("images") or []
    if not images:
        raise RuntimeError(f"no image in fal response: {result}")
    return images[0]["url"]


def download(url: str, dest: Path) -> None:
    import requests

    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    dest.write_bytes(r.content)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "ids",
        nargs="*",
        help="character ids to render (default: all 25)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="print the prompts and exit without calling fal",
    )
    parser.add_argument(
        "--no-style-ref",
        action="store_true",
        help="don't chain renders with IP-Adapter — generate each from text only",
    )
    args = parser.parse_args()

    spec = load_prompts()
    characters = select_characters(spec, args.ids or None)
    print(f"rendering {len(characters)} characters: "
          f"{', '.join(c['id'] for c in characters)}")

    if args.dry_run:
        for c in characters:
            print(f"\n=== {c['id']} (#{c['render_order']}) ===")
            print(build_full_prompt(spec, c))
        return 0

    if not os.environ.get("FAL_KEY"):
        sys.exit("FAL_KEY env var not set")

    try:
        import fal_client  # type: ignore
    except ImportError:
        sys.exit("pip install fal-client requests")

    style_ref_url: str | None = None
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for i, c in enumerate(characters, start=1):
        print(f"\n[{i}/{len(characters)}] {c['id']} → "
              f"{'(anchor, no style ref)' if not style_ref_url else '(referencing prior anchor)'}")
        prompt = build_full_prompt(spec, c)
        ref = None if args.no_style_ref else style_ref_url
        t0 = time.time()
        try:
            image_url = generate_one(
                fal_client=fal_client,
                full_prompt=prompt,
                negative=spec["global_negative"],
                style_ref_url=ref,
            )
        except Exception as exc:
            print(f"  failed: {exc}")
            continue
        elapsed = time.time() - t0
        dest = OUT_DIR / f"{c['id']}.jpg"
        download(image_url, dest)
        print(f"  saved {dest.relative_to(REPO)} in {elapsed:.1f}s")
        # The first rendered character (David in the default order) becomes
        # the style anchor for everything that follows.
        if style_ref_url is None:
            style_ref_url = image_url

    print("\ndone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
