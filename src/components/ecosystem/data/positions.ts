export interface NodePosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Positions as percentages of container width/height
// Layout: channels top, main agents middle ring, mac studio center, support agents bottom ring
export const positions: Record<string, NodePosition> = {
  // Communication Channels — top row
  telegram: { x: 30, y: 5 },
  slack: { x: 50, y: 5 },
  discord: { x: 70, y: 5 },

  // Slack agents — flanking slack
  kiloclaw: { x: 38, y: 14 },
  mykimik2: { x: 62, y: 14 },

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
  vector: { x: 46, y: 68 },
  model: { x: 58, y: 68 },
  gsd: { x: 70, y: 68 },
  ssh: { x: 82, y: 68 },

  // Bottom row
  autoforge: { x: 10, y: 82 },
  github: { x: 25, y: 82 },
  pope: { x: 38, y: 82 },
  vercel: { x: 52, y: 82 },
  stripe: { x: 65, y: 82 },
  supabase: { x: 78, y: 82 },
  update: { x: 90, y: 82 },
};
