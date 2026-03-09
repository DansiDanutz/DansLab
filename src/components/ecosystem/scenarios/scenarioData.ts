export interface ScenarioStep {
  activeAgents: string[];
  activeConnections: string[];
  narration: string;
  duration: number; // ms
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: ScenarioStep[];
}

export const scenarios: Scenario[] = [
  {
    id: "bug-fix",
    name: "Fix a Bug",
    icon: "🔧",
    description: "Watch how a bug gets detected and fixed automatically",
    steps: [
      {
        activeAgents: ["slack", "kiloclaw"],
        activeConnections: ["slack-kiloclaw"],
        narration: "A bug report arrives in Slack. KiloClaw picks it up...",
        duration: 2500,
      },
      {
        activeAgents: ["kiloclaw", "monitor", "doctor"],
        activeConnections: ["doctor-monitor"],
        narration: "DansLabDoctor diagnoses the issue with Monitor's data...",
        duration: 2500,
      },
      {
        activeAgents: ["doctor", "david", "openclaw-3", "openclaw-4"],
        activeConnections: ["david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"],
        narration: "David routes the fix through the OpenClaw reviewer and automation pair...",
        duration: 2500,
      },
      {
        activeAgents: ["openclaw-4", "github", "pope", "manusclaw"],
        activeConnections: ["github-pope", "david-manusclaw"],
        narration: "ManusClaw drives the operational run while GitHub and Pope validate the changes...",
        duration: 2500,
      },
      {
        activeAgents: ["github", "vercel"],
        activeConnections: ["github-vercel"],
        narration: "All checks pass! Deploying to Vercel... Bug fixed! ✅",
        duration: 2500,
      },
    ],
  },
  {
    id: "learning",
    name: "Learn & Improve",
    icon: "🧠",
    description: "See how the system learns from yesterday's mistakes",
    steps: [
      {
        activeAgents: ["learning"],
        activeConnections: [],
        narration: "DansLabLearning reviews everything from yesterday...",
        duration: 2500,
      },
      {
        activeAgents: ["learning", "vector"],
        activeConnections: ["learning-vector"],
        narration: "Insights stored in Vector Memory for future reference...",
        duration: 2500,
      },
      {
        activeAgents: ["vector", "model"],
        activeConnections: ["learning-model"],
        narration: "DansLabModel optimizes prompts and fallback strategies...",
        duration: 2500,
      },
      {
        activeAgents: ["model", "gsd", "update"],
        activeConnections: ["update-gsd"],
        narration: "GSD Framework updated. All tools get latest versions...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "dexter", "nano", "memo", "sienna", "openclaw-1", "openclaw-2"],
        activeConnections: ["david-dexter", "david-nano", "david-memo", "david-sienna", "david-openclaw-1", "david-openclaw-2"],
        narration: "Core agents and OpenClaw builders receive the improvements. The lab is smarter today! 🚀",
        duration: 2500,
      },
    ],
  },
  {
    id: "new-feature",
    name: "New Feature",
    icon: "✨",
    description: "From idea to deployed feature in minutes",
    steps: [
      {
        activeAgents: ["dan", "telegram", "mac-studio"],
        activeConnections: ["dan-mac-studio", "david-telegram"],
        narration: "Dan kicks off a new idea from the entry point into the lab...",
        duration: 2500,
      },
      {
        activeAgents: ["dan", "david", "mac-studio", "openclaw-2"],
        activeConnections: ["dan-david", "ms-david", "david-openclaw-2"],
        narration: "David analyzes the request and OpenClaw-02 maps the approach...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "dexter", "openclaw-1", "autoforge"],
        activeConnections: ["david-dexter", "david-openclaw-1", "autoforge-github"],
        narration: "Dexter and OpenClaw-01 split the work while AutoForge starts writing code...",
        duration: 2500,
      },
      {
        activeAgents: ["autoforge", "github", "pope"],
        activeConnections: ["autoforge-github", "github-pope"],
        narration: "Code pushed. Pope validates and runs the pipeline...",
        duration: 2500,
      },
      {
        activeAgents: ["vercel", "discord", "telegram", "kimiclaw"],
        activeConnections: ["github-vercel", "david-discord", "david-telegram", "slack-kimiclaw"],
        narration: "Deployed to Vercel. KimiClaw amplifies the release across the whole network! 🎉",
        duration: 2500,
      },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Flow",
    icon: "💰",
    description: "How DansLab generates revenue through subscriptions and credits",
    steps: [
      {
        activeAgents: ["stripe"],
        activeConnections: [],
        narration: "A new user subscribes to the platform...",
        duration: 2500,
      },
      {
        activeAgents: ["stripe", "supabase"],
        activeConnections: ["stripe-supabase"],
        narration: "DansLabStripe processes payment. Data stored in Supabase...",
        duration: 2500,
      },
      {
        activeAgents: ["nano", "david"],
        activeConnections: ["david-nano"],
        narration: "Nano creates a specialized agent for the user...",
        duration: 2500,
      },
      {
        activeAgents: ["nano", "david", "supabase"],
        activeConnections: ["supabase-david"],
        narration: "Agent enrolled into nervix.ai ecosystem...",
        duration: 2500,
      },
      {
        activeAgents: ["kimiclaw", "slack", "discord", "telegram", "manusclaw"],
        activeConnections: ["slack-kimiclaw", "slack-manusclaw", "david-discord", "david-telegram"],
        narration: "KimiClaw and ManusClaw push the new offer across channels and into execution! 💸",
        duration: 2500,
      },
    ],
  },
  {
    id: "lab-sync",
    name: "Lab Sync",
    icon: "🧬",
    description: "Watch Dan, David, and the OpenClaw mesh tighten the internal loop",
    steps: [
      {
        activeAgents: ["dan", "david"],
        activeConnections: ["dan-david"],
        narration: "Dan sets the next priority and feeds it directly into David...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-1", "openclaw-2"],
        activeConnections: ["david-openclaw-1", "david-openclaw-2", "openclaw-1-openclaw-2"],
        narration: "The builder and researcher OpenClaw agents split discovery and implementation...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-3", "openclaw-4"],
        activeConnections: ["david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"],
        narration: "Reviewer and automation agents tighten quality and execution...",
        duration: 2500,
      },
      {
        activeAgents: ["kiloclaw", "kimiclaw", "manusclaw", "slack"],
        activeConnections: ["slack-kiloclaw", "slack-kimiclaw", "slack-manusclaw", "kimiclaw-manusclaw"],
        narration: "The OpenClaw channel agents moderate, amplify, and operationalize the result.",
        duration: 2500,
      },
    ],
  },
];
