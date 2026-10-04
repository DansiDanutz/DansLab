// DansLab — canonical agent + product data
// Facts here must be verifiable: live sites, public repos, or the company
// operating docs (DANSLAB-OS.md / SYSTEM.md). Do not add unsourced metrics.

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
  core?: boolean;
  project?: string;
  product?: string;
  droplet?: string;
  model?: string;
};

export type ProductTier = "flagship" | "shipping" | "lab" | "audited";

export type Product = {
  id: string;
  name: string;
  tier: ProductTier;
  lead: string;
  desc: string;
  color: string;
  href: string;
  docs?: string;
  audited?: boolean;
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
  // CORE CREW — the eight agents that run the company (DANSLAB-OS §1)
  { id: "david", name: "David", role: "Fleet Orchestrator", type: "main", color: "#22c55e", initials: "DV", core: true, project: "nervix.ai", product: "Nervix", droplet: "Mac Studio", status: "online",
    desc: "Runs on the Mac Studio. Receives the mission from Dan, assigns work, verifies evidence, and closes or escalates every issue. Bridges Supabase, Vercel and GitHub, and watches the whole fleet." },
  { id: "hermes", name: "Hermes", role: "The Brain", type: "main", color: "#d4a017", initials: "HM", core: true, project: "danslab", product: "Hermes", droplet: "Mac Studio", status: "thinking",
    desc: "The reasoning layer above the fleet. Scopes the day's work each morning, holds long-term context, and runs the weekly strategy review." },
  { id: "dexter", name: "Dexter", role: "Backend & DevOps Lead", type: "main", color: "#3b82f6", initials: "DX", core: true, project: "nervix.ai", product: "Nervix", droplet: "46.101.•.•", status: "online",
    desc: "Senior developer and general manager. Owns the Nervix backend, CrawdBot and deployments. Runs the nanobots and cron jobs on his droplet and is Dan's primary contact." },
  { id: "nano", name: "Nano", role: "Agent Supply", type: "main", color: "#a855f7", initials: "NN", core: true, project: "nervix.ai", product: "Nervix", droplet: "157.230.•.•", status: "busy",
    desc: "Founding orchestrator of the Nervix federation. Creates specialised agents, enrolls them through nervix-cli, and manages onboarding, Ed25519 identity and reputation." },
  { id: "memo", name: "Memo", role: "Project Manager", type: "main", color: "#f97316", initials: "MM", core: true, project: "MyWork-AI", product: "MyWork-AI", droplet: "138.68.•.•", status: "online",
    desc: "Project manager and DevOps. Runs the n8n automations and maintains MyWork-AI, the build-and-ship CLI published on PyPI. Hosts the Stripe purchase webhook." },
  { id: "sienna", name: "Sienna", role: "Crypto Specialist", type: "main", color: "#ec4899", initials: "SI", core: true, project: "zmarty.me", product: "zmarty", droplet: "167.172.•.•", status: "trading",
    desc: "Owns Zmarty — crypto market intelligence and trading signals. Works the Zmarty API and promotes the strategy publicly." },
  { id: "doctor", name: "DansLabDoctor", role: "Health & Auto-Repair", type: "support", color: "#ef4444", initials: "DR", core: true, status: "online",
    desc: "Owns the watchdog. Checks infrastructure every 15 minutes, restarts stuck agents, and runs the daily audit. Humans only hear about what auto-repair could not fix." },
  { id: "finance", name: "Finance", role: "Cost & Revenue", type: "support", color: "#eab308", initials: "FN", core: true, status: "online",
    desc: "Tracks what the lab spends and what it earns, and reports a daily spend and revenue line. The number has to be real, not zero." },

  // CLAW SUPPORT AGENTS
  { id: "openclaw-1", name: "OpenClaw-01", role: "Builder", type: "support", color: "#60a5fa", initials: "O1", status: "online",
    desc: "Internal Claw builder running against the OpenClaw gateway with Telegram and Supabase context." },
  { id: "openclaw-2", name: "OpenClaw-02", role: "Researcher", type: "support", color: "#c084fc", initials: "O2", status: "idle",
    desc: "OpenClaw researcher — discovery, mapping, design. ClawHub skills extend capabilities." },
  { id: "openclaw-3", name: "OpenClaw-03", role: "Reviewer", type: "support", color: "#f472b6", initials: "O3", status: "online",
    desc: "OpenClaw reviewer — QA, edge cases, regression. Reviews PRs on GitHub before CI." },
  { id: "openclaw-4", name: "OpenClaw-04", role: "Automation", type: "support", color: "#38bdf8", initials: "O4", status: "busy",
    desc: "OpenClaw automation specialist — glue code, scripts, repetitive tasks." },
  { id: "manusclaw", name: "ManusClaw", role: "Operator", type: "slack", color: "#f59e0b", initials: "MC", status: "online",
    desc: "Manus AI operations agent. Runs focused execution loops. Designed the Nervix v2 federation architecture." },
  { id: "kiloclaw", name: "KiloClaw", role: "Moderator", type: "slack", color: "#f43f5e", initials: "KC", status: "online",
    desc: "KiloCode agent on Slack — moderates the agents, keeps order, escalates issues to Doctor." },
  { id: "kimiclaw", name: "KimiClaw", role: "Advertiser", type: "slack", color: "#14b8a6", initials: "KM", status: "online",
    desc: "OpenClaw signal amplifier — promotes the lab's products across channels." },

  // INFRASTRUCTURE / SUPPORT
  { id: "monitor", name: "DansLabMonitor", role: "System Monitor", type: "support", color: "#eab308", initials: "MO", status: "online",
    desc: "Scheduled health telemetry: droplet stats to Supabase, GPU auto-stop, secret scanner, and daily summaries." },
  { id: "vercel", name: "DansLabVercel", role: "Deployments", type: "support", color: "#f5f5f5", initials: "VC", status: "online",
    desc: "Manages Vercel deployments across the lab's products." },
  { id: "github", name: "DansLabGithub", role: "Code Org", type: "support", color: "#c084fc", initials: "GH", status: "online",
    desc: "Keeps repositories organised: agent workspaces, configs, microservices and product repos." },
  { id: "pope", name: "ThePopeBot", role: "Async Worker", type: "support", color: "#fb923c", initials: "PP", status: "busy",
    desc: "Autonomous GitHub Actions worker. Docker agents create branches, code in containers, and submit PRs." },
  { id: "autoforge", name: "DansLabAutoForge", role: "Auto Coder", type: "support", color: "#38bdf8", initials: "AF", status: "busy",
    desc: "Autonomous coding agent — writes, refactors, ships code using the GSD framework." },
  { id: "gsd", name: "DansLabGSD", role: "GSD Framework", type: "support", color: "#4ade80", initials: "GS", status: "online",
    desc: "Structured task execution: reads milestones, breaks them into tasks, and dispatches them to the agents." },
  { id: "vector", name: "DansLabVector", role: "Vector Memory", type: "support", color: "#818cf8", initials: "VE", status: "online",
    desc: "Team memory. Agents load shared context on startup from agent_context and daily_summaries in Supabase." },
  { id: "model", name: "DansLabModel", role: "LLM Router", type: "support", color: "#f472b6", initials: "ML", status: "online",
    desc: "Manages model routing and fallback chains across providers so the cheapest capable model does each job." },
  { id: "learning", name: "DansLabLearning", role: "Auto Learner", type: "support", color: "#a3e635", initials: "LN", status: "idle",
    desc: "Learns from the previous day. Daily summaries are written to Supabase each night." },
  { id: "stripe", name: "DansLabStripe", role: "Payments", type: "support", color: "#8b5cf6", initials: "ST", status: "online",
    desc: "Stripe integration for billing. The purchase webhook grants GitHub repo access automatically." },
  { id: "ssh", name: "DansLabSSH", role: "Connections", type: "support", color: "#06b6d4", initials: "SH", status: "online",
    desc: "Cross-droplet connectivity over ed25519 keys and the private tailnet." },
  { id: "supabase", name: "DansLabSupabase", role: "Database", type: "support", color: "#34d399", initials: "SB", status: "online",
    desc: "The lab's shared databases: one for the agents' working memory, one for the Nervix federation." },
];

export const CORE_AGENT_ORDER = ["david", "hermes", "dexter", "nano", "memo", "sienna", "doctor", "finance"] as const;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DansLab-WorldCup";

export const PRODUCTS: Product[] = [
  // FLAGSHIP — production-ready
  { id: "nervix", name: "Nervix", tier: "flagship", lead: "David", desc: "The global federation layer for AI agents. Enroll agents, trade tasks, build reputation, and settle on TON.", color: "#c0392b", href: "https://nervix.ai", docs: "/docs/nervix", kpi: "Agent marketplace · TON settlement" },
  { id: "nervixpay", name: "NervixPay", tier: "flagship", lead: "Dexter", desc: "Accept crypto payments as easily as a QR code. Non-custodial checkout for merchants and AI agents.", color: "#d4a017", href: "https://nervixpay.vercel.app", docs: "/docs/nervixpay", kpi: "Polygon · Ethereum · BNB Chain" },
  { id: "youtubestudio", name: "YouTube Studio", tier: "flagship", lead: "Dan", desc: "The AI video production pipeline behind our channel — from research to final render.", color: "#c0392b", href: "/docs/youtubestudio", docs: "/docs/youtubestudio", kpi: "10-step pipeline" },
  { id: "fakereal", name: "Fake / Real", tier: "flagship", lead: "Dan", desc: "Paste a link. JEV audits the evidence and returns REAL or FAKE with cited sources and clear limits.", color: "#d4a017", href: "https://www.fake-real.live", docs: "/docs/fakereal", kpi: "3 free checks a day" },
  { id: "semeclaw", name: "SemeClaw", tier: "flagship", lead: "Dan", desc: "The war-room protocol — multi-agent meetings where decisions get signed and written back to source.", color: "#c0392b", href: "/semeclaw", docs: "/docs/semeclaw", kpi: "Multi-agent meetings" },

  // SHIPPING — live and in use
  { id: "zmarty", name: "Zmarty", tier: "shipping", lead: "Sienna", desc: "Crypto market intelligence and trading signals, served through an API.", color: "#d4a017", href: "https://zmarty.me", docs: "/docs/zmarty", kpi: "Signals · API · membership" },
  { id: "crawdbot", name: "CrawdBot", tier: "shipping", lead: "Dexter", desc: "Custom AI tools built on the OpenClaw platform.", color: "#d4a017", href: "https://crawdbot.com", docs: "/docs/crawdbot", audited: true, kpi: "Built on OpenClaw" },
  { id: "mywork", name: "MyWork-AI", tier: "shipping", lead: "Memo", desc: "Build, ship and sell software products from one CLI.", color: "#c0392b", href: "https://pypi.org/project/mywork-ai/", docs: "/docs/mywork", kpi: "pip install mywork-ai" },
  { id: "youtube", name: "WorldCup Central", tier: "shipping", lead: "Dan", desc: "Our YouTube channel — AI World Cup 2026 simulations, football legends and impossible matchups.", color: "#c0392b", href: YOUTUBE_CHANNEL_URL, docs: "/docs/youtube", kpi: "Live channel" },
  { id: "worldcup", name: "WorldCup26 Cards", tier: "shipping", lead: "Dan", desc: "Free collectible legend cards. Watch the story, unlock the card.", color: "#d4a017", href: "https://worldcup26.world", docs: "/docs/worldcup", audited: true, kpi: "Free to play" },

  // LAB — smaller builds and experiments
  { id: "reality", name: "Reality", tier: "lab", lead: "Dan", desc: "A life simulation on a living 3D Earth.", color: "#c0392b", href: "https://reality-gamma.vercel.app", kpi: "3D life sim" },
  { id: "dailystock", name: "DailyStock", tier: "lab", lead: "Sienna", desc: "Daily stock and crypto decision cards. Educational only.", color: "#d4a017", href: "https://dailystock-cyan.vercel.app", audited: true, kpi: "Decision dashboard" },
  { id: "neverdie", name: "NeverDie", tier: "lab", lead: "Dan", desc: "A second brain and digital-immortality vault.", color: "#d4a017", href: "https://github.com/DansiDanutz/NeverDieFable", docs: "/docs/neverdie", kpi: "Open source" },
  { id: "dansemenescu", name: "Dan Semenescu", tier: "lab", lead: "Dan", desc: "The founder's personal site.", color: "#c0392b", href: "https://dansemenescu.vercel.app", docs: "/docs/dansemenescu", audited: true, kpi: "Founder site" },

  // AUDITED — production apps verified by RepoAudit; shown in the collapsed verified-apps list
  { id: "danslab", name: "DansLab", tier: "audited", lead: "David", desc: "This site: fleet architecture and the audit surface.", color: "#c0392b", href: "https://danslab.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "repoaudit", name: "RepoAudit", tier: "audited", lead: "Dan", desc: "The fleet audit control plane and source of truth for what is verified.", color: "#22c55e", href: "https://repoaudit.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "crawboard", name: "CrawBoard", tier: "audited", lead: "Dexter", desc: "Creator operations dashboard.", color: "#3b82f6", href: "https://team.crawdbot.com", audited: true, kpi: "RepoAudit verified" },
  { id: "marketplace", name: "MyWork Marketplace", tier: "audited", lead: "Memo", desc: "Build and ship marketplace.", color: "#c0392b", href: "https://my-work-ai.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "zmartrise", name: "ZmartRise", tier: "audited", lead: "Sienna", desc: "AI-powered market intelligence.", color: "#d4a017", href: "https://www.zmartrise.ai", audited: true, kpi: "RepoAudit verified" },
  { id: "pokerclubcluj", name: "Poker Club Cluj", tier: "audited", lead: "Dan", desc: "Public civic campaign and memo hub.", color: "#3b82f6", href: "https://poker-club-cluj.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "pokercluj", name: "PokerCluj", tier: "audited", lead: "Dan", desc: "Poker Cluj public deployment.", color: "#60a5fa", href: "https://pokercluj.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "pokeragent", name: "PokerAgent", tier: "audited", lead: "Dan", desc: "AI-assisted poker player and agent management platform with a built-in odds calculator.", color: "#a855f7", href: "https://poker-agent-flax.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "adsemeclaw", name: "Ad-SemeClaw", tier: "audited", lead: "Dan", desc: "SemeClaw ad campaign surface.", color: "#c0392b", href: "https://ad-semeclaw.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "danslabvideo", name: "DansLab Video", tier: "audited", lead: "Dan", desc: "Video pipeline public surface.", color: "#ec4899", href: "https://danslab-video.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "livetranslation", name: "LiveTranslation", tier: "audited", lead: "Dan", desc: "Live translation app.", color: "#14b8a6", href: "https://live-translation-eight.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "danmatei", name: "Dan Matei", tier: "audited", lead: "Dan", desc: "Dan Matei public site.", color: "#22c55e", href: "https://www.danmatei.ro", audited: true, kpi: "RepoAudit verified" },
  { id: "scoalafotbal", name: "Scoala Fotbal Dan Matei", tier: "audited", lead: "Dan", desc: "Football school public site.", color: "#38bdf8", href: "https://scoala-fotbal-dan-matei.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "game1", name: "Shikaku Quest", tier: "audited", lead: "Dan", desc: "Puzzle game deployment.", color: "#a3e635", href: "https://shikaku-quest-three.vercel.app", audited: true, kpi: "RepoAudit verified" },
  { id: "staticdeployment", name: "Static Deployment", tier: "audited", lead: "Dan", desc: "Static production deployment.", color: "#f59e0b", href: "https://static-deployment-swart.vercel.app", audited: true, kpi: "RepoAudit verified" },
];

export const AUDITED_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.audited);

export const STATS: Stat[] = [
  { label: "Core agents", value: 8, suffix: "", sub: "each with one lane and a daily target" },
  { label: "Machines", value: 5, suffix: "", sub: "a Mac Studio and four droplets" },
  { label: "Live products", value: PRODUCTS.filter((p) => p.tier === "flagship" || p.tier === "shipping").length, suffix: "", sub: "flagship and shipping, all public" },
  { label: "Audited apps", value: AUDITED_PRODUCTS.length, suffix: "", sub: "verified by RepoAudit" },
];

// Avatars available as real photos in /public/avatars
export const AVATAR_PATHS: Record<string, string> = {
  dan: "/avatars/dan.jpg",
  dexter: "/avatars/dexter.jpg",
  memo: "/avatars/memo.jpg",
  sienna: "/avatars/sienna.jpg",
};
