export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Layout: channels top, main agents middle ring, mac studio center, support agents bottom ring
export const positions: Record<string, NodePosition> = {
  // Human entry
  dan: { x: 50, y: 12 },

  // Communication Channels — top row
  telegram: { x: 30, y: 5 },
  slack: { x: 50, y: 5 },
  discord: { x: 70, y: 5 },

  // Slack agents — flanking slack
  kiloclaw: { x: 38, y: 14 },
  kimiclaw: { x: 62, y: 14 },
  manusclaw: { x: 74, y: 16 },

  // David — top center orchestrator
  david: { x: 50, y: 24 },

  // Main agents — middle ring
  dexter: { x: 20, y: 34 },
  sienna: { x: 80, y: 34 },

  // Mac Studio — CENTER
  "mac-studio": { x: 50, y: 44 },

  nano: { x: 20, y: 54 },
  memo: { x: 80, y: 54 },

  // Support agents — bottom arc
  monitor: { x: 10, y: 68 },
  doctor: { x: 22, y: 68 },
  learning: { x: 34, y: 68 },
  vector: { x: 40, y: 68 },
  "openclaw-1": { x: 52, y: 66 },
  "openclaw-2": { x: 64, y: 66 },
  model: { x: 76, y: 68 },
  gsd: { x: 86, y: 68 },
  ssh: { x: 94, y: 68 },

  // Bottom row
  autoforge: { x: 10, y: 82 },
  github: { x: 25, y: 82 },
  pope: { x: 36, y: 82 },
  "openclaw-3": { x: 48, y: 82 },
  "openclaw-4": { x: 60, y: 82 },
  vercel: { x: 70, y: 82 },
  stripe: { x: 82, y: 82 },
  supabase: { x: 92, y: 82 },
  update: { x: 98, y: 82 },
};
