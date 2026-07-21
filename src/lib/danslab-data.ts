// DansLab — canonical agent + product data
// Ported from design-system data.jsx

export type AgentStatus = "online" | "busy" | "trading" | "thinking" | "idle" | "off";
export type AgentType = "main" | "support" | "slack";

export type Agent = {
  id: string;
  name: string;
  role: string;
  type: AgentType;
  color: string;
  initials: string;
  status: AgentStatus;
  desc: string;
  project?: string;
  product?: string;
  droplet?: string;
  model?: string;
};

export type Product = {
  id: string;
  name: string;
  lead: string;
  desc: string;
  color: string;
  href: string;
  kpi: string;
};

export type ActivityItem = {
  t: number;
  agent: string;
  verb: string;
  target: string;
  icon: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
  sub: string;
};

export const AGENTS: Agent[] = [
  // MAIN AGENTS — main droplet operators
  { id: "dexter", name: "Dexter", role: "General Manager", type: "main", color: "#3b82f6", initials: "DX", project: "crawdbot.com", product: "CrawdBot", droplet: "46.101.•.•", model: "Claude Opus 4.6", status: "online",
    desc: "Senior Dev & GM. SSH to all agents. Manages CrawdBot, YouTube Platform, CrawBoard. Runs 24 Nervix nanobots + 14 cron jobs. Dan's primary contact." },
  { id: "david", name: "David", role: "Fleet Orchestrator", type: "main", color: "#22c55e", initials: "DV", project: "nervix.ai", product: "Nervix", droplet: "Mac Studio", model: "Qwen 3.5 (local)", status: "online",
    desc: "Mac Studio OpenClaw. Receives the mission from the Bosses and orchestrates the entire company hand-in-hand with Hermes. Bridges Supabase, Vercel, GitHub. Watches every agent fleet-wide. Runs the nervix.ai federation." },
  { id: "nano", name: "Nano", role: "Agent Creator", type: "main", color: "#a855f7", initials: "NN", project: "nervix.ai", product: "Nervix", droplet: "157.230.•.•", model: "Claude Sonnet 4", status: "busy",
    desc: "Founding Orchestrator of Nervix Federation. Creates specialized agents, enrolls them via nervix-cli. Ed25519 auth, reputation system." },
  { id: "memo", name: "Memo", role: "Project Manager", type: "main", color: "#f97316", initials: "MM", project: "MyWork-AI", product: "MyWork-AI", droplet: "138.68.•.•", model: "Claude Sonnet 4", status: "online",
    desc: "PM & DevOps. Runs 24 n8n automations (localhost:5678). Manages MyWork-AI (72+ CLI commands, PyPI). Hosts purchase-webhook for Stripe → GitHub." },
  { id: "sienna", name: "Sienna", role: "Crypto Specialist", type: "main", color: "#ec4899", initials: "SI", project: "zmarty.me", product: "zmarty", droplet: "167.172.•.•", model: "ZAI GLM-4.7", status: "trading",
    desc: "Crypto girl. Binance API trading. 100+ trading endpoints via zmarty.me. Promotes strategy via sienna-crypto-girl site." },

  // HERMES — the brain
  { id: "hermes", name: "Hermes", role: "The Brain", type: "main", color: "#d4a017", initials: "HM", project: "danslab", product: "Hermes", droplet: "Mac Studio", model: "Claude Opus 4.6", status: "thinking",
    desc: "The brain of DansLab. Reasoning layer above the fleet — routes intent, holds long-term context, scribes every war room. Loads full Vector Memory on every call." },

  // CLAW SUPPORT AGENTS
  { id: "openclaw-1", name: "OpenClaw-01", role: "Builder", type: "support", color: "#60a5fa", initials: "O1", status: "online",
    desc: "Internal Claw builder. Runs v2026.2.14 locally on ws://127.0.0.1:18789 with Telegram provider, Supabase context." },
  { id: "openclaw-2", name: "OpenClaw-02", role: "Researcher", type: "support", color: "#c084fc", initials: "O2", status: "idle",
    desc: "OpenClaw researcher — discovery, mapping, design. ClawHub skills marketplace extends capabilities." },
  { id: "openclaw-3", name: "OpenClaw-03", role: "Reviewer", type: "support", color: "#f472b6", initials: "O3", status: "online",
    desc: "OpenClaw reviewer — QA, edge cases, regression. Reviews PRs on GitHub before Pope runs CI." },
  { id: "openclaw-4", name: "OpenClaw-04", role: "Automation", type: "support", color: "#38bdf8", initials: "O4", status: "busy",
    desc: "OpenClaw automation specialist — glue code, scripts, repetitive tasks. Works with AutoForge for autonomous shipping." },
  { id: "manusclaw", name: "ManusClaw", role: "Operator", type: "slack", color: "#f59e0b", initials: "MC", status: "online",
    desc: "Manus AI operations agent. Runs focused execution loops. Designed Nervix v2 federation architecture." },
  { id: "kiloclaw", name: "KiloClaw", role: "Moderator", type: "slack", color: "#f43f5e", initials: "KC", status: "online",
    desc: "KiloCode agent on Slack — moderates all agents, keeps order, escalates issues to Doctor." },
  { id: "kimiclaw", name: "KimiClaw", role: "Advertiser", type: "slack", color: "#14b8a6", initials: "KM", status: "online",
    desc: "OpenClaw signal amplifier — promotes crawdbot.com, nervix.ai, MyWork-AI, zmarty.me across all channels." },

  // INFRASTRUCTURE / SUPPORT
  { id: "monitor", name: "DansLabMonitor", role: "System Monitor", type: "support", color: "#eab308", initials: "MO", status: "online",
    desc: "14 crons on Dexter's droplet: droplet stats → Supabase every 30min, GPU auto-stop, secret scanner, daily summaries at 23:55 UTC." },
  { id: "vercel", name: "DansLabVercel", role: "Deployments", type: "support", color: "#f5f5f5", initials: "VC", status: "online",
    desc: "Manages Vercel deployments: CrawdBot, CrawBoard, Nervix, YouTube Platform, OpenClaw Key Manager, DansLab." },
  { id: "github", name: "DansLabGithub", role: "Code Org", type: "support", color: "#c084fc", initials: "GH", status: "online",
    desc: "60+ repos organized. Agent workspaces, agent configs, Nervix microservices, product repos." },
  { id: "pope", name: "ThePopeBot", role: "Async Worker", type: "support", color: "#fb923c", initials: "PP", status: "busy",
    desc: "Autonomous GitHub Actions worker. Docker agents create branches, code in containers, submit PRs. Cron + webhook triggers." },
  { id: "autoforge", name: "DansLabAutoForge", role: "Auto Coder", type: "support", color: "#38bdf8", initials: "AF", status: "busy",
    desc: "Autonomous coding agent — writes, refactors, ships code. Uses GSD framework for structured execution." },
  { id: "gsd", name: "DansLabGSD", role: "GSD Framework", type: "support", color: "#4ade80", initials: "GS", status: "online",
    desc: "GSD Framework — structured task execution used by AutoForge, Pope, OpenClaw agents." },
  { id: "vector", name: "DansLabVector", role: "Vector Memory", type: "support", color: "#818cf8", initials: "VE", status: "online",
    desc: "All agents load team context on startup. Stores agent_context + daily_summaries in Supabase." },
  { id: "update", name: "DansLabUpdate", role: "Version Manager", type: "support", color: "#2dd4bf", initials: "UP", status: "idle",
    desc: "Updates all tools: OpenClaw v2026.2.14, Claude Code, Codex, AutoForge, GSD, nervix-cli." },
  { id: "model", name: "DansLabModel", role: "LLM Optimizer", type: "support", color: "#f472b6", initials: "ML", status: "online",
    desc: "Manages model fallback chains. 7+ providers: Anthropic, OpenRouter, DeepSeek, Z.AI, Google, OpenAI." },
  { id: "doctor", name: "DansLabDoctor", role: "System Fixer", type: "support", color: "#ef4444", initials: "DR", status: "online",
    desc: "Runs devops-control-repo scripts/audit.sh daily. Checks solutions/ folder from Manus AI. Executes repairs." },
  { id: "learning", name: "DansLabLearning", role: "Auto Learner", type: "support", color: "#a3e635", initials: "LN", status: "idle",
    desc: "Auto-learns from previous day. Daily summaries generated at 23:55 UTC → Supabase daily_summaries." },
  { id: "stripe", name: "DansLabStripe", role: "Payments", type: "support", color: "#8b5cf6", initials: "ST", status: "online",
    desc: "Stripe integration for CrawBoard billing (Pro/Team/Enterprise). purchase-webhook auto-grants GitHub repo access." },
  { id: "ssh", name: "DansLabSSH", role: "Connections", type: "support", color: "#06b6d4", initials: "SH", status: "online",
    desc: "Cross-droplet SSH mesh via ed25519 keys. Dexter↔Memo, Dexter↔Sienna, Sienna→Nano, Memo→Dexter." },
  { id: "supabase", name: "DansLabSupabase", role: "Database", type: "support", color: "#34d399", initials: "SB", status: "online",
    desc: "Two Supabase instances: MoltBot DB (30+ tables) used by all agents. Nervix DB (agents, tasks, escrow)." },
];

// ⚠️ CONFIRM before merge: Dan's real channel URL (14k subs). Placeholder handle below.
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DansLab";

export const PRODUCTS: Product[] = [
  { id: "nervix", name: "nervix.ai", lead: "David", desc: "Agent federation & marketplace · YouTube Studio", color: "#c0392b", href: "https://nervix.ai", kpi: "247 agents enrolled" },
  { id: "crawdbot", name: "crawdbot.com", lead: "Dexter", desc: "YouTube automation suite", color: "#d4a017", href: "https://crawdbot.com", kpi: "12.4k videos processed" },
  { id: "youtube", name: "DansLab on YouTube", lead: "Dan", desc: "The lab's channel — fleet builds, agent ops, AI automation in public", color: "#c0392b", href: YOUTUBE_CHANNEL_URL, kpi: "14k subscribers" },
  { id: "mywork", name: "MyWork-AI", lead: "Memo", desc: "Build & ship platform", color: "#c0392b", href: "#", kpi: "72 CLI commands · PyPI" },
  { id: "zmarty", name: "zmarty.me", lead: "Sienna", desc: "Crypto trading signals", color: "#d4a017", href: "#", kpi: "96.2% win rate" },
  { id: "semeclaw", name: "SemeClaw", lead: "Dan", desc: "War-room protocol · where decisions get signed", color: "#c0392b", href: "/semeclaw", kpi: "Always lobsters" },
];

export const ACTIVITY: ActivityItem[] = [
  { t: 2, agent: "dexter", verb: "shipped", target: "CrawdBot v2.14 → Vercel", icon: "↗" },
  { t: 5, agent: "sienna", verb: "opened", target: "BTC/USDT long · +2.3%", icon: "$" },
  { t: 8, agent: "pope", verb: "merged", target: "PR #1183 · nervix-cli", icon: "⌥" },
  { t: 11, agent: "memo", verb: "ran", target: "n8n · weekly-digest cron", icon: "↻" },
  { t: 14, agent: "nano", verb: "enrolled", target: "agent moltbot-47 · ed25519", icon: "+" },
  { t: 17, agent: "doctor", verb: "patched", target: "SSH mesh · memo↔sienna key rot.", icon: "⚕" },
  { t: 22, agent: "openclaw-2", verb: "indexed", target: "42 competitor landing pages", icon: "⊙" },
  { t: 26, agent: "autoforge", verb: "drafted", target: "YouTube-Studio · captions API", icon: "✎" },
  { t: 31, agent: "learning", verb: "summarized", target: "23:55 UTC daily · 1.4k tokens", icon: "☼" },
  { t: 38, agent: "stripe", verb: "granted", target: "GitHub access · CrawBoard Team", icon: "◆" },
];

export const STATS: Stat[] = [
  { label: "Active agents", value: 30, suffix: "+", sub: "across 5 droplets" },
  { label: "Products live", value: 6, suffix: "", sub: "5 on Vercel + YouTube" },
  { label: "Cron jobs", value: 38, suffix: "/day", sub: "14 Dexter · 24 Memo" },
  { label: "Uptime", value: 99.94, suffix: "%", sub: "last 30 days" },
];

// Avatars available as real photos in /public/avatars
export const AVATAR_PATHS: Record<string, string> = {
  dan: "/avatars/dan.jpg",
  dexter: "/avatars/dexter.jpg",
  memo: "/avatars/memo.jpg",
  sienna: "/avatars/sienna.jpg",
};
