# YouTube Pipeline

[![CI](https://github.com/DansiDanutz/DansLab/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DansiDanutz/DansLab/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **AI-powered video production. Research → Script → Render → Upload.**

A 10-step autonomous video pipeline plus a Next.js studio for managing runs.
Designed for production use with cost discipline, local-first model routing,
and a bearer-token-authed API.

---

## Architecture

```
youtube-pipeline/                    Next.js 15 web app at repo root
├── src/
│   ├── app/
│   │   ├── page.tsx                 Dashboard — stats, engine health, jobs
│   │   ├── studio/page.tsx          Studio — create + monitor runs
│   │   └── api/pipeline/
│   │       ├── run/route.ts         POST — queue a new video job
│   │       ├── status/route.ts      GET  — engine + queue health
│   │       ├── jobs/route.ts        GET  — list/inspect jobs
│   │       ├── metrics/route.ts     GET  — pipeline metrics
│   │       └── configs/route.ts     GET  — channel/topic configs
│   ├── middleware.ts                Bearer-token auth + rate limit
│   └── lib/rate-limit.ts            In-memory sliding-window limiter
├── tests/                           node:test suites for middleware + lib
├── packages/
│   ├── video-pipeline/              Python pipeline engine (10 steps)
│   │   ├── cli.py                   CLI entry (queue, run, worker)
│   │   ├── engines/                 Render engines (HyperFrames, Remotion, ...)
│   │   ├── core/                    Orchestrator, queue, cost tracker, agents
│   │   ├── agents/                  CrewAI content agents
│   │   └── config/                  YAML channel/topic/prompt configs
│   └── openclaw-logger/             Optional fleet logger (TypeScript)
├── docker-compose.yml               Redis (localhost-bind, password-required)
└── .github/workflows/ci.yml         Lint + build + test on every PR
```

---

## Web App (Next.js 15.5)

Two pages, intentionally focused:

- **`/`** — Dashboard with totals, engine health, recent jobs, 10-step pipeline overview
- **`/studio`** — Projects, Pipeline runs, and Config tabs

All API routes live under `/api/pipeline/*` and are gated by bearer-token auth.
Non-pipeline routes (`projects`, `team`, `revenue`, `connections`, `metrics`) have
been moved to `src/_deprecated/api/` and removed from the live build.

---

## Video Pipeline (10 steps)

The pipeline runs under `packages/video-pipeline/`:

| Step | Name | What it does |
|----:|------|--------------|
| 1 | Research | Topic discovery via Perplexity / Brave / Firecrawl |
| 2 | Script | Narration draft with TTS-aware phonetic conversion |
| 3 | Visual | Per-scene design brief |
| 4 | Scenes | Composition + asset layout |
| 5 | Audio | TTS (Kokoro / ElevenLabs) + BGM |
| 6 | Subtitles | Caption sync, formatting |
| 7 | Render | HyperFrames / Remotion / Wan2.2 (configurable) |
| 8 | QA | Validation gates |
| 9 | Final | Assembly + transitions |
| 10 | Upload | YouTube publish + SEO |

### Run a job

```bash
cd packages/video-pipeline
python cli.py queue --topic "Bitcoin halving explained" --engine hyperframes
python cli.py worker   # processes queued jobs
```

### Or trigger via API

```bash
curl -X POST http://localhost:3000/api/pipeline/run \
  -H "Authorization: Bearer $PIPELINE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Bitcoin halving explained","engine":"hyperframes"}'
```

---

## Setup

### Prerequisites

- Node 20+
- Python 3.13+
- Redis (via `docker compose up redis` — requires `REDIS_PASSWORD` in `.env`)
- API keys for at least one LLM provider (see `.env.example`)

### Install

```bash
# Web app
npm install

# Pipeline
cd packages/video-pipeline
pip install -e .
```

### Configure

```bash
cp .env.example .env
# At minimum, set:
#   PIPELINE_API_TOKEN   (openssl rand -hex 32)
#   REDIS_PASSWORD       (openssl rand -hex 32)
#   one LLM provider key (OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY / ...)
```

### Run

```bash
# Terminal 1 — web app
npm run dev

# Terminal 2 — Redis (if you use Docker)
docker compose up redis

# Terminal 3 — pipeline worker
cd packages/video-pipeline && python cli.py worker
```

Open http://localhost:3000.

---

## Security model

| Surface | Protection |
|---------|-----------|
| `/api/pipeline/*` | Bearer token (PIPELINE_API_TOKEN), constant-time compare, fail-closed |
| Rate limit | 60 req/min per (token, IP), 429 + Retry-After when exceeded |
| Redis | Localhost-only bind, password-required, protected-mode on |
| Secrets | All from env vars; deploy script fails-closed without them |

See [AUDIT_REPORT_2026-05-16.md](AUDIT_REPORT_2026-05-16.md) for the full audit
that drove these controls.

---

## Development

```bash
npm run dev          # Next.js dev server with HMR
npm run build        # Production build (also runs typecheck)
npm run lint         # ESLint via next lint
npm test             # node:test runner — 22 tests across middleware + lib
```

All four commands also run in CI on every push and PR.

---

## Roadmap

Tracked against the security and feature audit:

- [x] Phase 1 — Security baseline (API auth, rate limit, Redis lockdown, CVE patches)
- [x] Phase 3 (partial) — CI/CD pipeline, dependabot
- [ ] Phase 2 — Docs + config sweep (this README is the first piece)
- [ ] Phase 3 (remaining) — Python test coverage for engine modules
- [ ] Phase 4 — Stock footage (Pexels/Pixabay), BGM library, multi-platform export
- [ ] Phase 5 — Cost discipline ($0.20/video target with smart fallback)

See [CHANGELOG.md](CHANGELOG.md) for shipped work.

---

## License

MIT — see [LICENSE](LICENSE).
