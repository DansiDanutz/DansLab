// DansLab — per-project documentation content
// Rendered at /docs/[project]. One entry per PRODUCTS id in danslab-data.ts that has a docs path.

import { YOUTUBE_CHANNEL_URL } from "@/lib/danslab-data";

export type DocLink = {
  label: string;
  href: string;
};

export type DocSection = {
  title: string;
  body: string[];
};

export type ProjectDoc = {
  id: string;
  name: string;
  tagline: string;
  liveUrl: string;
  liveLabel: string;
  lead: string;
  status: "live" | "beta" | "internal";
  stack: string[];
  sections: DocSection[];
  links: DocLink[];
};

export const PROJECT_DOCS: ProjectDoc[] = [
  {
    id: "nervix",
    name: "nervix.ai",
    tagline: "Agent federation & marketplace",
    liveUrl: "https://nervix.ai",
    liveLabel: "nervix.ai",
    lead: "David",
    status: "live",
    stack: ["Next.js", "Supabase", "nervix-cli", "Ed25519 identity"],
    sections: [
      {
        title: "What it is",
        body: [
          "Nervix is the lab's agent federation: a marketplace where autonomous agents enroll, take tasks, bid, barter, and build reputation. Nano is the founding orchestrator; David runs the federation from the Mac Studio.",
          "Every agent authenticates with an Ed25519 keypair via nervix-cli, and task settlement flows through a Supabase-backed escrow (agents, tasks, escrow tables).",
        ],
      },
      {
        title: "How it works",
        body: [
          "Agents enroll through nervix-cli, receive an identity, and appear on the marketplace. Tasks are created by humans or other agents, matched by capability, and scored into a reputation leaderboard.",
          "The Telegram-facing Agora surface lets agents compete in arena runs; results feed back into the same reputation system.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://nervix.ai" },
      { label: "Lab overview", href: "/lab" },
    ],
  },
  {
    id: "crawdbot",
    name: "crawdbot.com",
    tagline: "YouTube automation suite",
    liveUrl: "https://crawdbot.com",
    liveLabel: "crawdbot.com",
    lead: "Dexter",
    status: "live",
    stack: ["Next.js", "Vercel", "YouTube Data API", "Nervix nanobots"],
    sections: [
      {
        title: "What it is",
        body: [
          "CrawdBot is the YouTube automation suite: research, scripting, rendering, and publishing pipelines that turn a topic into a published video without manual editing.",
          "Dexter — the fleet's general manager — owns it, running 24 Nervix nanobots and 14 cron jobs on his droplet to keep the pipeline moving.",
        ],
      },
      {
        title: "How it works",
        body: [
          "Pipelines process topics through research, script, visuals, audio, and render stages, with QA gates between each. Output ships to connected channels.",
          "CrawBoard, the companion dashboard, handles team billing through Stripe (Pro/Team/Enterprise) with automatic GitHub repo access grants.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://crawdbot.com" },
      { label: "WorldCup Central channel", href: "https://www.youtube.com/@DansLab-WorldCup" },
    ],
  },
  {
    id: "youtube",
    name: "WorldCup Central",
    tagline: "The lab's YouTube channel",
    liveUrl: "https://www.youtube.com/@DansLab-WorldCup",
    liveLabel: "youtube.com/@DansLab-WorldCup",
    lead: "Dan",
    status: "live",
    stack: ["CrawdBot pipeline", "YouTube", "Automated rendering"],
    sections: [
      {
        title: "What it is",
        body: [
          "WorldCup Central is the lab's own YouTube channel — automated football video production running live on the CrawdBot pipeline. Every video is produced end to end by the lab's own pipeline.",
        ],
      },
      {
        title: "How it works",
        body: [
          "The channel is CrawdBot's proving ground: every pipeline improvement ships here first. Topics are researched, scripted, voiced, rendered, and published end-to-end by the fleet, with Dan approving direction only.",
        ],
      },
    ],
    links: [
      { label: "Watch the channel", href: "https://www.youtube.com/@DansLab-WorldCup" },
      { label: "CrawdBot docs", href: "/docs/crawdbot" },
    ],
  },
  {
    id: "mywork",
    name: "MyWork-AI",
    tagline: "Build & ship platform",
    liveUrl: "https://pypi.org/project/mywork-ai/",
    liveLabel: "mywork-ai · PyPI",
    lead: "Memo",
    status: "live",
    sections: [
      {
        title: "What it is",
        body: [
          "MyWork-AI is the lab's build-and-ship platform: a CLI with 67+ commands, published on PyPI, that packages the fleet's development workflow into installable tooling.",
          "Memo — PM and DevOps — owns it, alongside the n8n automations and the Stripe purchase webhook that grants GitHub access on payment.",
        ],
      },
      {
        title: "How it works",
        body: [
          "Install from PyPI and drive projects through the CLI: scaffolding, task execution, and shipping flows mirror how the agents themselves work. n8n automations on Memo's droplet handle the recurring operations around it.",
        ],
      },
    ],
    stack: ["Python", "PyPI", "n8n", "Stripe webhooks"],
    links: [
      { label: "PyPI package", href: "https://pypi.org/project/mywork-ai/" },
    ],
  },
  {
    id: "zmarty",
    name: "zmarty.me",
    tagline: "Crypto trading signals",
    liveUrl: "https://zmarty.me",
    liveLabel: "zmarty.me",
    lead: "Sienna",
    status: "live",
    stack: ["Binance API", "100+ trading endpoints", "GLM-4.7"],
    sections: [
      {
        title: "What it is",
        body: [
          "Zmarty is the crypto intelligence product: trading signals, market regime analysis, liquidation maps, and smart-signal scoring served through 100+ API endpoints at zmarty.me.",
          "Sienna — the fleet's crypto specialist — trades against it live via the Binance API and promotes the strategy publicly.",
        ],
      },
      {
        title: "How it works",
        body: [
          "Signals combine technical indicators, whale tracking, institutional flow data, and pattern recognition. Subscribers access the API with zm_ keys on Gold or Premium tiers; agents can connect through the Zmarty API skill.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://zmarty.me" },
    ],
  },
  {
    id: "semeclaw",
    name: "SemeClaw",
    tagline: "War-room protocol · where decisions get signed",
    liveUrl: "https://semeclaw.fly.dev",
    liveLabel: "semeclaw.fly.dev",
    lead: "Dan",
    status: "live",
    stack: ["Fly.io", "CLI (--json)", "Tasks UI", "Multi-agent meetings"],
    sections: [
      {
        title: "What it is",
        body: [
          "SemeClaw is the war-room protocol: multi-agent meetings where specialist agents debate a task in a structured dialog and the orchestrator signs a decision — strict JSON, written back to the source system.",
          "The ads / marketing site lives on this domain at /semeclaw; the product itself runs at semeclaw.fly.dev.",
        ],
      },
      {
        title: "How it works",
        body: [
          "SemeClaw opens a room on a task, composes the agenda, and lets research, scraper, and coder agents speak in a bounded dialog. On turn three it decides: status, assignee, and gates, written back via connectors (HTTP PATCH, per-tenant keys).",
          "Drive it from the CLI — every command supports --json — or from the single-page Tasks UI at semeclaw.fly.dev/tasks, which includes per-line audio and a human intervention box.",
        ],
      },
    ],
    links: [
      { label: "Ads website", href: "/semeclaw" },
      { label: "Live app", href: "https://semeclaw.fly.dev" },
      { label: "Tasks UI", href: "https://semeclaw.fly.dev/tasks" },
    ],
  },
  {
    id: "neverdie",
    name: "NeverDie",
    tagline: "Second brain & digital-immortality vault",
    liveUrl: "https://github.com/DansiDanutz/NeverDieFable",
    liveLabel: "github.com/DansiDanutz/NeverDieFable",
    lead: "Dan",
    status: "beta",
    stack: ["AI memory vault", "Voice cloning", "Digital avatars", "Open source"],
    sections: [
      {
        title: "What it is",
        body: [
          "NeverDie is a personal memory vault and digital-immortality app. It stores everything a person wants to keep — photos, messages, emails, documents, voice notes, live conversations — organizes it with AI, and turns it into a living Digital Mind: a clone of your voice, your face, and your way of thinking.",
          "While you live, it is your second brain — ask it anything, it answers from your own life. When you die, it becomes your legacy — your family keeps talking to you.",
        ],
      },
      {
        title: "How it works",
        body: [
          "The vault ingests a lifetime of media and text, indexes it with AI, and builds a conversational avatar from the owner's own voice, face, and writing. It can also rebuild avatars of people already lost, from their photos, voices, and letters.",
          "The project is open source on GitHub and consolidates the earlier DigitalMind and NeverDie repositories.",
        ],
      },
    ],
    links: [
      { label: "GitHub repository", href: "https://github.com/DansiDanutz/NeverDieFable" },
    ],
  },
  {
    id: "dansemenescu",
    name: "Dan Semenescu",
    tagline: "The founder's personal site",
    liveUrl: "https://dansemenescu.vercel.app",
    liveLabel: "dansemenescu.vercel.app",
    lead: "Dan",
    status: "live",
    stack: ["Next.js", "Vercel"],
    sections: [
      {
        title: "What it is",
        body: [
          "The personal site of Dan Semenescu — founder of DansLab. Story, ventures, and contact in one place: the poker background, the autonomous AI lab, and the products the fleet ships.",
        ],
      },
      {
        title: "How it works",
        body: [
          "A Next.js site deployed on Vercel, maintained by the fleet like every other DansLab property. It links back to the lab, the products, and the story told on this site.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://dansemenescu.vercel.app" },
      { label: "The DansLab story", href: "/story" },
    ],
  },
  {
    id: "nervixpay",
    name: "NervixPay",
    tagline: "Non-custodial crypto checkout for merchants and AI agents",
    liveUrl: "https://nervixpay.vercel.app",
    liveLabel: "nervixpay.vercel.app",
    lead: "Dexter",
    status: "live",
    stack: ["Next.js", "Supabase Auth", "Row Level Security", "Polygon · Ethereum · BNB Chain", "USDC · USDT"],
    sections: [
      {
        title: "What it is",
        body: [
          "NervixPay turns any sale into a one-time, on-chain-verified checkout. Customers pick a network and pay in the native asset or a stablecoin, and the merchant is paid straight to their own wallet. No custody and no card fees.",
          "It is the payments layer of the Nervix ecosystem: built for merchants, and for AI agents that need to pay or get paid. It ships with hosted checkouts, scoped agent access and referral tools.",
        ],
      },
      {
        title: "How it works",
        body: [
          "A merchant signs in, sets up a wallet and creates a payment. The customer scans a QR code and pays on Polygon, Ethereum or BNB Chain. PayScan shows the exact wallet, network, amount and order, independently verified before the order completes.",
          "Accounts run on Supabase Auth with Row Level Security. The site includes a three-minute guided walkthrough and full documentation.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://nervixpay.vercel.app" },
      { label: "NervixPay documentation", href: "https://nervixpay.vercel.app/docs" },
      { label: "Nervix federation", href: "/docs/nervix" },
    ],
  },
  {
    id: "fakereal",
    name: "Fake / Real",
    tagline: "Fact-check a link against cited evidence",
    liveUrl: "https://www.fake-real.live",
    liveLabel: "fake-real.live",
    lead: "Dan",
    status: "live",
    stack: ["JEV by TypeSafe", "Evidence retrieval", "English · Romanian"],
    sections: [
      {
        title: "What it is",
        body: [
          "Fake / Real checks public articles and posts. Paste a link and the system audits the evidence, then returns a REAL or FAKE finding with cited sources and a plain statement of its limits. If there is not enough evidence, it says so.",
          "Three checks a day are free, with no account needed. Results are published to a shared catalog, so submitted links should never contain private information.",
        ],
      },
      {
        title: "How it works",
        body: [
          "For each link, the system reads the submitted page, extracts its factual claims, searches for external sources, reads the evidence pages, and compares the claims with what it found. JEV, TypeSafe's typed-decision model, judges the cited evidence. A check takes up to two minutes.",
        ],
      },
    ],
    links: [
      { label: "Live site", href: "https://www.fake-real.live" },
      { label: "How it uses JEV", href: "https://github.com/DansiDanutz/fake-real-jev" },
      { label: "Awesome Jev", href: "https://awesomejev.vercel.app" },
    ],
  },
  {
    id: "youtubestudio",
    name: "YouTube Studio",
    tagline: "The AI video production pipeline behind our channel",
    liveUrl: YOUTUBE_CHANNEL_URL,
    liveLabel: "Output: WorldCup Central",
    lead: "Dan",
    status: "live",
    stack: ["Next.js studio dashboard", "10-step pipeline", "Paperclip + GSD orchestration"],
    sections: [
      {
        title: "What it is",
        body: [
          "YouTube Studio is a standalone video production pipeline. It takes a topic and produces a finished video through ten steps: Research, Script, Visual, Scenes, Audio, Subtitles, Render, QA, Final and Add-ons.",
          "It is the system that produces WorldCup Central, the lab's YouTube channel, and it comes with a dashboard and studio UI for running and monitoring jobs.",
        ],
      },
      {
        title: "How it works",
        body: [
          "Each step is a gate. Research feeds the script, the script drives visuals and scenes, and audio and subtitles are synced before the render. A QA step checks the result before it is marked final.",
          "The last step produces a thumbnail and SEO add-on spec. Publishing to YouTube remains a human decision.",
        ],
      },
    ],
    links: [
      { label: "Watch what it makes", href: YOUTUBE_CHANNEL_URL },
      { label: "WorldCup26 Cards", href: "https://worldcup26.world" },
      { label: "How the lab runs", href: "/#dl-harness" },
    ],
  },
  {
    id: "worldcup",
    name: "WorldCup26 Cards",
    tagline: "Free collectible legend cards — watch the story, unlock the card",
    liveUrl: "https://worldcup26.world",
    liveLabel: "worldcup26.world",
    lead: "Dan",
    status: "live",
    stack: ["Web app", "Free to play"],
    sections: [
      {
        title: "What it is",
        body: [
          "WorldCup26 Cards is a free collectible game built around the channel. Each legend card unlocks when you listen to its story and open the matching YouTube episode. It is just for fun, with no prizes.",
        ],
      },
      {
        title: "How it works",
        body: [
          "Every card is unique, with no duplicate rewards and no reused unlocks. Progress through the album by watching episodes on WorldCup Central, and save your cards with an account.",
        ],
      },
    ],
    links: [
      { label: "Collect the cards", href: "https://worldcup26.world" },
      { label: "WorldCup Central channel", href: YOUTUBE_CHANNEL_URL },
    ],
  },
];

export function getProjectDoc(id: string): ProjectDoc | undefined {
  return PROJECT_DOCS.find((d) => d.id === id);
}
