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
        activeAgents: ["doctor", "david", "autoforge"],
        activeConnections: ["supabase-david", "autoforge-github"],
        narration: "David assigns AutoForge to write the fix...",
        duration: 2500,
      },
      {
        activeAgents: ["autoforge", "github", "pope"],
        activeConnections: ["autoforge-github", "github-pope"],
        narration: "Code pushed to GitHub. Pope runs CI checks...",
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
        activeAgents: ["david", "dexter", "nano", "memo", "sienna"],
        activeConnections: ["david-dexter", "david-nano", "david-memo", "david-sienna"],
        narration: "All agents receive the improvements. Team is smarter today! 🚀",
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
        activeAgents: ["telegram", "mac-studio"],
        activeConnections: ["david-telegram"],
        narration: "Dan posts a new idea in Telegram from his Mac Studio...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "mac-studio"],
        activeConnections: ["ms-david"],
        narration: "David analyzes the request and plans the implementation...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "dexter", "autoforge"],
        activeConnections: ["david-dexter", "autoforge-github"],
        narration: "Dexter gets assigned. AutoForge starts coding...",
        duration: 2500,
      },
      {
        activeAgents: ["autoforge", "github", "pope"],
        activeConnections: ["autoforge-github", "github-pope"],
        narration: "Code pushed. Pope validates and runs the pipeline...",
        duration: 2500,
      },
      {
        activeAgents: ["vercel", "discord", "telegram"],
        activeConnections: ["github-vercel", "david-discord", "david-telegram"],
        narration: "Deployed to Vercel! Team notified across all channels! 🎉",
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
        activeAgents: ["mykimik2", "slack", "discord", "telegram"],
        activeConnections: ["slack-mykimik2", "david-discord", "david-telegram"],
        narration: "MyKimiK2 advertises the new agent across all channels! 💸",
        duration: 2500,
      },
    ],
  },
];
