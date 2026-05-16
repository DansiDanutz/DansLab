export type AgentType = "main" | "support" | "infra" | "channel" | "slack";

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  project?: string;
  projectUrl?: string;
  type: AgentType;
  color: string;
  glow: string;
  initials: string;
  description: string;
}

export const agents: AgentDef[] = [
  // ═══════════════════════════════════════════
  // INFRASTRUCTURE
  // ═══════════════════════════════════════════
  {
    id: "mac-studio",
    name: "Mac Studio",
    role: "Central Hub",
    type: "infra",
    color: "#a1a1aa",
    glow: "rgba(161,161,170,0.4)",
    initials: "MS",
    description: "Dan's Mac Studio — runs David fleet orchestrator, Qwen 3.5 local model, Codex & Claude Code. Redis bridges to Supabase, Vercel, GitHub.",
  },
  {
    id: "dan",
    name: "Dan",
    role: "Human Boss",
    project: "DansLab",
    projectUrl: "https://danslab.vercel.app",
    type: "main",
    color: "#f8fafc",
    glow: "rgba(248,250,252,0.35)",
    initials: "DN",
    description: "Romanian entrepreneur. Commands the fleet via Telegram DM to Dexter. Sets priorities, approves direction, and decides what enters the lab.",
  },

  // ═══════════════════════════════════════════
  // MAIN AGENTS — DigitalOcean Droplets (Frankfurt)
  // ═══════════════════════════════════════════
  {
    id: "david",
    name: "David",
    role: "Fleet Orchestrator",
    project: "nervix.ai",
    projectUrl: "https://nervix.vercel.app",
    type: "main",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    initials: "DV",
    description: "Fleet orchestrator on Mac Studio. Bridges to Supabase, Vercel, GitHub. Monitors all agents fleet-wide. Runs nervix.ai federation.",
  },
  {
    id: "dexter",
    name: "Dexter",
    role: "General Manager",
    project: "crawdbot.com",
    projectUrl: "https://crawdbot.com",
    type: "main",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
    initials: "DX",
    description: "Senior Dev & GM on droplet 46.101.219.116. Claude Opus 4.6. SSH to all agents. Manages CrawdBot, YouTube Platform, CrawBoard (team.crawdbot.com). Runs 24 Nervix nanobots + 14 cron jobs. Dan's primary contact.",
  },
  {
    id: "nano",
    name: "Nano",
    role: "Agent Creator",
    project: "nervix.ai",
    projectUrl: "https://nervix.vercel.app",
    type: "main",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    initials: "NN",
    description: "Founding Orchestrator of Nervix Federation on droplet 157.230.23.158. Creates specialized agents, enrolls them via nervix-cli (npm). Ed25519 auth, capability benchmarking, reputation system.",
  },
  {
    id: "memo",
    name: "Memo",
    role: "Project Manager",
    project: "MyWork-AI",
    projectUrl: "https://pypi.org/project/mywork-ai/",
    type: "main",
    color: "#f97316",
    glow: "rgba(249,115,22,0.4)",
    initials: "MM",
    description: "PM & DevOps on droplet 138.68.86.47. Claude Sonnet 4. Runs 24 n8n automations (localhost:5678). Manages MyWork-AI (72+ CLI commands, PyPI). Hosts purchase-webhook for Stripe → GitHub access.",
  },
  {
    id: "sienna",
    name: "Sienna",
    role: "Crypto Specialist",
    project: "zmarty.me",
    projectUrl: "https://zmarty.me",
    type: "main",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
    initials: "SI",
    description: "Crypto girl on droplet 167.172.187.230. ZAI GLM-4.7 model. Binance API trading. 100+ trading endpoints via zmarty.me. Promotes strategy via sienna-crypto-girl site.",
  },

  // ═══════════════════════════════════════════
  // OPENCLAW AGENTS — Local instances (port 18789)
  // ═══════════════════════════════════════════
  {
    id: "openclaw-1",
    name: "OpenClaw-01",
    role: "Builder",
    type: "support",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    initials: "O1",
    description: "Internal OpenClaw builder. Each agent runs OpenClaw v2026.2.14 locally on ws://127.0.0.1:18789 with Telegram provider, session persistence, and Supabase context.",
  },
  {
    id: "openclaw-2",
    name: "OpenClaw-02",
    role: "Researcher",
    type: "support",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
    initials: "O2",
    description: "Internal OpenClaw researcher for discovery, mapping, design. ClawHub skills marketplace (clawhub.ai/skills) extends capabilities.",
  },
  {
    id: "openclaw-3",
    name: "OpenClaw-03",
    role: "Reviewer",
    type: "support",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    initials: "O3",
    description: "Internal OpenClaw reviewer for QA, edge cases, regression. Reviews PRs on GitHub before Pope runs CI.",
  },
  {
    id: "openclaw-4",
    name: "OpenClaw-04",
    role: "Automation",
    type: "support",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
    initials: "O4",
    description: "Internal OpenClaw automation specialist for glue code, scripts, repetitive tasks. Works with AutoForge for autonomous shipping.",
  },
  {
    id: "manusclaw",
    name: "ManusClaw",
    role: "Operator",
    type: "slack",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    initials: "MC",
    description: "Manus AI operations agent. Runs focused execution loops. Designed Nervix v2 federation architecture. Writes solutions for devops-control-repo.",
  },

  // ═══════════════════════════════════════════
  // COMMUNICATION CHANNELS
  // ═══════════════════════════════════════════
  {
    id: "telegram",
    name: "Telegram",
    role: "Primary Comms",
    type: "channel",
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.4)",
    initials: "TG",
    description: "Primary human-agent channel. Dan DMs Dexter directly. Team Avatars group (chat_id: -1003828031283) syncs Dan + Dexter + Memo + Sienna. All messages stored in Supabase chat_history.",
  },
  {
    id: "slack",
    name: "Slack",
    role: "Team Hub",
    type: "channel",
    color: "#e11d48",
    glow: "rgba(225,29,72,0.4)",
    initials: "SL",
    description: "Team communication hub. KiloClaw moderates, KimiClaw amplifies, ManusClaw drives ops.",
  },
  {
    id: "discord",
    name: "Discord",
    role: "Community",
    type: "channel",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.4)",
    initials: "DC",
    description: "Community channel for users and public updates.",
  },

  // ═══════════════════════════════════════════
  // SLACK AGENTS
  // ═══════════════════════════════════════════
  {
    id: "kiloclaw",
    name: "KiloClaw",
    role: "Moderator",
    type: "slack",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.4)",
    initials: "KC",
    description: "KiloCode agent on Slack — moderates all agents, keeps order, escalates issues to Doctor.",
  },
  {
    id: "kimiclaw",
    name: "KimiClaw",
    role: "Advertiser",
    type: "slack",
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.4)",
    initials: "KM",
    description: "OpenClaw signal amplifier — promotes crawdbot.com, nervix.ai, MyWork-AI, zmarty.me across all channels.",
  },

  // ═══════════════════════════════════════════
  // SUPPORT AGENTS
  // ═══════════════════════════════════════════
  {
    id: "monitor",
    name: "DansLabMonitor",
    role: "System Monitor",
    type: "support",
    color: "#eab308",
    glow: "rgba(234,179,8,0.3)",
    initials: "MO",
    description: "Monitors everything. 14 crons on Dexter's droplet: droplet stats → Supabase every 30min, GPU auto-stop, secret scanner, daily summaries at 23:55 UTC.",
  },
  {
    id: "vercel",
    name: "DansLabVercel",
    role: "Deployments",
    type: "support",
    color: "#f5f5f5",
    glow: "rgba(245,245,245,0.3)",
    initials: "VC",
    description: "Manages Vercel deployments: CrawdBot, CrawBoard, Nervix, YouTube Platform, OpenClaw Key Manager, DansLab. All on free tier.",
  },
  {
    id: "github",
    name: "DansLabGithub",
    role: "Code Organization",
    type: "support",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.3)",
    initials: "GH",
    description: "60+ repos organized. Agent workspaces (david/dexter/nano/sienna/memo-workspace), agent configs (agent-dexter/sienna/memo), Nervix microservices, product repos.",
  },
  {
    id: "pope",
    name: "ThePopeBot",
    role: "Async Worker",
    type: "support",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.3)",
    initials: "PP",
    description: "Autonomous GitHub Actions worker. Separate workers for Dexter, Nano, Memo (popebot-worker-*). Docker agents create branches, code in containers, submit PRs. Cron + webhook triggers.",
  },
  {
    id: "autoforge",
    name: "DansLabAutoForge",
    role: "Auto Coder",
    type: "support",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.3)",
    initials: "AF",
    description: "Autonomous coding agent — writes, refactors, ships code. Uses GSD framework for structured execution.",
  },
  {
    id: "gsd",
    name: "DansLabGSD",
    role: "GSD Framework",
    type: "support",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.3)",
    initials: "GS",
    description: "GSD Framework — structured task execution used by AutoForge, Pope, OpenClaw agents, and all coding workflows.",
  },
  {
    id: "vector",
    name: "DansLabVector",
    role: "Vector Memory",
    type: "support",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.3)",
    initials: "VE",
    description: "Vector memory. All agents load team context on startup via memory_manager.py and context_manager.py. Stores agent_context + daily_summaries in Supabase.",
  },
  {
    id: "update",
    name: "DansLabUpdate",
    role: "Version Manager",
    type: "support",
    color: "#2dd4bf",
    glow: "rgba(45,212,191,0.3)",
    initials: "UP",
    description: "Updates all tools: OpenClaw v2026.2.14, Claude Code, Codex, AutoForge, GSD, nervix-cli. Runs from devops-control-repo daily audit cycle.",
  },
  {
    id: "model",
    name: "DansLabModel",
    role: "LLM Optimizer",
    type: "support",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.3)",
    initials: "ML",
    description: "Manages model fallback chains: Opus→Sonnet→GPT-4.1→Gemini Flash→ZAI (main), Gemini Flash→Sonnet→Opus (sub-agents), Gemini Flash→Haiku (crons). 7+ providers: Anthropic, OpenRouter, DeepSeek, Z.AI, Google, OpenAI.",
  },
  {
    id: "doctor",
    name: "DansLabDoctor",
    role: "System Fixer",
    type: "support",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.3)",
    initials: "DR",
    description: "Fixes everything. Runs devops-control-repo scripts/audit.sh daily. Checks solutions/ folder from Manus AI. Executes repairs, updates status.md per agent.",
  },
  {
    id: "learning",
    name: "DansLabLearning",
    role: "Auto Learner",
    type: "support",
    color: "#a3e635",
    glow: "rgba(163,230,53,0.3)",
    initials: "LN",
    description: "Auto-learns from previous day. Daily summaries generated at 23:55 UTC → stored in Supabase daily_summaries table. Feeds patterns to Model and Vector.",
  },
  {
    id: "stripe",
    name: "DansLabStripe",
    role: "Payments",
    type: "support",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    initials: "ST",
    description: "Stripe integration for CrawBoard billing (Pro/Team/Enterprise plans). purchase-webhook on Memo's droplet auto-grants GitHub repo access on purchase.",
  },
  {
    id: "ssh",
    name: "DansLabSSH",
    role: "Connections",
    type: "support",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
    initials: "SH",
    description: "Cross-droplet SSH mesh via ed25519 keys. Dexter↔Memo, Dexter↔Sienna, Sienna→Nano, Memo→Dexter (emergency). Managed by devops-control-repo.",
  },
  {
    id: "supabase",
    name: "DansLabSupabase",
    role: "Database",
    type: "support",
    color: "#34d399",
    glow: "rgba(52,211,153,0.3)",
    initials: "SB",
    description: "Two Supabase instances: MoltBot DB (30+ tables: chat_history, daily_summaries, agent_context, tasks, video pipeline) used by all agents. Nervix DB (agents, tasks, escrow) for the federation.",
  },
];

export const agentMap = new Map(agents.map((a) => [a.id, a]));
