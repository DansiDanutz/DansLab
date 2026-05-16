# DansLab Video Pipeline Architecture v2.0

> **The most advanced open-source YouTube automation pipeline.**
> Research → Script → Visual Design → Scenes → Audio → Subtitles → Render → QA → Final → Upload

---

## Philosophy

1. **Durable execution** — checkpoints after every step; resume on crash
2. **Cost transparency** — every API call tracked to the cent
3. **Multi-engine redundancy** — HyperFrames + Revideo + Remotion with auto-selection
4. **Local-first, cloud-fallback** — Ollama → ComfyUI → cloud APIs
5. **Agent-driven content** — CrewAI agents for research, script, visual, SEO, QA
6. **Observable** — Prometheus metrics for Grafana, per-video cost ledgers

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     WEB APP (Next.js 15)                        │
│  /studio  →  /api/pipeline/*  →  Dashboard + Control Plane      │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST + WebSocket
┌──────────────────────────────▼──────────────────────────────────┐
│                    QUEUE (Redis)                                │
│         danslab:pipeline:queue  →  durable job storage          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│              ORCHESTRATOR (Python asyncio)                      │
│  10-step pipeline with checkpoints, retries, cost tracking      │
│  ├─ Step 1:  Research      (Perplexity → BytePlus → Ollama)    │
│  ├─ Step 2:  Script        (CrewAI ScriptWriter)                │
│  ├─ Step 3:  Visual Design (CrewAI VisualPlanner)               │
│  ├─ Step 4:  Scenes        (Scene manifest + asset mapping)     │
│  ├─ Step 5:  Audio         (Kokoro → VibeVoice → ElevenLabs)    │
│  ├─ Step 6:  Subtitles     (Whisper local)                      │
│  ├─ Step 7:  Render        (HF || Revideo || Remotion)          │
│  ├─ Step 8:  QA            (ffprobe + CrewAI QualityReviewer)   │
│  ├─ Step 9:  Final         (Assembly + metadata)                │
│  └─ Step 10: Addons        (Thumbnail + YouTube upload)         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  ┌──────────┐          ┌──────────┐          ┌──────────┐
  │  LOCAL   │          │  CLOUD   │          │  AGENTS  │
  │ ComfyUI  │          │ Fal      │          │ CrewAI   │
  │ Ollama   │          │ Higgs    │          │ OpenClaw │
  │ Kokoro   │          │ Seedance │          │ LangGraph│
  │ Whisper  │          │ Veo      │          │          │
  └──────────┘          └──────────┘          └──────────┘
```

---

## Core Modules

### `core/settings.py`
Pydantic Settings with environment variable binding. All config in one place:
- `LLMConfig` — provider, fallback chain, retries
- `RenderConfig` — engines, resolution, parallel rendering
- `ComfyUIConfig` — local/remote ComfyUI endpoints
- `TTSConfig` — engine selection, voice, speed
- `YouTubeConfig` — upload settings, review gates
- `PipelineConfig` — enabled steps, budget, timeouts
- `ObservabilityConfig` — metrics, logging, cost tracking

### `core/queue.py`
Redis-backed job queue. No Celery required.
- `enqueue()`, `dequeue()`, `complete()`, `fail()`
- Progress tracking per job
- Dead letter queue for failed jobs
- Health check endpoint

### `core/orchestrator.py`
Main pipeline engine.
- Dynamic step registry — add steps without changing orchestrator
- Exponential backoff retry (2^attempt seconds)
- Checkpointing after every step (`data/checkpoints/{job_id}.json`)
- Resume from checkpoint on restart
- Human review gate before render/upload
- Budget enforcement (`cost_budget_usd`)

### `core/cost_tracker.py`
Per-video cost tracking.
- LLM token costs (pricing table for 9+ providers)
- Image generation costs
- Video render costs
- TTS character costs
- External API costs
- JSONL ledger per job for audit trail

### `core/monitoring.py`
Prometheus-compatible metrics.
- `danslab_pipeline_runs_total`
- `danslab_pipeline_completions_total`
- `danslab_step_duration_seconds`
- `danslab_cost_usd`
- `danslab_renders_total`
- `danslab_render_duration_seconds`
- `danslab_queue_depth`

---

## Agent Layer

### `agents/content_crew.py`
CrewAI multi-agent content team:

| Agent | Role | Responsibility |
|-------|------|----------------|
| TrendHunter | Research | Find high-engagement topics from RSS/social/news |
| ScriptWriter | Content | Write hook-driven narration scripts |
| VisualPlanner | Design | Scene-by-scene visual direction |
| SeoManager | Optimization | Titles, descriptions, tags, thumbnails |
| QualityReviewer | QA | Technical + brand + factual review |

Each agent runs independently or as part of a Crew workflow.

---

## Render Engines

### `renderers/revideo_engine.py`
New MIT-licensed batch renderer.
- `renderVideo()` Node.js API for server-side rendering
- Template system with variable injection
- Faster than DOM-based for complex scenes
- No licensing fees

### `engines/hyperframes_render_engine.py`
Existing HTML→video engine.
- LLM-friendly (HTML/CSS/JS generation)
- Deterministic output
- Best for data viz, infographics, social content

### `engines/step7_render.py`
Dual-track parallel renderer.
- Runs HyperFrames + Remotion simultaneously
- `render_judge.py` auto-selects winner via ffprobe scoring
- Copies winner to `out/final.mp4`

---

## CLI

```bash
# Run pipeline directly
python cli.py run --topic "Crypto News" --engine hyperframes

# Queue for worker
python cli.py queue --topic "AI Agents" --upload

# Start worker
python cli.py worker

# Check status
python cli.py status

# List jobs
python cli.py jobs --limit 20

# Render manifest
python cli.py render --engine revideo --manifest scenes.json --output out.mp4

# Cost tracking
python cli.py cost --job-id abc123 -v

# Metrics
python cli.py metrics

# CrewAI agents
python cli.py crew --phase research --topic "Bitcoin"
python cli.py crew --phase script --topic "Ethereum" --style calm
```

---

## Configuration

All config lives in `core/settings.py` with environment variable overrides:

```bash
# .env
LLM_PRIMARY_PROVIDER=gemini
LLM_FALLBACK_PROVIDERS=glm,ollama
RENDER_PRIMARY_ENGINE=hyperframes
RENDER_PARALLEL_RENDER=true
TTS_PRIMARY_ENGINE=kokoro
PIPELINE_HUMAN_REVIEW_GATE=true
PIPELINE_COST_BUDGET_USD=5.0
OBS_ENABLED=true
```

Pipeline configs (sources, prompts, channels) remain in `config/*.yaml`.

---

## Integration Points

| Service | Port | Integration |
|---------|------|-------------|
| Next.js app | 3000 | Web UI, Studio page, API routes |
| ComfyUI | 8000 | Image/video generation |
| Ollama | 11434 | Local LLM inference |
| OpenClaw | 18789 | Agent dispatch |
| Grafana | 3000 | Metrics dashboard |
| Redis | 6379 | Job queue |

---

## Cost Model (per 60s video)

| Stage | Engine | Est. Cost |
|-------|--------|-----------|
| Research | Perplexity API | $0.01 |
| Script | Gemini 2.5 Pro | $0.02 |
| Images | ComfyUI local | $0.001 |
| TTS | Kokoro local | $0.00 |
| Render | HyperFrames | $0.005 |
| **Total** | | **~$0.04** |

With cloud fallback for images/video: ~$0.15–$0.50 per video.

---

## Roadmap

- [ ] Temporal.io integration for enterprise-grade durability
- [ ] LangGraph workflow visualization
- [ ] Automatic A/B testing (title/thumbnail variants)
- [ ] Analytics feedback loop (YouTube API → pipeline tuning)
- [ ] Multi-language support (CosyVoice for Chinese, etc.)
- [ ] Real-time collaboration (WebSocket studio)
