"use client";

import { YOUTUBE_CHANNEL_URL } from "@/lib/danslab-data";
import { LivePill, SectionLabel } from "./atoms";

type BriefRow = { tag: string; text: string; tone?: "ok" | "warn" | "act" };

const BRIEF_ROWS: BriefRow[] = [
  { tag: "CLOSED", text: "Issues closed yesterday, each with linked evidence", tone: "ok" },
  { tag: "RED", text: "Anything auto-repair could not fix — normally zero", tone: "ok" },
  { tag: "WATCH", text: "Any agent under its daily target two days running", tone: "warn" },
  { tag: "SPEND", text: "What the lab spent, and what it earned, in one line" },
  { tag: "LOOP", text: "Nervix: enrollment → listing → purchase" },
  { tag: "NEEDS YOU", text: "The only line that asks Dan for anything — reply YES or NO", tone: "act" },
];

export function Hero({ onSeeProducts, onSeeHarness }: {
  onSeeProducts?: () => void;
  onSeeHarness?: () => void;
}) {
  return (
    <section className="dl-hero">
      <SectionLabel n={1} title="DANSLAB // WHO WE ARE" />

      <div className="dl-hero-grid">
        <div className="dl-hero-left">
          <LivePill />

          <h1 className="dl-hero-title">
            An AI-run software<br />
            company, <span className="dl-title-accent">led by<br />one human.</span>
          </h1>

          <p className="dl-hero-lede">
            <span className="dl-drop">D</span>ansLab builds and ships real products — a payments network
            for AI agents, an AI video studio, a fact-checker — with a crew of <em>AI agents</em> that
            work around the clock. Dan sets the direction and signs off. The agents do the work,
            and nothing counts until it is closed with evidence.
          </p>

          <div className="dl-hero-actions">
            <button type="button" className="dl-btn-primary" onClick={onSeeProducts}>
              See what we&rsquo;ve built
              <span className="dl-btn-arrow">→</span>
            </button>
            <button type="button" className="dl-btn-ghost" onClick={onSeeHarness}>
              How the lab runs
            </button>
            <a className="dl-btn-link" href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer noopener">
              <span className="dl-link-dot" /> Watch on YouTube
            </a>
          </div>

          <div className="dl-hero-metabar">
            <span>BUILT ON <b>OPENCLAW · HERMES · PAPERCLIP</b></span>
            <span className="dl-dot-sep">·</span>
            <span>CLUJ-NAPOCA, RO</span>
            <span className="dl-dot-sep">·</span>
            <span>CLAUDE · GLM · KIMI</span>
          </div>
        </div>

        <HeroBrief />
      </div>
    </section>
  );
}

function HeroBrief() {
  return (
    <div className="dl-terminal">
      <div className="dl-terminal-head">
        <div className="dl-terminal-lights">
          <span style={{ background: "#c0392b" }} />
          <span style={{ background: "#d4a017" }} />
          <span style={{ background: "#22c55e" }} />
        </div>
        <div className="dl-terminal-title">the 07:00 CEO Brief</div>
        <div className="dl-terminal-meta">EXAMPLE FORMAT</div>
      </div>
      <div className="dl-terminal-body">
        <p className="dl-brief-intro">
          Dan does not read logs or dashboards. Every morning one short message arrives, and
          every line is a number or a decision.
        </p>
        {BRIEF_ROWS.map((row) => (
          <div key={row.tag} className={`dl-brief-row ${row.tone ? `is-${row.tone}` : ""}`}>
            <span className="dl-brief-tag">{row.tag}</span>
            <span className="dl-brief-text">{row.text}</span>
          </div>
        ))}
        <div className="dl-terminal-prompt">
          <span className="dl-prompt-glyph">dan ▸</span>
          <span className="dl-brief-reply">YES</span>
          <span className="dl-caret" />
        </div>
      </div>
    </div>
  );
}
