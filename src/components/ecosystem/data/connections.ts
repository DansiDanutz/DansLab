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
  // DAN — Human in the loop
  // ═══════════════════════════════════════════
  { id: "dan-mac-studio", from: "dan", to: "mac-studio", type: "data", label: "Human Input" },
  { id: "dan-david", from: "dan", to: "david", type: "data", label: "Direction" },
  { id: "dan-telegram", from: "dan", to: "telegram", type: "comms", label: "Ideas" },

  // ═══════════════════════════════════════════
  // MAC STUDIO — Central hub, Tailscale SSH to all VMs
  // ═══════════════════════════════════════════
  { id: "ms-david", from: "mac-studio", to: "david", type: "ssh", label: "Tailscale" },
  { id: "ms-dexter", from: "mac-studio", to: "dexter", type: "ssh", label: "Tailscale" },
  { id: "ms-nano", from: "mac-studio", to: "nano", type: "ssh", label: "Tailscale" },
  { id: "ms-sienna", from: "mac-studio", to: "sienna", type: "ssh", label: "Tailscale" },
  { id: "ms-ssh", from: "mac-studio", to: "ssh", type: "ssh", label: "Manage SSH" },

  // ═══════════════════════════════════════════
  // DAVID — Main orchestrator, connects to almost everything
  // ═══════════════════════════════════════════
  // → Main agents
  { id: "david-dexter", from: "david", to: "dexter", type: "data", label: "Orchestrate" },
  { id: "david-nano", from: "david", to: "nano", type: "data", label: "Orchestrate" },
  { id: "david-memo", from: "david", to: "memo", type: "data", label: "Orchestrate" },
  { id: "david-sienna", from: "david", to: "sienna", type: "data", label: "Orchestrate" },
  // → OpenClaw delegation
  { id: "david-openclaw-1", from: "david", to: "openclaw-1", type: "data", label: "Delegate Build" },
  { id: "david-openclaw-2", from: "david", to: "openclaw-2", type: "data", label: "Delegate Research" },
  { id: "david-openclaw-3", from: "david", to: "openclaw-3", type: "data", label: "Delegate Review" },
  { id: "david-openclaw-4", from: "david", to: "openclaw-4", type: "data", label: "Delegate Automation" },
  // → Channels
  { id: "david-telegram", from: "david", to: "telegram", type: "comms" },
  { id: "david-slack", from: "david", to: "slack", type: "comms" },
  { id: "david-discord", from: "david", to: "discord", type: "comms" },
  // → Key support
  { id: "david-gsd", from: "david", to: "gsd", type: "data", label: "Framework" },
  { id: "david-vector", from: "david", to: "vector", type: "data", label: "Memory" },
  { id: "david-monitor", from: "david", to: "monitor", type: "monitor", label: "Health" },
  { id: "david-manusclaw", from: "david", to: "manusclaw", type: "comms", label: "Operate" },

  // ═══════════════════════════════════════════
  // MAIN AGENTS — Product connections
  // ═══════════════════════════════════════════
  // Dexter (crawdbot.com)
  { id: "dexter-github", from: "dexter", to: "github", type: "data", label: "Code" },
  { id: "dexter-supabase", from: "dexter", to: "supabase", type: "data", label: "Data" },
  // Nano (agent creator on nervix.ai)
  { id: "nano-supabase", from: "nano", to: "supabase", type: "data", label: "Enroll Agents" },
  { id: "nano-stripe", from: "nano", to: "stripe", type: "data", label: "Credits" },
  // Memo (MyWork-ai)
  { id: "memo-github", from: "memo", to: "github", type: "data", label: "Code" },
  { id: "memo-supabase", from: "memo", to: "supabase", type: "data", label: "Platform Data" },
  { id: "memo-stripe", from: "memo", to: "stripe", type: "data", label: "Payments" },
  // Sienna (zmarty.me)
  { id: "sienna-supabase", from: "sienna", to: "supabase", type: "data", label: "Trading Data" },
  { id: "sienna-stripe", from: "sienna", to: "stripe", type: "data", label: "Subscriptions" },

  // ═══════════════════════════════════════════
  // SLACK AGENTS
  // ═══════════════════════════════════════════
  { id: "slack-kiloclaw", from: "slack", to: "kiloclaw", type: "comms", label: "Moderation" },
  { id: "slack-kimiclaw", from: "slack", to: "kimiclaw", type: "comms", label: "Amplify" },
  { id: "slack-manusclaw", from: "slack", to: "manusclaw", type: "comms", label: "Ops" },
  // KiloClaw → Doctor (reports issues it detects)
  { id: "kiloclaw-doctor", from: "kiloclaw", to: "doctor", type: "data", label: "Report Issues" },
  { id: "kiloclaw-monitor", from: "kiloclaw", to: "monitor", type: "monitor", label: "Alert" },
  // KimiClaw → advertises all products
  { id: "kimiclaw-dexter", from: "kimiclaw", to: "dexter", type: "comms", label: "Promote crawdbot" },
  { id: "kimiclaw-nano", from: "kimiclaw", to: "nano", type: "comms", label: "Promote nervix" },
  { id: "kimiclaw-memo", from: "kimiclaw", to: "memo", type: "comms", label: "Promote MyWork" },
  { id: "kimiclaw-sienna", from: "kimiclaw", to: "sienna", type: "comms", label: "Promote zmarty" },
  { id: "kimiclaw-manusclaw", from: "kimiclaw", to: "manusclaw", type: "comms", label: "Signal" },

  // ═══════════════════════════════════════════
  // OPENCLAW MESH — Builder, Researcher, Reviewer, Automation
  // ═══════════════════════════════════════════
  { id: "openclaw-1-openclaw-2", from: "openclaw-1", to: "openclaw-2", type: "data", label: "Build + Research" },
  { id: "openclaw-3-openclaw-4", from: "openclaw-3", to: "openclaw-4", type: "data", label: "Review + Automate" },
  { id: "openclaw-1-github", from: "openclaw-1", to: "github", type: "data", label: "Push Code" },
  { id: "openclaw-1-gsd", from: "openclaw-1", to: "gsd", type: "data", label: "Task Exec" },
  { id: "openclaw-2-vector", from: "openclaw-2", to: "vector", type: "data", label: "Research Memory" },
  { id: "openclaw-2-learning", from: "openclaw-2", to: "learning", type: "data", label: "Insights" },
  { id: "openclaw-3-github", from: "openclaw-3", to: "github", type: "data", label: "Review PRs" },
  { id: "openclaw-3-doctor", from: "openclaw-3", to: "doctor", type: "data", label: "Report Bugs" },
  { id: "openclaw-4-autoforge", from: "openclaw-4", to: "autoforge", type: "data", label: "Auto Scripts" },
  { id: "openclaw-4-gsd", from: "openclaw-4", to: "gsd", type: "data", label: "Task Exec" },

  // ═══════════════════════════════════════════
  // GSD — Framework used by many agents
  // ═══════════════════════════════════════════
  { id: "gsd-autoforge", from: "gsd", to: "autoforge", type: "data", label: "Task Framework" },
  { id: "gsd-pope", from: "gsd", to: "pope", type: "data", label: "Job Framework" },
  { id: "gsd-learning", from: "gsd", to: "learning", type: "data", label: "Learn Tasks" },

  // ═══════════════════════════════════════════
  // AUTOFORGE — Autonomous coder
  // ═══════════════════════════════════════════
  { id: "autoforge-github", from: "autoforge", to: "github", type: "data", label: "Push Code" },
  { id: "autoforge-model", from: "autoforge", to: "model", type: "data", label: "LLM Calls" },

  // ═══════════════════════════════════════════
  // DEPLOY PIPELINE
  // ═══════════════════════════════════════════
  { id: "github-vercel", from: "github", to: "vercel", type: "deploy", label: "Deploy" },
  { id: "github-pope", from: "github", to: "pope", type: "data", label: "CI/CD Jobs" },

  // ═══════════════════════════════════════════
  // UPDATE — Updates ALL tools across the system
  // ═══════════════════════════════════════════
  { id: "update-gsd", from: "update", to: "gsd", type: "data", label: "Update GSD" },
  { id: "update-autoforge", from: "update", to: "autoforge", type: "data", label: "Update AutoForge" },
  { id: "update-openclaw-1", from: "update", to: "openclaw-1", type: "data", label: "Update OpenClaw" },
  { id: "update-openclaw-4", from: "update", to: "openclaw-4", type: "data", label: "Update OpenClaw" },
  { id: "update-model", from: "update", to: "model", type: "data", label: "Update Models" },

  // ═══════════════════════════════════════════
  // LEARNING + VECTOR + MODEL — Knowledge pipeline
  // ═══════════════════════════════════════════
  { id: "learning-vector", from: "learning", to: "vector", type: "data", label: "Store Insights" },
  { id: "learning-model", from: "learning", to: "model", type: "data", label: "Optimize Prompts" },
  { id: "vector-model", from: "vector", to: "model", type: "data", label: "Retrieved Context" },

  // ═══════════════════════════════════════════
  // DOCTOR + MONITOR — Health & repair
  // ═══════════════════════════════════════════
  { id: "doctor-monitor", from: "doctor", to: "monitor", type: "monitor", label: "Diagnose" },
  { id: "doctor-david", from: "doctor", to: "david", type: "data", label: "Fix Report" },
  { id: "monitor-vercel", from: "monitor", to: "vercel", type: "monitor", label: "Uptime" },
  { id: "monitor-supabase", from: "monitor", to: "supabase", type: "monitor", label: "DB Health" },

  // ═══════════════════════════════════════════
  // STRIPE + SUPABASE — Revenue & data
  // ═══════════════════════════════════════════
  { id: "stripe-supabase", from: "stripe", to: "supabase", type: "data", label: "Payment Records" },
  { id: "supabase-david", from: "supabase", to: "david", type: "data", label: "Database" },

  // ═══════════════════════════════════════════
  // SSH — Connection manager
  // ═══════════════════════════════════════════
  { id: "ssh-david", from: "ssh", to: "david", type: "ssh", label: "Connections" },
  { id: "ssh-monitor", from: "ssh", to: "monitor", type: "ssh", label: "Network Health" },
];

export const connectionMap = new Map(connections.map((c) => [c.id, c]));
