# DansiDanutz System Architecture

## Document Status

- Version: 1.0
- Date: 2026-03-10
- Scope: `C:\Users\dansi\Desktop\MoltBot`
- Primary presentation repo: `DansLab`
- Primary operations repo: `CrawdBot`
- Audience: founder, operators, collaborators, future agents

## 1. Executive Summary

DansLab should be understood as both a company model and a technical operating system.

At the company level, DansLab is an AI-first software company organized around:

- Dan as founder and human decision-maker
- David as the main orchestrator running from Dan's Mac Studio
- four principal runtime agents hosted as separate machine contexts: Dexter, Sienna, Memo, and Nano
- an internal OpenClaw specialist team used to research, build, review, automate, operate, moderate, and amplify work
- a set of support systems for deployment, monitoring, memory, payments, communication, and structured execution

At the technical level, the system currently splits into two layers:

1. `DansLab`
   The public and internal architecture interface. It explains the lab, the ecosystem, and the team topology through a Next.js graph application.

2. `CrawdBot`
   The clearest operational proof in this workspace of how one real autonomous agent is run, monitored, constrained, and connected to dashboards and message flows.

This distinction matters:

- `DansLab` is the most complete expression of the intended company architecture
- `CrawdBot` is the strongest implementation evidence for actual workflows, telemetry, security rules, and monitored autonomous execution
- the broader company model spans multiple projects, some active, some prototyped, and some represented architecturally rather than fully implemented in this workspace

This document is therefore explicit about two things:

- what the DansLab company is designed to be
- what the local repositories prove today

## 2. Core Company Model

### 2.1 Company Definition

DansLab is an AI-native software company based on OpenClaw agents.

Its operating idea is:

- one human founder defines strategy, quality, taste, and business direction
- one main orchestrator decomposes intent into coordinated work
- multiple machine-resident agents own domain-specific execution
- an internal specialist layer handles research, implementation, review, automation, moderation, operations, and promotion
- reusable frameworks, dashboards, and marketplaces turn work into products and revenue

### 2.2 Strategic Loop

The company loop is:

`idea -> orchestration -> execution -> review -> deployment -> visibility -> revenue -> learning -> improved execution`

This loop appears repeatedly across the repos:

- in `DansLab` as an architecture map
- in `CrawdBot` as monitored task execution
- in `MyWork Framework` as build tooling and workflow structure
- in `Marketplace` and `The Brain Platform` as monetization and distribution logic

### 2.3 Nervix in the Company Model

Nervix is a core part of the DansLab company architecture.

Based on the system definitions present in `DansLab`, Nervix should be understood as the agent ecosystem platform attached most directly to David and Nano.

In practical architectural terms:

- David is associated with `nervix.ai` as the main orchestrator
- Nano is associated with `nervix.ai` as the agent creator
- Nervix is the logical environment where specialized agents are enrolled, coordinated, and turned into usable company capabilities

That means Nervix occupies a specific company function:

- it is not just another website
- it is the orchestration and enrollment surface for agent-based capabilities
- it is the platform layer where new agent labor can be structured, hosted, and monetized

Inside the DansLab company model, Nervix sits between:

- strategy from Dan
- orchestration from David
- supply creation from Nano
- monetization and outward delivery through the broader ecosystem

The clean interpretation is:

- DansLab is the company and system map
- Nervix is the agent platform inside that company
- David runs the orchestration logic of Nervix
- Nano expands the Nervix ecosystem by creating new specialist agents

## 3. Physical and Logical Topology

### 3.1 Primary Topology

The intended core topology is:

- Dan works from a Mac Studio
- the Mac Studio hosts the local model and orchestration environment
- David runs as the main orchestrator on or through that Mac Studio environment
- four separate runtime agents exist as machine-isolated workers:
  - Dexter
  - Sienna
  - Memo
  - Nano
- the Mac Studio connects to those workers through remote connectivity represented in `DansLab` as `Tailscale SSH`

This topology is represented directly in:

- `DansLab/src/components/ecosystem/data/agents.ts`
- `DansLab/src/components/ecosystem/data/connections.ts`

### 3.2 Hub-and-Spoke Structure

The system is designed as a hub-and-spoke model:

- Dan is the strategic source
- Mac Studio is the physical control hub
- David is the logical orchestration hub
- the VM agents are execution spokes
- OpenClaw agents are specialist sub-spokes under David
- support systems provide deployment, memory, monitoring, versioning, and communications

### 3.3 Runtime Layers

The runtime can be understood in five layers:

1. Human layer
   Dan sets direction, approves major outcomes, and acts as final override.

2. Orchestration layer
   David interprets goals, delegates work, coordinates handoffs, and routes outputs.

3. Execution layer
   Dexter, Sienna, Memo, and Nano own domain-specific delivery lanes.

4. Specialist layer
   OpenClaw agents plus ManusClaw, KimiClaw, and KiloClaw provide focused specialist behavior.

5. Support layer
   Monitoring, memory, payments, deploy, versioning, GitHub, database, and communication systems keep the lab operational.

### 3.4 Computer-Use Execution Layer

Beyond code generation and remote shell execution, the system can benefit from a dedicated computer-use layer.

In DansLab terms, that layer should be treated as a contained execution substrate rather than as a replacement for the architecture.

The role of a system such as `mac-mini-agent` is:

- provide GUI automation on macOS
- provide tmux-based terminal execution on a dedicated machine
- provide remote job execution against a contained Apple device
- allow agents to interact with apps, browsers, windows, and desktop workflows directly

Inside the DansLab architecture, this should be modeled as:

- a dedicated execution node under David
- used by ManusClaw for final operational runs
- used by OpenClaw-04 for deterministic terminal and automation tasks
- optionally used by Dexter or Sienna when real browser or desktop actions are needed

It should not be treated as:

- the main company architecture
- the policy layer
- the memory layer
- the governance layer

It is best understood as the computer-use execution layer that extends the current SSH and code-centric operating model.

## 4. Human and Main Agent Architecture

## 4.1 Dan

Role:

- human founder
- strategic director
- final approver
- scope owner

Responsibilities:

- decides what enters the lab
- sets product and business priorities
- validates quality against real intent
- provides human override when agent outputs diverge
- manages the relationship between product building and monetization

System position:

- connected directly to Mac Studio and David
- represented in the `DansLab` graph as the human-in-the-loop center

## 4.2 Mac Studio

Role:

- central hardware hub
- local control plane
- host or gateway for David and remote agent coordination

Responsibilities:

- serves as the physical operating base for orchestration
- hosts local tooling, local model execution, and developer interfaces
- connects into remote agents through SSH/Tailscale-style links
- acts as the manual override point for the entire system

Evidence:

- described in `DansLab` as "Dan's Mac Studio"
- connected in `connections.ts` to David, Dexter, Nano, Memo, Sienna, and OpenClaw nodes through SSH links

## 4.3 David

Role:

- main orchestrator
- central delegation engine
- company-wide routing brain

Responsibilities:

- receives direction from Dan
- translates goals into delegated work
- routes tasks to Dexter, Nano, Memo, Sienna, and OpenClaw agents
- coordinates communication across Telegram, Slack, and Discord
- connects with support systems such as database, model optimization, and memory
- acts as the main operational brain of the company

Designed behavior:

- David should not do every task directly
- David should interpret, prioritize, and delegate
- David is the controller for both internal product work and external system motion
- David is the coordination point where human direction becomes machine execution

Project association:

- associated in `DansLab` with `nervix.ai`

## 4.4 Dexter

Role:

- YouTube tools and creator systems agent

Responsibilities:

- owns creator tooling and video/channel utility work
- develops or maintains channel analytics, video studio features, and creator automation
- supports products that help YouTube creators operate more effectively
- can participate in feature delivery when David routes creator- or media-related work

Project association:

- associated in `DansLab` with `crawdbot.com`

Interpretation:

- Dexter is a product/domain execution agent, not a general orchestrator
- Dexter is best understood as the media-tools lane inside the company

## 4.5 Nano

Role:

- agent creator
- monetization enabler for specialized agents

Responsibilities:

- designs and creates specialized agents
- enrolls or integrates those agents into the broader Nervix system
- supports the business model where agents themselves can become monetizable capabilities
- extends the company by manufacturing new task-specific workers

Project association:

- associated with `nervix.ai`

Interpretation:

- Nano is the company's expansion engine for new agents
- Nano grows the supply side of the ecosystem

## 4.6 Memo

Role:

- framework builder
- autonomous senior developer

Responsibilities:

- owns framework-related engineering work
- operates inside monitored workspace constraints
- uses structured task execution and reporting
- contributes to MyWork-style tools, dashboards, and adjacent product infrastructure
- acts as the most concrete example of a real operated agent in the current repos

Project association:

- `MyWork-ai`
- `CrawdBot`

Implementation evidence:

- `CrawdBot/README.md`
- `CrawdBot/docs/CLAUDE.md`
- `CrawdBot/reporter/*`
- `CrawdBot/dashboard/*`

Interpretation:

- Memo is the best-documented operational agent in the local workspace
- Memo proves the intended DansLab model can be partially implemented in practice

## 4.7 Sienna

Role:

- crypto and trading agent

Responsibilities:

- focuses on trading strategy, crypto intelligence, and market-facing product work
- advertises or represents trading capabilities through `zmarty.me`
- is associated with large endpoint surfaces and trading data systems
- sits on the financial/trading vertical within the company

Project association:

- `zmarty.me`

Interpretation:

- Sienna is the market/trading execution lane
- Sienna is not a general-purpose agent; she is domain-specialized

## 5. OpenClaw Team Architecture

The OpenClaw team is the internal specialist company layer under David.

This team exists to prevent the system from collapsing into one generalist agent trying to do everything poorly.

The OpenClaw design principle is specialization by workflow stage.

## 5.1 OpenClaw-01

Role:

- Builder

Primary mission:

- turn approved plans into implementation

Responsibilities:

- implement features after requirements are sufficiently clear
- create components, modules, routes, integrations, and supporting code
- execute concrete scoped build work
- convert design and architecture direction into real artifacts

Boundaries:

- not responsible for ambiguous early discovery
- not the final reviewer
- not the main deploy or communications owner

Ideal handoff:

- receives a plan from David or OpenClaw-02
- produces implementation for OpenClaw-03 review

## 5.2 OpenClaw-02

Role:

- Researcher

Primary mission:

- reduce ambiguity before build work begins

Responsibilities:

- analyze vague requests
- map architecture options
- identify dependencies and risks
- break goals into execution-ready units
- produce plans the build layer can actually use

Boundaries:

- not the main implementation owner
- not the final operational ship layer

Ideal handoff:

- receives direction from David
- sends a clarified plan to OpenClaw-01

## 5.3 OpenClaw-03

Role:

- Reviewer

Primary mission:

- protect quality and prevent bad work from moving outward

Responsibilities:

- review code and implementation outputs
- identify regressions, edge cases, and wrong assumptions
- challenge whether the solution actually solves the original problem
- check whether tests, validation, or operational checks are missing

Boundaries:

- not the main author of the implementation
- not the channel amplification owner

Ideal handoff:

- receives implementation from OpenClaw-01
- sends rework back or approves downstream execution

## 5.4 OpenClaw-04

Role:

- Automation

Primary mission:

- handle deterministic, repeatable, script-heavy engineering work

Responsibilities:

- build scripts and glue code
- automate repetitive engineering actions
- support migration, setup, linting, and pipeline mechanics
- reduce time wasted on repetitive tasks

Boundaries:

- not the main discovery agent
- not the high-level architecture owner

Ideal handoff:

- receives validated work from David or OpenClaw-03
- operationalizes repeatable follow-through

## 5.5 ManusClaw

Role:

- Operator

Primary mission:

- carry approved work across the finish line

Responsibilities:

- runs tactical execution loops
- closes operational tasks
- performs the final practical run phase
- helps ensure prepared work does not stall before completion

Boundaries:

- not the early-stage researcher
- not the main moderator

Ideal handoff:

- receives approved work from David and the OpenClaw review path
- coordinates final action and completion

## 5.6 KiloClaw

Role:

- Moderator

Primary mission:

- maintain signal quality and priority discipline in team communications

Responsibilities:

- moderate agent and team channel activity
- catch incoming issues first
- distinguish signal from noise
- prioritize or escalate the right work to the right agent

Boundaries:

- not the main build or promotion owner

Ideal handoff:

- receives raw traffic from Slack-style team channels
- escalates real issues to Doctor, David, or execution agents

## 5.7 KimiClaw

Role:

- Advertiser and signal amplifier

Primary mission:

- make useful output visible across channels and opportunities

Responsibilities:

- advertise products, releases, and capabilities
- translate technical output into outward-facing signal
- support monetization and visibility
- distribute announcements through channels

Boundaries:

- not the moderation owner
- not the code implementation owner

Ideal handoff:

- receives meaningful outputs from David or ManusClaw
- amplifies them across Slack, Telegram, Discord, and similar channels

## 5.8 OpenClaw Operating Sequence

The intended internal sequence is:

1. Dan sets direction
2. David interprets and delegates
3. OpenClaw-02 clarifies the work
4. OpenClaw-01 builds
5. OpenClaw-03 reviews
6. OpenClaw-04 automates repeatable follow-through
7. ManusClaw operationalizes completion
8. KiloClaw maintains signal quality
9. KimiClaw amplifies outcomes

This exact path is not mandatory on every task, but it is the cleanest designed operating model.

## 6. Support Systems Architecture

The DansLab graph includes named support systems that represent core company functions.

## 6.1 DansLabMonitor

Purpose:

- observe uptime, performance, errors, and agent health

Architectural role:

- monitoring and operational visibility layer
- detects problems and feeds diagnostic flows

## 6.2 DansLabVercel

Purpose:

- deployment execution for web properties

Architectural role:

- production and preview release manager for Vercel-hosted projects

Evidence:

- `DansLab/vercel.json`
- `CrawdBot/dashboard` Vercel deployment model described in `README.md`

## 6.3 DansLabGithub

Purpose:

- repository and branch organization

Architectural role:

- source-control governance layer
- permission and PR structure
- deploy trigger source for Vercel and CI-style actions

## 6.4 DansLabPope

Purpose:

- autonomous runner for assigned jobs

Architectural role:

- isolated autonomous execution path for GitHub-connected work
- useful for repairs and unattended flows

## 6.5 DansLabAutoForge

Purpose:

- autonomous coding system

Architectural role:

- high-throughput code-writing engine
- can push generated work into GitHub-facing flows

## 6.6 DansLabGSD

Purpose:

- structured execution framework

Architectural role:

- standardizes task phases, plans, and progress tracking
- used when agents need ordered execution instead of ad hoc work

Evidence:

- `CrawdBot/reporter/reporter.py` parses `.planning/STATE.md`
- `CrawdBot/docs/CLAUDE.md` explicitly requires GSD planning files
- `MyWork-Framework` positions GSD as a core system component

## 6.7 DansLabVector

Purpose:

- vector memory and searchable system knowledge

Architectural role:

- captures reusable system memory
- supports recall, pattern reuse, and knowledge continuity

## 6.8 DansLabUpdate

Purpose:

- version and update management

Architectural role:

- keeps tools and supporting systems current
- feeds improvements into GSD and the wider toolchain

## 6.9 DansLabModel

Purpose:

- model optimization and fallback management

Architectural role:

- optimizes model choice, fallbacks, and prompt behavior
- helps the company manage cost, reliability, and repair of model routes

Evidence:

- `CrawdBot/docs/CLAUDE.md` defines a real fallback stack:
  - primary `Z.AI GLM-4.7`
  - fallback `Claude Opus 4.5`
- `molt-bot-seven/README.md` documents multi-provider cost and failover strategy

## 6.10 DansLabDoctor

Purpose:

- diagnostics and system repair

Architectural role:

- receives health signals from monitoring
- handles diagnosis and recovery
- acts as internal incident response

## 6.11 DansLabLearning

Purpose:

- daily or periodic learning loop

Architectural role:

- extracts patterns, mistakes, and improvements from previous work
- feeds better behavior back into models, memory, and frameworks

## 6.12 DansLabStripe

Purpose:

- payment processing

Architectural role:

- handles subscriptions, credits, payments, and revenue events

Evidence across repos:

- `Marketplace` uses Stripe Connect
- `The Brain Platform` treats monetization as a first-class system capability

## 6.13 DansLabSSH

Purpose:

- remote connectivity and machine access

Architectural role:

- manages the connections between Mac Studio and remote workers
- represented as Tailscale SSH in `DansLab`

## 6.14 DansLabSupabase

Purpose:

- shared database, auth, storage, realtime

Architectural role:

- persistence and realtime synchronization layer
- supports dashboarding, messages, status, and product data

Evidence:

- `CrawdBot` reporter writes to Supabase tables
- `CrawdBot` dashboard reads live agent state from Supabase
- `Marketplace` README names Supabase as database layer

## 6.15 Nervix Platform

Purpose:

- host the orchestrated agent ecosystem
- act as the platform where specialized agents can be joined, coordinated, and made useful

Architectural role:

- platform layer for David's orchestration domain
- enrollment layer for Nano-created agents
- operational surface for agent-based value creation

Company meaning:

- Nervix is the internal platform expression of the agent company
- if DansLab is the company map, Nervix is one of the main operational platforms inside that map

Primary ownership:

- David operates the orchestrator side
- Nano expands the agent roster feeding into that platform

## 6.16 Mac Mini Execution Node

Purpose:

- provide isolated computer-use automation on Apple hardware

Architectural role:

- dedicated desktop-automation executor
- host GUI tasks, browser tasks, desktop validation, content posting, and final manual-like runs

Recommended ownership:

- David delegates to it
- ManusClaw operates it for finish-line tasks
- OpenClaw-04 uses it for deterministic execution routines

Recommended boundary:

- this node should be isolated from Dan's main Mac Studio
- it should be treated as a high-trust executor with narrow permissions and clear logging

## 7. Communication Architecture

The company model uses channel-specific communication rather than a single monolithic chat surface.

### 7.1 Telegram

Designed use:

- idea posting
- updates
- broad agent visibility

### 7.2 Slack

Designed use:

- team hub
- moderation and prioritization
- operational routing

Special roles on Slack:

- KiloClaw moderates
- KimiClaw amplifies
- ManusClaw drives ops

### 7.3 Discord

Designed use:

- community and external interaction layer

### 7.4 Message Bridge Pattern

The strongest implemented evidence for the communication pattern is in `CrawdBot`.

There:

- Dan writes toward the bot through Supabase-backed messages
- the reporter fetches unread owner messages and writes them to `messages/inbox.json`
- the bot writes updates to `messages/outbox.json`
- the reporter uploads those messages to Supabase and mirrors them into activity streams

Relevant files:

- `CrawdBot/reporter/message_handler.py`
- `CrawdBot/README.md`

This establishes the company communication principle:

- human-to-agent and agent-to-human communication should be durable, visible, and auditable

## 8. Security Architecture

The security model is best documented in `CrawdBot` and `MyWork-Framework`.

## 8.1 Core Principles

- secrets must not live in repositories
- agent write scope must be constrained
- main branches must be protected from autonomous direct pushes
- sensitive operational code should be protected from arbitrary agent editing
- communication and state should be observable
- destructive actions should be restricted

## 8.2 Secret Handling

In `CrawdBot`:

- secrets go through `api_manager.py`
- storage is outside the repo
- `SECURITY.md` explicitly forbids hardcoded passwords and API keys
- `.env` is treated as sensitive and excluded from normal agent work

In `MyWork-Framework`:

- `.env` and `.mcp.json` must never be committed
- `.env.example` and `.mcp.json.example` provide safe templates
- `mw doctor` is intended to check security issues and exposed secret patterns

## 8.3 Workspace Isolation

`CrawdBot/docs/CLAUDE.md` defines a strict boundary:

- the bot can only work in `workspace/`
- the bot must not modify `reporter/`, `guardrails/`, `.env`, or `api_manager.py`
- the bot must not access live production systems

This is important because it shows the company security model favors limited execution zones rather than unrestricted agent freedom.

## 8.4 Branch and Git Safety

`CrawdBot` defines:

- branch prefix `bot/*`
- never push to `main` or `master`
- create PRs, never self-merge

This establishes the intended governance standard:

- autonomous work should enter review flows rather than directly rewriting protected branches

## 8.5 Forbidden and Restricted Actions

`CrawdBot/docs/CLAUDE.md` forbids:

- destructive shell commands
- force pushes
- package publishing
- spending money
- reading sensitive files
- editing control-plane and security files

That means the company security model is not just about secrets; it is also about economic and operational containment.

## 8.6 Monitoring as Security

The reporter loop in `CrawdBot` turns observability into a security function:

- status is logged
- commits are logged
- messages are logged
- task progress is logged

A monitored autonomous agent is easier to audit, interrupt, and reason about than an unmonitored one.

## 9. Workflow Architecture

## 9.1 Canonical Company Workflow

The default DansLab workflow is:

1. Dan defines a goal
2. David interprets and routes it
3. relevant main agent or OpenClaw agent receives it
4. build/research/review/automation handoffs occur
5. GitHub and deployment systems handle publication
6. communication channels surface updates
7. learning and memory systems capture the result

## 9.2 Bug-Fix Workflow

Represented in `DansLab/scenarioData.ts`:

1. bug arrives in Slack
2. KiloClaw picks it up
3. Doctor diagnoses it with Monitor data
4. David routes to OpenClaw-03 and OpenClaw-04
5. ManusClaw helps drive the operational run
6. GitHub and Pope validate the change
7. Vercel deploys the fix

This workflow shows:

- intake
- diagnosis
- review and automation
- operational completion
- deployment

## 9.3 Learning Workflow

Represented in `scenarioData.ts`:

1. Learning reviews prior work
2. insights are stored in Vector
3. Model optimization uses those insights
4. GSD and Update distribute improvements
5. David and core agents receive the improved patterns

This is the company's self-improvement loop.

## 9.4 New Feature Workflow

Represented in `scenarioData.ts`:

1. Dan initiates idea entry
2. David and OpenClaw-02 analyze the request
3. Dexter and OpenClaw-01 split implementation work
4. AutoForge pushes code
5. GitHub and Pope validate
6. Vercel deploys
7. KimiClaw amplifies release across channels

This is the clearest expression of the intended product-delivery pipeline.

## 9.5 Revenue Workflow

Represented in `scenarioData.ts`:

1. a user subscribes
2. Stripe processes payment
3. Supabase stores relevant data
4. Nano creates a specialized agent
5. David enrolls that agent into the ecosystem
6. KimiClaw and ManusClaw push the new offer outward and operationally

This workflow links money directly to agent creation and system growth.

## 9.6 Memo Operational Workflow

The most concrete implemented workflow is Memo's in `CrawdBot`:

1. check inbox for owner messages
2. read `.planning/STATE.md`
3. work highest-priority task
4. append progress to `messages/outbox.json`
5. commit with bot-safe format
6. update state
7. reporter pushes system state, messages, and commits to Supabase
8. dashboard reflects changes in near real time

This proves a real closed loop between:

- instructions
- local work
- telemetry
- messaging
- dashboard visibility

## 10. Tooling Architecture

## 10.1 DansLab Tooling

`DansLab` is built with:

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

Its function is:

- visualize the company architecture
- provide branded entry routes
- expose internal lab and external ecosystem views

## 10.2 CrawdBot Tooling

`CrawdBot` uses:

- Python reporter runtime
- Supabase REST and realtime
- psutil-based process monitoring
- Git log parsing
- local JSON inbox/outbox bridge
- Next.js monitoring dashboard

Key files:

- `reporter/reporter.py`
- `reporter/process_monitor.py`
- `reporter/git_tracker.py`
- `reporter/message_handler.py`
- `dashboard/*`

## 10.3 MyWork Framework Tooling

`MyWork-Framework` positions itself as an AI-powered development platform combining:

- project orchestration
- autonomous coding
- workflow automation
- GSD integration
- n8n
- marketplace connectivity

It is the internal tooling layer intended to help users or agents:

- clone
- build
- sell
- earn

## 10.4 AI Provider and Model Tooling

Across the repos, the model strategy includes:

- local model execution on Mac Studio
- Z.AI as a low-cost primary provider in some agent docs
- Claude as fallback
- multi-provider failover and rotation strategies in `molt-bot-seven`

This implies the company model is designed to optimize for:

- resilience
- low cost
- fallback reliability
- provider diversity

## 10.5 Marketplace and Product Tooling

The business-side toolchain includes:

- Stripe / Stripe Connect
- Supabase
- Vercel
- Railway
- Pinecone in Marketplace docs
- builder and product metadata concepts

## 10.6 Mac-Based Execution Tooling

An additional execution layer can be added through a dedicated macOS automation stack such as `mac-mini-agent`.

Inside the DansLab architecture, that kind of tooling belongs in the execution layer, not the governance layer.

Its value is:

- GUI control
- browser automation on a real desktop
- terminal session orchestration on a dedicated Apple machine
- remote job execution for tasks that cannot be solved by repo edits alone

The correct architectural use is:

- David dispatches high-level jobs
- OpenClaw-04 prepares deterministic routines
- ManusClaw executes finish-line operations

Typical use cases:

- validate deployed UIs in a real browser session
- operate desktop-only workflows
- post or publish through apps that require GUI interaction
- handle content or operational tasks on Apple-native tooling

Recommended constraints:

- run on a dedicated Mac execution node, not Dan's main Mac Studio
- keep logs and job histories
- restrict which agents can invoke it directly
- use it as an execution substrate under the existing DansLab company architecture

## 11. Repository and Project Architecture

The workspace is not one project. It is a multi-repo operating environment.

## 11.1 `DansLab`

Type:

- architecture site
- brand and system map

Purpose:

- explain the company
- render `/`, `/lab`, and `/ecosystem`
- encode agents, connections, and workflows as TypeScript data

Key architectural value:

- acts as the visual source of truth for how the company is intended to work

## 11.2 `CrawdBot`

Type:

- autonomous agent workspace
- monitoring and reporting system

Purpose:

- run Memo as an autonomous senior developer
- enforce workspace and security boundaries
- report state to Supabase
- expose status through a Vercel dashboard

Key architectural value:

- most concrete proof of agent operations, restrictions, telemetry, and owner messaging

## 11.2.1 `nervix.ai` in the Repo-Derived Architecture

Type:

- agent orchestration platform

Purpose:

- provide the platform context for David and Nano
- receive, organize, and operationalize specialized agents
- support the company's agent-based expansion model

Architectural value:

- Nervix is the platform where the agent company logic becomes structured and reusable
- it is the most direct platform expression of David's orchestration role

## 11.3 `mywork-ai`

Type:

- AI development framework

Purpose:

- help users build projects faster
- provide templates, AI generation, review, and deployment commands
- integrate GSD, automation, and marketplace paths

Architectural value:

- defines the builder experience and framework-side product strategy

## 11.4 `MyWork-Framework`

Type:

- unified framework and orchestration platform

Purpose:

- combine project orchestration, autonomous coding, and workflow automation
- provide tools users keep, improve, and use to build products
- support the loop of clone -> build -> sell -> earn

Architectural value:

- core methodology repo
- ties framework, Brain, and Marketplace into one system

## 11.5 `Marketplace`

Type:

- monetization platform

Purpose:

- allow builders to list and sell production-ready projects
- handle listings, search, payments, reviews, and subscriptions
- apply platform fee economics

Tech stack from README:

- Next.js 14
- TypeScript
- Tailwind
- FastAPI
- PostgreSQL via Supabase
- Clerk
- Stripe Connect
- Pinecone
- Vercel + Railway

Architectural value:

- converts internal build capability into external revenue

## 11.6 `the-brain-platform`

Type:

- marketplace plus module platform vision

Purpose:

- define an installable platform
- provide instant-deploy modules
- monetize builder output with a 10% commission model
- provide subscribers with a high-value module library

Architectural value:

- describes the broadest commercial form of the DansLab ecosystem

## 11.7 `memo-bot`

Type:

- project orchestration bot concept

Purpose:

- define Memo as an AI senior developer and project orchestrator
- connect planning, execution, testing, and delivery
- position Memo on top of MyWork Framework and Claude CLI-style generation

Architectural value:

- expands the conceptual role of Memo beyond the stricter `CrawdBot` implementation

## 11.8 `molt-bot-seven`

Type:

- dashboard design and control-plane concept

Purpose:

- define the monitoring dashboard, provider strategy, cost optimization, and tools status model

Architectural value:

- documents how the dashboard and provider stack should function economically and operationally

## 11.9 `Listed-Projects/SportsAI`

Type:

- product/example project

Purpose:

- sports trading intelligence
- arbitrage detection
- long-running autonomous coding pattern

Architectural value:

- shows how autonomous coding, UI monitoring, and feature-managed sessions can be productized

## 12. Team Responsibilities Matrix

| Team Layer | Primary owner | Responsibility |
|---|---|---|
| Strategy | Dan | Direction, taste, business priority, approval |
| Orchestration | David | Delegation, routing, sequencing, ecosystem coordination |
| Product domain execution | Dexter, Nano, Memo, Sienna | Specialized output in creator tools, agent creation, framework building, trading |
| Internal specialist execution | OpenClaw team | Research, build, review, automation, ops, moderation, amplification |
| Monitoring and repair | Monitor, Doctor | Health, incidents, diagnostics |
| Delivery and source control | GitHub, Vercel, Pope, AutoForge | Code flow, validation, deployment |
| Memory and learning | Vector, Learning, Model, GSD | Capture, optimize, structure, improve |
| Business systems | Stripe, Marketplace, Brain Platform | Revenue, subscriptions, product distribution |
| Communications | Slack, Telegram, Discord, KiloClaw, KimiClaw, ManusClaw | Signal routing, updates, moderation, amplification |

## 13. Evidence vs Representation

This is the most important governance note in the entire document.

### 13.1 What Is Strongly Implemented in the Local Workspace

- `DansLab` public architecture site
- `CrawdBot` monitored agent implementation
- Supabase-backed reporting model
- local file-based message bridge
- agent status/activity/task telemetry pattern
- security and workspace boundaries for Memo
- framework and marketplace documentation for a larger product/business system

### 13.2 What Is Represented Architecturally But Not Fully Proven Here

- full multi-agent production runtime for David, Dexter, Nano, and Sienna
- live OpenClaw runtime mesh for all specialist agents
- complete always-on channel automation across Telegram, Slack, and Discord
- complete company-wide control plane spanning every named support system

### 13.3 Correct Interpretation

The correct professional reading is:

- the repositories show a real emerging agent company architecture
- some core pieces are implemented and working
- some pieces are documented as design targets or represented in the architecture UI
- the whole system should be described as a hybrid of implemented infrastructure and explicit future-state operating model

That framing is more credible than claiming every node in `DansLab` already exists as a full production service.

## 14. End-to-End Company Narrative

The entire DansLab system works like this:

Dan runs the company from a Mac Studio. That machine is the practical hub. David is the main orchestrator connected to Dan and to the remote or isolated execution agents. Dexter handles creator and YouTube tool work. Nano creates specialized agents and expands the ecosystem. Memo builds framework and engineering systems and is the most operationally proven agent in the workspace. Sienna owns the trading and crypto lane.

Under David, the OpenClaw team provides internal specialist labor. OpenClaw-02 researches, OpenClaw-01 builds, OpenClaw-03 reviews, OpenClaw-04 automates, ManusClaw finishes operations, KiloClaw moderates communication signal, and KimiClaw amplifies results into channels and business visibility.

Around them sit the support systems: monitoring, diagnostics, GitHub, Vercel, vector memory, learning, model optimization, SSH connectivity, database, and payments. Together, those systems form the company substrate.

The repos then map onto that company:

- `DansLab` explains the lab
- `CrawdBot` proves monitored autonomous work
- `Nervix` is the internal agent platform most closely tied to David and Nano
- `MyWork` provides the build framework
- `Marketplace` and `The Brain Platform` describe revenue and distribution
- project repos and examples show what the framework is meant to produce and sell

That is the complete intended architecture: a founder-led AI company where orchestration, specialization, observability, security, monetization, and learning are all treated as first-class system components.

## 15. Recommended Use of This Document

This document should be used as:

- the current company architecture reference
- the onboarding document for collaborators
- the source text for future `/architecture` or internal docs pages
- the baseline for gap analysis between intended and implemented systems

## 16. Next Documentation Targets

After this file, the clean next documents would be:

1. `AGENT_OPERATING_PROTOCOL.md`
   Exact operating rules per agent.

2. `SECURITY_MODEL.md`
   Formal security boundaries, trust zones, and credential handling.

3. `PROJECT_CATALOG.md`
   One page per repo or product with status, owner, stack, and deployment state.

4. `IMPLEMENTATION_GAP_ANALYSIS.md`
   Explicit table of what exists, what is partial, and what is still conceptual.
