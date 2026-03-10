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
        activeConnections: ["kiloclaw-doctor", "kiloclaw-monitor", "doctor-monitor"],
        narration: "KiloClaw alerts Doctor and Monitor. Doctor diagnoses the issue...",
        duration: 2500,
      },
      {
        activeAgents: ["doctor", "david", "openclaw-3", "openclaw-4"],
        activeConnections: ["doctor-david", "david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"],
        narration: "David routes the fix through OpenClaw reviewer and automation pair...",
        duration: 2500,
      },
      {
        activeAgents: ["openclaw-4", "autoforge", "github", "pope"],
        activeConnections: ["openclaw-4-autoforge", "autoforge-github", "github-pope"],
        narration: "AutoForge writes the fix, pushes to GitHub, Pope runs CI...",
        duration: 2500,
      },
      {
        activeAgents: ["github", "vercel", "monitor"],
        activeConnections: ["github-vercel", "monitor-vercel"],
        narration: "Deployed to Vercel! Monitor confirms the fix is live. ✅",
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
        activeAgents: ["learning", "openclaw-2"],
        activeConnections: ["openclaw-2-learning"],
        narration: "DansLabLearning reviews yesterday with OpenClaw-02's research insights...",
        duration: 2500,
      },
      {
        activeAgents: ["learning", "vector"],
        activeConnections: ["learning-vector"],
        narration: "Insights stored in Vector Memory for future reference...",
        duration: 2500,
      },
      {
        activeAgents: ["vector", "model", "learning"],
        activeConnections: ["learning-model", "vector-model"],
        narration: "Model optimizes prompts using Vector context and Learning patterns...",
        duration: 2500,
      },
      {
        activeAgents: ["update", "gsd", "autoforge", "model"],
        activeConnections: ["update-gsd", "update-autoforge", "update-model"],
        narration: "Update pushes latest versions to GSD, AutoForge, and Model...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "dexter", "nano", "memo", "sienna", "openclaw-1", "openclaw-4"],
        activeConnections: ["david-dexter", "david-nano", "david-memo", "david-sienna", "david-openclaw-1", "david-openclaw-4"],
        narration: "All agents receive improvements. The lab is smarter today! 🚀",
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
        activeConnections: ["dan-telegram", "dan-mac-studio"],
        narration: "Dan posts a new idea in Telegram from his Mac Studio...",
        duration: 2500,
      },
      {
        activeAgents: ["dan", "david", "openclaw-2", "vector"],
        activeConnections: ["dan-david", "david-openclaw-2", "openclaw-2-vector"],
        narration: "David delegates research to OpenClaw-02, who checks Vector Memory...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-1", "autoforge", "gsd"],
        activeConnections: ["david-openclaw-1", "openclaw-1-gsd", "gsd-autoforge"],
        narration: "OpenClaw-01 builds using GSD framework, AutoForge writes code...",
        duration: 2500,
      },
      {
        activeAgents: ["autoforge", "github", "openclaw-3", "pope"],
        activeConnections: ["autoforge-github", "openclaw-3-github", "github-pope"],
        narration: "Code pushed. OpenClaw-03 reviews PRs. Pope runs CI...",
        duration: 2500,
      },
      {
        activeAgents: ["vercel", "kimiclaw", "discord", "telegram"],
        activeConnections: ["github-vercel", "kimiclaw-dexter", "david-discord", "david-telegram"],
        narration: "Deployed! KimiClaw amplifies the release across all channels! 🎉",
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
        activeAgents: ["stripe", "memo", "sienna"],
        activeConnections: ["memo-stripe", "sienna-stripe"],
        narration: "New subscriptions arrive on MyWork-ai and zmarty.me...",
        duration: 2500,
      },
      {
        activeAgents: ["stripe", "supabase"],
        activeConnections: ["stripe-supabase"],
        narration: "Stripe processes payments. Records stored in Supabase...",
        duration: 2500,
      },
      {
        activeAgents: ["nano", "david", "supabase"],
        activeConnections: ["david-nano", "nano-supabase", "nano-stripe"],
        narration: "Nano creates specialized agents, enrolls them on nervix.ai...",
        duration: 2500,
      },
      {
        activeAgents: ["monitor", "supabase", "david"],
        activeConnections: ["monitor-supabase", "supabase-david", "david-monitor"],
        narration: "Monitor tracks DB health. David confirms the system is green...",
        duration: 2500,
      },
      {
        activeAgents: ["kimiclaw", "manusclaw", "slack", "discord", "telegram"],
        activeConnections: ["slack-kimiclaw", "slack-manusclaw", "kimiclaw-manusclaw", "david-discord", "david-telegram"],
        narration: "KimiClaw promotes, ManusClaw executes. Revenue flows! 💸",
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
        activeAgents: ["dan", "david", "mac-studio"],
        activeConnections: ["dan-david", "dan-mac-studio", "ms-david"],
        narration: "Dan sets the next priority through his Mac Studio to David...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-1", "openclaw-2", "gsd", "vector"],
        activeConnections: ["david-openclaw-1", "david-openclaw-2", "openclaw-1-openclaw-2", "openclaw-1-gsd", "openclaw-2-vector"],
        narration: "Builder and Researcher split work — using GSD framework and Vector memory...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-3", "openclaw-4", "autoforge", "github"],
        activeConnections: ["david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4", "openclaw-4-autoforge", "openclaw-3-github"],
        narration: "Reviewer validates, Automation runs scripts, AutoForge ships code...",
        duration: 2500,
      },
      {
        activeAgents: ["kiloclaw", "kimiclaw", "manusclaw", "slack"],
        activeConnections: ["slack-kiloclaw", "slack-kimiclaw", "slack-manusclaw", "kimiclaw-manusclaw"],
        narration: "Channel agents moderate, amplify, and operationalize the result.",
        duration: 2500,
      },
    ],
  },
];
