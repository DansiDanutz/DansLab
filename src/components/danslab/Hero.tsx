"use client";

import { useMemo } from "react";
import { ACTIVITY, AGENTS, PRODUCTS } from "@/lib/danslab-data";
import { LivePill, SectionLabel, TickerRow, useTicker } from "./atoms";

export function Hero({ onEnterLab, onViewEcosystem }: {
  onEnterLab?: () => void;
  onViewEcosystem?: () => void;
}) {
  return (
    <section className="dl-hero">
      <SectionLabel n={1} title="DANSLAB // MANIFEST" />

      <div className="dl-hero-grid">
        <div className="dl-hero-left">
          <LivePill />

          <h1 className="dl-hero-title">
            A human-led<br />
            <span className="dl-title-accent">autonomous AI lab</span><br />
            running while Dan sleeps.
          </h1>

          <p className="dl-hero-lede">
            <span className="dl-drop">D</span>ansLab is a fleet of <em>30+ agents</em> orchestrated across
            five DigitalOcean droplets and a Mac Studio. They build, ship, research, trade,
            and escalate to Dan over Telegram — around the clock, across {PRODUCTS.length} audited production projects,
            on one budget.
          </p>

          <div className="dl-hero-actions">
            <button type="button" className="dl-btn-primary" onClick={onEnterLab}>
              Enter the Lab
              <span className="dl-btn-arrow">→</span>
            </button>
            <button type="button" className="dl-btn-ghost" onClick={onViewEcosystem}>
              View ecosystem
            </button>
            <a className="dl-btn-link" href="https://github.com/DansiDanutz/DansLab" target="_blank" rel="noreferrer noopener">
              <span className="dl-link-dot" /> github.com/DansiDanutz
            </a>
          </div>

          <div className="dl-hero-metabar">
            <span>POWERED BY <b>OPENCLAW v2026.2.14</b></span>
            <span className="dl-dot-sep">·</span>
            <span>FRANKFURT / US-EAST</span>
            <span className="dl-dot-sep">·</span>
            <span>CLAUDE · QWEN · ZAI · GEMINI</span>
          </div>
        </div>

        <HeroTerminal />
      </div>
    </section>
  );
}

function HeroTerminal() {
  const t = useTicker(1800);
  const visible = useMemo(() => {
    const n = ACTIVITY.length;
    const start = t % n;
    return Array.from({ length: 6 }, (_, i) => ACTIVITY[(start + i) % n]);
  }, [t]);

  return (
    <div className="dl-terminal">
      <div className="dl-terminal-head">
        <div className="dl-terminal-lights">
          <span style={{ background: "#c0392b" }} />
          <span style={{ background: "#d4a017" }} />
          <span style={{ background: "#22c55e" }} />
        </div>
        <div className="dl-terminal-title">dan@danslab ~ % tail -f fleet.log</div>
        <div className="dl-terminal-meta">UTC 23:14:{String(10 + (t % 50)).padStart(2, "0")}</div>
      </div>
      <div className="dl-terminal-body">
        <div className="dl-terminal-ascii">
{`  ┌─ DANS / LAB ─────────────────────────────┐
  │  ░▒▓  five droplets · one boss  ▓▒░      │
  │  ░▒▓  thirty agents · no sleep  ▓▒░      │
  └──────────────────────────────────────────┘`}
        </div>
        {visible.map((item, i) => (
          <TickerRow key={`${t}-${i}`} item={item} agents={AGENTS} />
        ))}
        <div className="dl-terminal-prompt">
          <span className="dl-prompt-glyph">dexter@fleet ▸</span>
          <span className="dl-caret" />
        </div>
      </div>
    </div>
  );
}
