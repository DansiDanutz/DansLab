export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Vertical zones with breathing room between each layer
// Dan+Channels: 6-10%, Slack+Claws: 20-24%, Orchestration: 30-45%, Support: 55-68%, Infra: 78-82%
export const positions: Record<string, NodePosition> = {
  // === ZONE: Human Boss + Channels (top) ===
  dan: { x: 50, y: 7 },

  telegram: { x: 28, y: 7 },
  discord: { x: 72, y: 7 },

  // Slack + flanking claws - pushed down to avoid Dan's labels
  slack: { x: 50, y: 20 },
  kiloclaw: { x: 36, y: 22 },
  kimiclaw: { x: 64, y: 22 },
  manusclaw: { x: 80, y: 24 },

  // === ZONE: Orchestration (middle) ===
  david: { x: 50, y: 32 },

  // Main agents - wide ring
  dexter: { x: 15, y: 37 },
  sienna: { x: 85, y: 37 },

  // Mac Studio - CENTER HUB
  "mac-studio": { x: 50, y: 45 },

  nano: { x: 15, y: 53 },
  memo: { x: 85, y: 53 },

  // === ZONE: OpenClaw Mesh ===
  "openclaw-1": { x: 35, y: 53 },
  "openclaw-2": { x: 65, y: 53 },
  "openclaw-3": { x: 35, y: 63 },
  "openclaw-4": { x: 65, y: 63 },

  // === ZONE: Support Layer ===
  vector: { x: 50, y: 60 },
  monitor: { x: 6, y: 66 },
  doctor: { x: 16, y: 66 },
  learning: { x: 26, y: 66 },
  model: { x: 74, y: 66 },
  gsd: { x: 84, y: 66 },
  ssh: { x: 94, y: 66 },

  // === ZONE: Infrastructure (bottom) ===
  autoforge: { x: 6, y: 80 },
  github: { x: 18, y: 80 },
  pope: { x: 30, y: 80 },
  vercel: { x: 42, y: 80 },
  stripe: { x: 58, y: 80 },
  supabase: { x: 70, y: 80 },
  update: { x: 82, y: 80 },
};
