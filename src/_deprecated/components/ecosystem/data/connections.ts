export type ConnectionType = "data" | "ssh" | "deploy" | "monitor" | "comms";

export interface ConnectionDef {
  id: string;
  from: string;
  to: string;
  type: ConnectionType;
  label?: string;
}

export const connections: ConnectionDef[] = [
  // ═══════════════════════════════════════════
  // DAN — Human boss, primary contact is Dexter via Telegram DM
  // ═══════════════════════════════════════════
  { id: "dan-dexter", from: "dan", to: "dexter", type: "comms", label: "Telegram DM" },
  { id: "dan-telegram", from: "dan", to: "telegram", type: "comms", label: "Team Avatars Group" },
  { id: "dan-mac-studio", from: "dan", to: "mac-studio", type: "data", label: "Local Access" },

  // ═══════════════════════════════════════════
  // MAC STUDIO — David runs here, bridges to services
  // ═══════════════════════════════════════════
  { id: "ms-david", from: "mac-studio", to: "david", type: "data", label: "Runs Locally" },

  // ═══════════════════════════════════════════
  // DAVID — Fleet orchestrator, Redis bridges
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // DEXTER — GM, SSH hub, runs Nervix nanobots + crons
  // ═══════════════════════════════════════════
  { id: "dexter-memo", from: "dexter", to: "memo", type: "ssh", label: "SSH + Supabase Msgs" },
  { id: "dexter-sienna", from: "dexter", to: "sienna", type: "ssh", label: "SSH + Supabase Msgs" },
  { id: "dexter-supabase", from: "dexter", to: "supabase", type: "data", label: "MoltBot DB (30+ tables)" },
  { id: "dexter-github", from: "dexter", to: "github", type: "data", label: "60+ Repos" },
  { id: "dexter-telegram", from: "dexter", to: "telegram", type: "comms", label: "@SmartMemo_bot" },
  { id: "dexter-monitor", from: "dexter", to: "monitor", type: "monitor", label: "14 Cron Jobs" },
  { id: "dexter-pope", from: "dexter", to: "pope", type: "data", label: "popebot-worker-dexter" },
  { id: "dexter-nano", from: "dexter", to: "nano", type: "data", label: "Nervix Bridge" },
  { id: "dexter-vercel", from: "dexter", to: "vercel", type: "deploy", label: "CrawdBot + CrawBoard" },

  // ═══════════════════════════════════════════
  // MEMO — PM, n8n automations, MyWork-AI, purchase-webhook
  // ═══════════════════════════════════════════
  { id: "memo-supabase", from: "memo", to: "supabase", type: "data", label: "MoltBot DB" },
  { id: "memo-github", from: "memo", to: "github", type: "data", label: "MyWork-AI Repos" },
  { id: "memo-telegram", from: "memo", to: "telegram", type: "comms", label: "@MemoWorker_bot" },
  { id: "memo-stripe", from: "memo", to: "stripe", type: "data", label: "purchase-webhook" },
  { id: "memo-pope", from: "memo", to: "pope", type: "data", label: "popebot-worker-memo" },
  { id: "memo-dexter-emergency", from: "memo", to: "dexter", type: "ssh", label: "Emergency SSH" },

  // ═══════════════════════════════════════════
  // SIENNA — Crypto, Binance, ZAI model
  // ═══════════════════════════════════════════
  { id: "sienna-supabase", from: "sienna", to: "supabase", type: "data", label: "Trading Data" },
  { id: "sienna-telegram", from: "sienna", to: "telegram", type: "comms", label: "@AdaptiveAI_bot" },
  { id: "sienna-nano", from: "sienna", to: "nano", type: "ssh", label: "SSH crossdroplet" },
  { id: "sienna-model", from: "sienna", to: "model", type: "data", label: "ZAI GLM-4.7" },

  // ═══════════════════════════════════════════
  // NANO — Nervix orchestrator, agent enrollment
  // ═══════════════════════════════════════════
  { id: "nano-supabase", from: "nano", to: "supabase", type: "data", label: "Nervix DB" },
  { id: "nano-pope", from: "nano", to: "pope", type: "data", label: "popebot-worker-nano" },
  { id: "nano-stripe", from: "nano", to: "stripe", type: "data", label: "Nervix Escrow" },

  // ═══════════════════════════════════════════
  // TELEGRAM — Team Avatars group, syncs to Supabase
  // ═══════════════════════════════════════════
  { id: "telegram-supabase", from: "telegram", to: "supabase", type: "data", label: "chat_history sync" },

  // ═══════════════════════════════════════════
  // SLACK AGENTS
  // ═══════════════════════════════════════════
  { id: "slack-kiloclaw", from: "slack", to: "kiloclaw", type: "comms", label: "Moderation" },
  { id: "slack-kimiclaw", from: "slack", to: "kimiclaw", type: "comms", label: "Amplify" },
  { id: "slack-manusclaw", from: "slack", to: "manusclaw", type: "comms", label: "Ops" },
  { id: "kiloclaw-doctor", from: "kiloclaw", to: "doctor", type: "data", label: "Escalate Issues" },
  { id: "kimiclaw-dexter", from: "kimiclaw", to: "dexter", type: "comms", label: "Promote CrawdBot" },
  { id: "kimiclaw-nano", from: "kimiclaw", to: "nano", type: "comms", label: "Promote Nervix" },
  { id: "kimiclaw-memo", from: "kimiclaw", to: "memo", type: "comms", label: "Promote MyWork" },
  { id: "kimiclaw-sienna", from: "kimiclaw", to: "sienna", type: "comms", label: "Promote zmarty" },
  { id: "kimiclaw-manusclaw", from: "kimiclaw", to: "manusclaw", type: "comms", label: "Signal" },
  { id: "manusclaw-doctor", from: "manusclaw", to: "doctor", type: "data", label: "DevOps Solutions" },

  // ═══════════════════════════════════════════
  // OPENCLAW MESH — All agents run OpenClaw locally
  // ═══════════════════════════════════════════
  { id: "openclaw-1-openclaw-2", from: "openclaw-1", to: "openclaw-2", type: "data", label: "Build + Research" },
  { id: "openclaw-3-openclaw-4", from: "openclaw-3", to: "openclaw-4", type: "data", label: "Review + Automate" },
  { id: "openclaw-1-github", from: "openclaw-1", to: "github", type: "data", label: "Push Code" },
  { id: "openclaw-1-gsd", from: "openclaw-1", to: "gsd", type: "data", label: "Task Exec" },
  { id: "openclaw-2-vector", from: "openclaw-2", to: "vector", type: "data", label: "Research Memory" },
  { id: "openclaw-3-github", from: "openclaw-3", to: "github", type: "data", label: "Review PRs" },
  { id: "openclaw-3-doctor", from: "openclaw-3", to: "doctor", type: "data", label: "Report Bugs" },
  { id: "openclaw-4-autoforge", from: "openclaw-4", to: "autoforge", type: "data", label: "Auto Scripts" },
  { id: "openclaw-4-gsd", from: "openclaw-4", to: "gsd", type: "data", label: "Task Exec" },
  { id: "david-openclaw-1", from: "david", to: "openclaw-1", type: "data", label: "Delegate Build" },
  { id: "david-openclaw-2", from: "david", to: "openclaw-2", type: "data", label: "Delegate Research" },
  { id: "david-openclaw-3", from: "david", to: "openclaw-3", type: "data", label: "Delegate Review" },
  { id: "david-openclaw-4", from: "david", to: "openclaw-4", type: "data", label: "Delegate Automation" },
  { id: "david-manusclaw", from: "david", to: "manusclaw", type: "comms", label: "Operate" },

  // ═══════════════════════════════════════════
  // POPE — ThePopeBot workers (Docker + GitHub Actions)
  // ═══════════════════════════════════════════
  { id: "pope-github", from: "pope", to: "github", type: "data", label: "Create PRs" },

  // ═══════════════════════════════════════════
  // AUTOFORGE + GSD — Coding pipeline
  // ═══════════════════════════════════════════
  { id: "autoforge-github", from: "autoforge", to: "github", type: "data", label: "Push Code" },
  { id: "autoforge-model", from: "autoforge", to: "model", type: "data", label: "LLM Calls" },
  { id: "gsd-autoforge", from: "gsd", to: "autoforge", type: "data", label: "Task Framework" },
  { id: "gsd-pope", from: "gsd", to: "pope", type: "data", label: "Job Framework" },

  // ═══════════════════════════════════════════
  // DEPLOY PIPELINE — GitHub → Vercel
  // ═══════════════════════════════════════════
  { id: "github-vercel", from: "github", to: "vercel", type: "deploy", label: "Auto Deploy" },

  // ═══════════════════════════════════════════
  // UPDATE — devops-control-repo daily cycle
  // ═══════════════════════════════════════════
  { id: "update-gsd", from: "update", to: "gsd", type: "data", label: "Update GSD" },
  { id: "update-autoforge", from: "update", to: "autoforge", type: "data", label: "Update AutoForge" },
  { id: "update-openclaw-1", from: "update", to: "openclaw-1", type: "data", label: "Update OpenClaw" },
  { id: "update-openclaw-4", from: "update", to: "openclaw-4", type: "data", label: "Update OpenClaw" },
  { id: "update-model", from: "update", to: "model", type: "data", label: "Update Models" },
  { id: "update-doctor", from: "update", to: "doctor", type: "data", label: "Audit Scripts" },

  // ═══════════════════════════════════════════
  // LEARNING + VECTOR + MODEL — Knowledge pipeline
  // ═══════════════════════════════════════════
  { id: "learning-vector", from: "learning", to: "vector", type: "data", label: "Store daily_summaries" },
  { id: "learning-model", from: "learning", to: "model", type: "data", label: "Optimize Prompts" },
  { id: "learning-supabase", from: "learning", to: "supabase", type: "data", label: "daily_summaries table" },
  { id: "vector-model", from: "vector", to: "model", type: "data", label: "Retrieved Context" },
  { id: "vector-supabase", from: "vector", to: "supabase", type: "data", label: "agent_context table" },

  // ═══════════════════════════════════════════
  // DOCTOR + MONITOR — Health & repair (devops-control-repo)
  // ═══════════════════════════════════════════
  { id: "doctor-monitor", from: "doctor", to: "monitor", type: "monitor", label: "Diagnose" },
  { id: "doctor-david", from: "doctor", to: "david", type: "data", label: "Fix Report" },
  { id: "monitor-supabase", from: "monitor", to: "supabase", type: "monitor", label: "Droplet Stats → DB" },
  { id: "monitor-vercel", from: "monitor", to: "vercel", type: "monitor", label: "Uptime" },

  // ═══════════════════════════════════════════
  // STRIPE + SUPABASE — Revenue & data
  // ═══════════════════════════════════════════
  { id: "stripe-supabase", from: "stripe", to: "supabase", type: "data", label: "Payment Records" },
  { id: "stripe-github", from: "stripe", to: "github", type: "data", label: "purchase-webhook → Repo Access" },

  // ═══════════════════════════════════════════
  // SSH — Cross-droplet mesh (ed25519 keys)
  // ═══════════════════════════════════════════
  { id: "ssh-dexter", from: "ssh", to: "dexter", type: "ssh", label: "Hub Node" },
  { id: "ssh-memo", from: "ssh", to: "memo", type: "ssh", label: "id_ed25519_crossdroplet" },
  { id: "ssh-sienna", from: "ssh", to: "sienna", type: "ssh", label: "id_ed25519_crossdroplet" },
  { id: "ssh-nano", from: "ssh", to: "nano", type: "ssh", label: "id_ed25519_crossdroplet" },
];

export const connectionMap = new Map(connections.map((c) => [c.id, c]));
