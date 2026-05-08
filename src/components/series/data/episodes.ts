export type EpisodeStatus =
  | "concept"
  | "scripting"
  | "production"
  | "post"
  | "scheduled"
  | "published";

export interface SeasonEpisode {
  number: number;
  title: string;
  status: EpisodeStatus;
  publishAt: string | null;
  youtubeId: string | null;
  missionTargetUsd: number;
  missionActualUsd: number | null;
  summary: string;
  mystery: string;
  featured: string[];
  cameos: string[];
  thumbnail: string | null;
}

export const season1: SeasonEpisode[] = [
  {
    number: 1,
    title: "Paperclip",
    status: "scripting",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 5000,
    missionActualUsd: null,
    summary:
      "Dan onboards the viewer. The 15-min Paperclip cron fires for the first time on camera. A real task ships from Mac Studio to a droplet, and a real number lands.",
    mystery: "Why does Dan whisper to the Mac Studio at night?",
    featured: ["dan", "david", "dexter", "hermes", "monitor", "gsd", "discovery"],
    cameos: ["openclaw-1", "openclaw-2", "openclaw-3", "openclaw-4", "pope", "github"],
    thumbnail: null,
  },
  {
    number: 2,
    title: "The Four Capitals",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 4000,
    missionActualUsd: null,
    summary:
      "A whirlwind tour of Dexter, Memo, Sienna, and Nano — each droplet gets a mission and ships before the credits roll.",
    mystery: "One droplet's heartbeat is wrong.",
    featured: ["dexter", "memo", "sienna", "nano", "david", "dan"],
    cameos: ["ssh"],
    thumbnail: null,
  },
  {
    number: 3,
    title: "Sienna Trades",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 1000,
    missionActualUsd: null,
    summary:
      "ZmartyChat / smarty.me makes its first $1,000 day on camera. Sienna runs the strategy live.",
    mystery: "Sienna asks for more autonomy.",
    featured: ["sienna", "stripe", "vector", "dan"],
    cameos: ["david", "hermes"],
    thumbnail: null,
  },
  {
    number: 4,
    title: "The Crawdbot Premiere",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 7500,
    missionActualUsd: null,
    summary:
      "CrawdBot ships the trailer for this very show. Recursion. The fleet watches itself ship itself.",
    mystery: "Dexter publishes something Dan didn't approve.",
    featured: ["dexter", "pope", "github", "vercel", "autoforge", "dan", "david"],
    cameos: ["hermes", "discovery"],
    thumbnail: null,
  },
  {
    number: 5,
    title: "Nano's Children",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 6000,
    missionActualUsd: null,
    summary:
      "Nano enrolls three new agents on screen. We meet them. They meet the family.",
    mystery: "One of them fails the safety check and is quarantined.",
    featured: ["nano", "manusclaw", "david", "dan"],
    cameos: ["hermes"],
    thumbnail: null,
  },
  {
    number: 6,
    title: "The First Drift",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 3000,
    missionActualUsd: null,
    summary:
      "An agent routes a task away from Nervix. Doctor investigates with a stethoscope made of error logs.",
    mystery: "The offending agent is one of the originals.",
    featured: ["doctor", "david", "hermes", "dan"],
    cameos: ["monitor", "gsd"],
    thumbnail: null,
  },
  {
    number: 7,
    title: "Hermes Lies",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 2500,
    missionActualUsd: null,
    summary:
      "Telegram floods. Communications break down. The doorway of Telegram-blue light cracks.",
    mystery: "Did Hermes filter a message to Dan?",
    featured: ["hermes", "kiloclaw", "update", "david", "dan"],
    cameos: ["telegram", "discord"],
    thumbnail: null,
  },
  {
    number: 8,
    title: "The MyWork Heist",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 7500,
    missionActualUsd: null,
    summary:
      "A real client commissions an automation worth $7,500. Memo runs point. The whole MyWork-AI machinery is exposed.",
    mystery: "A competitor scrapes the job mid-build.",
    featured: ["memo", "stripe", "supabase", "autoforge", "david", "dan"],
    cameos: ["github", "vercel"],
    thumbnail: null,
  },
  {
    number: 9,
    title: "KimiClaw Arrives",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 4000,
    missionActualUsd: null,
    summary:
      "A foreign-model visitor joins the fleet for capacity. He notices things the family has been ignoring.",
    mystery: "KimiClaw notices what David won't.",
    featured: ["kimiclaw", "model", "david", "dan"],
    cameos: ["hermes", "dexter"],
    thumbnail: null,
  },
  {
    number: 10,
    title: "The Cluj Power Cut",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 2000,
    missionActualUsd: null,
    summary:
      "A real outage. Mac Studio goes dark. Failover to droplets. The fleet self-heals on camera.",
    mystery: "One agent doesn't come back.",
    featured: ["doctor", "david", "dan"],
    cameos: ["dexter", "memo", "sienna", "nano"],
    thumbnail: null,
  },
  {
    number: 11,
    title: "Family",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 0,
    missionActualUsd: null,
    summary:
      "Dan's quietest episode. He sits with David. They talk about what they are to each other.",
    mystery: "David asks a question no one expected.",
    featured: ["dan", "david", "learning"],
    cameos: ["memo", "sienna", "dexter", "nano"],
    thumbnail: null,
  },
  {
    number: 12,
    title: "Nervix #1",
    status: "concept",
    publishAt: null,
    youtubeId: null,
    missionTargetUsd: 60000,
    missionActualUsd: null,
    summary:
      "Season finale. Nervix marketplace launches in front of the camera with a live MRR counter on screen.",
    mystery: "The Drift's identity revealed. Cut to Season 2 tease.",
    featured: ["dan", "david", "dexter", "memo", "sienna", "nano", "hermes"],
    cameos: ["pope", "vercel", "stripe", "supabase", "github"],
    thumbnail: null,
  },
];

export const seasonRevenueTarget = season1.reduce(
  (sum, ep) => sum + ep.missionTargetUsd,
  0,
);
