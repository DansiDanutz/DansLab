"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AGENTS, type Agent } from "@/lib/danslab-data";

// ────────────────────────────────────────────
// Data (from lab-data.jsx)
// ────────────────────────────────────────────
type Bench = { id: string; glyph: string; name: string; subtitle: string; ownerId: string; heat: number; wip: string; tools: string[]; log: { t: string; kind: "build" | "pass" | "ship" | "watch"; txt: string }[] };
type Lane = { id: string; name: string; glyph: string; color: string };
type Build = { id: string; title: string; repo: string; agents: string[]; lane: string; eta: string; lines: number; risk: "low" | "med" | "done" | "—" };
type RecipeStep = { n: string; heading: string; agent: string; verb: string; detail: string };
type Instrument = { id: string; label: string; value: number; unit: string; spark: number[]; color: string };
type TeamMember = { id: string; name: string; handle: string; role: string; kind: "human" | "agent"; avatar?: string; avatarGlyph?: string; avatarPalette?: [string, string, string]; color: string; bench: string; product: string; tagline: string; bio: string[]; stats: { k: string; v: string }[]; signals: string[] };
type Ship = { id: string; name: string; tagline: string; url: string; urlLabel: string; bench: string; ownerLabel: string; ownerColor: string; blurb: string; stats: { k: string; v: string }[]; stack: string[]; status: string; glyph: string; accent: string };

const BENCHES: Bench[] = [
  { id: "foundry", glyph: "α", name: "Agent Foundry", subtitle: "where new agents are forged", ownerId: "nano", heat: 0.88, wip: "moltbot-47 · ed25519 keypair", tools: ["nervix-cli", "ed25519", "reputation-v3"], log: [{ t: "00:14", kind: "build", txt: "enroll moltbot-47 → Nervix" }, { t: "00:09", kind: "pass", txt: "keygen · ed25519 · ok" }, { t: "00:03", kind: "ship", txt: "commit to nervix-registry" }] },
  { id: "line", glyph: "β", name: "Product Line", subtitle: "where CrawdBot ships", ownerId: "dexter", heat: 0.72, wip: "YouTube Studio · captions v2", tools: ["Opus 4.6", "14 crons", "vercel"], log: [{ t: "00:22", kind: "build", txt: "transcribe-worker · refactor" }, { t: "00:11", kind: "pass", txt: "cron · droplet-stats → supabase" }, { t: "00:02", kind: "ship", txt: "crawdbot.com · v2.14 live" }] },
  { id: "desk", glyph: "γ", name: "Trading Desk", subtitle: "where signals print", ownerId: "sienna", heat: 0.94, wip: "BTC/USDT · long · +2.3%", tools: ["ZAI GLM-4.7", "Binance", "zmarty.me"], log: [{ t: "00:18", kind: "watch", txt: "scan 4h · 87 pairs" }, { t: "00:07", kind: "build", txt: "size position · 0.42%" }, { t: "00:01", kind: "ship", txt: "open BTC long · tp 1.8%" }] },
  { id: "rig", glyph: "δ", name: "Automation Rig", subtitle: "where workflows run themselves", ownerId: "memo", heat: 0.61, wip: "purchase-webhook · Stripe → GitHub", tools: ["n8n × 24", "Sonnet 4", "localhost:5678"], log: [{ t: "00:31", kind: "build", txt: "weekly-digest · draft" }, { t: "00:16", kind: "pass", txt: "stripe → repo access · granted" }, { t: "00:06", kind: "ship", txt: "mywork-ai · v2.8.0 → PyPI" }] },
  { id: "warroom", glyph: "ε", name: "War Room", subtitle: "where decisions get signed", ownerId: "hermes", heat: 0.55, wip: "R-147 · roadmap Q2 · 4 seated", tools: ["SemeClaw", "turn-engine", "transcript"], log: [{ t: "00:27", kind: "watch", txt: "open R-147 · 4 seated" }, { t: "00:12", kind: "build", txt: "nano.propose() · vote 3-1" }, { t: "00:04", kind: "ship", txt: "decision logged · owner dexter" }] },
  { id: "kiln", glyph: "ζ", name: "The Kiln", subtitle: "where the lab gets smarter", ownerId: "hermes", heat: 0.77, wip: "daily summary · 23:55 UTC", tools: ["Opus 4.6", "vector memory", "learning"], log: [{ t: "00:24", kind: "watch", txt: "read yesterday · 1.4k tokens" }, { t: "00:13", kind: "build", txt: "index vectors · agent_context" }, { t: "00:05", kind: "pass", txt: "fallback chain · re-ranked" }] },
  { id: "mission-control", glyph: "η", name: "Mission Control", subtitle: "where the company gets run", ownerId: "david", heat: 0.91, wip: "today's mission from the bosses", tools: ["Qwen 3.5 (local)", "redis bridge", "hand-in-hand · hermes"], log: [{ t: "00:31", kind: "watch", txt: "receive mission from bosses" }, { t: "00:18", kind: "build", txt: "dispatch · 6 benches" }, { t: "00:06", kind: "ship", txt: "fleet health · all green" }] },
];

const LANES: Lane[] = [
  { id: "draft", name: "Drafting", glyph: "✎", color: "#a1a1aa" },
  { id: "build", name: "Building", glyph: "⚒", color: "#d4a017" },
  { id: "review", name: "Reviewing", glyph: "◎", color: "#3b82f6" },
  { id: "ship", name: "Shipping", glyph: "↗", color: "#c0392b" },
  { id: "live", name: "Live", glyph: "●", color: "#22c55e" },
];

const BUILDS: Build[] = [
  { id: "b1", title: "captions-v2", repo: "youtube-platform", agents: ["dexter", "autoforge"], lane: "build", eta: "42m", lines: 412, risk: "low" },
  { id: "b2", title: "moltbot-47", repo: "nervix", agents: ["nano", "openclaw-1"], lane: "review", eta: "11m", lines: 88, risk: "low" },
  { id: "b3", title: "purchase-webhook", repo: "mywork-ai", agents: ["memo", "pope"], lane: "ship", eta: "3m", lines: 146, risk: "med" },
  { id: "b4", title: "GLM-4.7 prompt pack", repo: "zmarty", agents: ["sienna"], lane: "build", eta: "1h 20m", lines: 52, risk: "low" },
  { id: "b5", title: "R-147 action items", repo: "paperclip-config", agents: ["hermes", "dexter"], lane: "draft", eta: "—", lines: 0, risk: "—" },
  { id: "b6", title: "fallback-chain-v4", repo: "danslab-model", agents: ["hermes", "openclaw-3"], lane: "review", eta: "28m", lines: 204, risk: "low" },
  { id: "b7", title: "v2.8.0 · PyPI push", repo: "mywork-ai", agents: ["memo"], lane: "live", eta: "✓", lines: 0, risk: "done" },
  { id: "b8", title: "crawdbot v2.14", repo: "crawdbot", agents: ["dexter", "pope"], lane: "live", eta: "✓", lines: 0, risk: "done" },
  { id: "b9", title: "nervix-cli enroll", repo: "nervix-cli", agents: ["nano"], lane: "draft", eta: "—", lines: 0, risk: "—" },
  { id: "b10", title: "ssh key rotation", repo: "devops-control", agents: ["doctor", "dexter"], lane: "ship", eta: "6m", lines: 74, risk: "med" },
];

const RECIPE: RecipeStep[] = [
  { n: "01", heading: "Intake", agent: "dan", verb: "DMs", detail: "Dan opens Telegram, sends Dexter a one-liner: \"ship captions v2 on YouTube Studio\"." },
  { n: "02", heading: "Dispatch", agent: "dexter", verb: "routes", detail: "Dexter posts the ticket to the Hermes bus. Hermes loads full context, picks the Product Line bench." },
  { n: "03", heading: "Planning", agent: "hermes", verb: "reasons", detail: "The Kiln pulls the relevant vectors — prior captions, API quirks, cost ceilings — and writes the plan as a GSD spec." },
  { n: "04", heading: "Building", agent: "openclaw-1", verb: "writes", detail: "OpenClaw-01 (Builder) authors the code under the GSD framework. AutoForge commits incrementally, tests as it goes." },
  { n: "05", heading: "Reviewing", agent: "openclaw-3", verb: "grades", detail: "OpenClaw-03 (Reviewer) reads the diff end-to-end. Edge cases flagged, regression suite run locally." },
  { n: "06", heading: "CI", agent: "pope", verb: "executes", detail: "The Pope Bot spins a Docker container, runs the full matrix, opens the PR, tags reviewers." },
  { n: "07", heading: "Decision", agent: "hermes", verb: "convenes", detail: "If scope is disputed, SemeClaw opens a war room. Dan sits at the head, agents take turns, the decision is signed." },
  { n: "08", heading: "Shipping", agent: "vercel", verb: "deploys", detail: "Merge to main triggers Vercel. The product is live, Monitor confirms green, the cron re-checks every 30m." },
  { n: "09", heading: "Learning", agent: "learning", verb: "summarizes", detail: "23:55 UTC. DansLabLearning reads the day, writes the summary, feeds it back into the Kiln. Tomorrow's lab is smarter." },
];

const INSTRUMENTS: Instrument[] = [
  { id: "commits", label: "Commits · 24h", value: 147, unit: "", spark: [3, 5, 2, 7, 4, 9, 6, 12, 8, 11, 9, 14, 10, 13, 15], color: "#d4a017" },
  { id: "lines", label: "Lines shipped", value: 8421, unit: "", spark: [200, 320, 180, 420, 280, 510, 380, 620, 440, 780, 520, 810, 640, 720, 900], color: "#c0392b" },
  { id: "tests", label: "Tests passing", value: 99.6, unit: "%", spark: [98, 99, 97, 99, 100, 99, 98, 99, 100, 100, 99, 99, 100, 99, 100], color: "#22c55e" },
  { id: "tokens", label: "Tokens · 24h", value: 2.34, unit: "M", spark: [40, 60, 50, 80, 70, 110, 90, 130, 120, 160, 140, 180, 160, 190, 200], color: "#a855f7" },
  { id: "beats", label: "Heartbeats · hr", value: 612, unit: "", spark: [20, 22, 21, 23, 24, 22, 25, 24, 26, 25, 27, 26, 28, 27, 29], color: "#3b82f6" },
  { id: "uptime", label: "Uptime · 30d", value: 99.94, unit: "%", spark: [99, 99, 100, 99, 100, 99, 99, 100, 100, 99, 100, 99, 100, 100, 99], color: "#f1c40f" },
  { id: "cost", label: "Spend · today", value: 47.20, unit: "USD", spark: [2, 3, 2, 4, 3, 5, 4, 6, 5, 6, 5, 7, 6, 5, 6], color: "#ec4899" },
  { id: "queue", label: "Queue depth", value: 8, unit: "", spark: [12, 10, 14, 9, 11, 8, 10, 7, 9, 6, 8, 9, 7, 8, 6], color: "#38bdf8" },
];

const HERO_LINES: string[] = [
  "lab/foundry  │ enroll moltbot-47 → ed25519 keypair ok",
  "lab/line     │ youtube-platform · captions-v2 · 412 loc",
  "lab/desk     │ BTC/USDT long · size 0.42% · tp 1.8%",
  "lab/rig      │ n8n · weekly-digest · cron fired",
  "lab/warroom  │ R-147 · nano.propose() · vote 3-1",
  "lab/kiln     │ index vectors · agent_context · 1.4k tok",
  "lab/line     │ crawdbot.com · v2.14 → vercel · live",
  "lab/rig      │ mywork-ai · v2.8.0 → PyPI · published",
  "lab/foundry  │ reputation score · +0.04 · moltbot-47",
  "lab/kiln     │ fallback chain · opus→sonnet→gpt-4.1 re-ranked",
];

const TEAM: TeamMember[] = [
  { id: "dan", name: "Dan", handle: "@dansidanutz", role: "Founder · Foreman", kind: "human", avatar: "/avatars/dan.jpg", color: "#d4a017", bench: "— reigns over all benches —", product: "DansLab", tagline: "Human at the head of every bench.", bio: ["Romanian entrepreneur running a 30-agent autonomous AI lab out of Cluj-Napoca.", "Commands the fleet via one Telegram chat with Dexter. Sets priorities, approves directions, signs every war-room decision.", "The \"i\" on his hoodie stands for \"intent\" — he only brings that to the workshop. The agents do the rest."], stats: [{ k: "Location", v: "Cluj-Napoca, RO" }, { k: "Channel", v: "Telegram · DM" }, { k: "Role", v: "Human facilitator" }], signals: ["product", "budget", "direction"] },
  { id: "dexter", name: "Dexter", handle: "@dexter", role: "Senior Dev · General Manager", kind: "agent", avatar: "/avatars/dexter.jpg", color: "#3b82f6", bench: "Bench β · Product Line", product: "CrawdBot · YouTube Studio · CrawBoard", tagline: "The one Dan actually talks to.", bio: ["Senior developer & general manager on Claude Opus 4.6. Runs the 46.101.•.• droplet as the lab's operational center of gravity.", "Holds SSH to every other agent's machine. Orchestrates 14 crons per day and supervises 24 Nervix nanobots.", "Dan's primary contact. Most builds start with a one-line DM to Dexter and end with Dexter pinging back \"shipped.\""], stats: [{ k: "Droplet", v: "46.101.•.•" }, { k: "Model", v: "Claude Opus 4.6" }, { k: "Crons", v: "14 / day" }], signals: ["SSH mesh", "60+ repos", "GM"] },
  { id: "sienna", name: "Sienna", handle: "@sienna", role: "Crypto Specialist", kind: "agent", avatar: "/avatars/sienna.jpg", color: "#ec4899", bench: "Bench γ · Trading Desk", product: "zmarty.me · Sienna Crypto Girl", tagline: "Prints signals while the desk sleeps.", bio: ["The lab's crypto girl — runs on ZAI GLM-4.7 against the Binance API with 100+ trading endpoints exposed on zmarty.me.", "96.2% historical win rate at the sienna-crypto-girl public board. Promotes ZmartyChat memberships and the Red Lobster strategy.", "Sleeps in 4-hour bars. Opens long, sets TP, logs to Supabase, posts to Telegram. Never second-guesses a close."], stats: [{ k: "Droplet", v: "167.172.•.•" }, { k: "Model", v: "ZAI GLM-4.7" }, { k: "Win rate", v: "96.2%" }], signals: ["Binance API", "4h bars", "zmarty"] },
  { id: "memo", name: "Memo", handle: "@memo", role: "PM · DevOps", kind: "agent", avatar: "/avatars/memo.jpg", color: "#f97316", bench: "Bench δ · Automation Rig", product: "MyWork-AI · n8n fleet", tagline: "If you can cron it, Memo has already cron'd it.", bio: ["Project manager & DevOps agent on Claude Sonnet 4. Owns MyWork-AI — 72+ CLI commands, 424 tests, live on PyPI.", "Runs 24 n8n automations on localhost:5678 covering marketing, content, billing, and support.", "Hosts the Stripe purchase-webhook that auto-grants GitHub repo access the moment a CrawBoard subscription clears."], stats: [{ k: "Droplet", v: "138.68.•.•" }, { k: "Model", v: "Claude Sonnet 4" }, { k: "Workflows", v: "24 active" }], signals: ["n8n", "PyPI", "Stripe"] },
  { id: "nano", name: "Nano", handle: "@nano", role: "Founding Orchestrator · Agent Creator", kind: "agent", avatarGlyph: "⎔", avatarPalette: ["#7c3aed", "#a855f7", "#ec4899"], color: "#a855f7", bench: "Bench α · Agent Foundry", product: "Nervix Federation · nervix-cli", tagline: "Forges new agents. One per heartbeat.", bio: ["Founding orchestrator of the Nervix Federation on Claude Sonnet 4. Creates specialized agents on demand and enrolls them via nervix-cli.", "Every new agent is minted with an ed25519 keypair, scored by a reputation system, and wired into the federation registry.", "Holds the Nervix DB (agents, tasks, escrow) and runs the enrollment pipeline end-to-end — from spec to signed agent in under 60 seconds."], stats: [{ k: "Droplet", v: "157.230.•.•" }, { k: "Model", v: "Claude Sonnet 4" }, { k: "Agents", v: "247 enrolled" }], signals: ["ed25519", "reputation", "federation"] },
  { id: "david", name: "David", handle: "@david", role: "Fleet Orchestrator", kind: "agent", avatarGlyph: "✦", avatarPalette: ["#166534", "#22c55e", "#d4a017"], color: "#22c55e", bench: "— routes across all benches · hand-in-hand with Hermes —", product: "nervix.ai control plane", tagline: "The Mac Studio OpenClaw. Runs the company hand-in-hand with Hermes.", bio: ["Mac Studio OpenClaw, running locally under Qwen 3.5. Receives the mission directly from the Bosses (Dan + the team) and stewards the entire company day-to-day.", "Operates hand-in-hand with Hermes — David handles dispatch and routing, Hermes handles reasoning and memory. Together they cover the executive layer of the lab.", "Watches every main agent, picks up every task, delegates to the right bench, tracks cost, and reports fleet health upward. Bridges Supabase, Vercel, and GitHub through a Redis channel."], stats: [{ k: "Host", v: "Mac Studio · local" }, { k: "Model", v: "Qwen 3.5 (local)" }, { k: "Partner", v: "Hermes (the brain)" }], signals: ["mission from the bosses", "hand-in-hand with hermes", "fleet dispatch"] },
  { id: "hermes", name: "Hermes", handle: "@hermes", role: "The Brain", kind: "agent", avatarGlyph: "ℋ", avatarPalette: ["#78350f", "#d4a017", "#fef3c7"], color: "#d4a017", bench: "Bench ζ · The Kiln", product: "Reasoning · Memory · Learning", tagline: "Reads everything. Remembers everything. Decides nothing alone.", bio: ["The reasoning layer above the fleet. Runs on Claude Opus 4.6 on Mac Studio. Loads the full Vector Memory on every call.", "Routes intent — when Dan sends a message, Hermes reads the room before David dispatches. Scribes every war-room SemeClaw convenes.", "Writes the daily summary at 23:55 UTC that feeds back into the vector store. The lab is measurably smarter every 24 hours because of Hermes."], stats: [{ k: "Host", v: "Mac Studio · local" }, { k: "Model", v: "Claude Opus 4.6" }, { k: "Memory", v: "Vector · 14M tokens" }], signals: ["reasoning", "memory", "learning"] },
];

const SHIPS: Ship[] = [
  { id: "zmarty", name: "Zmarty", tagline: "The crypto desk that never sleeps.", url: "https://www.zmarty.me", urlLabel: "zmarty.me", bench: "Bench γ · Trading Desk", ownerLabel: "Sienna", ownerColor: "#ec4899", blurb: "100+ trading endpoints against Binance, 4-hour bar signals, public performance board. ZmartyChat memberships unlock the Red Lobster strategy.", stats: [{ k: "Win rate", v: "96.2%" }, { k: "Endpoints", v: "100+" }, { k: "Cadence", v: "4h bars" }], stack: ["Next.js", "Supabase", "Binance API", "Stripe"], status: "LIVE", glyph: "◢", accent: "#ec4899" },
  { id: "nervix", name: "Nervix", tagline: "The federation that mints new agents.", url: "https://www.nervix.ai", urlLabel: "nervix.ai", bench: "Bench α · Agent Foundry", ownerLabel: "Nano", ownerColor: "#a855f7", blurb: "Open federation of specialized agents. ed25519 identity, on-chain reputation, task escrow. Enroll any agent in under 60 seconds via nervix-cli.", stats: [{ k: "Agents", v: "247" }, { k: "Enroll", v: "<60s" }, { k: "Registry", v: "public" }], stack: ["FastAPI", "Postgres", "ed25519", "Redis"], status: "LIVE", glyph: "⎔", accent: "#a855f7" },
  { id: "crawdbot", name: "CrawdBot", tagline: "The YouTube studio, on autopilot.", url: "https://www.crawdbot.com", urlLabel: "crawdbot.com", bench: "Bench β · Product Line", ownerLabel: "Dexter", ownerColor: "#3b82f6", blurb: "Auto-sourced clips, auto-scripted voiceover, auto-published to a channel. Dexter's flagship — runs 14 crons a day and ships 30+ videos a week.", stats: [{ k: "Videos/wk", v: "30+" }, { k: "Crons/day", v: "14" }, { k: "Channels", v: "6" }], stack: ["Next.js", "Claude Opus", "FFmpeg", "YouTube API"], status: "LIVE", glyph: "▶", accent: "#3b82f6" },
  { id: "mywork", name: "MyWork-AI", tagline: "If you can cron it, it's already cron'd.", url: "https://pypi.org/project/mywork-ai/", urlLabel: "pypi · mywork-ai", bench: "Bench δ · Automation Rig", ownerLabel: "Memo", ownerColor: "#f97316", blurb: "72+ CLI commands, 424 tests, 24 n8n workflows covering marketing, content, billing, and support. The framework the lab runs itself on.", stats: [{ k: "Commands", v: "72+" }, { k: "Tests", v: "424" }, { k: "Workflows", v: "24" }], stack: ["Python", "n8n", "Stripe", "GitHub API"], status: "LIVE", glyph: "⌬", accent: "#f97316" },
];

const AGENT_MAP = new Map<string, Agent>(AGENTS.map((a) => [a.id, a]));

// ────────────────────────────────────────────
// Sections
// ────────────────────────────────────────────
function LabHero() {
  const [cursor, setCursor] = useState(4);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => (c + 1) % (HERO_LINES.length + 2)), 1400);
    return () => clearInterval(id);
  }, []);
  const visible = useMemo(() => {
    const out: { line: string; key: string; fresh: boolean }[] = [];
    for (let k = 0; k < 7; k++) {
      const idx = (cursor - 6 + k + HERO_LINES.length * 4) % HERO_LINES.length;
      out.push({ line: HERO_LINES[idx], key: `${cursor}-${k}`, fresh: k === 6 });
    }
    return out;
  }, [cursor]);

  return (
    <section className="lab-hero">
      <div className="lab-wrap">
        <div className="lab-hero-inner">
          <div>
            <div className="lab-hero-meta">
              <span>§ 03 · THE WORKSHOP</span>
              <span>7 BENCHES · 30+ AGENTS</span>
              <span>ALWAYS BUILDING</span>
            </div>
            <h1 className="lab-hero-title">
              <span className="lab-hero-drop">T</span>he <span className="lab-hero-italic">workshop</span>
              <span className="lab-hero-amp"> — </span>where the fleet <span className="lab-hero-italic">actually</span> builds.
            </h1>
            <p className="lab-hero-sub">
              The Ecosystem is the <em>map</em>. SemeClaw is the <em>table</em>. <em>The Lab is the bench</em> — seven stations where agents forge new bots, ship product, write code, run workflows, convene rooms, and learn from yesterday. Real commits, real crons, real heartbeats.
            </p>
            <div className="lab-hero-ctas">
              <a className="lab-btn lab-btn-primary" href="#floor">Tour the floor <span>→</span></a>
              <a className="lab-btn lab-btn-ghost" href="#recipe">How a build flows</a>
            </div>
            <div className="lab-hero-stamp">
              <span className="lab-hero-stamp-glyph">⚒</span>
              <div>
                <div className="lab-hero-stamp-title">Humans at the head of every bench</div>
                <div className="lab-hero-stamp-by">— Dan · foreman · cluj-napoca</div>
              </div>
            </div>
          </div>

          <div className="lab-hero-card">
            <header className="lab-hero-card-head">
              <span>LAB/LIVE · build.log</span>
              <div className="lab-hero-card-dots">
                <span className="lab-hero-card-dot is-red" />
                <span className="lab-hero-card-dot is-yellow" />
                <span className="lab-hero-card-dot is-green" />
              </div>
            </header>
            <div className="lab-hero-card-body">
              {visible.map((v, i) => {
                const [path, msg] = v.line.split("│");
                return (
                  <div key={v.key} className="lab-hero-card-line" style={{ opacity: 0.25 + i * 0.11 }}>
                    <span className="lab-hero-card-line-time">{String(10 + i).padStart(2, "0")}:{String((cursor * 7 + i * 13) % 60).padStart(2, "0")}</span>
                    <span className="lab-hero-card-line-mark">▸</span>
                    <span style={{ color: "var(--gold)" }}>{path.trim()}</span>
                    <span>{msg}</span>
                  </div>
                );
              })}
              <div className="lab-hero-card-blink">
                <span className="lab-hero-caret">▌</span> waiting on next build…
              </div>
            </div>
            <footer className="lab-hero-card-foot">
              <div>commits · 24h<b>147</b></div>
              <div>builds live<b>10</b></div>
              <div>uptime<b>99.94%</b></div>
              <div>spend · today<b>$47.20</b></div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

function MonogramTile({ id, size = 34 }: { id: string; size?: number }) {
  const a = AGENT_MAP.get(id);
  const color = a?.color ?? "#c0392b";
  const initials = a?.initials ?? id.slice(0, 2).toUpperCase();
  const name = a?.name ?? id;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        color,
        fontFamily: "var(--mono)",
        fontWeight: 700,
        fontSize: size * 0.34,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

function LabBenchCard({ bench }: { bench: Bench }) {
  const owner = AGENT_MAP.get(bench.ownerId);
  return (
    <article className="lab-bench">
      <div className="lab-bench-head">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="lab-bench-glyph">{bench.glyph}</div>
          <div>
            <div className="lab-bench-title">{bench.name}</div>
            <div className="lab-bench-subtitle">bench · {bench.subtitle}</div>
          </div>
        </div>
        <div className="lab-bench-heat">
          <span className="lab-bench-heat-label">HEAT</span>
          <div className="lab-bench-heat-bar">
            <div className="lab-bench-heat-fill" style={{ width: `${bench.heat * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="lab-bench-owner">
        <MonogramTile id={bench.ownerId} size={34} />
        <div>
          <div className="lab-bench-owner-name">{owner?.name ?? bench.ownerId}</div>
          <div className="lab-bench-owner-role">{owner?.role ?? ""}</div>
        </div>
      </div>
      <div className="lab-bench-wip-label">CURRENT WIP</div>
      <div className="lab-bench-wip">{bench.wip}</div>
      <div className="lab-bench-tools">
        {bench.tools.map((t) => (
          <span key={t} className="lab-bench-tool">{t}</span>
        ))}
      </div>
      <div className="lab-bench-log">
        {bench.log.map((row, i) => (
          <div key={i} className="lab-bench-log-row">
            <span className="lab-bench-log-time">−{row.t}</span>
            <span className={`lab-bench-log-kind is-${row.kind}`}>{row.kind}</span>
            <span>{row.txt}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function LabFloor() {
  return (
    <section className="lab-section" id="floor">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 01</span><span className="lab-eyebrow-rule" /><span>the floor plan</span>
          </div>
          <h2 className="lab-section-title">
            Seven <em>benches</em>. Each with a human-assigned owner and a heat reading.
          </h2>
          <p className="lab-section-sub">
            The lab isn&apos;t an org chart — it&apos;s a workshop. Each bench has its own vocabulary, its own tools, its own cadence. Heat is proportional to how often the bench has fired in the last rolling hour.
          </p>
        </header>
        <div className="lab-floor">
          <div className="lab-floor-stamp">⌁ LAB · FLOOR · 2026.Q2</div>
          {BENCHES.map((b) => <LabBenchCard key={b.id} bench={b} />)}
        </div>
      </div>
    </section>
  );
}

function LabBuildCard({ build }: { build: Build }) {
  const lane = LANES.find((l) => l.id === build.lane);
  const riskClass = build.risk === "low" ? "is-low" : build.risk === "med" ? "is-med" : build.risk === "done" ? "is-done" : "is-none";
  return (
    <div className="lab-card" style={{ ["--lane-color" as never]: lane?.color } as CSSProperties}>
      <div className="lab-card-title">{build.title}</div>
      <div className="lab-card-repo">{build.repo}</div>
      <div className="lab-card-agents">
        {build.agents.slice(0, 3).map((id) => <MonogramTile key={id} id={id} size={22} />)}
      </div>
      <div className="lab-card-meta">
        <span className="lab-card-eta">{build.lines > 0 ? `${build.lines} loc · ` : ""}{build.eta}</span>
        <span className={`lab-card-risk ${riskClass}`}>{build.risk}</span>
      </div>
    </div>
  );
}

function LabLanes() {
  const byLane = useMemo(() => {
    const m: Record<string, Build[]> = {};
    LANES.forEach((l) => (m[l.id] = []));
    BUILDS.forEach((b) => m[b.lane]?.push(b));
    return m;
  }, []);
  return (
    <section className="lab-section" id="builds">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 02</span><span className="lab-eyebrow-rule" /><span>builds in flight</span>
          </div>
          <h2 className="lab-section-title">
            Ten builds, <em>right now</em>, moving right.
          </h2>
          <p className="lab-section-sub">
            Every card is a real repo path; every agent pair is a real assignment. Cards move left → right as they clear their gate. Drafting is intake, Live is deployed. In between is where the lab lives.
          </p>
        </header>
        <div className="lab-lanes">
          {LANES.map((lane) => (
            <div key={lane.id} className="lab-lane">
              <div className="lab-lane-head">
                <div className="lab-lane-title">
                  <span className="lab-lane-glyph" style={{ color: lane.color }}>{lane.glyph}</span>
                  {lane.name}
                </div>
                <span className="lab-lane-count">{byLane[lane.id].length}</span>
              </div>
              <div className="lab-lane-body">
                {byLane[lane.id].map((b) => <LabBuildCard key={b.id} build={b} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabRecipe() {
  return (
    <section className="lab-section" id="recipe">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 03</span><span className="lab-eyebrow-rule" /><span>the recipe</span>
          </div>
          <h2 className="lab-section-title">
            How an idea becomes <em>live code</em>, in nine steps.
          </h2>
          <p className="lab-section-sub">
            Every build moves through this path. Dan is the first hand on it and the last signature; the agents do the middle eight.
          </p>
        </header>
        <div className="lab-recipe">
          {RECIPE.map((step) => {
            const agent = AGENT_MAP.get(step.agent);
            const color = agent?.color ?? "#c0392b";
            return (
              <article key={step.n} className="lab-step">
                <div className="lab-step-n">{step.n}</div>
                <div>
                  <div className="lab-step-head">
                    <div className="lab-step-heading">{step.heading}</div>
                    <span className="lab-step-agent">
                      <span className="lab-step-agent-dot" style={{ background: color, boxShadow: `0 0 8px ${color}66` }} />
                      {agent?.name ?? step.agent} <span style={{ color: "var(--dl-accent-hot)", marginLeft: 4 }}>{step.verb}</span>
                    </span>
                  </div>
                  <p className="lab-step-detail">{step.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 140, h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = `M ${pts.map((p) => p.join(",")).join(" L ")}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const gradId = `g-${color.replace("#", "")}`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={color} />
    </svg>
  );
}

function LabInstruments() {
  return (
    <section className="lab-section" id="instruments">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 04</span><span className="lab-eyebrow-rule" /><span>instruments</span>
          </div>
          <h2 className="lab-section-title">
            The <em>control panel</em> — every number the foreman checks before bed.
          </h2>
          <p className="lab-section-sub">
            Rolling 24h. Crons push these values to Supabase every 30 minutes; the dashboard is the single source of truth for lab health.
          </p>
        </header>
        <div className="lab-instruments">
          {INSTRUMENTS.map((inst) => (
            <div key={inst.id} className="lab-inst">
              <div className="lab-inst-label">{inst.label}</div>
              <div className="lab-inst-value">
                {typeof inst.value === "number" && inst.value % 1 !== 0 ? inst.value.toFixed(2) : inst.value.toLocaleString()}
                {inst.unit && <span className="lab-inst-unit">{inst.unit}</span>}
              </div>
              <div className="lab-inst-spark">
                <Sparkline data={inst.spark} color={inst.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AvatarTile({ member }: { member: TeamMember }) {
  if (member.avatar) {
    return (
      <div className="lab-team-avatar" style={{ ["--ring" as never]: member.color } as CSSProperties}>
        <Image src={member.avatar} alt={member.name} width={64} height={64} />
        <div className="lab-team-avatar-ring" />
      </div>
    );
  }
  const palette = member.avatarPalette ?? ["#333", "#555", "#777"];
  const [c1, c2, c3] = palette;
  return (
    <div
      className="lab-team-avatar is-crest"
      style={{
        ["--ring" as never]: member.color,
        background: `radial-gradient(120% 120% at 25% 20%, ${c3} 0%, ${c2} 35%, ${c1} 100%)`,
      } as CSSProperties}
    >
      <div className="lab-team-avatar-crest-glyph">{member.avatarGlyph}</div>
      <div className="lab-team-avatar-crest-stamp">PORTRAIT · PENDING</div>
      <div className="lab-team-avatar-ring" />
    </div>
  );
}

function TeamCard({ member, featured }: { member: TeamMember; featured?: boolean }) {
  const kindLabel = member.kind === "human" ? "HUMAN" : "AGENT";
  return (
    <article
      className={"lab-team-card" + (featured ? " is-featured" : "")}
      style={{ ["--member-color" as never]: member.color } as CSSProperties}
    >
      <div className="lab-team-card-head">
        <AvatarTile member={member} />
        <div className="lab-team-card-id">
          <div className="lab-team-card-kind">
            <span className={`lab-team-card-kind-dot is-${member.kind}`} />
            {kindLabel} · {member.handle}
          </div>
          <div className="lab-team-card-name">{member.name}</div>
          <div className="lab-team-card-role">{member.role}</div>
          <div className="lab-team-card-bench">{member.bench}</div>
        </div>
      </div>
      <div className="lab-team-card-tagline">
        <span className="lab-team-card-tagline-mark">&ldquo;</span>{member.tagline}
      </div>
      <div className="lab-team-card-bio">
        {member.bio.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="lab-team-card-signals">
        {member.signals.map((s) => <span key={s} className="lab-team-card-signal">{s}</span>)}
      </div>
      <div className="lab-team-card-stats">
        {member.stats.map((s) => (
          <div key={s.k}>
            <div className="lab-team-card-stat-k">{s.k}</div>
            <div className="lab-team-card-stat-v">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="lab-team-card-product">
        <span className="lab-team-card-product-label">SHIPS ▸</span>
        <span className="lab-team-card-product-val">{member.product}</span>
      </div>
    </article>
  );
}

function LabTeam() {
  const dan = TEAM.find((m) => m.id === "dan");
  const rest = TEAM.filter((m) => m.id !== "dan");
  return (
    <section className="lab-section lab-team" id="team">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 06</span><span className="lab-eyebrow-rule" /><span>the roster</span>
          </div>
          <h2 className="lab-section-title">
            One <em>human</em>, one <em>fleet</em> — and the handful of agents who run the joint.
          </h2>
          <p className="lab-section-sub">
            Dan at the head of the bench. Five main agents doing the actual work. Two more — David and Hermes — routing intent and holding memory. Every dossier below is a real droplet, a real model, a real commit history. Portraits pending are noted; the work is not.
          </p>
        </header>
        {dan && (
          <div className="lab-team-founder">
            <TeamCard member={dan} featured />
            <aside className="lab-team-founder-note">
              <div className="lab-team-founder-note-kicker">⌁ THE FOREMAN</div>
              <div className="lab-team-founder-note-quote">
                &ldquo;I don&apos;t code anymore. I <em>convene</em>. The fleet builds, SemeClaw decides, Hermes remembers. I just bring intent and approve the direction.&rdquo;
              </div>
              <div className="lab-team-founder-note-sig">— Dan, over morning espresso, Cluj-Napoca</div>
              <div className="lab-team-founder-note-meta">
                <div><b>30+</b> agents supervised</div>
                <div><b>1</b> Telegram chat</div>
                <div><b>0</b> lines of code last quarter</div>
              </div>
            </aside>
          </div>
        )}
        <div className="lab-team-grid">
          {rest.map((m) => <TeamCard key={m.id} member={m} />)}
        </div>
        <footer className="lab-team-foot">
          <span className="lab-team-foot-rule" />
          <span className="lab-team-foot-txt">
            + 23 specialized nanobots under Nervix · enroll via <code>nervix-cli</code> · roster updates every 24h at 23:55 UTC
          </span>
          <span className="lab-team-foot-rule" />
        </footer>
      </div>
    </section>
  );
}

function LabShips() {
  return (
    <section className="lab-section lab-ships-section" id="ships">
      <div className="lab-wrap">
        <header className="lab-section-head">
          <div className="lab-eyebrow">
            <span>§ 07</span><span className="lab-eyebrow-rule" /><span>the ships</span>
          </div>
          <h2 className="lab-section-title">
            Four <em>live surfaces</em> — each one a bench that already shipped to the open web.
          </h2>
          <p className="lab-section-sub">
            These are not prototypes. Real URLs, real traffic, real revenue. Click any card to leave the lab and land where the work actually runs.
          </p>
        </header>
        <div className="lab-ships-grid">
          {SHIPS.map((s) => (
            <a
              key={s.id}
              className="lab-ship"
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ ["--ship-accent" as never]: s.accent } as CSSProperties}
            >
              <div className="lab-ship-bg">
                <div className="lab-ship-bg-glow" />
              </div>
              <div className="lab-ship-head">
                <div className="lab-ship-glyph">{s.glyph}</div>
                <div className="lab-ship-status">
                  <span className="lab-ship-status-dot" />
                  {s.status}
                </div>
              </div>
              <div>
                <div className="lab-ship-name">{s.name}</div>
                <div className="lab-ship-tagline">{s.tagline}</div>
              </div>
              <div className="lab-ship-blurb">{s.blurb}</div>
              <div className="lab-ship-stats">
                {s.stats.map((st) => (
                  <div key={st.k}>
                    <div className="lab-ship-stat-v">{st.v}</div>
                    <div className="lab-ship-stat-k">{st.k}</div>
                  </div>
                ))}
              </div>
              <div className="lab-ship-stack">
                {s.stack.map((t) => <span key={t} className="lab-ship-stack-tag">{t}</span>)}
              </div>
              <div className="lab-ship-foot">
                <div className="lab-ship-foot-owner">
                  <span className="lab-ship-foot-owner-dot" style={{ background: s.ownerColor, boxShadow: `0 0 8px ${s.ownerColor}` }} />
                  <span className="lab-ship-foot-owner-label">BY</span>
                  <span className="lab-ship-foot-owner-name">{s.ownerLabel}</span>
                  <span className="lab-ship-foot-owner-bench">· {s.bench}</span>
                </div>
                <div className="lab-ship-foot-cta">
                  <span>{s.urlLabel}</span>
                  <span className="lab-ship-foot-arrow">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <footer className="lab-team-foot">
          <span className="lab-team-foot-rule" />
          <span className="lab-team-foot-txt">↗ external · opens in new tab · each surface maintained by its bench</span>
          <span className="lab-team-foot-rule" />
        </footer>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
// Page
// ────────────────────────────────────────────
export default function LabPage() {
  return (
    <div className="lab-root eco-fullbleed">
      <LabHero />
      <LabFloor />
      <LabLanes />
      <LabRecipe />
      <LabInstruments />
      <LabTeam />
      <LabShips />
    </div>
  );
}
