"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AGENTS, type Agent } from "@/lib/danslab-data";
import { Monogram, SectionLabel, StatusDot, cssVar } from "./atoms";

type FilterId = "all" | "main" | "support" | "slack";

const AGENT_FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All agents" },
  { id: "main", label: "Main" },
  { id: "support", label: "Support" },
  { id: "slack", label: "Slack crew" },
];

export function AgentGrid({ onOpen }: { onOpen: (a: Agent) => void }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const list = useMemo(() => {
    if (filter === "all") return AGENTS;
    return AGENTS.filter((a) => a.type === filter);
  }, [filter]);

  const counts: Record<FilterId, number> = useMemo(() => ({
    all: AGENTS.length,
    main: AGENTS.filter((a) => a.type === "main").length,
    support: AGENTS.filter((a) => a.type === "support").length,
    slack: AGENTS.filter((a) => a.type === "slack").length,
  }), []);

  return (
    <section className="dl-agents" id="dl-agents">
      <SectionLabel n={2} title="THE CREW // 30 AGENTS" />

      <div className="dl-agents-head">
        <h2 className="dl-h2">
          Every agent owns a domain.<br />
          <span className="dl-h2-dim">They DM each other like colleagues.</span>
        </h2>
        <div className="dl-filter-bar">
          {AGENT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`dl-filter ${filter === f.id ? "is-active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="dl-filter-count">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dl-grid dl-style-bench">
        {list.map((a, i) => (
          <AgentCard key={a.id} a={a} i={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function AgentCard({ a, i, onOpen }: { a: Agent; i: number; onOpen: (a: Agent) => void }) {
  const idx = String(i + 1).padStart(2, "0");
  const isMain = a.type === "main";
  return (
    <button
      type="button"
      className="dl-card dl-card-bench"
      style={cssVar({ "--card-accent": a.color })}
      onClick={() => onOpen(a)}
    >
      <div className="dl-card-bench-stripe" style={{ background: a.color }} />
      <div className="dl-card-bench-top">
        <Monogram agent={a} size={44} />
        <div className="dl-card-bench-meta">
          <span className="dl-card-idx">AGT · {idx}</span>
          <StatusDot status={a.status} />
        </div>
      </div>
      <div className="dl-card-bench-body">
        <div className="dl-card-name">{a.name}</div>
        <div className="dl-card-role">{a.role}</div>
      </div>
      <div className="dl-card-bench-foot">
        {a.project ? <span>↗ {a.project}</span> : <span className="dl-card-internal">internal</span>}
        {isMain && a.droplet && (
          <span className="dl-card-drop">
            {a.droplet.includes(".") ? a.droplet.split(".").slice(0, 2).join(".") + "…" : a.droplet}
          </span>
        )}
      </div>
    </button>
  );
}
