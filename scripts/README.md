# DansLab Series Generation Pipelines

Two zero-or-near-zero-cost ways to generate the V2 character hero shots without
paying Higgsfield. Both consume the same prompt source of truth
(`scripts/character-prompts.json`) so output stays consistent across the set.

Pick one:

| | **Local (Mac Studio)** | **fal.ai cloud** |
|---|---|---|
| Cost | **$0** marginal | ~$1.00 total (existing fal credits) |
| Setup | One-time ComfyUI install on Mac Studio (~15 min) | None; just `FAL_KEY` env var |
| Per-render time | 30–90s on M-series GPU | 10–30s |
| Style consistency | IP-Adapter chains all renders to first | FLUX Pro Redux chains all renders to first |
| Best for | Bulk + iteration; future episodes; storyboards | Right-now batch when no time to set up local |

## Common: prompt source of truth

`scripts/character-prompts.json` holds the **global style** and **per-character
slot fills** for all 25 speaking-role hero shots. Both pipelines build the
final prompt as `global_style + "\n\n" + character.prompt` and apply
`global_negative` to keep things photoreal (no Pixar / cartoon).

The first character (`david`, `render_order: 1`, `is_anchor: true`) is rendered
first; every subsequent render references the freshly-generated David image as
a style anchor so the whole set looks like one art direction.

## Pipeline A — Local on Mac Studio (recommended, $0)

### One-time install
1. Clone ComfyUI: `git clone https://github.com/comfyanonymous/ComfyUI`
2. Install ComfyUI deps: `pip install -r requirements.txt`
3. Download FLUX.1-dev weights into `ComfyUI/models/unet/flux1-dev.safetensors`
   from https://huggingface.co/black-forest-labs/FLUX.1-dev (you'll need a
   Hugging Face token; FLUX-dev is gated but free for non-commercial; for
   commercial use point to FLUX.1-schnell instead).
4. Download FLUX VAE → `ComfyUI/models/vae/ae.safetensors`
5. Download CLIP-L → `ComfyUI/models/clip/clip_l.safetensors`
6. Download T5-XXL fp8 → `ComfyUI/models/clip/t5xxl_fp8_e4m3fn.safetensors`
7. Install ComfyUI-IPAdapter-plus into `ComfyUI/custom_nodes/`:
   `git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus`
8. Start ComfyUI: `python main.py --listen 127.0.0.1 --port 8188`

### Run
```bash
# All 25 in render order, chaining the David anchor through IP-Adapter:
python scripts/generate_characters_local.py

# Just a subset:
python scripts/generate_characters_local.py david hermes nano

# Dry-run to see the prompts:
python scripts/generate_characters_local.py --dry-run

# Don't chain renders (each one independent):
python scripts/generate_characters_local.py --no-style-ref
```

Outputs land in `public/series/characters/<id>.jpg`. The runner uploads each
freshly-saved image back into ComfyUI as the IP-Adapter style ref for the
next character.

## Pipeline B — fal.ai cloud (existing credits)

### Install
```bash
pip install fal-client requests
export FAL_KEY=...   # from https://fal.ai/dashboard/keys
```

### Run
```bash
# All 25:
python scripts/generate_characters_fal.py

# Subset:
python scripts/generate_characters_fal.py david hermes

# Dry-run:
python scripts/generate_characters_fal.py --dry-run

# Don't chain renders:
python scripts/generate_characters_fal.py --no-style-ref
```

The script uses `fal-ai/flux-pro/v1.1-ultra` for the anchor and
`fal-ai/flux-pro/v1.1-ultra/redux` (image-to-image with style retention) for
every subsequent character.

## After a batch lands

1. Spot-check the images in `public/series/characters/`. Re-run any that drift.
2. The Next.js cast page (`/series/cast`) auto-picks up images via
   `src/components/series/data/cast.ts`. Locked refs render from the
   `artUrl` field in that file — no other change needed.
3. Commit the updated character images and push.

## Cost ceiling sanity-check

| Surface | Renders | Local cost | fal cost | Higgsfield cost |
|---|---|---|---|---|
| Speaking roles (V2 lock) | 25 | $0 | ~$1.00 | ~$2.50 |
| Optional cameos | up to 9 | $0 | ~$0.36 | ~$0.90 |
| Per-episode storyboards (×12) | ~360 | $0 | ~$14.40 | ~$36 |
| Thumbnail variants (3 per ep × 12) | 36 | $0 | ~$1.44 | ~$3.60 |
| **Season total** | **~430** | **$0** | **~$17** | **~$43** |

Local pipeline is the durable choice. fal pipeline is the right-now choice.
