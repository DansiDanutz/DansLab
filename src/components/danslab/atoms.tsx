"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import type { Agent, AgentStatus, ActivityItem } from "@/lib/danslab-data";
import { AVATAR_PATHS } from "@/lib/danslab-data";

// ────────────────────────────────────────────
// Hooks
// ────────────────────────────────────────────
export function useTicker(intervalMs = 1000) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return t;
}

export function useCountUp(target: number, durationMs = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number | undefined;
    let start: number | undefined;
    const step = (ts: number) => {
      if (start === undefined) start = ts;
      const p = Math.min(1, (ts - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);
  return v;
}

// ────────────────────────────────────────────
// Status dot
// ────────────────────────────────────────────
const STATUS_MAP: Record<AgentStatus, { c: string; g: string }> = {
  online:   { c: "#22c55e", g: "rgba(34,197,94,.6)" },
  busy:     { c: "#d4a017", g: "rgba(212,160,23,.6)" },
  trading:  { c: "#ec4899", g: "rgba(236,72,153,.6)" },
  thinking: { c: "#facc15", g: "rgba(250,204,21,.6)" },
  idle:     { c: "#52525b", g: "rgba(82,82,91,.2)" },
  off:      { c: "#3f3f46", g: "transparent" },
};

export function StatusDot({ status = "online", size = 6 }: { status?: AgentStatus; size?: number }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.idle;
  const pulse = status === "online" || status === "busy" || status === "trading" || status === "thinking";
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 999,
        background: s.c,
        boxShadow: `0 0 8px ${s.g}`,
        animation: pulse ? "dl-pulse 2.4s ease-in-out infinite" : "none",
        flexShrink: 0,
      }}
    />
  );
}

// ────────────────────────────────────────────
// Live status badge pill (hero)
// ────────────────────────────────────────────
const LIVE_MSGS = [
  "Dexter online · Opus 4.6",
  "38 crons scheduled today",
  "Sienna · BTC long open",
  "Pope merged PR #1183",
  "Nano enrolling moltbot-47",
  "14 agents active now",
];

export function LivePill() {
  const t = useTicker(2200);
  const msg = LIVE_MSGS[t % LIVE_MSGS.length];
  return (
    <div className="dl-live-pill">
      <StatusDot status="busy" size={7} />
      <span className="dl-live-label">LIVE</span>
      <span className="dl-live-sep">/</span>
      <span className="dl-live-msg" key={msg}>{msg}</span>
    </div>
  );
}

// ────────────────────────────────────────────
// Section label ("§ 01 · HERO")
// ────────────────────────────────────────────
export function SectionLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="dl-section-label">
      <span className="dl-section-num">§ {String(n).padStart(2, "0")}</span>
      <span className="dl-section-rule" />
      <span className="dl-section-title">{title}</span>
    </div>
  );
}

// ────────────────────────────────────────────
// Monogram — uses real avatar if available, else initials
// ────────────────────────────────────────────
export function Monogram({ agent, size = 40 }: { agent: Agent; size?: number }) {
  const avatar = AVATAR_PATHS[agent.id];
  if (avatar) {
    return (
      <div
        className="dl-monogram"
        style={{
          width: size,
          height: size,
          borderColor: `${agent.color}40`,
          background: `linear-gradient(135deg, ${agent.color}22 0%, ${agent.color}08 100%)`,
        }}
      >
        <Image src={avatar} alt={agent.name} width={size} height={size} />
      </div>
    );
  }
  return (
    <div
      className="dl-monogram"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${agent.color}22 0%, ${agent.color}08 100%)`,
        borderColor: `${agent.color}40`,
        color: agent.color,
        fontSize: size * 0.36,
      }}
    >
      {agent.initials}
    </div>
  );
}

// ────────────────────────────────────────────
// Ticker line (small monospace row)
// ────────────────────────────────────────────
export function TickerRow({ item, agents }: { item: ActivityItem; agents: Agent[] }) {
  const a = agents.find((x) => x.id === item.agent) ?? { name: item.agent, color: "#999" };
  return (
    <div className="dl-ticker-row">
      <span className="dl-ticker-time">{item.t < 60 ? `${item.t}m` : `${Math.floor(item.t / 60)}h`}</span>
      <span className="dl-ticker-icon" style={{ color: a.color }}>{item.icon}</span>
      <span className="dl-ticker-agent" style={{ color: a.color }}>{a.name}</span>
      <span className="dl-ticker-verb">{item.verb}</span>
      <span className="dl-ticker-target">{item.target}</span>
    </div>
  );
}

// Helper to make CSS custom properties type-safe
export function cssVar(props: Record<string, string | number>): CSSProperties {
  return props as CSSProperties;
}
