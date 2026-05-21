"use client";

import { useEffect } from "react";
import type { Agent } from "@/lib/danslab-data";
import { Monogram, StatusDot } from "./atoms";

const RECENT_TASKS = [
  { t: "02m", line: "DM → Dexter · status report", ok: true },
  { t: "08m", line: "cron · 30min droplet health sync", ok: true },
  { t: "17m", line: "pull · moltbot-db chat_history", ok: true },
  { t: "24m", line: "branch · feat/webhook-retry", ok: false },
];

const WIRED = ["supabase", "telegram", "github", "vercel"];

export function Drawer({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  useEffect(() => {
    if (!agent) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [agent, onClose]);

  if (!agent) return null;

  return (
    <div className="dl-drawer-root" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dl-drawer-scrim" />
      <aside className="dl-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="dl-drawer-head">
          <div className="dl-drawer-head-left">
            <Monogram agent={agent} size={56} />
            <div>
              <div className="dl-drawer-name">{agent.name}</div>
              <div className="dl-drawer-role">{agent.role}</div>
            </div>
          </div>
          <button type="button" className="dl-drawer-close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="dl-drawer-statusrow">
          <span
            className="dl-drawer-statuschip"
            style={{ color: agent.color, borderColor: `${agent.color}44` }}
          >
            <StatusDot status={agent.status} size={7} />
            {agent.status.toUpperCase()}
          </span>
          {agent.model && <span className="dl-drawer-tag">{agent.model}</span>}
          {agent.droplet && <span className="dl-drawer-tag mono">{agent.droplet}</span>}
          {agent.project && (
            <span className="dl-drawer-tag link" style={{ color: agent.color }}>
              ↗ {agent.project}
            </span>
          )}
        </div>

        <p className="dl-drawer-desc">{agent.desc}</p>

        <div>
          <div className="dl-drawer-block-title">RECENT · last 30m</div>
          <ul className="dl-drawer-tasks">
            {RECENT_TASKS.map((x, i) => (
              <li key={i}>
                <span className="dl-drawer-task-t">{x.t}</span>
                <span
                  className="dl-drawer-task-dot"
                  style={{ background: x.ok ? "#22c55e" : "#d4a017" }}
                />
                <span>{x.line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="dl-drawer-block-title">WIRED TO</div>
          <div className="dl-drawer-wires">
            {WIRED.map((k) => (
              <span key={k} className="dl-drawer-wire">↔ {k}</span>
            ))}
          </div>
        </div>

        <footer className="dl-drawer-foot">
          <button type="button" className="dl-btn-primary dl-btn-sm">Open agent console</button>
          <button type="button" className="dl-btn-ghost dl-btn-sm">DM via Telegram</button>
        </footer>
      </aside>
    </div>
  );
}
