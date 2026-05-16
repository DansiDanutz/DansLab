# DansLab — Autonomous AI Lab

> **One product.** One codebase. Research → Script → Render → Publish.

DansLab is a human-led AI ecosystem where Dan orchestrates 30+ autonomous agents across 5 products. This repo unifies the public-facing web platform with the autonomous video production pipeline.

---

## Architecture

```
DansLab/                           # Root — Next.js web app (apps/web pattern)
├── src/app/                       # Next.js App Router
│   ├── page.tsx                   # Homepage — ecosystem overview
│   ├── lab/                       # Lab dashboard
│   ├── studio/                    # 🎬 Video production studio
│   ├── ecosystem/                 # Ecosystem explorer
│   ├── daily-news/                # Daily news feed
│   ├── evolution/                 # Agent evolution tracker
│   ├── semeclaw/                  # SemeClaw interface
│   └── api/pipeline/              # REST API for pipeline control
│       ├── status/route.ts
│       ├── run/route.ts
│       └── configs/route.ts
├── src/components/                # React components
├── packages/
│   └── video-pipeline/            # Python 10-step video engine
│       ├── engines/               # Step 1–10 engines + render/QA
│       ├── config/                # YAML configs (sources, routing, prompts)
│       ├── workflows/             # ComfyUI workflow JSONs
│       ├── tests/                 # pytest suite
│       └── tools/                 # Utility scripts
└── packages/openclaw-logger/      # Shared logging package
```

---

## Web App

**Stack:** Next.js 15 · React 18 · TypeScript · Tailwind CSS · Supabase

```bash
npm install
npm run dev          # localhost:3000
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — stats, products, agent team |
| `/lab` | Live lab dashboard with agent status |
| `/studio` | **Video production studio** — pipeline UI |
| `/ecosystem` | Full ecosystem visualization |
| `/daily-news` | Curated daily news feed |
| `/evolution` | Agent evolution & learning logs |
| `/semeclaw` | SemeClaw reasoning interface |

---

## Video Pipeline

**Stack:** Python 3.12 · HyperFrames · ComfyUI · Remotion (legacy) · Kokoro TTS

The 10-step engine lives in `packages/video-pipeline/engines/`:

| Step | Engine | Purpose |
|------|--------|---------|
| 1 | `step1_research.py` | Topic discovery via Perplexity / BytePlus Ark / Ollama |
| 2 | `step2_script.py` | Script drafting & polishing |
| 3 | `step3_visual.py` | Visual design brief generation |
| 4 | `step4_scenes.py` | Scene manifest creation |
| 5 | `step5_audio.py` | TTS narration (Kokoro) + music |
| 6 | `step6_subtitles.py` | Caption generation & sync |
| 7 | `step7_render.py` | **Dual-track render** — HyperFrames + Remotion |
| 8 | `step8_qa.py` | Technical QA validation |
| 9 | `step9_final.py` | Final assembly & delivery |
| 10 | `step10_addons.py` | Thumbnails, metadata, upload |

### Key Features

- **Dual-track rendering** — HyperFrames (preferred) + Remotion run in parallel; `render_judge.py` auto-selects the best output
- **Deep mode fallback chain** — Perplexity → BytePlus Ark → Ollama for all research steps
- **Design agent orchestration** — `design_agent_orchestrator.py` + `open_design_agent.py` handle visual direction
- **ComfyUI integration** — `comfyui_mcp_client.py` for SD1.5 / FLUX avatar & asset generation
- **Auto-render** — `video_build_mesh.py` can trigger HyperFrames renders automatically after handoff

### Running the Pipeline

```bash
cd packages/video-pipeline
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt

# Run a step
python -m engines.step1_research

# Or run via the dashboard server
python dashboard/server.py
```

---

## Configs

All pipeline configuration is in `packages/video-pipeline/config/`:

| File | Purpose |
|------|---------|
| `sources.yaml` | RSS feeds, internal signals, manual topics |
| `model_routing.yaml` | LLM assignment & fallback chain |
| `prompts.yaml` | System prompts per pipeline stage |
| `channels.yaml` | YouTube channel metadata |
| `comfyui_workflow.json` | ComfyUI generation pipeline |
| `manual_topics.yaml` | Override topics for forced coverage |

---

## API

The Next.js app exposes REST endpoints under `/api/pipeline/`:

```bash
GET  /api/pipeline/status     # Health & engine status
POST /api/pipeline/run        # Queue a new video job
GET  /api/pipeline/configs    # List available configs
```

---

## Development

### Prerequisites

- Node.js 20+
- Python 3.12+
- pnpm (for workspaces)
- ComfyUI Desktop (for image generation)
- HyperFrames CLI (`npx hyperframes`)

### Setup

```bash
# Install web dependencies
npm install

# Install pipeline dependencies
cd packages/video-pipeline
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

### Run Everything

```bash
# Terminal 1 — Web app
npm run dev

# Terminal 2 — Pipeline server (when wired)
cd packages/video-pipeline
python dashboard/server.py
```

---

## Environment Variables

Copy `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENCLAW_API_KEY=
PERPLEXITY_API_KEY=
BYTEPLUS_ARK_API_KEY=
HIGGSFIELD_API_KEY=
```

---

## History

This product unifies three previous codebases:

1. **DansLab** (Next.js web app) — the public-facing platform
2. **YouTubePipeline** (Python) — the 10-step video engine
3. **YouTube-Studio** (TypeScript, archived) — earlier pipeline iteration

All active development now happens in this single repo.

---

## License

Proprietary — DansLab 2026
