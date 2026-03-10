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
        activeAgents: ["kiloclaw", "doctor", "monitor"],
        activeConnections: ["kiloclaw-doctor", "doctor-monitor"],
        narration: "KiloClaw escalates to Doctor. Doctor checks Monitor's diagnostics...",
        duration: 2500,
      },
      {
        activeAgents: ["doctor", "david", "openclaw-3", "openclaw-4"],
        activeConnections: ["doctor-david", "david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"],
        narration: "David routes fix through OpenClaw reviewer and automation pair...",
        duration: 2500,
      },
      {
        activeAgents: ["openclaw-4", "autoforge", "github", "pope"],
        activeConnections: ["openclaw-4-autoforge", "autoforge-github", "pope-github"],
        narration: "AutoForge writes the fix, pushes to GitHub. Pope creates a PR...",
        duration: 2500,
      },
      {
        activeAgents: ["github", "vercel", "monitor"],
        activeConnections: ["github-vercel", "monitor-vercel"],
        narration: "Auto-deployed to Vercel! Monitor confirms the fix is live. ✅",
        duration: 2500,
      },
    ],
  },
  {
    id: "learning",
    name: "Learn & Improve",
    icon: "🧠",
    description: "See how the system learns from yesterday — daily summaries at 23:55 UTC",
    steps: [
      {
        activeAgents: ["learning", "supabase"],
        activeConnections: ["learning-supabase"],
        narration: "DansLabLearning reviews yesterday's daily_summaries from Supabase...",
        duration: 2500,
      },
      {
        activeAgents: ["learning", "vector", "supabase"],
        activeConnections: ["learning-vector", "vector-supabase"],
        narration: "Insights stored in Vector Memory (agent_context table)...",
        duration: 2500,
      },
      {
        activeAgents: ["vector", "model", "learning"],
        activeConnections: ["learning-model", "vector-model"],
        narration: "Model optimizes fallback chains: Opus→Sonnet→GPT-4.1→Gemini→ZAI...",
        duration: 2500,
      },
      {
        activeAgents: ["update", "gsd", "autoforge", "model"],
        activeConnections: ["update-gsd", "update-autoforge", "update-model"],
        narration: "Update pushes latest tool versions via devops-control-repo audit cycle...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "dexter", "nano", "memo", "sienna"],
        activeConnections: ["david-dexter", "david-nano", "david-memo", "david-sienna"],
        narration: "All agents receive improvements. The lab is smarter today! 🚀",
        duration: 2500,
      },
    ],
  },
  {
    id: "new-feature",
    name: "New Feature",
    icon: "✨",
    description: "From Dan's Telegram DM to deployed feature",
    steps: [
      {
        activeAgents: ["dan", "dexter", "telegram"],
        activeConnections: ["dan-dexter", "dan-telegram", "dexter-telegram"],
        narration: "Dan DMs Dexter on Telegram with a new feature idea...",
        duration: 2500,
      },
      {
        activeAgents: ["dexter", "david", "openclaw-2", "vector"],
        activeConnections: ["david-dexter", "david-openclaw-2", "openclaw-2-vector"],
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
        activeConnections: ["autoforge-github", "openclaw-3-github", "pope-github"],
        narration: "Code pushed. OpenClaw-03 reviews PRs. Pope runs CI in Docker...",
        duration: 2500,
      },
      {
        activeAgents: ["github", "vercel", "kimiclaw", "telegram"],
        activeConnections: ["github-vercel", "kimiclaw-dexter", "david-telegram"],
        narration: "Auto-deployed to Vercel! KimiClaw promotes across channels! 🎉",
        duration: 2500,
      },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Flow",
    icon: "💰",
    description: "How subscriptions and credits flow through the system",
    steps: [
      {
        activeAgents: ["stripe", "memo"],
        activeConnections: ["memo-stripe"],
        narration: "New subscription on CrawBoard. Stripe webhook hits Memo's purchase-webhook...",
        duration: 2500,
      },
      {
        activeAgents: ["stripe", "supabase", "github"],
        activeConnections: ["stripe-supabase", "stripe-github"],
        narration: "Payment recorded in Supabase. Auto-grants GitHub repo access...",
        duration: 2500,
      },
      {
        activeAgents: ["nano", "david", "supabase"],
        activeConnections: ["david-nano", "nano-supabase", "nano-stripe"],
        narration: "Nano enrolls specialized agents into Nervix Federation via nervix-cli...",
        duration: 2500,
      },
      {
        activeAgents: ["dexter", "monitor", "supabase"],
        activeConnections: ["dexter-supabase", "dexter-monitor", "monitor-supabase"],
        narration: "Dexter's crons push stats to Supabase. Monitor confirms system green...",
        duration: 2500,
      },
      {
        activeAgents: ["kimiclaw", "manusclaw", "slack", "telegram"],
        activeConnections: ["slack-kimiclaw", "slack-manusclaw", "kimiclaw-manusclaw", "david-telegram"],
        narration: "KimiClaw promotes, ManusClaw executes operations. Revenue flows! 💸",
        duration: 2500,
      },
    ],
  },
  {
    id: "lab-sync",
    name: "Lab Sync",
    icon: "🧬",
    description: "Dan → Dexter → David → OpenClaw mesh tightens the loop",
    steps: [
      {
        activeAgents: ["dan", "dexter", "david", "mac-studio"],
        activeConnections: ["dan-dexter", "dan-mac-studio", "ms-david", "david-dexter"],
        narration: "Dan DMs Dexter. David picks up orchestration from Mac Studio...",
        duration: 2500,
      },
      {
        activeAgents: ["david", "openclaw-1", "openclaw-2", "gsd", "vector"],
        activeConnections: ["david-openclaw-1", "david-openclaw-2", "openclaw-1-openclaw-2", "openclaw-1-gsd", "openclaw-2-vector"],
        narration: "Builder and Researcher split work — GSD framework + Vector memory...",
        duration: 2500,
      },
      {
        activeAgents: ["openclaw-3", "openclaw-4", "autoforge", "github"],
        activeConnections: ["openclaw-3-openclaw-4", "openclaw-4-autoforge", "openclaw-3-github", "autoforge-github"],
        narration: "Reviewer validates. Automation ships. AutoForge pushes code...",
        duration: 2500,
      },
      {
        activeAgents: ["dexter", "memo", "sienna", "supabase", "telegram"],
        activeConnections: ["dexter-memo", "dexter-sienna", "dexter-supabase", "telegram-supabase"],
        narration: "Dexter SSHs updates to Memo and Sienna. All synced via Supabase. Team Avatars notified.",
        duration: 2500,
      },
    ],
  },
];
