export type ConnectionType = "data" | "ssh" | "deploy" | "monitor" | "comms";

export interface ConnectionDef {
  id: string;
  from: string;
  to: string;
  type: ConnectionType;
  label?: string;
}

export const connections: ConnectionDef[] = [
  // Mac Studio → Main Agents (SSH via Tailscale)
  { id: "ms-david", from: "mac-studio", to: "david", type: "ssh", label: "Tailscale SSH" },
  { id: "ms-dexter", from: "mac-studio", to: "dexter", type: "ssh", label: "Tailscale SSH" },
  { id: "ms-nano", from: "mac-studio", to: "nano", type: "ssh", label: "Tailscale SSH" },
  { id: "ms-memo", from: "mac-studio", to: "memo", type: "ssh", label: "Tailscale SSH" },
  { id: "ms-sienna", from: "mac-studio", to: "sienna", type: "ssh", label: "Tailscale SSH" },

  // David orchestrates everyone
  { id: "david-dexter", from: "david", to: "dexter", type: "data", label: "Orchestrate" },
  { id: "david-nano", from: "david", to: "nano", type: "data", label: "Orchestrate" },
  { id: "david-memo", from: "david", to: "memo", type: "data", label: "Orchestrate" },
  { id: "david-sienna", from: "david", to: "sienna", type: "data", label: "Orchestrate" },

  // Communication channels
  { id: "david-telegram", from: "david", to: "telegram", type: "comms" },
  { id: "david-slack", from: "david", to: "slack", type: "comms" },
  { id: "david-discord", from: "david", to: "discord", type: "comms" },

  // Slack agents
  { id: "slack-kiloclaw", from: "slack", to: "kiloclaw", type: "comms", label: "Moderation" },
  { id: "slack-mykimik2", from: "slack", to: "mykimik2", type: "comms", label: "Advertising" },

  // Support agent connections to Mac Studio / David
  { id: "ms-monitor", from: "mac-studio", to: "monitor", type: "monitor" },
  { id: "ms-gsd", from: "mac-studio", to: "gsd", type: "data" },
  { id: "ms-vector", from: "mac-studio", to: "vector", type: "data" },
  { id: "ms-model", from: "mac-studio", to: "model", type: "data" },
  { id: "ms-ssh", from: "mac-studio", to: "ssh", type: "ssh" },

  // Deploy pipeline
  { id: "github-vercel", from: "github", to: "vercel", type: "deploy", label: "Deploy" },
  { id: "github-pope", from: "github", to: "pope", type: "data", label: "CI/CD" },
  { id: "autoforge-github", from: "autoforge", to: "github", type: "data", label: "Push Code" },

  // Support interconnections
  { id: "doctor-monitor", from: "doctor", to: "monitor", type: "monitor", label: "Diagnose" },
  { id: "learning-vector", from: "learning", to: "vector", type: "data", label: "Store Insights" },
  { id: "learning-model", from: "learning", to: "model", type: "data", label: "Optimize" },
  { id: "update-gsd", from: "update", to: "gsd", type: "data", label: "Update Tools" },
  { id: "stripe-supabase", from: "stripe", to: "supabase", type: "data", label: "Payments" },
  { id: "supabase-david", from: "supabase", to: "david", type: "data", label: "Database" },
  { id: "ssh-david", from: "ssh", to: "david", type: "ssh", label: "Connections" },
];

export const connectionMap = new Map(connections.map((c) => [c.id, c]));
