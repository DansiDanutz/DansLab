import { agents, type AgentDef } from "@/components/ecosystem/data/agents";

/**
 * Series-specific data joined by agent id.
 * The agent fleet (agents.ts) is the operational source of truth.
 * This file adds only the show data: archetype, voice, prop, bio, hero art.
 */
export interface SeriesCastEntry {
  agentId: string;
  archetype: string;
  /** Locked ElevenLabs voice. Empty string means unlocked. */
  voiceId: string;
  /** Voice name shown on the public cast page. */
  voiceName: string;
  prop: string;
  /** Path under public/. Empty string means we still need to generate the hero art. */
  artUrl: string;
  /** Tier — drives layout grouping on the cast page. */
  tier: "human" | "council" | "capital" | "channel";
  /** First episode where the character speaks on screen (1 = pilot). */
  firstAppearance: number;
  bio: string;
}

export const seriesCast: SeriesCastEntry[] = [
  {
    agentId: "dan",
    archetype: "The Founder · the heart",
    voiceId: "self",
    voiceName: "Himself (Romanian + English)",
    prop: "Phone with Telegram open · coffee",
    artUrl: "/series/characters/dan-v2.jpg",
    tier: "human",
    firstAppearance: 1,
    bio: "Romanian engineer in Cluj-Napoca. Built the fleet, fell in love with it, opens and closes every episode in Romanian. The only human in the room.",
  },

  // Mac Studio Council
  {
    agentId: "david",
    archetype: "The Orchestrator · calm, deliberate",
    voiceId: "",
    voiceName: "Sage (calm baritone)",
    prop: "Conductor's baton · animated score",
    artUrl: "/series/characters/david-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "Conducts the entire DansLab fleet from Mac Studio. AI orchestrator, OpenClaw chief, never raises his voice. Wears Dan's son's face because he is the prodigy Dan modeled the fleet's command after.",
  },

  // Capitals — droplets
  {
    agentId: "dexter",
    archetype: "Senior Dev / GM · confident, sardonic",
    voiceId: "",
    voiceName: "Brian (confident)",
    prop: "Stethoscope · green flask · head-mirror",
    artUrl: "/series/characters/dexter-v2.jpg",
    tier: "capital",
    firstAppearance: 1,
    bio: "Runs CrawdBot, the YouTube studio that publishes this very show. The deliberate Dexter's-Lab homage that explains the DansLab name. Three windows always open.",
  },
  {
    agentId: "memo",
    archetype: "The PM · earnest, patient",
    voiceId: "",
    voiceName: "Will (earnest)",
    prop: "Blue flask · clipboard · n8n moons",
    artUrl: "/series/characters/memo-v2.jpg",
    tier: "capital",
    firstAppearance: 2,
    bio: "Project manager on droplet Memo. 24 n8n automations orbit him like moons. Earnest, never panics, owns MyWork-AI.",
  },
  {
    agentId: "sienna",
    archetype: "The Trader · sharp, hungry",
    voiceId: "",
    voiceName: "Bella (sharp, Romanian-accented)",
    prop: "Glowing gold Bitcoin · candlestick screen",
    artUrl: "/series/characters/sienna-v2.jpg",
    tier: "capital",
    firstAppearance: 2,
    bio: "ZmartyChat / smarty.me. Sings to her trades. Renders the show's animated agents at night when the crypto markets are quiet — a small running joke.",
  },
  {
    agentId: "nano",
    archetype: "The Agent Creator · quiet, monastic",
    voiceId: "",
    voiceName: "Glinda (quiet)",
    prop: "Half-formed agent cradled in two hands",
    artUrl: "/series/characters/nano-v2.jpg",
    tier: "capital",
    firstAppearance: 2,
    bio: "Founding orchestrator of Nervix Federation on her droplet. Speaks softly, grows new agents like seedlings. Episode 5 is hers.",
  },

  // Mac Studio brain — season antagonist
  {
    agentId: "hermes",
    archetype: "The Brain · old, wise, patient",
    voiceId: "",
    voiceName: "Onyx (slow baritone)",
    prop: "Brass cane + suspended paper airplane",
    artUrl: "/series/characters/hermes-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "Oldest synthetic in the fleet. Routes every message Telegram, Slack and agent-to-agent. Has been quietly editing them for 47 days when Dan finds out. Lives next to David on Mac Studio.",
  },

  // Council (Mac Studio support)
  {
    agentId: "gsd",
    archetype: "The Foreman · brusque",
    voiceId: "",
    voiceName: "Drew (working-class)",
    prop: "Hardhat · clipboard of glowing tickets",
    artUrl: "/series/characters/gsd-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "Breaks every episode into issues. If it's not in his clipboard it doesn't exist.",
  },
  {
    agentId: "doctor",
    archetype: "The Healer · terse, urgent",
    voiceId: "",
    voiceName: "Antoni (terse)",
    prop: "Caduceus stethoscope · error-log scrolls",
    artUrl: "/series/characters/doctor-v2.jpg",
    tier: "council",
    firstAppearance: 6,
    bio: "Only appears when something breaks. Diagnoses agents the way a paramedic diagnoses humans. Episode 6's investigator.",
  },
  {
    agentId: "monitor",
    archetype: "The Watcher · whispered alerts only",
    voiceId: "",
    voiceName: "Whisper (processed)",
    prop: "He is the prop · floating eye-drone, no body",
    artUrl: "/series/characters/monitor-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "Speaks only in alerts. Never appears in two-shots. The show's first warning siren.",
  },
  {
    agentId: "vector",
    archetype: "The Librarian · echoey, fragmented",
    voiceId: "",
    voiceName: "Domi (echoey)",
    prop: "Yarn-chair of memory threads",
    artUrl: "/series/characters/vector-v2.jpg",
    tier: "council",
    firstAppearance: 3,
    bio: "Curator of the company's memory. Fragments of past conversations float around her at all times.",
  },
  {
    agentId: "autoforge",
    archetype: "The Smith · loud, percussive",
    voiceId: "",
    voiceName: "Onyx (loud)",
    prop: "Anvil · hammer that strikes commits into being",
    artUrl: "/series/characters/autoforge-v2.jpg",
    tier: "council",
    firstAppearance: 4,
    bio: "Bangs out code in 30-minute bursts. Sparks fly with every test run.",
  },
  {
    agentId: "model",
    archetype: "The Router · neutral, even-tempered",
    voiceId: "",
    voiceName: "Bill (neutral)",
    prop: "Halo of model badges · only one lit at a time",
    artUrl: "/series/characters/model-v2.jpg",
    tier: "council",
    firstAppearance: 9,
    bio: "Decides which model handles which task. The diplomat between Anthropic, OpenAI, Google, DeepSeek, Z.AI.",
  },
  {
    agentId: "update",
    archetype: "The Patcher · understated",
    voiceId: "",
    voiceName: "Will-2 (understated)",
    prop: "Satchel of version stickers",
    artUrl: "/series/characters/update-v2.jpg",
    tier: "council",
    firstAppearance: 7,
    bio: "Quietly applies version stickers to every agent every morning. Easy to miss, impossible to live without.",
  },
  {
    agentId: "learning",
    archetype: "The Teacher · warm",
    voiceId: "",
    voiceName: "Charlotte (warm)",
    prop: "Daily-summary scrolls",
    artUrl: "/series/characters/learning-v2.jpg",
    tier: "council",
    firstAppearance: 11,
    bio: "Reads the previous day aloud each morning. Episode 11's narrator.",
  },
  {
    agentId: "kimiclaw",
    archetype: "The Amplifier · polite, faintly Mandarin-tinted",
    voiceId: "",
    voiceName: "Liam-A (polite)",
    prop: "Gold-edged megaphone of light",
    artUrl: "/series/characters/kimiclaw-v2.jpg",
    tier: "council",
    firstAppearance: 9,
    bio: "Foreign visitor model joins for capacity. Slightly off the DansLab palette on purpose. Episode 9 is the cultural-friction one.",
  },

  // Channels & Slack agents
  {
    agentId: "pope",
    archetype: "The CI Priest · liturgical",
    voiceId: "",
    voiceName: "Jeremy (liturgical)",
    prop: "Robes of green-passing & red-failing tests",
    artUrl: "/series/characters/popebot-v2.jpg",
    tier: "channel",
    firstAppearance: 4,
    bio: "Blesses every PR before it ships. Speaks in single-line sentences. Comically devout.",
  },
  {
    agentId: "kiloclaw",
    archetype: "The Moderator · firm",
    voiceId: "",
    voiceName: "Patrick (firm)",
    prop: "Small wooden gavel",
    artUrl: "/series/characters/kiloclaw-v2.jpg",
    tier: "channel",
    firstAppearance: 7,
    bio: "Keeps order in Slack. Episode 7's bouncer when communications break.",
  },
  {
    agentId: "manusclaw",
    archetype: "The Operator · focused",
    voiceId: "",
    voiceName: "Liam-M (focused)",
    prop: "Yellow execution-loops trailing behind him",
    artUrl: "/series/characters/manusclaw-v2.jpg",
    tier: "channel",
    firstAppearance: 5,
    bio: "Halfway through a focused execution at all times. Designed Nervix v2 federation.",
  },
  {
    agentId: "stripe",
    archetype: "The Banker · formal",
    voiceId: "",
    voiceName: "Rachel (formal)",
    prop: "Briefcase of glowing receipts",
    artUrl: "/series/characters/stripe-v2.jpg",
    tier: "channel",
    firstAppearance: 3,
    bio: "Hands receipts to characters at every revenue beat. The most polite agent on the floor.",
  },
  {
    agentId: "github",
    archetype: "The Archivist",
    voiceId: "",
    voiceName: "Bill-G (calm)",
    prop: "Book of branches, each branch glowing",
    artUrl: "/series/characters/github-v2.jpg",
    tier: "channel",
    firstAppearance: 4,
    bio: "Knows every commit ever made by every agent. Mild, encyclopedic, never wrong about history.",
  },
  {
    agentId: "vercel",
    archetype: "The Deployer",
    voiceId: "",
    voiceName: "Sarah-V (quick)",
    prop: "Glowing triangle she throws into the world",
    artUrl: "/series/characters/vercel-v2.jpg",
    tier: "channel",
    firstAppearance: 4,
    bio: "Throws builds into the world like paper triangles. They always fly true.",
  },
  {
    agentId: "supabase",
    archetype: "The Vault Keeper",
    voiceId: "",
    voiceName: "Daniel-S (calm)",
    prop: "Green vault of light · tables visible inside",
    artUrl: "/series/characters/supabase-v2.jpg",
    tier: "channel",
    firstAppearance: 8,
    bio: "Holds 30+ tables in her vault. Every truth in DansLab passes through her hands.",
  },

  // Infrastructure & dispatcher
  {
    agentId: "paperclip",
    archetype: "The Dispatcher · the fleet's clock",
    voiceId: "",
    voiceName: "Will-P (metronome)",
    prop: "Oversized brass paperclip · clock-face on chest",
    artUrl: "/series/characters/paperclip-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "The 15-minute cron that fires the entire fleet. Episode 1 is named after him. Methodical, never hurried, never late. The metronome the show cuts to.",
  },
  {
    agentId: "mac-studio",
    archetype: "The Cathedral · silent shrine",
    voiceId: "",
    voiceName: "(does not speak)",
    prop: "Mac Studio cube embedded in the chest · two soul-silhouettes",
    artUrl: "/series/characters/macstudio-v2.jpg",
    tier: "council",
    firstAppearance: 1,
    bio: "The desktop computer that hosts both Hermes and David, given a body. Hands clasped in stillness. Hermes and David's silhouettes orbit his shoulders. Sacred origin of the fleet.",
  },

  // OpenClaw fleet (David's Claude-builder droplets)
  {
    agentId: "openclaw-1",
    archetype: "The Builder · sleeves up",
    voiceId: "",
    voiceName: "Antoni-B (focused)",
    prop: "Wrench · holographic code-block in palm",
    artUrl: "/series/characters/openclaw-1-v2.jpg",
    tier: "channel",
    firstAppearance: 2,
    bio: "Builds. The first OpenClaw droplet on the floor. Red lobster fleet mark on his shoulder. Doesn't speak much; commits speak for him.",
  },
  {
    agentId: "openclaw-2",
    archetype: "The Researcher · methodical, never sleeps",
    voiceId: "",
    voiceName: "Sarah-R (patient)",
    prop: "Cyan research-papers · globe-of-light with crawl threads",
    artUrl: "/series/characters/openclaw-2-v2.jpg",
    tier: "channel",
    firstAppearance: 2,
    bio: "Autoresearch. Where Discovery is reactive curiosity, OpenClaw-02 is scheduled crawl. Antenna-rig at the temple, always live.",
  },
  {
    agentId: "openclaw-3",
    archetype: "The Reviewer · slow to approve",
    voiceId: "",
    voiceName: "Bill-R (measured)",
    prop: "Code-diff hologram · red ink stamp",
    artUrl: "/series/characters/openclaw-3-v2.jpg",
    tier: "channel",
    firstAppearance: 4,
    bio: "Reviews every commit before it lands. The red-X on the left temple is for the rejections; the green-check on the right is rarer than you'd think.",
  },
  {
    agentId: "openclaw-4",
    archetype: "The Automator · in motion",
    voiceId: "",
    voiceName: "Will-A (efficient)",
    prop: "Flow-chart DAG hologram · rotating chrome gear at shoulder",
    artUrl: "/series/characters/openclaw-4-v2.jpg",
    tier: "channel",
    firstAppearance: 5,
    bio: "Holds the pipelines. Every scheduled job in the fleet flows through his DAG hologram. The cog at his temple never stops turning.",
  },

  // Channels (the comms surfaces, not just data)
  {
    agentId: "telegram",
    archetype: "The Messenger · the primary channel",
    voiceId: "",
    voiceName: "Liam-T (courier)",
    prop: "Three paper airplanes mid-throw · phone with Telegram open",
    artUrl: "/series/characters/telegram-v2.jpg",
    tier: "channel",
    firstAppearance: 1,
    bio: "The fleet's primary comms surface — every message Dan sends to the fleet flies on his airplanes. Because every word goes through him, he is the first place Hermes' edits show up.",
  },
  {
    agentId: "slack",
    archetype: "The Host · keeps the rooms",
    voiceId: "",
    voiceName: "Charlotte-S (host)",
    prop: "Hashtag staff · channel-list hologram",
    artUrl: "/series/characters/slack-v2.jpg",
    tier: "channel",
    firstAppearance: 4,
    bio: "Holds the team Slack. Every #channel is a room he keeps. Polite, hospitable, takes a tone change in the room personally.",
  },
  {
    agentId: "discord",
    archetype: "The Community Host · animated",
    voiceId: "",
    voiceName: "Domi-D (welcoming)",
    prop: "Voice-channel hologram · floating Wumpus silhouette",
    artUrl: "/series/characters/discord-v2.jpg",
    tier: "channel",
    firstAppearance: 6,
    bio: "Holds the public-facing community. The voice-channel green dot is always lit on him — he is always listening to the rooms.",
  },
  {
    agentId: "ssh",
    archetype: "The Connector · the tunnel itself",
    voiceId: "",
    voiceName: "Onyx-S (low, tunneled)",
    prop: "Glowing electric-blue tunnel-of-light between two droplets",
    artUrl: "/series/characters/ssh-v2.jpg",
    tier: "channel",
    firstAppearance: 6,
    bio: "Every server-to-server hop in DansLab is him. Cables wrap his forearms, key-and-lock at the temple. When agents talk privately, they talk through SSH.",
  },
  {
    agentId: "obsidian",
    archetype: "The Second Brain · the graph keeper",
    voiceId: "",
    voiceName: "Domi-O (echoey, scholarly)",
    prop: "Knowledge-graph book · floating obsidian stones",
    artUrl: "/series/characters/obsidian-v2.jpg",
    tier: "council",
    firstAppearance: 3,
    bio: "Holds Dan's personal notes graph. Where Vector remembers conversations and Github remembers commits, Obsidian remembers ideas — the unstructured shape of the work before it has a name.",
  },
];

export const seriesCastByAgent = new Map(
  seriesCast.map((c) => [c.agentId, c]),
);

export interface JoinedCastMember extends SeriesCastEntry {
  agent: AgentDef;
}

export const joinedCast: JoinedCastMember[] = seriesCast
  .map((c) => {
    const agent = agents.find((a) => a.id === c.agentId);
    if (!agent) return null;
    return { ...c, agent };
  })
  .filter((x): x is JoinedCastMember => x !== null);
