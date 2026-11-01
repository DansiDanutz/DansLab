"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  AGENT_MAP, AVATARS, CONN_TYPES, CONNECTIONS, SCENARIOS,
  nodeSize, shortName, type ConnType, type Connection, type EcoAgent,
} from "./data";
import { edgePath, type Point } from "./map-layout";

export type ScenarioState = {
  playing: boolean;
  id: string | null;
  step: number;
  line: string;
  agents: Set<string>;
  conns: Set<string>;
};

// ────────────────────────────────────────────
// Node
// ────────────────────────────────────────────
function NodeFace({ agent, size }: { agent: EcoAgent; size: number }) {
  const av = AVATARS[agent.id];
  if (av?.src) return <Image src={av.src} alt="" width={size} height={size} />;
  if (av?.crest && av.palette && av.glyph) {
    const [c1, c2, c3] = av.palette;
    return (
      <span className="eco-node-crest" style={{ background: `radial-gradient(120% 120% at 25% 20%, ${c3} 0%, ${c2} 35%, ${c1} 100%)`, fontSize: size * 0.46 }}>
        {av.glyph}
      </span>
    );
  }
  return <span className="eco-node-initials" style={{ color: agent.color, fontSize: size * 0.28 }}>{agent.initials}</span>;
}

export function EcoNode({ agent, at, state, onSelect, onHover }: {
  agent: EcoAgent;
  at: Point;
  state: "idle" | "focus" | "linked" | "dim";
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const size = nodeSize(agent);
  const lit = state === "focus" || state === "linked";
  return (
    <button
      type="button"
      className={`eco-node is-${state}`}
      style={{ left: at.x, top: at.y - size / 2, ["--node-color" as string]: agent.color }}
      onClick={() => onSelect(agent.id)}
      onMouseEnter={() => onHover(agent.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(agent.id)}
      onBlur={() => onHover(null)}
      aria-label={`${agent.name}, ${agent.role}`}
    >
      <span
        className="eco-node-disc"
        style={{
          width: size, height: size,
          boxShadow: lit ? `0 0 0 3px ${agent.color}33, 0 0 22px ${agent.color}88` : undefined,
        }}
      >
        <NodeFace agent={agent} size={size} />
      </span>
      <span className="eco-node-name">{shortName(agent.name)}</span>
      <span className="eco-node-role">{agent.role}</span>
    </button>
  );
}

// ────────────────────────────────────────────
// Edges
// ────────────────────────────────────────────
export function EcoEdges({ width, height, nodes, lit, dimOthers }: {
  width: number;
  height: number;
  nodes: Record<string, Point>;
  lit: Set<string>;
  dimOthers: boolean;
}) {
  const ordered = [...CONNECTIONS].sort((a, b) => Number(lit.has(a.id)) - Number(lit.has(b.id)));
  return (
    <svg className="eco-edges" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {ordered.map((c) => {
        const a = nodes[c.from], b = nodes[c.to];
        if (!a || !b) return null;
        const t = CONN_TYPES[c.type];
        const on = lit.has(c.id);
        const d = edgePath(a, b);
        return (
          <g key={c.id} className={`eco-edge ${on ? "is-on" : dimOthers ? "is-dim" : ""}`}>
            <path d={d} stroke={on ? t.color : "currentColor"} strokeDasharray={t.dash === "none" ? undefined : t.dash} />
            {on && (
              <circle r={2.6} fill={t.color}>
                <animateMotion dur="1.8s" repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ────────────────────────────────────────────
// Legend
// ────────────────────────────────────────────
export function Legend() {
  return (
    <ul className="eco-legend" aria-label="Connection types">
      {(Object.entries(CONN_TYPES) as [ConnType, (typeof CONN_TYPES)[ConnType]][]).map(([k, v]) => (
        <li key={k}>
          <svg width="22" height="6" aria-hidden>
            <line x1="1" y1="3" x2="21" y2="3" stroke={v.color} strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={v.dash === "none" ? undefined : v.dash} />
          </svg>
          {v.label}
        </li>
      ))}
    </ul>
  );
}

// ────────────────────────────────────────────
// Side rail: scenarios + selected agent
// ────────────────────────────────────────────
export function ScenarioList({ state, play, stop }: {
  state: ScenarioState;
  play: (id: string) => void;
  stop: () => void;
}) {
  const active = state.id ? SCENARIOS.find((s) => s.id === state.id) : null;
  return (
    <section className="eco-card">
      <header className="eco-card-head">
        <span className="eco-card-label">Watch a workflow</span>
        {state.playing && <button type="button" className="eco-stop" onClick={stop}>Stop</button>}
      </header>
      <div className="eco-scenarios">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`eco-scenario ${state.id === s.id ? "is-on" : ""}`}
            onClick={() => (state.id === s.id ? stop() : play(s.id))}
            aria-pressed={state.id === s.id}
          >
            <span className="eco-scenario-glyph" aria-hidden>{s.glyph}</span>
            <span className="eco-scenario-body">
              <span className="eco-scenario-name">{s.name}</span>
              <span className="eco-scenario-desc">{s.desc}</span>
            </span>
          </button>
        ))}
      </div>
      {state.playing && active && (
        <div className="eco-narration" aria-live="polite">
          <div className="eco-narration-meta">
            <span>{active.name}</span>
            <span>Step {state.step + 1} / {active.steps.length}</span>
          </div>
          <p className="eco-narration-line" key={state.step}>{state.line}</p>
          <div className="eco-narration-dots">
            {active.steps.map((_, i) => (
              <span key={i} className={i === state.step ? "is-on" : i < state.step ? "is-done" : ""} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function EdgeList({ title, items, direction }: { title: string; items: Connection[]; direction: "out" | "in" }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="eco-panel-block-title">{title} · {items.length}</div>
      <ul className="eco-panel-edges">
        {items.map((c) => {
          const t = CONN_TYPES[c.type];
          const other = AGENT_MAP.get(direction === "out" ? c.to : c.from);
          return (
            <li key={c.id}>
              <span className="eco-panel-edge-dot" style={{ background: t.color }} />
              <span className="eco-edge-name">{other ? shortName(other.name) : c.to}</span>
              {c.label && <span className="eco-edge-label">{c.label}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AgentCard({ id, onClose }: { id: string; onClose: () => void }) {
  const a = AGENT_MAP.get(id);
  if (!a) return null;
  const chips: ReactNode[] = [
    <span key="status" className="eco-chip" style={{ color: a.color }}>
      <span className="eco-chip-dot" style={{ background: a.color }} />{(a.status || "online").toUpperCase()}
    </span>,
  ];
  if (a.model) chips.push(<span key="model" className="eco-chip">{a.model}</span>);
  if (a.droplet) chips.push(<span key="host" className="eco-chip">{a.droplet}</span>);
  if (a.project) chips.push(<span key="project" className="eco-chip">↗ {a.project}</span>);
  return (
    <section className="eco-card eco-agent" aria-live="polite">
      <header className="eco-agent-head">
        <span className="eco-agent-disc" style={{ ["--node-color" as string]: a.color, width: 44, height: 44 }}>
          <NodeFace agent={a} size={44} />
        </span>
        <div className="eco-agent-title">
          <div className="eco-agent-name">{a.name}</div>
          <div className="eco-agent-role">{a.role}</div>
        </div>
        <button type="button" className="eco-agent-close" onClick={onClose} aria-label="Close agent details">×</button>
      </header>
      <div className="eco-chips">{chips}</div>
      <p className="eco-agent-desc">{a.desc}</p>
      <EdgeList title="Talks to" items={CONNECTIONS.filter((c) => c.from === id)} direction="out" />
      <EdgeList title="Hears from" items={CONNECTIONS.filter((c) => c.to === id)} direction="in" />
    </section>
  );
}
