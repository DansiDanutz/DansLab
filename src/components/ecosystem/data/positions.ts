export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Better spread with visual zones: Comms top, Orchestration middle, Infrastructure bottom
export const positions: Record<string, NodePosition> = {
  // === ZONE: Human + Channels (top) ===
  dan: { x: 50, y: 10 },

  telegram: { x: 28, y: 10 },
  slack: { x: 50, y: 18.5 },
  discord: { x: 72, y: 10 },

  // Slack agents — flanking slack
  kiloclaw: { x: 36, y: 23 },
  kimiclaw: { x: 64, y: 23 },
  manusclaw: { x: 80, y: 25 },

  // === ZONE: Orchestration (middle) ===
  david: { x: 50, y: 31 },

  // Main agents — wide ring
  dexter: { x: 15, y: 36 },
  sienna: { x: 85, y: 36 },

  // Mac Studio — CENTER HUB
  "mac-studio": { x: 50, y: 47 },

  nano: { x: 15, y: 54.5 },
  memo: { x: 85, y: 54.5 },

  // === ZONE: OpenClaw Mesh ===
  "openclaw-1": { x: 35, y: 57.5 },
  "openclaw-2": { x: 65, y: 57.5 },
  "openclaw-3": { x: 35, y: 67 },
  "openclaw-4": { x: 65, y: 67 },

  // === ZONE: Support Layer ===
  vector: { x: 50, y: 63.5 },
  monitor: { x: 8, y: 72 },
  doctor: { x: 18, y: 72 },
  learning: { x: 28, y: 72 },
  model: { x: 72, y: 72 },
  gsd: { x: 82, y: 72 },
  ssh: { x: 92, y: 72 },

  // === ZONE: Infrastructure (bottom) ===
  autoforge: { x: 8, y: 82.5 },
  github: { x: 20, y: 82.5 },
  pope: { x: 32, y: 82.5 },
  vercel: { x: 44, y: 82.5 },
  stripe: { x: 56, y: 82.5 },
  supabase: { x: 68, y: 82.5 },
  update: { x: 80, y: 82.5 },
};
