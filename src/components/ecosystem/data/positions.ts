export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Better spread with visual zones: Comms top, Orchestration middle, Infrastructure bottom
export const positions: Record<string, NodePosition> = {
  // === ZONE: Human + Channels (top) ===
  dan: { x: 50, y: 8 },

  telegram: { x: 28, y: 8 },
  slack: { x: 50, y: 17 },
  discord: { x: 72, y: 8 },

  // Slack agents — flanking slack
  kiloclaw: { x: 36, y: 20 },
  kimiclaw: { x: 64, y: 20 },
  manusclaw: { x: 80, y: 22 },

  // === ZONE: Orchestration (middle) ===
  david: { x: 50, y: 30 },

  // Main agents — wide ring
  dexter: { x: 15, y: 36 },
  sienna: { x: 85, y: 36 },

  // Mac Studio — CENTER HUB
  "mac-studio": { x: 50, y: 46 },

  nano: { x: 15, y: 56 },
  memo: { x: 85, y: 56 },

  // === ZONE: OpenClaw Mesh ===
  "openclaw-1": { x: 35, y: 58 },
  "openclaw-2": { x: 65, y: 58 },
  "openclaw-3": { x: 35, y: 70 },
  "openclaw-4": { x: 65, y: 70 },

  // === ZONE: Support Layer ===
  vector: { x: 50, y: 64 },
  monitor: { x: 6, y: 72 },
  doctor: { x: 16, y: 72 },
  learning: { x: 26, y: 72 },
  model: { x: 74, y: 72 },
  gsd: { x: 84, y: 72 },
  ssh: { x: 94, y: 72 },

  // === ZONE: Infrastructure (bottom) ===
  autoforge: { x: 6, y: 87 },
  github: { x: 18, y: 87 },
  pope: { x: 30, y: 87 },
  vercel: { x: 42, y: 87 },
  stripe: { x: 58, y: 87 },
  supabase: { x: 70, y: 87 },
  update: { x: 82, y: 87 },
};
