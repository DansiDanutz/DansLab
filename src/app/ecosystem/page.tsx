"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { AGENTS, type Agent } from "@/lib/danslab-data";

// ────────────────────────────────────────────
// Local types
// ────────────────────────────────────────────
type EcoAgent = Omit<Agent, "type"> & { type: Agent["type"] | "channel" | "infra" };

type ConnType = "data" | "ssh" | "deploy" | "monitor" | "comms";
type Connection = { id: string; from: string; to: string; type: ConnType; label?: string };
type Pos = { x: number; y: number; z?: number };
type ScenarioStep = { agents: string[]; conns: string[]; line: string };
type Scenario = { id: string; name: string; glyph: string; desc: string; steps: ScenarioStep[] };

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────
const CONN_TYPES: Record<ConnType, { color: string; label: string; dash: string }> = {
  data:    { color: "#3b82f6", label: "Data",    dash: "none" },
  ssh:     { color: "#22c55e", label: "SSH",     dash: "4 3"  },
  deploy:  { color: "#f97316", label: "Deploy",  dash: "none" },
  monitor: { color: "#eab308", label: "Monitor", dash: "2 2"  },
  comms:   { color: "#a855f7", label: "Comms",   dash: "none" },
};

const POS: Record<string, Pos> = {
  telegram:      { x: 9,  y: 8,  z: -220 },
  dan:           { x: 50, y: 5,  z: -260 },
  discord:       { x: 91, y: 9,  z: -200 },
  slack:         { x: 50, y: 22, z: -140 },
  kiloclaw:      { x: 28, y: 20, z: -120 },
  kimiclaw:      { x: 72, y: 19, z: -130 },
  manusclaw:     { x: 90, y: 26, z:  -90 },
  david:         { x: 38, y: 38, z:  -60 },
  hermes:        { x: 62, y: 36, z:  -50 },
  "mac-studio":  { x: 50, y: 50, z:    0 },
  dexter:        { x: 10, y: 46, z:   80 },
  sienna:        { x: 90, y: 44, z:   90 },
  nano:          { x: 26, y: 60, z:  120 },
  memo:          { x: 74, y: 62, z:  110 },
  "openclaw-1":  { x: 36, y: 70, z:  -40 },
  "openclaw-2":  { x: 44, y: 76, z:  -60 },
  "openclaw-3":  { x: 56, y: 76, z:  -60 },
  "openclaw-4":  { x: 64, y: 70, z:  -40 },
  vector:        { x: 50, y: 79, z:  -90 },
  monitor:       { x: 8,  y: 62, z:   30 },
  doctor:        { x: 8,  y: 74, z:    0 },
  learning:      { x: 8,  y: 86, z:  -30 },
  model:         { x: 84, y: 62, z:   30 },
  gsd:           { x: 84, y: 74, z:    0 },
  ssh:           { x: 84, y: 83, z:  -30 },
  autoforge:     { x: 17, y: 89, z:  160 },
  github:        { x: 26, y: 88, z:  180 },
  pope:          { x: 36, y: 89, z:  200 },
  vercel:        { x: 47, y: 89, z:  220 },
  stripe:        { x: 58, y: 89, z:  200 },
  supabase:      { x: 69, y: 88, z:  180 },
  update:        { x: 80, y: 87, z:  160 },
};

const EXTRA_AGENTS: EcoAgent[] = [
  { id: "dan",         name: "Dan",        role: "Human Boss",    type: "main",    color: "#f8fafc", initials: "DN", status: "online", desc: "Romanian entrepreneur. Commands the fleet via Telegram DM to Dexter. Sets priorities, approves direction." },
  { id: "mac-studio",  name: "Mac Studio", role: "Central Hub",   type: "infra",   color: "#a1a1aa", initials: "MS", status: "online", desc: "Dan's Mac Studio — runs David fleet orchestrator, Qwen 3.5 local model, Codex & Claude Code. Redis bridges to Supabase, Vercel, GitHub." },
  { id: "telegram",    name: "Telegram",   role: "Primary Comms", type: "channel", color: "#0ea5e9", initials: "TG", status: "online", desc: "Primary human-agent channel. Dan DMs Dexter directly. Team Avatars group syncs Dan + Dexter + Memo + Sienna." },
  { id: "slack",       name: "Slack",      role: "Team Hub",      type: "channel", color: "#e11d48", initials: "SL", status: "online", desc: "Team communication hub. KiloClaw moderates, KimiClaw amplifies, ManusClaw drives ops." },
  { id: "discord",     name: "Discord",    role: "Community",     type: "channel", color: "#6366f1", initials: "DC", status: "idle",   desc: "Community channel for users and public updates." },
];

const ALL_AGENTS: EcoAgent[] = [...(AGENTS as EcoAgent[]), ...EXTRA_AGENTS];
const AGENT_MAP = new Map(ALL_AGENTS.map((a) => [a.id, a]));

const CONNECTIONS: Connection[] = [
  { id: "dan-dexter", from: "dan", to: "dexter", type: "comms", label: "Telegram DM" },
  { id: "dan-telegram", from: "dan", to: "telegram", type: "comms", label: "Team Avatars Group" },
  { id: "dan-mac-studio", from: "dan", to: "mac-studio", type: "data", label: "Local Access" },
  { id: "ms-david", from: "mac-studio", to: "david", type: "data", label: "Runs Locally" },
  { id: "ms-hermes", from: "mac-studio", to: "hermes", type: "data", label: "Runs Locally" },
  { id: "hermes-david", from: "hermes", to: "david", type: "data", label: "Hand-in-hand · mission flow" },
  { id: "hermes-dexter", from: "hermes", to: "dexter", type: "data", label: "Context" },
  { id: "hermes-nano", from: "hermes", to: "nano", type: "data", label: "Context" },
  { id: "hermes-memo", from: "hermes", to: "memo", type: "data", label: "Context" },
  { id: "hermes-sienna", from: "hermes", to: "sienna", type: "data", label: "Context" },
  { id: "hermes-vector", from: "hermes", to: "vector", type: "data", label: "Memory" },
  { id: "hermes-learning", from: "hermes", to: "learning", type: "data", label: "Reads" },
  { id: "hermes-supabase", from: "hermes", to: "supabase", type: "data", label: "Long-term" },
  { id: "hermes-telegram", from: "hermes", to: "telegram", type: "comms" },
  { id: "dan-hermes", from: "dan", to: "hermes", type: "comms", label: "Reasoning" },
  { id: "david-dexter", from: "david", to: "dexter", type: "data", label: "Orchestrate" },
  { id: "david-nano", from: "david", to: "nano", type: "data", label: "Orchestrate" },
  { id: "david-memo", from: "david", to: "memo", type: "data", label: "Orchestrate" },
  { id: "david-sienna", from: "david", to: "sienna", type: "data", label: "Orchestrate" },
  { id: "david-supabase", from: "david", to: "supabase", type: "data", label: "Redis Bridge" },
  { id: "david-vercel", from: "david", to: "vercel", type: "deploy", label: "Redis Bridge" },
  { id: "david-github", from: "david", to: "github", type: "data", label: "Redis Bridge" },
  { id: "david-monitor", from: "david", to: "monitor", type: "monitor", label: "Fleet Health" },
  { id: "david-telegram", from: "david", to: "telegram", type: "comms" },
  { id: "david-slack", from: "david", to: "slack", type: "comms" },
  { id: "david-discord", from: "david", to: "discord", type: "comms" },
  { id: "david-openclaw-1", from: "david", to: "openclaw-1", type: "data", label: "Delegate Build" },
  { id: "david-openclaw-2", from: "david", to: "openclaw-2", type: "data", label: "Delegate Research" },
  { id: "david-openclaw-3", from: "david", to: "openclaw-3", type: "data", label: "Delegate Review" },
  { id: "david-openclaw-4", from: "david", to: "openclaw-4", type: "data", label: "Delegate Automation" },
  { id: "david-manusclaw", from: "david", to: "manusclaw", type: "comms", label: "Operate" },
  { id: "dexter-memo", from: "dexter", to: "memo", type: "ssh", label: "SSH + Supabase" },
  { id: "dexter-sienna", from: "dexter", to: "sienna", type: "ssh", label: "SSH + Supabase" },
  { id: "dexter-supabase", from: "dexter", to: "supabase", type: "data", label: "MoltBot DB" },
  { id: "dexter-github", from: "dexter", to: "github", type: "data", label: "60+ Repos" },
  { id: "dexter-telegram", from: "dexter", to: "telegram", type: "comms" },
  { id: "dexter-monitor", from: "dexter", to: "monitor", type: "monitor", label: "14 Crons" },
  { id: "dexter-pope", from: "dexter", to: "pope", type: "data" },
  { id: "dexter-nano", from: "dexter", to: "nano", type: "data", label: "Nervix Bridge" },
  { id: "dexter-vercel", from: "dexter", to: "vercel", type: "deploy" },
  { id: "memo-supabase", from: "memo", to: "supabase", type: "data" },
  { id: "memo-github", from: "memo", to: "github", type: "data" },
  { id: "memo-telegram", from: "memo", to: "telegram", type: "comms" },
  { id: "memo-stripe", from: "memo", to: "stripe", type: "data", label: "purchase-webhook" },
  { id: "memo-pope", from: "memo", to: "pope", type: "data" },
  { id: "sienna-supabase", from: "sienna", to: "supabase", type: "data" },
  { id: "sienna-telegram", from: "sienna", to: "telegram", type: "comms" },
  { id: "sienna-nano", from: "sienna", to: "nano", type: "ssh" },
  { id: "sienna-model", from: "sienna", to: "model", type: "data", label: "ZAI GLM-4.7" },
  { id: "nano-supabase", from: "nano", to: "supabase", type: "data", label: "Nervix DB" },
  { id: "nano-pope", from: "nano", to: "pope", type: "data" },
  { id: "nano-stripe", from: "nano", to: "stripe", type: "data", label: "Escrow" },
  { id: "telegram-supabase", from: "telegram", to: "supabase", type: "data" },
  { id: "slack-kiloclaw", from: "slack", to: "kiloclaw", type: "comms" },
  { id: "slack-kimiclaw", from: "slack", to: "kimiclaw", type: "comms" },
  { id: "slack-manusclaw", from: "slack", to: "manusclaw", type: "comms" },
  { id: "kiloclaw-doctor", from: "kiloclaw", to: "doctor", type: "data", label: "Escalate" },
  { id: "kimiclaw-dexter", from: "kimiclaw", to: "dexter", type: "comms" },
  { id: "kimiclaw-nano", from: "kimiclaw", to: "nano", type: "comms" },
  { id: "kimiclaw-memo", from: "kimiclaw", to: "memo", type: "comms" },
  { id: "kimiclaw-sienna", from: "kimiclaw", to: "sienna", type: "comms" },
  { id: "manusclaw-doctor", from: "manusclaw", to: "doctor", type: "data" },
  { id: "openclaw-1-openclaw-2", from: "openclaw-1", to: "openclaw-2", type: "data" },
  { id: "openclaw-3-openclaw-4", from: "openclaw-3", to: "openclaw-4", type: "data" },
  { id: "openclaw-1-github", from: "openclaw-1", to: "github", type: "data" },
  { id: "openclaw-1-gsd", from: "openclaw-1", to: "gsd", type: "data" },
  { id: "openclaw-2-vector", from: "openclaw-2", to: "vector", type: "data" },
  { id: "openclaw-3-github", from: "openclaw-3", to: "github", type: "data" },
  { id: "openclaw-4-autoforge", from: "openclaw-4", to: "autoforge", type: "data" },
  { id: "pope-github", from: "pope", to: "github", type: "data", label: "PRs" },
  { id: "autoforge-github", from: "autoforge", to: "github", type: "data" },
  { id: "autoforge-model", from: "autoforge", to: "model", type: "data" },
  { id: "gsd-autoforge", from: "gsd", to: "autoforge", type: "data" },
  { id: "github-vercel", from: "github", to: "vercel", type: "deploy", label: "Auto Deploy" },
  { id: "learning-vector", from: "learning", to: "vector", type: "data" },
  { id: "learning-model", from: "learning", to: "model", type: "data" },
  { id: "learning-supabase", from: "learning", to: "supabase", type: "data" },
  { id: "vector-model", from: "vector", to: "model", type: "data" },
  { id: "vector-supabase", from: "vector", to: "supabase", type: "data" },
  { id: "doctor-monitor", from: "doctor", to: "monitor", type: "monitor" },
  { id: "doctor-david", from: "doctor", to: "david", type: "data" },
  { id: "monitor-supabase", from: "monitor", to: "supabase", type: "monitor" },
  { id: "monitor-vercel", from: "monitor", to: "vercel", type: "monitor" },
  { id: "update-gsd", from: "update", to: "gsd", type: "data" },
  { id: "update-autoforge", from: "update", to: "autoforge", type: "data" },
  { id: "update-model", from: "update", to: "model", type: "data" },
  { id: "update-doctor", from: "update", to: "doctor", type: "data" },
  { id: "stripe-supabase", from: "stripe", to: "supabase", type: "data" },
  { id: "stripe-github", from: "stripe", to: "github", type: "data", label: "Repo Access" },
  { id: "ssh-dexter", from: "ssh", to: "dexter", type: "ssh" },
  { id: "ssh-memo", from: "ssh", to: "memo", type: "ssh" },
  { id: "ssh-sienna", from: "ssh", to: "sienna", type: "ssh" },
  { id: "ssh-nano", from: "ssh", to: "nano", type: "ssh" },
];

const SCENARIOS: Scenario[] = [
  {
    id: "bug-fix",
    name: "Fix a Bug",
    glyph: "⚠",
    desc: "Bug lands in Slack → fixed → deployed, all without human touch.",
    steps: [
      { agents: ["slack", "kiloclaw"], conns: ["slack-kiloclaw"], line: "Bug report arrives in Slack. KiloClaw picks it up." },
      { agents: ["kiloclaw", "doctor", "monitor"], conns: ["kiloclaw-doctor", "doctor-monitor"], line: "KiloClaw escalates to Doctor. Doctor checks Monitor's diagnostics." },
      { agents: ["doctor", "david", "openclaw-3", "openclaw-4"], conns: ["doctor-david", "david-openclaw-3", "david-openclaw-4", "openclaw-3-openclaw-4"], line: "David routes fix through OpenClaw reviewer + automation pair." },
      { agents: ["openclaw-4", "autoforge", "github", "pope"], conns: ["openclaw-4-autoforge", "autoforge-github", "pope-github"], line: "AutoForge writes the fix, pushes to GitHub. Pope creates the PR." },
      { agents: ["github", "vercel", "monitor"], conns: ["github-vercel", "monitor-vercel"], line: "Auto-deployed to Vercel. Monitor confirms the fix is live." },
    ],
  },
  {
    id: "new-feature",
    name: "Ship a Feature",
    glyph: "✦",
    desc: "Dan DMs Dexter → research → build → deploy → promote.",
    steps: [
      { agents: ["dan", "dexter", "telegram"], conns: ["dan-dexter", "dan-telegram", "dexter-telegram"], line: "Dan DMs Dexter on Telegram with a new feature idea." },
      { agents: ["dexter", "david", "openclaw-2", "vector"], conns: ["david-dexter", "david-openclaw-2", "openclaw-2-vector"], line: "David delegates research to OpenClaw-02, checks Vector Memory." },
      { agents: ["david", "openclaw-1", "autoforge", "gsd"], conns: ["david-openclaw-1", "openclaw-1-gsd", "gsd-autoforge"], line: "OpenClaw-01 builds via GSD framework. AutoForge writes the code." },
      { agents: ["autoforge", "github", "openclaw-3", "pope"], conns: ["autoforge-github", "openclaw-3-github", "pope-github"], line: "OpenClaw-03 reviews PRs. Pope runs CI in Docker." },
      { agents: ["github", "vercel", "kimiclaw", "telegram"], conns: ["github-vercel", "kimiclaw-dexter", "david-telegram"], line: "Auto-deployed to Vercel. KimiClaw promotes across channels." },
    ],
  },
  {
    id: "learning",
    name: "Learn & Improve",
    glyph: "◈",
    desc: "Daily 23:55 UTC summary → Vector memory → Model optimizer.",
    steps: [
      { agents: ["learning", "supabase"], conns: ["learning-supabase"], line: "Learning reviews yesterday's daily_summaries from Supabase." },
      { agents: ["learning", "vector", "supabase"], conns: ["learning-vector", "vector-supabase"], line: "Insights stored in Vector Memory (agent_context table)." },
      { agents: ["vector", "model", "learning"], conns: ["learning-model", "vector-model"], line: "Model optimizes fallback chains — Opus→Sonnet→GPT-4.1→Gemini→ZAI." },
      { agents: ["update", "gsd", "autoforge", "model"], conns: ["update-gsd", "update-autoforge", "update-model"], line: "Update pushes latest tool versions via devops-control-repo." },
      { agents: ["david", "dexter", "nano", "memo", "sienna"], conns: ["david-dexter", "david-nano", "david-memo", "david-sienna"], line: "All agents receive improvements. The lab is smarter today." },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Flow",
    glyph: "$",
    desc: "CrawBoard subscription → Stripe → GitHub access → Nervix enroll.",
    steps: [
      { agents: ["stripe", "memo"], conns: ["memo-stripe"], line: "New subscription on CrawBoard. Stripe hits Memo's purchase-webhook." },
      { agents: ["stripe", "supabase", "github"], conns: ["stripe-supabase", "stripe-github"], line: "Payment recorded in Supabase. Auto-grants GitHub repo access." },
      { agents: ["nano", "david", "supabase"], conns: ["david-nano", "nano-supabase", "nano-stripe"], line: "Nano enrolls specialized agents into Nervix Federation via nervix-cli." },
      { agents: ["dexter", "monitor", "supabase"], conns: ["dexter-supabase", "dexter-monitor", "monitor-supabase"], line: "Dexter's crons push stats to Supabase. Monitor confirms green." },
      { agents: ["kimiclaw", "manusclaw", "slack", "telegram"], conns: ["slack-kimiclaw", "slack-manusclaw", "david-telegram"], line: "KimiClaw promotes, ManusClaw executes. Revenue flows." },
    ],
  },
  {
    id: "lab-sync",
    name: "Lab Sync",
    glyph: "◉",
    desc: "Dan → Dexter → David → OpenClaw mesh tightens the loop.",
    steps: [
      { agents: ["dan", "dexter", "david", "mac-studio"], conns: ["dan-dexter", "dan-mac-studio", "ms-david", "david-dexter"], line: "Dan DMs Dexter. David picks up orchestration from Mac Studio." },
      { agents: ["david", "openclaw-1", "openclaw-2", "gsd", "vector"], conns: ["david-openclaw-1", "david-openclaw-2", "openclaw-1-openclaw-2", "openclaw-1-gsd", "openclaw-2-vector"], line: "Builder + Researcher split work — GSD framework, Vector memory." },
      { agents: ["openclaw-3", "openclaw-4", "autoforge", "github"], conns: ["openclaw-3-openclaw-4", "openclaw-4-autoforge", "openclaw-3-github", "autoforge-github"], line: "Reviewer validates. Automation ships. AutoForge pushes code." },
      { agents: ["dexter", "memo", "sienna", "supabase", "telegram"], conns: ["dexter-memo", "dexter-sienna", "dexter-supabase", "telegram-supabase"], line: "Dexter SSHs updates to Memo + Sienna. Synced via Supabase." },
    ],
  },
];

// Avatar treatment per agent
type AvatarSpec = { src?: string; crest?: boolean; glyph?: string; palette?: [string, string, string] };
const AVATARS: Record<string, AvatarSpec> = {
  dan:    { src: "/avatars/dan.jpg" },
  dexter: { src: "/avatars/dexter.jpg" },
  memo:   { src: "/avatars/memo.jpg" },
  sienna: { src: "/avatars/sienna.jpg" },
  nano:   { crest: true, glyph: "⎔", palette: ["#7c3aed", "#a855f7", "#ec4899"] },
  david:  { crest: true, glyph: "✦", palette: ["#166534", "#22c55e", "#d4a017"] },
  hermes: { crest: true, glyph: "ℋ", palette: ["#78350f", "#d4a017", "#fef3c7"] },
};

// ────────────────────────────────────────────
// Scenario player hook
// ────────────────────────────────────────────
type ScenarioState = {
  playing: boolean;
  id: string | null;
  step: number;
  line: string;
  agents: Set<string>;
  conns: Set<string>;
};
const EMPTY_STATE: ScenarioState = { playing: false, id: null, step: 0, line: "", agents: new Set(), conns: new Set() };

function useScenarioPlayer() {
  const [state, setState] = useState<ScenarioState>(EMPTY_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setState(EMPTY_STATE);
  }, []);

  const play = useCallback((id: string) => {
    const sc = SCENARIOS.find((s) => s.id === id);
    if (!sc) return;
    let i = 0;
    const runStep = () => {
      const step = sc.steps[i];
      setState({
        playing: true,
        id,
        step: i,
        line: step.line,
        agents: new Set(step.agents),
        conns: new Set(step.conns),
      });
      i++;
      if (i < sc.steps.length) {
        timerRef.current = setTimeout(runStep, 2800);
      } else {
        timerRef.current = setTimeout(stop, 3200);
      }
    };
    runStep();
  }, [stop]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return { state, play, stop };
}

// ────────────────────────────────────────────
// Node
// ────────────────────────────────────────────
function EcoNode({ agent, pos, active, highlighted, dimmed, selected, dragging, onDown, onTap, size }: {
  agent: EcoAgent;
  pos: Pos;
  active: boolean;
  highlighted: boolean;
  dimmed: boolean;
  selected: boolean;
  dragging: boolean;
  onDown: (e: ReactMouseEvent, id: string) => void;
  onTap: (id: string) => void;
  size: "sm" | "md" | "lg";
}) {
  const sz = size === "sm" ? 44 : size === "lg" ? 64 : 52;
  const z = pos.z ?? Math.round(((pos.y - 50) / 50) * 110);
  const av = AVATARS[agent.id];

  let inner: React.ReactNode;
  if (av?.src) {
    inner = <Image src={av.src} alt={agent.name} width={sz} height={sz} />;
  } else if (av?.crest && av.palette && av.glyph) {
    const [c1, c2, c3] = av.palette;
    inner = (
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: `radial-gradient(120% 120% at 25% 20%, ${c3} 0%, ${c2} 35%, ${c1} 100%)`,
        display: "grid", placeItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <span style={{
          fontFamily: "Newsreader, serif", fontStyle: "italic", fontWeight: 500,
          fontSize: sz * 0.5, color: "rgba(255,255,255,0.95)",
          textShadow: "0 1px 4px rgba(0,0,0,0.5)", lineHeight: 1,
        }}>{av.glyph}</span>
      </div>
    );
  } else {
    inner = <span className="eco-node-initials" style={{ color: agent.color }}>{agent.initials}</span>;
  }

  return (
    <div
      className={`eco-node ${active ? "is-active" : ""} ${highlighted ? "is-hl" : ""} ${dimmed ? "is-dim" : ""} ${selected ? "is-sel" : ""} ${dragging ? "is-drag" : ""}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-50%, -50%) translateZ(${z}px)`,
      }}
      onMouseDown={(e) => { e.stopPropagation(); onDown(e, agent.id); }}
      onTouchEnd={(e) => { e.stopPropagation(); onTap(agent.id); }}
    >
      <div
        className="eco-node-disc"
        style={{
          width: sz, height: sz,
          background: av?.src ? "#1a100c" : `radial-gradient(circle at 30% 28%, ${agent.color}66, ${agent.color}11 70%)`,
          borderColor: `${agent.color}aa`,
          color: agent.color,
          padding: 0,
          boxShadow: active
            ? `0 0 28px ${agent.color}, inset 0 0 0 1px ${agent.color}, 0 8px 24px rgba(0,0,0,0.6)`
            : `0 0 8px ${agent.color}33, 0 6px 14px rgba(0,0,0,0.45)`,
        }}
      >
        {inner}
      </div>
      <div className="eco-node-label">
        <span className="eco-node-name">{agent.name}</span>
        <span className="eco-node-role">{agent.role}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Connection line
// ────────────────────────────────────────────
function EcoLine({ c, from, to, active, dimmed }: {
  c: Connection;
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
  dimmed: boolean;
}) {
  const type = CONN_TYPES[c.type];
  const opacity = dimmed ? 0.04 : active ? 0.95 : 0.16;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const nx = -dy;
  const ny = dx;
  const len = Math.hypot(nx, ny) || 1;
  const isHoriz = Math.abs(dy) < Math.abs(dx) * 0.4;
  const curve = isHoriz ? -0.12 : 0.05;
  const cx = mx + (nx / len) * dist * curve;
  const cy = my + (ny / len) * dist * curve + (isHoriz ? 24 : 0);
  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  return (
    <g style={{ opacity, transition: "opacity .35s" }}>
      <path
        d={d}
        stroke={type.color}
        strokeWidth={active ? 1.8 : 1}
        fill="none"
        strokeDasharray={type.dash === "none" ? undefined : type.dash}
        strokeLinecap="round"
        style={{ filter: active ? `drop-shadow(0 0 6px ${type.color})` : "none" }}
      />
      {active && (
        <circle r={2.8} fill={type.color} style={{ filter: `drop-shadow(0 0 8px ${type.color})` }}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}

// ────────────────────────────────────────────
// Scenario rail
// ────────────────────────────────────────────
function ScenarioBar({ state, play, stop }: {
  state: ScenarioState;
  play: (id: string) => void;
  stop: () => void;
}) {
  const active = state.id ? SCENARIOS.find((s) => s.id === state.id) : null;
  return (
    <div className="eco-scenarios">
      <div className="eco-scenarios-head">
        <span className="eco-scenarios-label">SCENARIOS / FLOWS</span>
        {state.playing && (
          <button type="button" className="eco-stop" onClick={stop}>■ stop</button>
        )}
      </div>
      <div className="eco-scenarios-list">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`eco-scenario ${state.id === s.id ? "is-on" : ""}`}
            onClick={() => (state.id === s.id ? stop() : play(s.id))}
          >
            <span className="eco-scenario-glyph">{s.glyph}</span>
            <span className="eco-scenario-body">
              <span className="eco-scenario-name">{s.name}</span>
              <span className="eco-scenario-desc">{s.desc}</span>
            </span>
          </button>
        ))}
      </div>
      {state.playing && active && (
        <div className="eco-narration">
          <div className="eco-narration-meta">
            <span>{active.glyph} {active.name}</span>
            <span className="eco-narration-step">step {state.step + 1}/{active.steps.length}</span>
          </div>
          <div className="eco-narration-line" key={state.step}>{state.line}</div>
          <div className="eco-narration-dots">
            {active.steps.map((_, i) => (
              <span key={i} className={i === state.step ? "is-on" : i < state.step ? "is-done" : ""} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Agent detail panel (overlay)
// ────────────────────────────────────────────
function AgentPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const a = AGENT_MAP.get(id);
  if (!a) return null;
  const outgoing = CONNECTIONS.filter((c) => c.from === id);
  const incoming = CONNECTIONS.filter((c) => c.to === id);
  return (
    <aside className="eco-panel" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
      <header className="eco-panel-head">
        <div className="eco-panel-mono" style={{ background: `linear-gradient(135deg, ${a.color}22, ${a.color}08)`, borderColor: `${a.color}55`, color: a.color }}>
          {a.initials}
        </div>
        <div className="eco-panel-head-body">
          <div className="eco-panel-name">{a.name}</div>
          <div className="eco-panel-role">{a.role}</div>
        </div>
        <button type="button" className="eco-panel-close" onClick={onClose}>×</button>
      </header>
      <div className="eco-panel-chips">
        <span className="eco-panel-chip" style={{ color: a.color, borderColor: `${a.color}55` }}>
          <span className="eco-panel-dot" style={{ background: a.color }} />
          {(a.status || "online").toUpperCase()}
        </span>
        {a.model && <span className="eco-panel-chip">{a.model}</span>}
        {a.droplet && <span className="eco-panel-chip">{a.droplet}</span>}
        {a.project && <span className="eco-panel-chip" style={{ color: a.color }}>↗ {a.project}</span>}
      </div>
      <p className="eco-panel-desc">{a.desc}</p>
      <div>
        <div className="eco-panel-block-title">OUT · {outgoing.length} edges</div>
        <ul className="eco-panel-edges">
          {outgoing.slice(0, 10).map((c) => {
            const t = CONN_TYPES[c.type];
            const other = AGENT_MAP.get(c.to);
            return (
              <li key={c.id}>
                <span className="eco-edge-type" style={{ color: t.color }}>{t.label}</span>
                <span className="eco-edge-arrow">→</span>
                <span className="eco-edge-name">{other ? other.name : c.to}</span>
                {c.label && <span className="eco-edge-label">· {c.label}</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div className="eco-panel-block-title">IN · {incoming.length} edges</div>
        <ul className="eco-panel-edges">
          {incoming.slice(0, 10).map((c) => {
            const t = CONN_TYPES[c.type];
            const other = AGENT_MAP.get(c.from);
            return (
              <li key={c.id}>
                <span className="eco-edge-type" style={{ color: t.color }}>{t.label}</span>
                <span className="eco-edge-arrow">←</span>
                <span className="eco-edge-name">{other ? other.name : c.from}</span>
                {c.label && <span className="eco-edge-label">· {c.label}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────
// Legend
// ────────────────────────────────────────────
function Legend({ counts }: { counts: { agents: number; conns: number } }) {
  return (
    <div className="eco-legend" onMouseDown={(e) => e.stopPropagation()}>
      {(Object.entries(CONN_TYPES) as [ConnType, (typeof CONN_TYPES)[ConnType]][]).map(([k, v]) => (
        <div key={k} className="eco-legend-item">
          <span
            className="eco-legend-line"
            style={{
              background: v.dash === "none" ? v.color : "transparent",
              borderTop: v.dash === "none" ? "none" : `1px dashed ${v.color}`,
            }}
          />
          <span>{v.label}</span>
        </div>
      ))}
      <span className="eco-legend-sep" />
      <div className="eco-legend-item"><b>{counts.agents}</b>&nbsp;agents</div>
      <div className="eco-legend-item"><b>{counts.conns}</b>&nbsp;edges</div>
    </div>
  );
}

// ────────────────────────────────────────────
// Main canvas + page
// ────────────────────────────────────────────
type DragRef = { x: number; y: number; tx: number; ty: number; dragged: boolean };
type NodeDragRef = { id: string; mx: number; my: number; startX: number; startY: number; startZ: number; dragged: boolean };

export default function EcosystemPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ w: 1200, h: 900 });
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [tilted, setTilted] = useState(true);
  const [smooth, setSmooth] = useState(false);
  const smoothTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);
  const dragRef = useRef<DragRef | null>(null);
  const nodeDragRef = useRef<NodeDragRef | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const { state: scenarioState, play, stop } = useScenarioPlayer();

  const [nodePos, setNodePos] = useState<Record<string, Pos>>(() => {
    if (typeof window === "undefined") return { ...POS };
    try {
      const saved = JSON.parse(localStorage.getItem("eco:nodepos") || "null");
      if (saved && typeof saved === "object") return { ...POS, ...saved };
    } catch {}
    return { ...POS };
  });

  useEffect(() => {
    try { localStorage.setItem("eco:nodepos", JSON.stringify(nodePos)); } catch {}
  }, [nodePos]);

  const resetLayout = () => {
    try { localStorage.removeItem("eco:nodepos"); } catch {}
    setNodePos({ ...POS });
  };

  // Auto-play once after idle — stops suggesting itself as soon as the user interacts
  useEffect(() => {
    if (scenarioState.playing || selected) return;
    const t = setTimeout(() => {
      if (interactedRef.current || document.hidden) return;
      const id = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)].id;
      play(id);
    }, 18000);
    return () => clearTimeout(t);
  }, [scenarioState.playing, selected, play]);

  const handleSelect = (id: string | null) => {
    interactedRef.current = true;
    if (id && scenarioState.playing) stop();
    setSelected((cur) => (cur === id ? null : id));
  };

  // End any drag on window mouseup — releasing outside the canvas must not leave a node glued to the cursor
  useEffect(() => {
    const endDrag = () => {
      if (nodeDragRef.current) { nodeDragRef.current = null; setDragId(null); }
      dragRef.current = null;
    };
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("blur", endDrag);
    return () => {
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("blur", endDrag);
    };
  }, []);

  // Track size
  useEffect(() => {
    const upd = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setDim({ w: r.width, h: r.height });
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    interactedRef.current = true;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const newScale = Math.max(0.45, Math.min(3.2, v.scale * factor));
      const sx = (cx - v.tx) / v.scale;
      const sy = (cy - v.ty) / v.scale;
      return { scale: newScale, tx: cx - sx * newScale, ty: cy - sy * newScale };
    });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e: ReactMouseEvent) => {
    if (e.button !== 0) return;
    interactedRef.current = true;
    const target = e.target as HTMLElement;
    if (target.closest(".eco-node, .eco-zoom-ctrls, .eco-panel, .eco-zone-pill")) return;
    dragRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty, dragged: false };
  };

  const onNodeDown = (e: ReactMouseEvent, id: string) => {
    if (e.button !== 0) return;
    interactedRef.current = true;
    const start = nodePos[id];
    if (!start) return;
    nodeDragRef.current = {
      id,
      mx: e.clientX, my: e.clientY,
      startX: start.x, startY: start.y,
      startZ: start.z ?? 0,
      dragged: false,
    };
    setDragId(id);
  };

  const onMouseMove = (e: ReactMouseEvent) => {
    const nd = nodeDragRef.current;
    if (nd) {
      const dx = e.clientX - nd.mx;
      const dy = e.clientY - nd.my;
      if (Math.hypot(dx, dy) > 2) nd.dragged = true;
      const pctDx = (dx / view.scale) / dim.w * 100;
      const pctDy = (dy / view.scale) / dim.h * 100;
      const nx = Math.max(2, Math.min(98, nd.startX + pctDx));
      const ny = Math.max(2, Math.min(98, nd.startY + pctDy));
      setNodePos((p) => ({ ...p, [nd.id]: { x: nx, y: ny, z: nd.startZ } }));
      return;
    }
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 3) d.dragged = true;
    setView((v) => ({ ...v, tx: d.tx + dx, ty: d.ty + dy }));
  };

  const onMouseUp = () => {
    const nd = nodeDragRef.current;
    if (nd) {
      if (!nd.dragged) handleSelect(nd.id);
      nodeDragRef.current = null;
      setDragId(null);
      return;
    }
    const d = dragRef.current;
    if (d && !d.dragged) handleSelect(null);
    dragRef.current = null;
  };

  // Touch
  const touchRef = useRef<{ mode: "pan" | "pinch"; x?: number; y?: number; tx?: number; ty?: number; d0?: number; scale0?: number } | null>(null);
  const onTouchStart = (e: ReactTouchEvent) => {
    interactedRef.current = true;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchRef.current = { mode: "pan", x: t.clientX, y: t.clientY, tx: view.tx, ty: view.ty };
    } else if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      touchRef.current = { mode: "pinch", d0: d, scale0: view.scale };
    }
  };
  const onTouchMove = (e: ReactTouchEvent) => {
    const r = touchRef.current;
    if (!r) return;
    if (r.mode === "pan" && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - (r.x ?? 0);
      const dy = t.clientY - (r.y ?? 0);
      setView((v) => ({ ...v, tx: (r.tx ?? 0) + dx, ty: (r.ty ?? 0) + dy }));
    } else if (r.mode === "pinch" && e.touches.length === 2 && r.d0 && r.scale0) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const newScale = Math.max(0.45, Math.min(3.2, r.scale0 * (d / r.d0)));
      // anchor the pinch at the midpoint between fingers, not the plane origin
      const wrap = wrapRef.current;
      const rect = wrap ? wrap.getBoundingClientRect() : { left: 0, top: 0 };
      const cx = (a.clientX + b.clientX) / 2 - rect.left;
      const cy = (a.clientY + b.clientY) / 2 - rect.top;
      setView((v) => {
        const sx = (cx - v.tx) / v.scale;
        const sy = (cy - v.ty) / v.scale;
        return { scale: newScale, tx: cx - sx * newScale, ty: cy - sy * newScale };
      });
    }
  };
  const onTouchEnd = () => { touchRef.current = null; };

  // Button zoom/fit animate smoothly; drag & pinch stay 1:1 with the pointer
  const smoothly = (apply: () => void) => {
    interactedRef.current = true;
    setSmooth(true);
    apply();
    if (smoothTimer.current) clearTimeout(smoothTimer.current);
    smoothTimer.current = setTimeout(() => setSmooth(false), 280);
  };
  const zoomBy = (factor: number) => smoothly(() => {
    setView((v) => {
      const newScale = Math.max(0.45, Math.min(3.2, v.scale * factor));
      const cx = dim.w / 2, cy = dim.h / 2;
      const sx = (cx - v.tx) / v.scale;
      const sy = (cy - v.ty) / v.scale;
      return { scale: newScale, tx: cx - sx * newScale, ty: cy - sy * newScale };
    });
  });
  const fit = () => smoothly(() => setView({ scale: 1, tx: 0, ty: 0 }));

  // Focus = selected or dragged node
  const focusId = dragId || selected;
  const selConnSet = useMemo(() => {
    if (!focusId) return new Set<string>();
    return new Set(CONNECTIONS.filter((c) => c.from === focusId || c.to === focusId).map((c) => c.id));
  }, [focusId]);
  const selNeighbors = useMemo(() => {
    if (!focusId) return new Set<string>();
    return new Set(
      CONNECTIONS
        .filter((c) => c.from === focusId || c.to === focusId)
        .flatMap((c) => [c.from, c.to])
    );
  }, [focusId]);

  const hasSel = !!focusId;
  const hasSce = scenarioState.playing;
  const ids = Object.keys(POS);
  const counts = { agents: ids.length, conns: CONNECTIONS.length };

  const planeTransform = `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})${tilted ? " rotateX(10deg)" : ""}`;

  return (
    <div className="eco-fullbleed eco-root">
      <div className="eco-main">
        <div
          className="eco-canvas"
          ref={wrapRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => { dragRef.current = null; }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="eco-canvas-grid" />
          <div className="eco-canvas-vignette" />

          <div className="eco-stage">
            <div
              className={`eco-plane ${tilted ? "is-tilted" : ""} ${smooth ? "is-smooth" : ""}`}
              style={{ transform: planeTransform, width: dim.w, height: dim.h } as CSSProperties}
            >
              {/* zone bands */}
              <div className="eco-zone-band" style={{ top: "2%",  height: "13%" }} />
              <div className="eco-zone-band" style={{ top: "17%", height: "12%" }} />
              <div className="eco-zone-band" style={{ top: "30%", height: "20%" }} />
              <div className="eco-zone-band" style={{ top: "51%", height: "14%" }} />
              <div className="eco-zone-band" style={{ top: "66%", height: "10%" }} />
              <div className="eco-zone-band" style={{ top: "77%", height: "20%" }} />

              {/* zone pills */}
              <div className="eco-zone-pill" style={{ top: "3%",  left: "1.5%" }}>§ 01 · BOSS &amp; CHANNELS</div>
              <div className="eco-zone-pill" style={{ top: "18%", left: "1.5%" }}>§ 02 · SLACK CREW</div>
              <div className="eco-zone-pill" style={{ top: "31%", left: "1.5%" }}>§ 03 · ORCHESTRATION</div>
              <div className="eco-zone-pill" style={{ top: "52%", left: "1.5%" }}>§ 04 · OPENCLAW MESH</div>
              <div className="eco-zone-pill" style={{ top: "67%", left: "1.5%" }}>§ 05 · SUPPORT LAYER</div>
              <div className="eco-zone-pill" style={{ top: "78%", left: "1.5%" }}>§ 06 · INFRASTRUCTURE</div>

              {/* SVG edges */}
              <svg className="eco-svg" viewBox={`0 0 ${dim.w} ${dim.h}`} preserveAspectRatio="none">
                {CONNECTIONS.map((c) => {
                  const fp = nodePos[c.from];
                  const tp = nodePos[c.to];
                  if (!fp || !tp) return null;
                  const from = { x: (fp.x / 100) * dim.w, y: (fp.y / 100) * dim.h };
                  const to   = { x: (tp.x / 100) * dim.w, y: (tp.y / 100) * dim.h };
                  const isSelActive = selConnSet.has(c.id);
                  const isSceActive = scenarioState.conns.has(c.id);
                  const active = isSelActive || isSceActive;
                  const dimmed = (hasSel && !isSelActive) || (hasSce && !isSceActive);
                  return <EcoLine key={c.id} c={c} from={from} to={to} active={active} dimmed={dimmed} />;
                })}
              </svg>

              {/* HTML nodes */}
              <div className="eco-nodes">
                {ids.map((id) => {
                  const a = AGENT_MAP.get(id);
                  if (!a) return null;
                  const pos = nodePos[id];
                  const isSceActive = scenarioState.agents.has(id);
                  const isSelActive = focusId === id || selNeighbors.has(id);
                  const active = isSceActive || focusId === id;
                  const highlighted = isSelActive || isSceActive;
                  const dimmed = (hasSel && !isSelActive) || (hasSce && !isSceActive);
                  const size: "sm" | "md" | "lg" =
                    ["dan", "david", "mac-studio", "hermes"].includes(id) ? "lg"
                    : a.type === "support" || a.type === "channel" ? "sm"
                    : "md";
                  return (
                    <EcoNode
                      key={id}
                      agent={a}
                      pos={pos}
                      active={active}
                      highlighted={highlighted}
                      dimmed={dimmed}
                      selected={selected === id}
                      dragging={dragId === id}
                      onDown={onNodeDown}
                      onTap={handleSelect}
                      size={size}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="eco-zoom-ctrls" onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="eco-zoom-btn" title="Zoom in" onClick={() => zoomBy(1.2)}>＋</button>
            <button type="button" className="eco-zoom-btn" title="Zoom out" onClick={() => zoomBy(1 / 1.2)}>－</button>
            <div className="eco-zoom-pct">{Math.round(view.scale * 100)}%</div>
            <button type="button" className="eco-zoom-btn" title="Fit" onClick={fit}>◇</button>
            <button
              type="button"
              className={`eco-zoom-btn ${tilted ? "is-on" : ""}`}
              title="Toggle 3D tilt"
              onClick={() => setTilted((v) => !v)}
            >3D</button>
            <button type="button" className="eco-zoom-btn" title="Reset layout" onClick={resetLayout}>⟲</button>
          </div>

          <div className="eco-canvas-hint">drag node · move it · drag space · pan · scroll · zoom</div>

          {selected && <AgentPanel id={selected} onClose={() => setSelected(null)} />}

          <Legend counts={counts} />
        </div>

        <ScenarioBar state={scenarioState} play={play} stop={stop} />
      </div>
    </div>
  );
}
