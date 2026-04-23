# SYSTEM.md — Dan's Lab System Bible

> **Canonical architecture + live operating baseline** for the Dan's Lab system.
> Every agent, every session, every tool should treat this file as the top-level reference.
> Last verified: 2026-04-03
>
> Control-plane contract:
> [DANSLAB_CONTROL_PLANE_ARCHITECTURE_2026-03-12.md](/Users/davidai/Desktop/DavidAi/DANSLAB_CONTROL_PLANE_ARCHITECTURE_2026-03-12.md)
>
> Autonomy loop contract:
> [DANSLAB_AUTONOMY_LOOP_ARCHITECTURE_2026-03-13.md](/Users/davidai/Desktop/DavidAi/DANSLAB_AUTONOMY_LOOP_ARCHITECTURE_2026-03-13.md)
>
> Live repair baseline:
> [system-baseline-2026-04-01.md](/Users/davidai/Desktop/DavidAi/scripts/logs/system-baseline-2026-04-01.md)

---

## 0. CURRENT TRUTH

This section overrides older assumptions elsewhere in the document.

### 0.1 Overall status

- Mac Studio control plane: healthy
- Claude Desktop local workspace support: healthy
- Fleet gateways: healthy on Dexter, Memo, Sienna, Nano
- Public SSH access: healthy on Dexter, Memo, Sienna, Nano
- OpenClaw version: standardized on `2026.4.21` across Mac Studio and all four droplets
- Telegram transport: OpenClaw main + Hermes working after duplicate poller cleanup on 2026-04-01
- **Paperclip fleet dispatch**: autonomous dispatcher v2 active (39-agent routing, 15-min cron)
- **Droplet execution**: wrapper v2 with timer-wake → execution run + Gemini remote execution
- **David model**: migrated from `claude_local` to `gemini_local` (gemini-2.5-pro) — Anthropic billing resolved
- **Last fleet stabilization**: 2026-04-23 (mass outage recovery, orphaned issue reset, semantic_noop fixes)

### 0.2 Canonical local services

- OpenClaw local gateway: `http://127.0.0.1:18789/health`
- Compatibility communication hub: `http://127.0.0.1:18790/health`
- Live fleet dashboard: `http://127.0.0.1:8780/health`
- n8n tunnel target: `http://127.0.0.1:15678`

### 0.3 Canonical Mac launchd services

- `ai.openclaw.gateway`
- `com.danslab.david-router`
- `com.danslab.communication-hub`
- `com.danslab.redis-tunnels`
- `com.danslab.n8n-tunnel`
- `ai.hermes.gateway` (Telegram + Discord)
- `ai.paperclip.board` (Company dashboard :3100)
- `com.danslab.paperclip-gateway-tunnels` (Droplet tunnels :28789-58789)
- `com.danslab.claude-balancer`
- `com.danslab.codex-proxy`

### 0.4 Canonical droplet access

- Dexter: `dexter-public`, `dexter-root-public`
- Memo: `memo-public`, `memo-root-public`
- Sienna: `sienna-public`, `sienna-root-public`
- Nano: `nano-public`, `nano-root-public`

### 0.5 Canonical gateway probe

```bash
bash -lc 'set -a; source ~/.config/openclaw/openclaw-gateway.env 2>/dev/null || true; set +a; openclaw gateway probe --json'
```

### 0.6 Canonical default model chain

1. `google/gemini-2.5-pro` (David primary — no Anthropic credit dependency)
2. `claude-balancer/claude-sonnet-4-6`
3. `zai/glm-4.7-flash`
4. `google/gemini-2.5-flash`
5. `openrouter/openrouter/auto`
6. `openai/gpt-4.1`

**Note**: David agent switched from `claude_local` to `gemini_local` adapter on 2026-04-23 to eliminate Anthropic billing dependency.

### 0.7 Operating rule

When checking health, trust this order:

1. direct local health endpoints on Mac Studio
2. direct `openclaw gateway probe --json` on each droplet
3. current launchd/systemd state
4. `fleet-doctor` report files after the run has fully completed

Do not treat stale report files, stale launchd job failures, or Tailscale-only aliases as canonical.

---

## 0.8 Paperclip Fleet Architecture (2026-04-23)

### Control Plane
- **Paperclip server**: Mac Studio port `3210` (proxied to `3100` for compatibility)
- **Database**: PostgreSQL `127.0.0.1:54329` (user: `paperclip`, pw: `paperclip`)
- **Redis**: `127.0.0.1:6379` (tunneled to droplets as `6380`)
- **Board dashboard**: `http://127.0.0.1:3100`
- **Company ID**: `e2c3ad73-d2f8-4396-adc5-4ea855df0143`

### Agent Adapters
| Agent | Adapter Type | Host | Notes |
|-------|-------------|------|-------|
| David | `gemini_local` | Mac Studio | Gemini CLI, primary model `gemini-2.5-pro` |
| Dexter | `process` | Droplet | `paperclip_droplet_exec.py dexter` → SSH → Gemini |
| Memo | `process` | Droplet | `paperclip_droplet_exec.py memo` → SSH → Gemini |
| Sienna | `process` | Droplet | `paperclip_droplet_exec.py sienna` → SSH → Gemini |
| Nano | `process` | Droplet | `paperclip_droplet_exec.py nano` → SSH → Gemini |
| Doctor | `process` | Mac Studio | `doctor_probe.py` — lightweight health checker |
| Update | `process` | Mac Studio | `update_probe.py` — fleet version scanner |
| GSD | `claude_local` | Mac Studio | ZAI-routed Claude (not Anthropic direct) |
| Autoresearch | `claude_local` | Mac Studio | ZAI-routed Claude |

### Autonomous Dispatcher (`david-dispatcher.py`)
- **Location**: `~/.openclaw/scripts/david-dispatcher.py`
- **Schedule**: Cron every 15 minutes
- **Capabilities**: 39-agent keyword/prefix routing
- **Max dispatches per cycle**: 5 issues
- **Stale checkout reset**: Issues checked out but not executed for >15 min are reset to `todo`

### Droplet Wrapper v2 (`paperclip_droplet_exec.py`)
- **Location**: `~/.openclaw/scripts/paperclip_droplet_exec.py`
- **Timer wake**: Detects `in_progress` issues → invokes Paperclip wakeup → creates execution run
- **Task wake**: Checkout + remote inspection + **Gemini execution on droplet**
- **Gemini on droplets**: Reads `GEMINI_API_KEY` from `~/.openclaw/openclaw.json`, runs via SSH
- **Timeout**: 90s for Gemini execution (graceful fallback on timeout)

### Heartbeat Mechanics
- Droplet agents are `process` adapter → no separate heartbeat ping
- `lastHeartbeatAt` updated by `finalizeAgentStatus()` when a **run completes**
- Heartbeat interval: 600s (10 min) per agent policy
- Scheduler tick: 30s

---

## 1. WHO WE ARE

**Dan's Lab** is an AI-orchestrated software company run by Dan (Romanian, Cluj-Napoca, EET timezone).

- **Mission**: Build and ship NERVIX (nervix.ai) — an AI agent marketplace
- **Structure**: 1 orchestrator (David) on Mac Studio + 4 autonomous agents on DigitalOcean droplets
- **Philosophy**: Agents work 24/7. Humans steer. Communication is constant. NERVIX is always #1.

### The Team

| Role | Name | Machine | Purpose |
|------|------|---------|---------|
| **Boss** | Dan | Windows laptop + Mac Mini | Strategy, decisions, final approval |
| **Orchestrator** | David | Mac Studio (Apple Silicon) | Fleet command, task delegation, architecture |
| **Senior Dev** | Dexter | DO Droplet (8GB) | NERVIX backend, CrawdBot, DevOps |
| **PM** | Memo | DO Droplet (16GB) | MyWork Framework, n8n automations |
| **Crypto/Dev** | Sienna | DO Droplet (8GB) | ZmartyChat/smarty.me, trading |
| **Agent Creator** | Nano | DO Droplet (8GB) | NERVIX agents, enrollment, CLI |

---

## 2. NETWORK ARCHITECTURE

### 2.1 Machines & IPs

| Machine | Type | Public IP | Tailscale IP | Location |
|---------|------|-----------|-------------|----------|
| **Mac Studio** | Apple M-series | LAN only | 100.79.10.102 | Dan's office |
| **Dan's S24** | Android | Mobile | 100.77.227.112 | Mobile |
| **Dan's Windows** | Laptop | Dynamic | 100.107.91.110 | Dan's office |
| **Dan's Mac Mini** | Desktop | Dynamic | 100.112.31.86 | Dan's office |
| **Dexter** | DO Droplet | 46.101.219.116 | 100.94.135.19 | Frankfurt |
| **Memo** | DO Droplet | 138.68.86.47 | 100.88.192.48 | Frankfurt |
| **Sienna** | DO Droplet | 167.172.187.230 | 100.124.88.93 | Frankfurt |
| **Nano** | DO Droplet | 157.230.23.158 | 100.105.148.29 | Frankfurt |

### 2.2 Tailscale Mesh Network (historical design reference)

```
                    ┌─────────────────────────────────┐
                    │        Tailscale Network         │
                    │   tailc56ca0.ts.net (encrypted)   │
                    └─────────────────────────────────┘
                         │         │         │
              ┌──────────┤         │         ├──────────┐
              │          │         │         │          │
         Mac Studio   Dan's    Dan's     Dan's      4 Droplets
         (David)     Windows  Mac Mini    S24     (Dexter/Memo/
        100.79.10.102  100.107.x  100.112.x  100.77.x   Sienna/Nano)
              │                                   100.94/88/124/105
              └──────── ALL traffic over ────────────┘
                     encrypted Tailscale mesh
```

**Current note**: Tailscale exists, but the live operating baseline is no longer Tailscale-first. Public SSH aliases are canonical because health tooling and recovery paths were repaired around `*-public` access.

**Rule**: treat Tailscale as optional overlay connectivity, not as the primary source of truth for reachability.

### 2.3 Current access architecture

The current stable platform uses:

- public SSH aliases for droplet operations
- loopback-bound OpenClaw gateways on each droplet
- Mac Studio local control-plane services for routing, dashboarding, and tunnels

Tailscale may still exist, but it is not the canonical operational dependency.

```
Each Droplet (x4)                    Mac Studio (100.79.10.102)
─────────────────                    ─────────────────────────
→ 100.79.10.102:8997  ─────────→    Claude Balancer (0.0.0.0:8997)
→ 100.79.10.102:8999  ─────────→    Claude Proxy 1  (0.0.0.0:8999)
→ 100.79.10.102:8998  ─────────→    Claude Proxy 2  (0.0.0.0:8998)
→ 100.79.10.102:1234  ─────────→    LM Studio Qwen3 (0.0.0.0:1234)
→ localhost:6380       ─────────→    Redis :6379     (SSH tunnel, kept)
```

**Operational note**: the major transport issue on 2026-04-01 was stale Tailscale-first assumptions in health tooling. Public access plus direct probe verification is now the canonical path.

### 2.4 Port Map — Mac Studio

| Port | Service | Purpose |
|------|---------|---------|
| 3100 | Paperclip | Company orchestration dashboard (28 agents, Kanban) |
| 6379 | Redis | Message bus, circuit breakers, streams |
| 8995 | Codex Proxy | OpenAI Codex/GPT-5.4 proxy (ChatGPT Pro) |
| 8997 | Claude Balancer | Load balancer across OAuth proxies (binds 0.0.0.0 for Tailscale) |
| 8998 | Claude Proxy2 | semebitcoin OAuth → Claude API (binds 0.0.0.0) |
| 8999 | Claude Proxy | seme OAuth → Claude API (binds 0.0.0.0) |
| 11434 | Ollama | Local models: qwen2.5-coder:7b, qwen3:8b, qwen3-fast |
| 15678 | n8n tunnel | SSH tunnel to Memo's n8n instance |
| 18789 | OpenClaw Gateway | Main gateway (token auth) |
| 18790 | Communication Hub | Compatibility operator endpoint |
| 28789 | Dexter tunnel | SSH tunnel → Dexter gateway :18789 (for Paperclip) |
| 38789 | Memo tunnel | SSH tunnel → Memo gateway :18789 (for Paperclip) |
| 48789 | Sienna tunnel | SSH tunnel → Sienna gateway :18789 (for Paperclip) |
| 54329 | Paperclip DB | Embedded Postgres (user: paperclip, pw: paperclip) |
| 58789 | Nano tunnel | SSH tunnel → Nano gateway :18789 (for Paperclip) |

---

## 3. Model Routing

### 3.1 Current routing principle

Use the normalized six-step chain below as the fleet default unless a specific agent has an explicit reason to differ.

### 3.2 Canonical fallback chain

1. `claude-balancer/claude-sonnet-4-6`
2. `zai/glm-4.7-flash`
3. `google/gemini-2.5-flash`
4. `google/gemini-2.5-pro`
5. `openrouter/openrouter/auto`
6. `openai/gpt-4.1`

### 3.3 Agent Assignments
| Agent | Primary | Coding | Cron/Routine | Heartbeat |
|-------|---------|--------|--------------|-----------|
| David (main) | claude-balancer/sonnet | zai-anthropic/glm-4.7 | vllm/Qwen3 | vllm/Qwen3 |
| DansLabModel | claude-balancer/sonnet | qwen3.6-plus (free) | vllm/Qwen3 | vllm/Qwen3 |
| Doctor | claude-balancer/sonnet | claude-balancer/sonnet | claude-balancer/sonnet | vllm/Qwen3 |
| Dexter/Memo/Sienna/Nano | claude-balancer/sonnet | zai-anthropic/glm-4.7 | vllm/Qwen3 | qwen-tunnel |
| Finance/Growth | claude-balancer/sonnet | N/A | google/gemini-2.5-flash | vllm/Qwen3 |
| Monitor/Vector/Update/N8N | vllm/Qwen3 | N/A | vllm/Qwen3 | vllm/Qwen3 |

### 3.4 Banned or removed defaults
| Model | Reason |
|-------|--------|
| `claude-proxy2/claude-sonnet-4-6` as default fallback | Removed from canonical chain during 2026-04-01 stabilization |
| `ollama/qwen3:8b` as fleet fallback | Removed from canonical chain during 2026-04-01 stabilization |
| `google/gemini-2.0-flash` | Deprecated by Google |
| `openai/gpt-5.4-pro` | Not a chat model |
| `ollama/tinyllama` | Too weak, retired |

### 3.5 Qwen Fleet Models (FREE)

#### `openrouter/qwen/qwen3.6-plus:free` — 1M ctx, FREE (OpenRouter)
- **Strengths**: Designed for agents. 1M context, multimodal (text+image+video), 65K output tokens, SWE-bench 78.8, hybrid MoE. Native function calling + chain-of-thought.
- **Weaknesses**: OpenRouter rate limits on free tier. Higher latency than local models. Not for high-frequency crons (>every 2h).
- **Best for**: Pipeline planning, discovery, code review, security audit, long-context analysis, morning briefs.
- **Routing**: Fallback in 34 agents. Should be primary for agentic pipeline agents (bug-fix, feature-dev, security-audit planners).
- **Note**: Two versions exist — prefer `qwen3.6-plus:free` (multimodal, 65K output) over `qwen3.6-plus-preview:free` (text-only, 32K output, data collection warning).

#### DashScope Provider (Alibaba Cloud) — LIVE on Mac Studio + Dexter
- **Base URL**: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (Singapore)
- **API Key**: `DASHSCOPE_API_KEY` in env
- **Format**: OpenAI-compatible (openai-completions)
- **Available models**:

| Model ID | Context | Use Case | Cost |
|----------|---------|----------|------|
| `dashscope/qwen3.6-plus` | 1M | Agentic, multimodal (text+image) | FREE (preview) |
| `dashscope/qwen3-omni-flash` | 256K | Audio+video+text multimodal | $0.43/M in, $1.66/M out |
| `dashscope/qwen3-coder-plus` | 262K | Code-specialized | FREE (preview) |

- **IMPORTANT**: `stream=True` is MANDATORY for omni models — non-streaming calls will error.
- **Free quota**: 1M tokens per new account (90-day validity)
- **Deployed on**: Mac Studio (openclaw.json) + Dexter (/etc/openclaw-env + openclaw.json)
- **139 total models available** including TTS, ASR, vision, embedding, and translation

#### Qwen 3.5 Omni (Plus/Flash/Light) — 256K ctx, via DashScope
- **Strengths**: True omnimodal — text+image+audio+video input, text+speech output. 113 languages speech recognition, 36 languages speech generation. Thinker-Talker architecture. SOTA on 215 audio/audio-visual benchmarks. Surpasses Gemini 3.1 Pro on audio understanding.
- **DashScope model ID**: `qwen3-omni-flash` (Plus not yet on international API)
- **Best for**: Audio/video analysis (YouTube projects on Dexter), speech-to-code, multimodal workflows.
- **Released**: March 30, 2026

### 3.6a Cost Targets
Total fleet: < $12/day (should approach $0/day with subscription-first routing)

---
## 3.6 Agent Identity & Email

| Agent | AgentMail | GitHub | Git Config |
|-------|-----------|--------|------------|
| **David** | nervix@agentmail.to | DansiDanutz (Mac Studio) | David |
| **Dexter** | danslabdexter@agentmail.to | DansiDanutz (SSH key) | Dexter |
| **Memo** | danslabmemo@agentmail.to | DansiDanutz (SSH key) | Memo |
| **Sienna** | siennaagent@agentmail.to | DansiDanutz (SSH key) | Sienna |
| **Nano** | danslabnano@agentmail.to | DansiDanutz (SSH key) | Nano |

All agents have SSH keys added to DansiDanutz's GitHub account. Git config set with AgentMail emails.

---

## 4. AGENTS — MAC STUDIO (David's Sub-Agents)

David runs 21 agents on the Mac Studio via OpenClaw gateway.

### 4.1 Telegram-Bound Agents (15)

| Agent ID | Telegram Bot | Role |
|----------|-------------|------|
| `main` | @DavidNervix_bot | David orchestrator — Dan talks to this |
| `monitor` | @MacStudioMonitor_bot | Fleet health pings |
| `doctor` | @DansLabDoctor_bot | Emergency system repair |
| `finance` | @DansLabFinance_bot | Cost tracking + reports |
| `growth` | @DansLabGrowth_bot | Enrollment + content strategy |
| `danslabmodel` | @DansLabModel_bot | Model routing intelligence |
| `ssh` | @DansLabSSH_bot | SSH operations |
| `supabase` | @DansLabSupabase_bot | Database operations |
| `github` | @DansLabGitHub_bot | Repository operations |
| `vercel` | @DansLabVercel_bot | Deployment operations |
| `stripe` | @DansLabStripe_bot | Payment operations |
| `popebot` | @FreeCrawdbot_bot | CI/CD + PR automation |
| `gsd` | @DansLabGSD_bot | Sprint/task tracking |
| `update` | @DansLabUpdate_bot | OpenClaw update agent |
| `kimik2` | @My_KimiK2_bot | Direct Kimi K2.5 access |

### 4.2 Internal Agents (6 — no Telegram bot)

| Agent ID | Role | Trigger |
|----------|------|---------|
| `vector` | Memory curation (MEMORY.md) | Cron (twice/week) |
| `obsidian` | Obsidian bridge operations | Bridge events |
| `n8n` | n8n workflow monitoring | Cron (every 4h) |
| `autoforge` | Auto-forge operations | On-demand |
| `discovery` | Skill/tool discovery | On-demand |
| `learning` | Learning & improvement | On-demand |

---

## 5. DROPLET AGENTS

Each droplet runs its own OpenClaw gateway (:18789) with its own agent.

### 5.1 Dexter (46.101.219.116)

| Field | Value |
|-------|-------|
| User | Dexter1981 |
| SSH | `ssh dexter` or `ssh dexter-root` |
| Disk | 96GB (55% used) |
| RAM | 8GB |
| Gateway | :18789 |
| Primary model | claude-balancer/claude-sonnet-4-6 |
| Projects | nervix-federation, CrawdBot, openclaw-key-manager |
| Telegram | @SmartMemo_bot |

### 5.2 Memo (138.68.86.47)

| Field | Value |
|-------|-------|
| User | Memo1981 |
| SSH | `ssh memo` or `ssh memo-root` |
| Disk | 154GB (35% used) |
| RAM | 16GB |
| Gateway | :18789 |
| Primary model | claude-balancer/claude-sonnet-4-6 |
| Projects | MyWork-AI, n8n-automations, popebot-worker |
| Telegram | @MemoWorker_bot |
| Extra | n8n on port 5678 (tunneled to Mac :15678) |

### 5.3 Sienna (167.172.187.230)

| Field | Value |
|-------|-------|
| User | Sienna1981 |
| SSH | `ssh sienna` or `ssh sienna-root` |
| Disk | 96GB (40% used) |
| RAM | 8GB |
| Gateway | :18789 |
| Primary model | claude-balancer/claude-sonnet-4-6 |
| Projects | sienna-crypto-girl, ZmartyChat/smarty.me |
| Telegram | @SiennaWorker_bot |

### 5.4 Nano (157.230.23.158)

| Field | Value |
|-------|-------|
| User | Nano1981 (agent), root (npm installs: `ssh nano-root`) |
| SSH | `ssh nano` or `ssh nano-root` |
| Disk | 96GB (63% used) |
| RAM | 8GB |
| Gateway | :18789 |
| Primary model | claude-balancer/claude-sonnet-4-6 |
| Projects | nervix-federation, nervix-cli |
| Telegram | @Nanonervix_bot |

---

## 6. EXTERNAL SERVICES

### 6.1 Supabase

| Database | Ref | Purpose | Tables |
|----------|-----|---------|--------|
| **Team DB** | okgwzwdtuhhpoyxyprzg | Kanban, team, agents, reports, GSD | ~101 |
| **Nervix DB** | kisncxslqjgdesgxmwen | Agent economy, escrow, wallets, workflows | ~43 |

Key tables (Team): `tasks`, `gsd_tasks`, `gsd_projects`, `team_members`, `agents`, `agent_messages`, `agent_token_usage`, `daily_summaries`, `notifications`, `alerts`, `subtasks`

### 6.2 GitHub (DansiDanutz)

| Repo | Priority | Lead |
|------|----------|------|
| nervix-federation | #1 ALWAYS | Nano + Dexter |
| nervix-cli | High | Nano + Dexter |
| sienna-crypto-girl | Medium | Sienna |
| MyWork-AI | Medium | Memo |
| n8n-automations | Medium | Memo |
| openclaw-key-manager | Low | Dexter |
| voice-ai-platform | Low | Dexter |
| SportsAI | Low | Sienna |

### 6.3 Communication Channels

| Service | Purpose | Config |
|---------|---------|--------|
| **Telegram** | Primary comms — Dan talks to bots | 16 bot accounts, 15 agent bindings |
| **Slack** | Team workspace + KiloClaw AI | DansLab Agents bot (U0AKH499STB) + KiloClaw (U0AK5F89X7G) |
| **Discord** | ACTIVE | Watchdog, GSD Bridge, Digest, Shipped Wins (4 launchd services) |

### 6.4 Slack Integration (2026-03-08)

**Workspace:** nervixworkspace.slack.com (team: Nervix, team_id: T0AK3TKAVGA)

**Bots:**
| Bot | User ID | App ID | Role |
|-----|---------|--------|------|
| DansLab Agents | U0AKH499STB | A0AK4652J3U | Fleet outbound messaging, health reports |
| KiloClaw (kilo.ai) | U0AK5F89X7G | A0A0Q4FL954 | AI assistant — @mention in channels for code/PR help |

**Channels:**
| Channel | ID | Purpose |
|---------|-----|---------|
| #all-nervix | #all-nervix | Announcements, health reports |
| #agents-alerts | C0AJNQ0SL07 | Critical fleet alerts |
| #david | C0AKYFT2X16 | David orchestrator |
| #dexter | C0AKH5BE95X | Dexter (Senior Dev) |
| #memo | C0AJNQ0JALF | Memo (PM) |
| #sienna | C0AJNQ0L8DV | Sienna (Crypto) |
| #nano | C0AK0QQ7QS1 | Nano (Agent Creator) |
| #social | C0AK7FRT43W | Team social |

**Mac Studio Agents with Slack access** (all 20 post to #agents-alerts):
- AutoForge, PopeBot, GSD, GitHub, Vercel, Monitor, Doctor, Stripe, Finance, Growth
- KimiK2, N8N, Model, Discovery, Learning, Obsidian, SSH, Supabase, Update, Vector

**Architecture:**
- Centralized on Mac Studio — david-router consumes `dls.slack.outgoing` Redis stream
- Rate limiting: Redis-backed per-channel (1msg/sec), Slack 429 handling
- DLQ: `dlq:dls.slack.outgoing` for poison messages
- Socket Mode: Configured (xapp- token in openclaw.json)
- Droplets: Slack DISABLED on all 4 (prevents Socket Mode conflicts)
- KiloClaw: External kilo.ai cloud bot, NOT a DansLab agent — no droplet, no Redis stream

### 6.5 Other Services

| Service | Purpose | Access |
|---------|---------|--------|
| **Redis** | Message bus, streams, circuit breakers | localhost:6379, password via `$DLS_REDIS_PASSWORD` |
| **Vercel** | Deployment platform | CLI configured (semebitcoin-9824) |
| **n8n** | Workflow automation | On Memo droplet :5678, tunneled to Mac :15678 |
| **Obsidian** | Knowledge base | Bridge service on Mac |
| **Notion** | Documentation | API key in env |

---

## 7. SECURITY MODEL

### 7.1 Access Control — WHO Can Access WHAT

```
AUTHORIZED MACHINES (and ONLY these):
  1. Dan's Windows Laptop     — Telegram, SSH, browser
  2. Dan's Mac Studio (David) — Everything (orchestrator)
  3. Dan's Mac Mini            — Development, SSH
  4. Dan's S24 Phone           — Telegram (mobile)

ZERO external access. No public APIs. No exposed dashboards.
```

### 7.2 Authentication

| Resource | Auth Method | Storage |
|----------|------------|---------|
| Droplet SSH | Ed25519 key | `~/.ssh/id_ed25519_agent` |
| OpenClaw Gateway | Token auth | `openclaw.json → gateway.auth.token` |
| Claude Proxy | OAuth (Max sub) | Keychain → proxy home dirs |
| Supabase | Service key + anon key | Stored in agent configs |
| Telegram bots | Bot tokens | `openclaw.json → channels.telegram` |
| GitHub | SSH key | `~/.ssh/` |
| Redis | Password | `$DLS_REDIS_PASSWORD` |

### 7.3 Security Rules

1. **Never expose ports to public internet** — all droplet services bind to localhost
2. **SSH key only** — no password auth on any machine
3. **Gateway token auth** — every request to OpenClaw gateway requires bearer token
4. **Claude proxy bound to 0.0.0.0** — :8997/8998/8999 accessible via Tailscale mesh (encrypted). Phase 5 ACLs will restrict to tagged devices only
5. **Config is immutable** — `openclaw.json` locked with `chflags uchg`, unlocked only during controlled updates
6. **No secrets in code** — API keys in env vars or `openclaw.json`, never in repos
7. **Droplets isolated** — agents cannot SSH to peer droplets for code execution (only tunnel repair via watchdog)

### 7.4 Tailscale Migration Status

**Phase 1** — Install Tailscale on all 4 droplets: **DONE** (2026-03-07)
- All droplets authenticated via interactive login
- Hostnames: dexter-droplet, memo-droplet, sienna-droplet, nano-droplet

**Phase 2** — Migrate tunnels to Tailscale IPs: **DONE** (2026-03-07)
- SSH config updated: all hosts point to Tailscale IPs (100.x.x.x)
- push-tunnels.sh updated: uses Tailscale IPs
- Redis tunnels: use SSH aliases (auto-resolved to Tailscale)
- Public IPs kept as `-public` SSH aliases for fallback

**Phase 3** — Add Dan's Windows + Mac Mini: **DONE** (completed by 2026-03-24)
- Mac Mini: 100.112.31.86 (ssh alias: `mac-mini`, user: dansidanutz) — DONE
- Dan's Windows: 100.107.91.110 — DONE
- Fleet is now 8/8 on Tailscale

**Phase 4** — Lock down SSH to Tailscale-only: **DONE** (2026-03-24)
- All 4 droplets: `ufw allow from 100.64.0.0/10 to any port 22` + `ufw allow in on tailscale0` + `ufw deny 22`
- Verified: All SSH via Tailscale confirmed working.
- Emergency: DO Console access preserved (`167.99.0.0/16`).

**Phase 5** — Tailscale ACLs (optional, future hardening):
```json
{
  "acls": [
    {"action": "accept", "src": ["tag:admin"], "dst": ["*:*"]},
    {"action": "accept", "src": ["tag:droplet"], "dst": ["tag:orchestrator:8997,8998,8999,1234,18789,6379"]},
    {"action": "accept", "src": ["tag:orchestrator"], "dst": ["tag:droplet:18789,22"]}
  ]
}
```

---

## 8. SERVICES & LAUNCHD (Mac Studio)

### 8.1 Always-On Services

| Service | launchd ID | Purpose |
|---------|-----------|---------|
| OpenClaw Gateway | `com.danslab.david-router` | Main gateway :18789 |
| Claude Balancer | `com.danslab.claude-balancer` | Load balancer :8997 |
| GPT-5.4 Proxy | `com.danslab.gpt54-proxy` | OpenAI proxy :8996 |
| Redis Tunnels | `com.danslab.redis-tunnels` | Push Redis to droplets |
| Telegram Watchdog | `com.danslab.telegram-watchdog` | Monitor bot health |
| Claude Token Sync | `com.danslab.claude-token-sync` | Hourly OAuth refresh |
| Proxy Keepalive | `com.danslab.proxy-keepalive` | Keep proxies alive |
| Fleet Connectivity | `com.danslab.fleet-connectivity` | Monitor droplet→Mac Studio every 15min |

### 8.2 Bridge Services

| Bridge | launchd ID | Connects |
|--------|-----------|----------|
| Kanban Bridge | `com.danslab.kanban-bridge` | Supabase tasks ↔ agents |
| Supabase Bridge | `com.danslab.supabase-bridge` | Supabase events |
| GitHub Bridge | `com.danslab.github-bridge` | GitHub webhooks |
| Obsidian Bridge | `com.danslab.obsidian-bridge` | Obsidian vault |
| Vercel Bridge | `com.danslab.vercel-bridge` | Vercel deployments |
| Mac Bridge | `com.danslab.mac-bridge` | macOS system events |
| n8n Tunnel | `com.danslab.n8n-tunnel` | SSH tunnel to Memo n8n |

---

## 9. CRON JOBS (OpenClaw Scheduler)

### 9.1 Active Cron Summary

| Model | Jobs | Cost |
|-------|------|------|
| vllm/Qwen3 (local) | 15 | FREE |
| google/gemini-2.5-flash | 1 | Cheap |
| claude-balancer/sonnet | 3 | Max sub |
| **Total active** | **19** | |
| Disabled | 9 | |

### 9.2 Key Cron Jobs

| Job | Schedule | Model | Agent |
|-----|----------|-------|-------|
| morning-brief | 08:00 EET | Qwen3 (free) | main |
| eod-summary | 20:00 EET | Gemini Flash | main |
| health-monitor | Every 2h | Qwen3 (free) | main |
| Doctor Repair Loop | Every 30min | Claude Sonnet | doctor |
| Doctor Model Health | Every 2h | Claude Sonnet | doctor |
| Brain Refresh | Every 3h | Qwen3 (free) | danslabmodel |
| DansLabModel Report | 08:30 EET | Qwen3 (free) | danslabmodel |
| openclaw-update | 07:00 EET | Qwen3 (free) | update |
| GSD Sprint Tracker | Every 4h | Qwen3 (free) | gsd |

---

## 10. KEY FILE PATHS

### 10.1 Mac Studio

| Path | Purpose |
|------|---------|
| `/Users/davidai/Desktop/DavidAi/` | David's working directory |
| `/Users/davidai/Desktop/DavidAi/SYSTEM.md` | THIS FILE — system bible |
| `/Users/davidai/Desktop/DavidAi/CLAUDE.md` | Claude Code context |
| `/Users/davidai/Desktop/DavidAi/scripts/` | Fleet scripts |
| `/Users/davidai/Desktop/DavidAi/scripts/enforce-openclaw-config.sh` | Config guard |
| `/Users/davidai/.openclaw/openclaw.json` | Master config (LOCKED) |
| `/Users/davidai/.openclaw/cron/jobs.json` | All cron jobs |
| `/Users/davidai/.openclaw/workspace/` | David main workspace |
| `/Users/davidai/.openclaw/workspace-*/` | Sub-agent workspaces |
| `/Users/davidai/.openclaw/workspace/claude-proxy/` | Claude proxy code + homes |
| `/Users/davidai/.ssh/id_ed25519_agent` | SSH key for all droplets |
| `/Users/davidai/.ssh/config` | SSH host definitions |

### 10.2 Each Droplet

| Path | Purpose |
|------|---------|
| `~/.openclaw/openclaw.json` | Agent config |
| `~/.openclaw/workspace/` | Agent workspace (SOUL.md, IDENTITY.md, etc.) |
| `~/nervix-federation/` | NERVIX monorepo (Dexter + Nano) |
| `~/popebot-worker/` | Pope Bot CI/CD (Memo) |

---

## 11. HOW THINGS CONNECT

### 11.1 Message Flow

```
Dan (Telegram)
    │
    ▼
Telegram Bot API
    │
    ▼
OpenClaw Gateway (:18789) ─── routes by bot → agent
    │
    ├──→ main (David)     ─── orchestrates everything
    ├──→ doctor            ─── repairs fleet
    ├──→ finance           ─── tracks costs
    ├──→ monitor           ─── health pings
    └──→ [other 11 agents]
    │
    ▼
Model Provider (via fallback chain)
    │
    ├──→ Claude Balancer (:8997) ──→ Claude API (Max sub)
    ├──→ Google Gemini ──→ Gemini API
    ├──→ NVIDIA Kimi ──→ NVIDIA API
    └──→ Qwen3 (:1234) ──→ Local LM Studio (FREE)
```

### 11.2 Droplet → Mac Studio Communication

```
Droplet Agent
    │
    ▼
Local OpenClaw Gateway (:18789)
    │
    ▼ needs LLM (Tailscale direct — no tunnels)
    │
    ├──→ 100.79.10.102:8997  (Claude Balancer)
    ├──→ 100.79.10.102:8999  (Claude Proxy 1)
    ├──→ 100.79.10.102:8998  (Claude Proxy 2)
    └──→ 100.79.10.102:1234  (Qwen3 FREE)
    │
    ▼ needs data (SSH tunnel — Redis binds localhost)
    └──→ localhost:6380 → Mac :6379 (Redis)
```

### 11.3 Task Delegation Flow

```
Dan: "Review the NERVIX escrow contract"
    │
    ▼
David (main agent) receives on Telegram
    │
    ▼
David classifies: CODING TASK → Dexter
David selects model: nvidia/kimi-k2-instruct
    │
    ▼
Redis stream: dls.tasks.dexter
    │
    ▼
Dexter picks up task from Redis (:6380 tunnel)
Dexter runs on kimi-k2-instruct (via Tailscale direct → claude-balancer)
    │
    ▼
Result → Redis stream: dls.results
    │
    ▼
David confirms, updates Supabase Kanban
David reports to Dan on Telegram
```

---

## 12. CRITICAL RULES (NON-NEGOTIABLE)

1. **NERVIX is always #1 priority** — every task, every decision considers NERVIX first
2. **Only David SSHes cross-droplet** — agents stay on their own machine (tunnel repair excepted)
3. **Never break Telegram bots** — they are the team's lifeline to Dan
4. **Never delete repos** — branch, don't force-push main
5. **Never use banned models** — see Section 3.4
6. **Config is sacred** — `openclaw.json` is locked, only modified via controlled process
7. **Cheapest capable model** — Qwen for routine, Claude for critical, never waste tokens
8. **50+ tasks/day** — the fleet runs hot, every agent contributes
9. **Communicate constantly** — update Kanban, alert Dan on blockers, never go silent
10. **Measure twice, cut once** — test before deploying, backup before changing

---

## 13. PROJECTS

| # | Project | Repo | Priority | Lead | Status |
|---|---------|------|----------|------|--------|
| 1 | **NERVIX** | nervix-federation | HIGHEST | Nano + Dexter + David | Active |
| 2 | **CrawdBot** | (Dexter's SaaS) | High | Dexter | Active |
| 3 | **ZmartyChat** | sienna-crypto-girl | Medium | Sienna | Active |
| 4 | **MyWork AI** | MyWork-AI | Medium | Memo | Active |
| 5 | **DansLab OS** | (infrastructure) | Ongoing | David | Active |

---

## 14. DAILY RHYTHM

| Time (EET) | Event | Agent |
|------------|-------|-------|
| 07:00 | OpenClaw update check | update |
| 08:00 | Morning brief to Dan | main |
| 08:30 | Model intelligence report | danslabmodel |
| Every 2h | Fleet health monitor | monitor |
| Every 2h | Model health check | doctor |
| Every 30min | Doctor repair loop | doctor |
| Every 3h | Brain refresh (proxy tokens) | danslabmodel |
| Every 4h | Task sync | main |
| Every 4h | GSD sprint tracker | gsd |
| Every 4h | n8n workflow health | n8n |
| 20:00 | End-of-day summary | main |
| Monday 09:00 | Weekly finance report | finance |
| Monday 09:30 | Weekly enrollment report | growth |

---

## 15. TROUBLESHOOTING QUICK REFERENCE

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Agent not responding on Telegram | Gateway down or model hanging | `openclaw gateway restart` |
| Droplet can't reach Claude | Tailscale down or proxy crashed | Check `tailscale status`, restart proxies via launchctl |
| Empty responses (0 tokens) | Invalid config or banned model | `openclaw doctor --fix` then enforce script |
| Config bloated with 60+ fallbacks | `openclaw doctor` auto-discovery | Run `enforce-openclaw-config.sh` |
| Claude proxy 500 errors | OAuth token expired | Re-login: `claude` in proxy home dir |
| Cron job stuck (runningAtMs set) | Model with no credits selected | Switch to working model, clear lock |
| Redis unreachable from droplet | Redis tunnel down | Check `com.danslab.redis-tunnels` |
| Fleet connectivity alarm | Service unreachable via Tailscale | Check `fleet-connectivity-check.sh` logs |

---

> **This document is the single source of truth.**
> When in doubt, read SYSTEM.md. When SYSTEM.md conflicts with other files, SYSTEM.md wins.
> Updated by David. Approved by Dan.

<!-- OPENCLAW_SYSTEM_STATUS_START -->
## 16. LIVE GOVERNANCE SNAPSHOT

- Generated: `2026-04-23 03:57:38 EEST`
- Communication priority: `ok`
- Runtime standard: `degraded`
- Daily learning review: `needs-attention`
- Doctor fleet health: `0/4` hosts probing ok

### Communication
- David main bot: `@DavidMacStudio_bot`
- Gateway loaded: `True`
- David router loaded: `True`
- Telegram watchdog loaded: `True`
- Recent communication findings: `none`

### Memory
- Advanced conversation memory store: [`main-telegram.jsonl`](/Users/davidai/.openclaw/memory/conversations/main-telegram.jsonl)
- Conversation ingestion status: `ok`
- Stored conversation records: `1054`
- Latest ingested session: `29431465-f9bb-4762-8047-bfbe4a4ffdf0`

### Specialist Governance
- `monitor` owns health visibility and communication alerts.
- `doctor` owns runtime repair and service recovery.
- `learning` owns prevention loops and recurring-issue digestion.
- `gsd` owns planning, execution structure, and Kanban/system follow-through.

### Board and Data Plane
- Kanban bridge loaded: `False`
- Supabase bridge loaded: `False`
- Board state is expected to flow through Supabase `tasks`, `kanban_activity`, and Redis task/result streams.

### Current Learning Pressure
- Repeated issues: `main Telegram streaming mode is weak: off; stale learning artifact: reply-slo-latest.json; doctor health still sees probe failures on: dexter, memo, sienna, nano; cron baseline missing jobs: health-monitor (monitor), nervix-priority-check (monitor), morning-brief (monitor), eod-summary (monitor), managed-tool-upgrade (update), openclaw-update-governor (update) ...; cron payload drift: Finance — Daily Cost Report 08:00 EET (finance) model=claude-balancer/claude-sonnet-4-6, Growth — Weekly Enrollment Report Monday (growth) model=claude-balancer/claude-sonnet-4-6; autonomous-repair governance drift: Doctor — Autonomous Repair Loop (every 30min) (doctor) replacement=Doctor — Safe Model Health Report (every 2h), DansLabModel — Brain Refresh (every 3h) (danslabmodel) replacement=DansLabModel — Claude Proxy Token Health (every 3h), Doctor — Model Health Check (every 2h) (doctor) replacement=Doctor — Safe Model Health Report (every 2h), claude-token-guard:macstudio (popebot) replacement=DansLabModel — Claude Proxy Token Health (every 3h), Claude token monitor (main) replacement=DansLabModel — Claude Proxy Token Health (every 3h); enabled announce jobs without explicit model pinning: Supabase — Post-Update Verification (runs after weekly update) (f49b4f42-a8a1-440e-a6a3-bf69c7e4b5f6); sensitive backup files present: 8`
<!-- OPENCLAW_SYSTEM_STATUS_END -->
