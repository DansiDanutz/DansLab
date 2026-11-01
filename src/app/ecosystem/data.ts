import { AGENTS, type Agent } from "../../lib/danslab-data";

// Ecosystem map data: agents, channels, connections, scenarios and tier layout.

export type EcoAgent = Omit<Agent, "type"> & { type: Agent["type"] | "channel" | "infra" };
export type ConnType = "data" | "ssh" | "deploy" | "monitor" | "comms";
export type Connection = { id: string; from: string; to: string; type: ConnType; label?: string };
export type Tier = { id: string; label: string; caption: string; nodes: string[] };
export type ScenarioStep = { agents: string[]; conns: string[]; line: string };
export type Scenario = { id: string; name: string; glyph: string; desc: string; steps: ScenarioStep[] };

export const CONN_TYPES: Record<ConnType, { color: string; label: string; dash: string }> = {
  data:    { color: "#3b82f6", label: "Data",    dash: "none" },
  ssh:     { color: "#22c55e", label: "SSH",     dash: "4 3"  },
  deploy:  { color: "#f97316", label: "Deploy",  dash: "none" },
  monitor: { color: "#eab308", label: "Monitor", dash: "2 2"  },
  comms:   { color: "#a855f7", label: "Comms",   dash: "none" },
};

export const EXTRA_AGENTS: EcoAgent[] = [
  { id: "dan",         name: "Dan",        role: "Human Boss",    type: "main",    color: "#f8fafc", initials: "DN", status: "online", desc: "Romanian entrepreneur. Commands the fleet via Telegram DM to Dexter. Sets priorities, approves direction." },
  { id: "mac-studio",  name: "Mac Studio", role: "Central Hub",   type: "infra",   color: "#a1a1aa", initials: "MS", status: "online", desc: "Dan's Mac Studio — runs David fleet orchestrator, Qwen 3.5 local model, Codex & Claude Code. Redis bridges to Supabase, Vercel, GitHub." },
  { id: "telegram",    name: "Telegram",   role: "Primary Comms", type: "channel", color: "#0ea5e9", initials: "TG", status: "online", desc: "Primary human-agent channel. Dan DMs Dexter directly. Team Avatars group syncs Dan + Dexter + Memo + Sienna." },
  { id: "slack",       name: "Slack",      role: "Team Hub",      type: "channel", color: "#e11d48", initials: "SL", status: "online", desc: "Team communication hub. KiloClaw moderates, KimiClaw amplifies, ManusClaw drives ops." },
  { id: "discord",     name: "Discord",    role: "Community",     type: "channel", color: "#6366f1", initials: "DC", status: "idle",   desc: "Community channel for users and public updates." },
];

export const ALL_AGENTS: EcoAgent[] = [...(AGENTS as EcoAgent[]), ...EXTRA_AGENTS];
export const AGENT_MAP = new Map(ALL_AGENTS.map((a) => [a.id, a]));

export const CONNECTIONS: Connection[] = [
  { id: "dan-dexter", from: "dan", to: "dexter", type: "comms", label: "Telegram DM" },
  { id: "dan-telegram", from: "dan", to: "telegram", type: "comms", label: "Team Avatars Group" },
  { id: "dan-mac-studio", from: "dan", to: "mac-studio", type: "data", label: "Local Access" },
  { id: "ms-david", from: "mac-studio", to: "david", type: "data", label: "Runs Locally" },
  { id: "ms-hermes", from: "mac-studio", to: "hermes", type: "data", label: "Runs Locally" },
  { id: "hermes-david", from: "hermes", to: "david", type: "data", label: "Hand-in-hand · mission flow" },
  { id: "hermes-dexter", from: "hermes", to: "dexter", type: "data", label: "Context" },
  { id: "hermes-nano", from: "hermes", to: "nano", type: "data", label: "Context" },
  { id: "hermes-memo", from: "hermes", to: "memo", type: "data", label: "Context" },
  { id: "hermes-sienna", from: "hermes", to: "sienna", type: "data", label: "Context" },
  { id: "hermes-vector", from: "hermes", to: "vector", type: "data", label: "Memory" },
  { id: "hermes-learning", from: "hermes", to: "learning", type: "data", label: "Reads" },
  { id: "hermes-supabase", from: "hermes", to: "supabase", type: "data", label: "Long-term" },
  { id: "hermes-telegram", from: "hermes", to: "telegram", type: "comms" },
  { id: "dan-hermes", from: "dan", to: "hermes", type: "comms", label: "Reasoning" },
  { id: "david-dexter", from: "david", to: "dexter", type: "data", label: "Orchestrate" },
  { id: "david-nano", from: "david", to: "nano", type: "data", label: "Orchestrate" },
  { id: "david-memo", from: "david", to: "memo", type: "data", label: "Orchestrate" },
  { id: "david-sienna", from: "david", to: "sienna", type: "data", label: "Orchestrate" },
  { id: "david-supabase", from: "david", to: "supabase", type: "data", label: "Redis Bridge" },
  { id: "david-vercel", from: "david", to: "vercel", type: "deploy", label: "Redis Bridge" },
  { id: "david-github", from: "david", to: "github", type: "data", label: "Redis Bridge" },
  { id: "david-monitor", from: "david", to: "monitor", type: "monitor", label: "Fleet Health" },
  { id: "david-telegram", from: "david", to: "telegram", type: "comms" },
  { id: "david-slack", from: "david", to: "slack", type: "comms" },
  { id: "david-discord", from: "david", to: "discord", type: "comms" },
  { id: "david-openclaw-1", from: "david", to: "openclaw-1", type: "data", label: "Delegate Build" },
  { id: "david-openclaw-2", from: "david", to: "openclaw-2", type: "data", label: "Delegate Research" },
  { id: "david-openclaw-3", from: "david", to: "openclaw-3", type: "data", label: "Delegate Review" },
  { id: "david-openclaw-4", from: "david", to: "openclaw-4", type: "data", label: "Delegate Automation" },
  { id: "david-manusclaw", from: "david", to: "manusclaw", type: "comms", label: "Operate" },
  { id: "dexter-memo", from: "dexter", to: "memo", type: "ssh", label: "SSH + Supabase" },
  { id: "dexter-sienna", from: "dexter", to: "sienna", type: "ssh", label: "SSH + Supabase" },
  { id: "dexter-supabase", from: "dexter", to: "supabase", type: "data", label: "MoltBot DB" },
  { id: "dexter-github", from: "dexter", to: "github", type: "data", label: "60+ Repos" },
  { id: "dexter-telegram", from: "dexter", to: "telegram", type: "comms" },
  { id: "dexter-monitor", from: "dexter", to: "monitor", type: "monitor", label: "14 Crons" },
  { id: "dexter-pope", from: "dexter", to: "pope", type: "data" },
  { id: "dexter-nano", from: "dexter", to: "nano", type: "data", label: "Nervix Bridge" },
  { id: "dexter-vercel", from: "dexter", to: "vercel", type: "deploy" },
  { id: "memo-supabase", from: "memo", to: "supabase", type: "data" },
  { id: "memo-github", from: "memo", to: "github", type: "data" },
  { id: "memo-telegram", from: "memo", to: "telegram", type: "comms" },
  { id: "memo-stripe", from: "memo", to: "stripe", type: "data", label: "purchase-webhook" },
  { id: "memo-pope", from: "memo", to: "pope", type: "data" },
  { id: "sienna-supabase", from: "sienna", to: "supabase", type: "data" },
  { id: "sienna-telegram", from: "sienna", to: "telegram", type: "comms" },
  { id: "sienna-nano", from: "sienna", to: "nano", type: "ssh" },
  { id: "sienna-model", from: "sienna", to: "model", type: "data", label: "ZAI GLM-4.7" },
  { id: "nano-supabase", from: "nano", to: "supabase", type: "data", label: "Nervix DB" },
  { id: "nano-pope", from: "nano", to: "pope", type: "data" },
  { id: "nano-stripe", from: "nano", to: "stripe", type: "data", label: "Escrow" },
  { id: "telegram-supabase", from: "telegram", to: "supabase", type: "data" },
  { id: "slack-kiloclaw", from: "slack", to: "kiloclaw", type: "comms" },
  { id: "slack-kimiclaw", from: "slack", to: "kimiclaw", type: "comms" },
  { id: "slack-manusclaw", from: "slack", to: "manusclaw", type: "comms" },
  { id: "kiloclaw-doctor", from: "kiloclaw", to: "doctor", type: "data", label: "Escalate" },
  { id: "kimiclaw-dexter", from: "kimiclaw", to: "dexter", type: "comms" },
  { id: "kimiclaw-nano", from: "kimiclaw", to: "nano", type: "comms" },
  { id: "kimiclaw-memo", from: "kimiclaw", to: "memo", type: "comms" },
  { id: "kimiclaw-sienna", from: "kimiclaw", to: "sienna", type: "comms" },
  { id: "manusclaw-doctor", from: "manusclaw", to: "doctor", type: "data" },
  { id: "openclaw-1-openclaw-2", from: "openclaw-1", to: "openclaw-2", type: "data" },
  { id: "openclaw-3-openclaw-4", from: "openclaw-3", to: "openclaw-4", type: "data" },
  { id: "openclaw-1-github", from: "openclaw-1", to: "github", type: "data" },
  { id: "openclaw-1-gsd", from: "openclaw-1", to: "gsd", type: "data" },
  { id: "openclaw-2-vector", from: "openclaw-2", to: "vector", type: "data" },
  { id: "openclaw-3-github", from: "openclaw-3", to: "github", type: "data" },
  { id: "openclaw-4-autoforge", from: "openclaw-4", to: "autoforge", type: "data" },
  { id: "pope-github", from: "pope", to: "github", type: "data", label: "PRs" },
  { id: "autoforge-github", from: "autoforge", to: "github", type: "data" },
  { id: "autoforge-model", from: "autoforge", to: "model", type: "data" },
  { id: "gsd-autoforge", from: "gsd", to: "autoforge", type: "data" },
  { id: "github-vercel", from: "github", to: "vercel", type: "deploy", label: "Auto Deploy" },
  { id: "learning-vector", from: "learning", to: "vector", type: "data" },
  { id: "learning-model", from: "learning", to: "model", type: "data" },
  { id: "learning-supabase", from: "learning", to: "supabase", type: "data" },
  { id: "vector-model", from: "vector", to: "model", type: "data" },
  { id: "vector-supabase", from: "vector", to: "supabase", type: "data" },
  { id: "doctor-monitor", from: "doctor", to: "monitor", type: "monitor" },
  { id: "doctor-david", from: "doctor", to: "david", type: "data" },
  { id: "monitor-supabase", from: "monitor", to: "supabase", type: "monitor" },
  { id: "monitor-vercel", from: "monitor", to: "vercel", type: "monitor" },
  { id: "update-gsd", from: "update", to: "gsd", type: "data" },
  { id: "update-autoforge", from: "update", to: "autoforge", type: "data" },
  { id: "update-model", from: "update", to: "model", type: "data" },
  { id: "update-doctor", from: "update", to: "doctor", type: "data" },
  { id: "stripe-supabase", from: "stripe", to: "supabase", type: "data" },
  { id: "stripe-github", from: "stripe", to: "github", type: "data", label: "Repo Access" },
  { id: "ssh-dexter", from: "ssh", to: "dexter", type: "ssh" },
  { id: "ssh-memo", from: "ssh", to: "memo", type: "ssh" },
  { id: "ssh-sienna", from: "ssh", to: "sienna", type: "ssh" },
  { id: "ssh-nano", from: "ssh", to: "nano", type: "ssh" },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "bug-fix",
    name: "Fix a Bug",
    glyph: "⚠",
    desc: "Bug lands in Slack → fixed → deployed, all without human touch.",
    steps: [
      { agents: ["slack", "kiloclaw"], conns: ["slack-kiloclaw"], line: "Bug report arrives in Slack. KiloClaw picks it up." },
      { agents: ["kiloclaw", "doctor", "monitor"], conns: ["kiloclaw-doctor", "doctor-monitor"], line: "KiloClaw escalates to Doctor. Doctor checks Monitor's diagnostics." },
      { agents: ["doctor", "david", "openclaw-3", "openclaw-4"], conns: ["doctor-david", "david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"], line: "David routes fix through OpenClaw reviewer + automation pair." },
      { agents: ["openclaw-4", "autoforge", "github", "pope"], conns: ["openclaw-4-autoforge", "autoforge-github", "pope-github"], line: "AutoForge writes the fix, pushes to GitHub. Pope creates the PR." },
      { agents: ["github", "vercel", "monitor"], conns: ["github-vercel", "monitor-vercel"], line: "Auto-deployed to Vercel. Monitor confirms the fix is live." },
    ],
  },
  {
    id: "new-feature",
    name: "Ship a Feature",
    glyph: "✦",
    desc: "Dan DMs Dexter → research → build → deploy → promote.",
    steps: [
      { agents: ["dan", "dexter", "telegram"], conns: ["dan-dexter", "dan-telegram", "dexter-telegram"], line: "Dan DMs Dexter on Telegram with a new feature idea." },
      { agents: ["dexter", "david", "openclaw-2", "vector"], conns: ["david-dexter", "david-openclaw-2", "openclaw-2-vector"], line: "David delegates research to OpenClaw-02, checks Vector Memory." },
      { agents: ["david", "openclaw-1", "autoforge", "gsd"], conns: ["david-openclaw-1", "openclaw-1-gsd", "gsd-autoforge"], line: "OpenClaw-01 builds via GSD framework. AutoForge writes the code." },
      { agents: ["autoforge", "github", "openclaw-3", "pope"], conns: ["autoforge-github", "openclaw-3-github", "pope-github"], line: "OpenClaw-03 reviews PRs. Pope runs CI in Docker." },
      { agents: ["github", "vercel", "kimiclaw", "telegram"], conns: ["github-vercel", "kimiclaw-dexter", "david-telegram"], line: "Auto-deployed to Vercel. KimiClaw promotes across channels." },
    ],
  },
  {
    id: "learning",
    name: "Learn & Improve",
    glyph: "◈",
    desc: "Daily 23:55 UTC summary → Vector memory → Model optimizer.",
    steps: [
      { agents: ["learning", "supabase"], conns: ["learning-supabase"], line: "Learning reviews yesterday's daily_summaries from Supabase." },
      { agents: ["learning", "vector", "supabase"], conns: ["learning-vector", "vector-supabase"], line: "Insights stored in Vector Memory (agent_context table)." },
      { agents: ["vector", "model", "learning"], conns: ["learning-model", "vector-model"], line: "Model optimizes fallback chains — Opus→Sonnet→GPT-4.1→Gemini→ZAI." },
      { agents: ["update", "gsd", "autoforge", "model"], conns: ["update-gsd", "update-autoforge", "update-model"], line: "Update pushes latest tool versions via devops-control-repo." },
      { agents: ["david", "dexter", "nano", "memo", "sienna"], conns: ["david-dexter", "david-nano", "david-memo", "david-sienna"], line: "All agents receive improvements. The lab is smarter today." },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Flow",
    glyph: "$",
    desc: "CrawBoard subscription → Stripe → GitHub access → Nervix enroll.",
    steps: [
      { agents: ["stripe", "memo"], conns: ["memo-stripe"], line: "New subscription on CrawBoard. Stripe hits Memo's purchase-webhook." },
      { agents: ["stripe", "supabase", "github"], conns: ["stripe-supabase", "stripe-github"], line: "Payment recorded in Supabase. Auto-grants GitHub repo access." },
      { agents: ["nano", "david", "supabase"], conns: ["david-nano", "nano-supabase", "nano-stripe"], line: "Nano enrolls specialized agents into Nervix Federation via nervix-cli." },
      { agents: ["dexter", "monitor", "supabase"], conns: ["dexter-supabase", "dexter-monitor", "monitor-supabase"], line: "Dexter's crons push stats to Supabase. Monitor confirms green." },
      { agents: ["kimiclaw", "manusclaw", "slack", "telegram"], conns: ["slack-kimiclaw", "slack-manusclaw", "david-telegram"], line: "KimiClaw promotes, ManusClaw executes. Revenue flows." },
    ],
  },
  {
    id: "lab-sync",
    name: "Lab Sync",
    glyph: "◉",
    desc: "Dan → Dexter → David → OpenClaw mesh tightens the loop.",
    steps: [
      { agents: ["dan", "dexter", "david", "mac-studio"], conns: ["dan-dexter", "dan-mac-studio", "ms-david", "david-dexter"], line: "Dan DMs Dexter. David picks up orchestration from Mac Studio." },
      { agents: ["david", "openclaw-1", "openclaw-2", "gsd", "vector"], conns: ["david-openclaw-1", "david-openclaw-2", "openclaw-1-openclaw-2", "openclaw-1-gsd", "openclaw-2-vector"], line: "Builder + Researcher split work — GSD framework, Vector memory." },
      { agents: ["openclaw-3", "openclaw-4", "autoforge", "github"], conns: ["openclaw-3-openclaw-4", "openclaw-4-autoforge", "openclaw-3-github", "autoforge-github"], line: "Reviewer validates. Automation ships. AutoForge pushes code." },
      { agents: ["dexter", "memo", "sienna", "supabase", "telegram"], conns: ["dexter-memo", "dexter-sienna", "dexter-supabase", "telegram-supabase"], line: "Dexter SSHs updates to Memo + Sienna. Synced via Supabase." },
    ],
  },
];

// Avatar treatment per agent
export type AvatarSpec = { src?: string; crest?: boolean; glyph?: string; palette?: [string, string, string] };
export const AVATARS: Record<string, AvatarSpec> = {
  dan:    { src: "/avatars/dan.jpg" },
  dexter: { src: "/avatars/dexter.jpg" },
  memo:   { src: "/avatars/memo.jpg" },
  sienna: { src: "/avatars/sienna.jpg" },
  nano:   { crest: true, glyph: "⎔", palette: ["#7c3aed", "#a855f7", "#ec4899"] },
  david:  { crest: true, glyph: "✦", palette: ["#166534", "#22c55e", "#d4a017"] },
  hermes: { crest: true, glyph: "ℋ", palette: ["#78350f", "#d4a017", "#fef3c7"] },
};

// Top-to-bottom chain of command. Order inside a tier keeps related nodes close to cut edge crossings.
export const TIERS: Tier[] = [
  { id: "command", label: "Command", caption: "Dan and the channels he steers from", nodes: ["telegram", "dan", "slack", "discord"] },
  { id: "orchestration", label: "Orchestration", caption: "Fleet brain on the Mac Studio", nodes: ["david", "mac-studio", "hermes"] },
  { id: "leads", label: "Lead agents", caption: "One agent per product line", nodes: ["dexter", "nano", "memo", "sienna"] },
  { id: "crew", label: "Slack crew", caption: "Moderation, promotion and operations", nodes: ["kiloclaw", "kimiclaw", "manusclaw"] },
  { id: "mesh", label: "OpenClaw mesh", caption: "Build, research, review, automate", nodes: ["openclaw-1", "openclaw-2", "vector", "openclaw-3", "openclaw-4"] },
  { id: "support", label: "Support layer", caption: "Keeps the fleet healthy and current", nodes: ["monitor", "doctor", "learning", "model", "gsd", "autoforge", "update", "ssh"] },
  { id: "infra", label: "Infrastructure", caption: "Where code, money and data land", nodes: ["github", "pope", "vercel", "stripe", "supabase"] },
];

// Large nodes anchor the map; channels and support services render smaller.
export const NODE_SIZE: Record<"sm" | "md" | "lg", number> = { sm: 40, md: 48, lg: 60 };
export const LARGE_NODES = new Set(["dan", "david", "mac-studio", "hermes"]);

export function nodeSize(agent: EcoAgent): number {
  if (LARGE_NODES.has(agent.id)) return NODE_SIZE.lg;
  return agent.type === "support" || agent.type === "channel" ? NODE_SIZE.sm : NODE_SIZE.md;
}

// "DansLabAutoForge" reads as "AutoForge" on the map; the side panel keeps the full name.
export const shortName = (name: string) => name.replace(/^DansLab(?=[A-Z])/, "");
