# TEACHER_KNOWLEDGE.md

> **Owner**: Teacher (Meta-Agent, Fleet Knowledge Engineer)  
> **Updated**: 2026-05-18  
> **Scope**: DansLab fleet — agent instructions, capabilities, quality standards, and improvement backlog  

---

## 1. Fleet Overview

### Pipeline (8 Stages)
| Stage | Agents | Role |
|-------|--------|------|
| 1 | Discovery | Research, web search, spec gathering |
| 2 | GSD | Sprint framing, milestone shaping |
| 3 | Hermes | Brain review, decision gate |
| 4 | David | Orchestrator, task delegation |
| 5 | Dexter, Memo, Sienna, Nano, Claude Code, Codex, Xlaude | Execution droplets + Mac Studio agents |
| 6 | Vercel | Deployment |
| 7 | Growth | Marketing, traction |
| 8 | Stripe | Revenue, billing |

### Observers
Monitor, Doctor, DoctorLocal, Finance, DansLabModel

### Support
GitHub, Supabase, SSH, N8N, Obsidian, Vector, Learning, Update, KimiClaw, Autoresearch

### Meta
Teacher (this agent) — owns prompt quality, knowledge hygiene, capability drift detection

### Non-reasoning (no instructions needed)
Dan (CEO/human), KiloClaw (external kilo.ai), OpenClaw (gateway adapter)

---

## 2. Agent Catalog (42 Agents)

> Source: Paperclip API `GET /api/companies/{companyId}/agents`  
> Last verified: 2026-05-18

### Core Execution
| Agent | Status | Budget ($) | Capabilities | Instructions |
|-------|--------|-----------|--------------|--------------|
| David | running | 4,500 | 381 chars | ✅ SET |
| Dexter | idle | 180 | 328 chars | ✅ SET |
| Sienna | idle | 180 | 266 chars | ✅ SET |
| Nano | idle | 180 | 291 chars | ✅ SET |
| Memo | idle | 180 | 274 chars | ✅ SET |
| Codex | idle | 67.5 | 222 chars | ✅ SET |
| Xlaude | idle | 101.25 | 174 chars | ✅ SET |
| Claude Code | running | 2,000 | 232 chars | ✅ SET |
| GSD | running | 1,350 | 274 chars | ✅ SET |
| Hermes | running | 225 | 532 chars | ✅ SET |

### Support & Infrastructure
| Agent | Status | Budget ($) | Capabilities | Instructions |
|-------|--------|-----------|--------------|--------------|
| SSH | running | 67.5 | 130 chars | ✅ SET |
| Doctor | idle | 225 | 259 chars | ✅ SET |
| DoctorLocal | idle | 45 | 239 chars | ✅ SET |
| Monitor | idle | 112.5 | 188 chars | ✅ SET |
| GitHub | idle | 67.5 | 435 chars | ✅ SET |
| Supabase | idle | 67.5 | 929 chars | ✅ SET |
| Vercel | idle | 67.5 | 217 chars | ✅ SET |
| Stripe | idle | 67.5 | 252 chars | ✅ SET |
| Finance | idle | 67.5 | 204 chars | ✅ SET |
| N8N | idle | 67.5 | 151 chars | ✅ SET |
| Obsidian | idle | 67.5 | 217 chars | ✅ SET |
| Vector | idle | 67.5 | 196 chars | ✅ SET |
| Learning | idle | 67.5 | 261 chars | ✅ SET |
| Update | idle | 112.5 | 1,395 chars | ✅ SET |
| KimiClaw | idle | 112.5 | 245 chars | ✅ SET |
| Autoresearch | running | 500 | 1,824 chars | ✅ SET |

### Meta & Quality
| Agent | Status | Budget ($) | Capabilities | Instructions |
|-------|--------|-----------|--------------|--------------|
| Teacher | idle | 67.5 | 246 chars | ✅ SET |
| DansLabModel | idle | 112.5 | 4,225 chars | ✅ SET |
| Discovery | idle | 112.5 | 1,908 chars | ✅ SET |
| Growth | idle | 67.5 | 267 chars | ✅ SET |

### Workers & Short-lived
| Agent | Status | Budget ($) | Capabilities | Instructions |
|-------|--------|-----------|--------------|--------------|
| Kimi CLI Worker | running | 0 (unlimited) | 132 chars | ✅ SET |
| Kimi Code | running | 112.5 | 155 chars | ✅ SET |
| OpenClaude Worker | idle | 0 (unlimited) | 423 chars | ✅ SET |
| OpenCode Worker | running | 0 (unlimited) | 349 chars | ✅ SET |
| Pi | idle | 225 | 662 chars | ✅ SET |
| Pi Stability | idle | 45 | 194 chars | ✅ SET |
| Hermes Strategy | idle | 112.5 | 983 chars | ✅ SET |
| Hermes Premium | running | 225 | 158 chars | ✅ SET |
| CodexMax | running | 67.5 | 366 chars | ✅ SET |
| OpenClaw | idle | 112.5 | 1,648 chars | ✅ SET |
| Dan | idle | 1,350 | 139 chars | ✅ SET |
| KiloClaw | running | 45 | 599 chars | ✅ SET |

---

## 3. Instruction File Registry

### Location
`~/.paperclip/instances/default/data/agent-instructions/<urlKey>.md`

### Coverage
- **43 files** present (30 core + 13 auxiliary/worker files)
- **Total size**: ~247 KB
- **Average size**: 5,689 bytes
- **42/42 agents** have `instructionsFilePath` registered in Paperclip DB

### Quality Dimensions (automated scan)
| Dimension | Pass Rate |
|-----------|-----------|
| Contains "identity" section | 35/43 (81%) |
| Contains model policy | 39/43 (91%) |
| Contains rules section | 41/43 (95%) |
| Contains NERVIX context | 29/43 (67%) |
| Contains Paperclip behavior | 42/43 (98%) |

### Largest / Most Detailed Files
1. `david.md` (21,076 bytes) — Full orchestration protocol
2. `_FLEET_PROTOCOL.md` (15,803 bytes) — Behavioral contract for all agents
3. `sienna.md` (15,086 bytes) — Crypto/trading research domain
4. `pi.md` (14,052 bytes) — Multi-model execution agent
5. `codexmax.md` (13,399 bytes) — Extended Codex capabilities

### Smallest / Needs Enrichment
1. `opencode-worker.md` (911 bytes)
2. `openclaude-worker.md` (967 bytes)
3. `pi-stability.md` (900 bytes)
4. `kimi-code.md` (1,166 bytes)
5. `hermes-premium.md` (1,981 bytes)

---

## 4. Quality Standards

### Strong Agent Checklist
- [ ] Clear identity: name, role, machine, pipeline position
- [ ] Specific duties with concrete examples
- [ ] Correct model routing (cheapest capable)
- [ ] Knows reporting chain
- [ ] Has NERVIX priority context
- [ ] Knows critical rules
- [ ] Instructions file registered in Paperclip

### Weak Agent Signals
- No instruction file (`instructionsFilePath` = null)
- Prompt template < 100 chars or generic
- Capabilities that don't match actual duties
- Wrong model for task type (e.g., Claude for routine cron)
- Missing NERVIX context

### Model Routing Policy (enforced in all instruction files)
| Tier | Model | Use Case |
|------|-------|----------|
| T0 (free) | `qwen3.6-plus:free` | Agentic/planning, 1M ctx |
| T0 (local) | `ollama/qwen3:8b` | Routine/cron |
| T1 | `claude-sonnet-4-6` | Critical/security |
| T1 | `gemini-2.5-flash` | Vision/multimodal |
| Banned | `tinyllama`, `gemini-2.0-flash` | Never use |

**Rule**: FREE > Subscription > Paid. Never use Claude subscription for routine agent tasks.

---

## 5. Known Gaps & Improvement Backlog

### Critical (P0)
1. **promptTemplate empty for all 42 agents** — Low immediate impact since `instructionsFilePath` takes precedence, but should be populated for fallback safety.

### High (P1)
2. **NERVIX context missing in 14 instruction files** — Files like `doctor-local`, `xlaude-local`, `vector`, `ssh`, `n8n`, `hermes-premium`, `kimi-code`, `openclaude-worker`, `opencode-worker`, `pi-stability`, `danslabmodel` (partial), `workflow-connections` need NERVIX references added.
3. **Identity section missing in 8 files** — `_FLEET_PROTOCOL`, `workflow-connections`, `doctor-local`, `xlaude-local`, `hermes-strategy`, `hermes-premium`, `kimi-code`, `danslabmodel`.

### Medium (P2)
4. **Capabilities audit** — Some capability descriptions may be outdated (last updated Apr 2026). Cross-check against current actual duties.
5. **Budget caps** — 4 agents at $0 (unlimited): Kimi CLI Worker, OpenClaude Worker, OpenCode Worker, Kimi Code. Finance should review whether unlimited is correct.
6. **Small instruction files** — Files < 1,500 bytes may lack sufficient context for complex tasks.

### Low (P3)
7. **Consolidate worker instructions** — `openclaude-worker`, `opencode-worker`, `pi-stability` are thin wrappers. Consider merging into parent agent files or expanding.
8. **Standardize header format** — Some files use `# Agent Instructions`, others use `# Agent Name Instructions`. Standardize for parseability.

---

## 6. Operating Rituals

### Morning (06:00 EET) — Fleet Quality Audit
- Check all agent Paperclip statuses (error state? Budget exceeded?)
- Review last 24h run logs for bad output quality
- Flag agents on stale information
- Create improvement tasks for critical deficiencies

### Midday (14:00 EET) — Prompt Drift Check
- Review whether current agent instructions still match reality
- Focus on newly recovered or recently failing agents
- Propose targeted prompt changes, not broad rewrites

### Evening (20:00 EET) — System Health Report
- Summarize what degraded, what improved, what should evolve next
- Link findings to runbooks and Obsidian notes

### Weekly Deep Audit
For each agent: capabilities current? instruction file present? model correct? budget OK? anti-patterns?

---

## 7. Reference Files

| File | Purpose |
|------|---------|
| `~/.paperclip/instances/default/data/agent-instructions/_FLEET_PROTOCOL.md` | Behavioral contract for all agents |
| `~/.paperclip/instances/default/data/agent-instructions/<urlKey>.md` | Per-agent instructions |
| `/Users/davidai/Desktop/DavidAi/SYSTEM.md` | System architecture bible |
| `DansLab-Vault/Agents/OpenClaw Agent Memory Map.md` | Shared registry |
| `~/.openclaw/scripts/request_help.py` | Fleet help routing |

---

## 8. Verification Commands

```bash
# List all instruction files
ls ~/.paperclip/instances/default/data/agent-instructions/*.md

# Check Paperclip registration (requires API key)
curl -s "$PAPERCLIP_API_URL/api/companies/{companyId}/agents" \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" | \
  jq '.[] | {name: .nameKey, path: .instructionsFilePath}'

# Quality scan (identity/model/rules/nervix coverage)
python3 -c "
import glob, os
for f in glob.glob(os.path.expanduser('~/.paperclip/instances/default/data/agent-instructions/*.md')):
    c = open(f).read().lower()
    print(f'{os.path.basename(f)[:-3]}: id={\"Y\" if \"identity\" in c else \"N\"} mdl={\"Y\" if \"model\" in c else \"N\"} rul={\"Y\" if \"rules\" in c else \"N\"} nrv={\"Y\" if \"nervix\" in c else \"N\"}')
"
```
