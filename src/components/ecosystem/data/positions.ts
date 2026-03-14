export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Spread vertically with clear zones to avoid label overlap
// Top zone: 6-12%, Channels: 16-22%, Middle: 28-48%, Support: 56-68%, Infra: 76-84%
export const positions: Record<string, NodePosition> = {
  // === ZONE: Human + Channels (top) ===
  dan: { x: 50, y: 6 },

  telegram: { x: 28, y: 6 },
  slack: { x: 50, y: 16 },
  discord: { x: 72, y: 6 },

  // Slack agents — flanking slack
  kiloclaw: { x: 36, y: 19 },
  kimiclaw: { x: 64, y: 19 },
  manusclaw: { x: 80, y: 21 },

  // === ZONE: Orchestration (middle) ===
  david: { x: 50, y: 28 },

  // Main agents — wide ring
  dexter: { x: 15, y: 34 },
  sienna: { x: 85, y: 34 },

  // Mac Studio — CENTER HUB
  "mac-studio": { x: 50, y: 43 },

  nano: { x: 15, y: 52 },
  memo: { x: 85, y: 52 },

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
