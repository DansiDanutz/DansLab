# DansLab System Architecture

## Document Status

- Version: 1.0
- Last updated: 2026-03-10
- Primary repository: `DansLab`
- Related workspace repository: `CrawdBot`
- Production URL: `https://danslab.vercel.app`

## Purpose

This document explains the DansLab system as it currently exists in the local workspace and in the deployed public site. It covers:

- the website architecture
- the internal lab model
- the ecosystem model
- the tools and services represented in the system
- the named agents and projects
- the major workflows
- deployment and operational flow

This document is intentionally explicit about one critical distinction:

- `DansLab` is the presentation and architecture-visualization layer
- the wider multi-agent platform is represented in `DansLab`
- only some operational pieces are implemented in adjacent repos such as `CrawdBot`

In other words, `DansLab` is both:

1. the public-facing architecture map
2. a product entry point into the internal lab model

It is not, by itself, the full execution backend for every agent shown in the graph.

---

## 1. Executive Summary

DansLab is a Next.js application deployed on Vercel that presents a layered view of an AI-first operating environment.

The system is organized into three user-facing levels:

1. `/`
   The entry layer. This is the branded landing experience built around Dan, the lobster mascot, and a portal-like PC entry into the lab.

2. `/lab`
   The internal team layer. This shows the human-in-the-loop model centered on Dan, David on Mac Studio, and the internal OpenClaw mesh.

3. `/ecosystem`
   The expanded operating model. This visualizes the full DansLab network of agents, infrastructure, channels, support services, and revenue systems.

At runtime, the site is primarily static-client UI with animated graph interactions. It is not currently backed by a live DansLab-specific database in this repository. Instead, the architecture data is encoded as TypeScript configuration:

- agents
- connections
- positions
- scenarios

The wider workspace includes `CrawdBot`, which provides evidence of a real monitored-agent implementation using:

- a Python reporter
- Supabase
- a Next.js dashboard
- Git activity tracking
- message bridging

That adjacent repo is relevant because it demonstrates how some parts of the architecture can operate in practice, especially telemetry, monitoring, messaging, and dashboard-driven agent supervision.

---

## 2. System Scope

### 2.1 What `DansLab` Is

`DansLab` is:

- a branded architecture dashboard
- a graph-based system map
- a narrative UI for explaining how the lab operates
- a deployment-ready public site
- a documentation-through-interface product

### 2.2 What `DansLab` Is Not

`DansLab` is not:

- the execution runtime for all agents
- the control plane for real bot state in this repo
- the source of truth for live task data
- a Supabase-backed backend application in its current form

### 2.3 Truth Sources

This architecture document is based on:

- `DansLab/src/app`
- `DansLab/src/components/ecosystem`
- `DansLab/src/components/lab`
- `DansLab/src/components/home`
- `DansLab/package.json`
- `DansLab/vercel.json`
- `CrawdBot/README.md`
- `CrawdBot/reporter/*`
- `CrawdBot/dashboard/*`

---

## 3. High-Level Architecture

```mermaid
flowchart TD
    User[Visitor or Operator] --> Home[/Landing Page]
    Home --> Lab[/Lab View]
    Home --> Eco[/Ecosystem View]
    Lab --> Eco

    Eco --> Agents[Agent Catalog]
    Eco --> Infra[Infrastructure Catalog]
    Eco --> Channels[Communication Channels]
    Eco --> Scenarios[Workflow Scenarios]

    GitHub[GitHub] --> Vercel[Vercel]
    Vercel --> Production[danslab.vercel.app]

    CrawdBot[CrawdBot Repo] --> Reporter[Python Reporter]
    Reporter --> Supabase[Supabase]
    Supabase --> BotDashboard[molt.bot dashboard]

    Eco -. represents .-> CrawdBot
    Eco -. represents .-> GitHub
    Eco -. represents .-> Vercel
    Eco -. represents .-> Supabase
```

Core idea:

- the `DansLab` site models the operating environment
- `CrawdBot` demonstrates one actual implementation of monitored autonomous work
- the public site and the operational repos are related, but not identical

---

## 4. Repository Architecture

## 4.1 `DansLab`

Main public-facing architecture site.

### Key folders

```text
DansLab/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── lab/page.tsx
│   │   ├── ecosystem/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── home/
│   │   ├── lab/
│   │   ├── ecosystem/
│   │   ├── avatars/
│   │   └── ui/
│   └── lib/
├── public/
├── vercel.json
└── package.json
```

### Architectural role

- defines the public product surface
- renders the lab and ecosystem views
- encodes the system model as code
- ships to Vercel as a Next.js App Router application

## 4.2 `CrawdBot`

Adjacent operational repo in the workspace.

### Architectural role

- demonstrates a real bot-monitoring pipeline
- contains a reporter that pushes state to Supabase
- includes task, message, and git-tracking patterns
- acts as evidence for how a monitored agent system can actually run

### Why it matters to DansLab

The `DansLab` ecosystem shows components like:

- monitoring
- database connectivity
- messaging
- structured task execution
- deployments

`CrawdBot` provides an actual implementation of parts of that operating model.

---

## 5. Frontend Application Architecture

## 5.1 Framework and Runtime

The `DansLab` app uses:

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- shadcn/ui primitives

### Characteristics

- App Router structure
- static route generation for current pages
- heavy client-side interaction inside graph canvases
- no internal API routes in current repo
- no server actions in current repo

## 5.2 Route Architecture

### `/`
Purpose:
- entry experience
- brand framing
- portal into the internal lab
- quick jump into the broader ecosystem

Main files:
- `src/app/page.tsx`
- `src/components/home/EntryIllustrations.tsx`
- `src/components/home/PortalEntryLink.tsx`

### `/lab`
Purpose:
- internal operating-room view
- compact graph focused on Dan + David + OpenClaw cluster
- detail panel for internal team nodes

Main files:
- `src/app/lab/page.tsx`
- `src/components/lab/LabCanvas.tsx`
- `src/components/lab/LabDetailPanel.tsx`

### `/ecosystem`
Purpose:
- full public architecture map
- detailed agent network
- scenario playback engine
- richer explanation of the wider system

Main files:
- `src/app/ecosystem/page.tsx`
- `src/components/ecosystem/EcosystemCanvas.tsx`
- `src/components/ecosystem/data/*`
- `src/components/ecosystem/scenarios/*`
- `src/components/ecosystem/panels/*`

---

## 6. UI Composition Model

## 6.1 Shared Graph Pattern

The graph experience is composed from a small set of reusable primitives:

- `AgentNode`
- `ConnectionLine`
- `AgentDetailPanel`
- `ScenarioPanel`
- `useScenario`

### Responsibilities

#### `AgentNode`
- renders a single node
- supports visual emphasis and dimming
- handles hover/click interaction
- now supports custom glyph rendering for key identities

#### `ConnectionLine`
- renders animated SVG Bézier lines
- supports connection typing:
  - `data`
  - `ssh`
  - `deploy`
  - `monitor`
  - `comms`

#### `AgentDetailPanel`
- opens on node selection
- shows role, description, project metadata, and relationships

#### `ScenarioPanel`
- renders selectable, narrated scenario playback controls

#### `useScenario`
- drives active agents
- drives active connections
- rotates step narration
- clears state when scenario finishes

## 6.2 Data-Driven Rendering

The ecosystem page is mostly data-driven.

The following files are the primary model:

- `src/components/ecosystem/data/agents.ts`
- `src/components/ecosystem/data/connections.ts`
- `src/components/ecosystem/data/positions.ts`
- `src/components/ecosystem/scenarios/scenarioData.ts`

This means the site behaves like a lightweight visual control map:

- add a node in `agents.ts`
- position it in `positions.ts`
- connect it in `connections.ts`
- animate it in `scenarioData.ts`

That pattern is the core of the architecture UI.

---

## 7. Agent Architecture

## 7.1 Primary Human + Orchestrator Layer

### Dan
Role:
- human decision maker
- source of priority
- final reviewer
- lab entry point

Function in the model:
- injects direction into the system
- owns project vision
- triggers new work

### David
Role:
- main orchestrator
- task router
- coordination point for internal and external agent work

Function in the model:
- receives direction from Dan
- delegates to domain agents
- bridges the lab to channels and systems

### Mac Studio
Role:
- central machine / host
- infrastructure hub

Function in the model:
- hosts orchestrator context
- acts as operational center
- anchors SSH-style and machine-centric relationships

## 7.2 Core Product Agents

### Dexter
Project:
- `crawdbot.com`

Responsibility:
- YouTube tooling
- creator-facing product work

### Nano
Project:
- `nervix.ai`

Responsibility:
- creates specialized agents
- enrolls them into the broader system

### Memo
Project:
- `MyWork-ai`

Responsibility:
- framework and platform builder
- tool/product creation inside a monetizable platform

### Sienna
Project:
- `zmarty.me`

Responsibility:
- crypto and trading-oriented product surface

## 7.3 OpenClaw Internal Team

### OpenClaw-01
Responsibility:
- builder
- implementation work

### OpenClaw-02
Responsibility:
- researcher
- planning and mapping

### OpenClaw-03
Responsibility:
- reviewer
- quality and regression thinking

### OpenClaw-04
Responsibility:
- automation
- scripts and repetitive execution

### KimiClaw
Responsibility:
- amplification
- signal distribution
- channel-level promotion and visibility

### KiloClaw
Responsibility:
- moderation
- noise control
- team order

### ManusClaw
Responsibility:
- operational execution
- tactical run ownership

## 7.4 Channel Layer

### Telegram
Use:
- idea input
- notifications
- direct updates

### Slack
Use:
- team hub
- internal coordination
- moderation and amplification layer

### Discord
Use:
- community-facing channel
- external user/community touchpoint

## 7.5 Support and Infrastructure Agents

### DansLabMonitor
- health monitoring
- uptime/error awareness

### DansLabGithub
- source control organization
- branch/PR/repo workflow representation

### DansLabVercel
- deployment representation
- preview/production publishing

### DansLabPope
- autonomous runner
- CI/CD style execution model

### DansLabAutoForge
- coding automation
- patch/refactor/shipping representation

### DansLabGSD
- structured execution framework
- plan-driven task progression

### DansLabVector
- memory/indexing/search model

### DansLabModel
- LLM strategy and optimization model

### DansLabDoctor
- diagnosis and repair model

### DansLabLearning
- retrospection and improvement loop

### DansLabStripe
- payments and monetization model

### DansLabSSH
- connectivity model
- machine-to-agent communication path

### DansLabSupabase
- database and realtime model

---

## 8. Project Catalog

This section documents named projects represented by the system.

## 8.1 Public/Product Projects

### DansLab
Type:
- architecture dashboard
- public-facing system explanation layer

Surface:
- `https://danslab.vercel.app`

### nervix.ai
Represented by:
- David
- Nano

Likely function in model:
- orchestrator ecosystem
- agent enrollment

### crawdbot.com
Represented by:
- Dexter

Likely function in model:
- YouTube tools and creator systems

### MyWork-ai
Represented by:
- Memo

Likely function in model:
- framework/product-building platform

### zmarty.me
Represented by:
- Sienna

Likely function in model:
- crypto/trading-related product

## 8.2 Operational Project in Workspace

### CrawdBot
Type:
- operational monitored bot workspace

Implemented capabilities:
- status reporting
- git tracking
- inbox/outbox message bridging
- Supabase writes
- dashboard-based monitoring

---

## 9. Workflow Architecture

## 9.1 Entry Workflow

```text
Visitor opens /
  -> sees DansLab entry scene
  -> clicks PC portal
  -> enters /lab
  -> optionally escalates into /ecosystem
```

Purpose:
- make the architecture understandable in layers
- avoid dropping users directly into the most complex system map

## 9.2 Human-to-Lab Workflow

```text
Dan
  -> defines direction
  -> passes direction to David
  -> David routes work to OpenClaw agents
  -> OpenClaw agents execute specialized tasks
  -> result returns to David
  -> Dan reviews / continues / redirects
```

This is the core internal control loop.

## 9.3 Idea-to-Feature Workflow

Represented in the ecosystem scenarios:

1. Dan creates or posts a new idea
2. David evaluates and plans it
3. OpenClaw and/or product agents split research and implementation
4. AutoForge/GitHub/Pope support execution and validation
5. Vercel deploys
6. channels are notified

## 9.4 Bug-Fix Workflow

Represented flow:

1. signal arrives in Slack
2. KiloClaw catches/moderates the issue
3. Monitor + Doctor diagnose
4. David routes execution
5. OpenClaw reviewer + automation pair handle fix loop
6. GitHub + Pope validate
7. Vercel publishes

## 9.5 Learning Workflow

Represented flow:

1. Learning reviews past activity
2. Vector stores patterns and lessons
3. Model optimizes prompts and logic
4. GSD/Update distribute improvements
5. primary agents and OpenClaw team receive upgraded behavior

## 9.6 Revenue Workflow

Represented flow:

1. Stripe processes payment
2. Supabase persists state
3. Nano and David enroll or create useful agents/products
4. KimiClaw and ManusClaw broadcast and operationalize the offer

This models DansLab as a system that does not only build, but monetizes.

## 9.7 Internal OpenClaw Sync Workflow

Represented in the `Lab Sync` scenario:

1. Dan sets a priority
2. David receives it
3. OpenClaw-01 and OpenClaw-02 split build/research
4. OpenClaw-03 and OpenClaw-04 handle quality/automation
5. KiloClaw, KimiClaw, and ManusClaw stabilize and distribute outcome

This is the cleanest representation of the internal lab operating model.

---

## 10. Data Model

## 10.1 Agent Model

Defined in `agents.ts`.

Fields:

- `id`
- `name`
- `role`
- `project`
- `projectUrl`
- `type`
- `color`
- `glow`
- `initials`
- `description`

Purpose:
- visual identity
- descriptive metadata
- graph semantics
- detail-panel content

## 10.2 Connection Model

Defined in `connections.ts`.

Fields:

- `id`
- `from`
- `to`
- `type`
- `label`

Purpose:
- relationship mapping
- animation path definition
- workflow storytelling

## 10.3 Position Model

Defined in `positions.ts`.

Purpose:
- layout control
- spatial storytelling
- hierarchy visualization

Examples:

- channels at the top
- Mac Studio near center
- support systems lower in the graph
- lab agents grouped into readable clusters

## 10.4 Scenario Model

Defined in `scenarioData.ts`.

Each scenario contains:

- id
- name
- icon
- description
- ordered steps

Each step contains:

- active agents
- active connections
- narration
- duration

Purpose:
- turn static architecture into animated explanation
- explain workflows without requiring a backend

---

## 11. Deployment Architecture

## 11.1 Hosting

Platform:
- Vercel

Configuration:
- `vercel.json`
- framework: `nextjs`
- build command: `npm run build`
- install command: `npm install`
- region: `iad1`

## 11.2 Source Control

Remote:
- `https://github.com/DansiDanutz/DansLab.git`

Branch used during latest deployment:
- `main`

## 11.3 Deployment Modes

There are two effective deployment paths:

1. Git-based deploy
   - push to GitHub
   - Vercel builds from connected project

2. Direct CLI deploy
   - `vercel --prod --yes`
   - production alias updated directly

## 11.4 Latest Confirmed Deployment

The current workspace deployment flow used:

- local production build verification
- commit to `main`
- push to GitHub
- direct Vercel production deploy

This confirms:

- the project builds successfully in production mode
- the public domain can be updated directly from this repo

---

## 12. Tooling Inventory

## 12.1 Frontend and UI

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- shadcn/ui primitives

## 12.2 Hosting and Delivery

- Vercel
- GitHub

## 12.3 Represented Infrastructure and Platform Tools

Within the system model, the following are explicitly represented:

- Mac Studio
- GitHub
- Vercel
- Supabase
- Stripe
- SSH / Tailscale-style connectivity
- GSD
- vector memory
- model optimization
- monitoring
- diagnostics
- learning

## 12.4 Adjacent Operational Tools from CrawdBot

From the neighboring `CrawdBot` repo:

- Python reporter
- Supabase REST client
- psutil-based host metrics
- git log parsing
- message syncing through local files
- Vercel dashboard deployment

These are useful because they show what a real instrumented bot implementation looks like behind a dashboard.

---

## 13. Relationship to CrawdBot

`CrawdBot` should be understood as a related operational implementation, not the same system as `DansLab`.

### `DansLab`
- public architecture layer
- narrative map
- branded system presentation

### `CrawdBot`
- concrete monitored bot workspace
- live-ish telemetry pattern
- owner/bot communication bridge
- real task/status pipeline

The architectural relationship is:

```text
DansLab explains the operating model
CrawdBot demonstrates one concrete execution stack inside that model
```

That is the most defensible way to describe the current workspace.

---

## 14. Security and Trust Boundaries

## 14.1 In `DansLab`

Current repo characteristics:

- no public backend endpoints
- no secrets used directly in route code
- mostly static, client-rendered architecture interface

This means the current public site is low-risk compared with an active control plane.

## 14.2 In `CrawdBot`

Security-sensitive elements exist:

- `.env`
- Supabase keys
- message bridge
- agent reporting
- workspace path restrictions
- guardrails

This matters because any future integration between `DansLab` and live operational data should respect those trust boundaries.

---

## 15. Known Gaps and Architectural Notes

This document should remain honest about current limitations.

## 15.1 Current Gaps

- `DansLab` is not backed by a live DansLab-specific database in this repo
- the ecosystem graph is curated, not auto-discovered
- scenario playback is scripted, not event-driven from real system state
- many represented agents are architectural entities, not directly implemented runtimes here

## 15.2 Strengths

- the site has a clear layered information architecture
- the graph model is highly editable
- routes cleanly separate entry, lab, and ecosystem concerns
- the system is deployable and production-ready as a documentation/product surface

## 15.3 Recommended Future Evolution

If DansLab should evolve from architecture-map into real control plane, the next steps are:

1. add a live data source for agents and workflows
2. move `agents.ts`, `connections.ts`, and scenarios into managed config or DB records
3. integrate real operational data from monitored systems
4. add auth and role-based views
5. split public architecture view from private operations view

---

## 16. Practical Reading of the System

The simplest accurate explanation of DansLab is:

- Dan is the human source of direction
- David is the orchestrator
- Mac Studio is the operating hub
- OpenClaw agents are the internal execution mesh
- product agents map to business/product surfaces
- support agents map to infrastructure and operational capabilities
- channels map to communications and market touchpoints
- the website turns all of that into a navigable architecture product

That is the system.

