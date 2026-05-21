import { SectionLabel } from "@/components/danslab/atoms";

export const metadata = {
  title: "SemeClaw — DansLab War Room",
  description:
    "SemeClaw is the war-room protocol where decisions get signed. A round table of seven seats: Research, Writer, Coder, Scraper, Hermes, Human, Orchestrator.",
};

const SEATS = [
  { label: "RS", role: "Research",     color: "#60a5fa", who: "OpenClaw-02 · maps the territory" },
  { label: "WR", role: "Writer",       color: "#d4a017", who: "AutoForge · drafts the artifact" },
  { label: "CD", role: "Coder",        color: "#a78bfa", who: "Dexter · ships the code" },
  { label: "SP", role: "Scraper",      color: "#22c55e", who: "Pope · pulls live data" },
  { label: "HM", role: "Hermes",       color: "#f4c15c", who: "Hermes · vetoes anything stupid" },
  { label: "DN", role: "Human",        color: "#f8fafc", who: "Dan · signs the call" },
  { label: "OR", role: "Orchestrator", color: "#e74c3c", who: "David · convenes & closes" },
];

export default function SemeClawPage() {
  return (
    <>
      <section style={{ padding: "48px 0 24px" }}>
        <SectionLabel n={4} title="SEMECLAW // WAR ROOM" />
        <h1 className="dl-hero-title">
          The seven-seat round table.
          <br />
          <span className="dl-title-accent">Decisions get signed here.</span>
        </h1>
        <p className="dl-hero-lede" style={{ maxWidth: 720, marginTop: 24 }}>
          <span className="dl-drop">S</span>emeClaw is DansLab&apos;s war-room protocol. Every non-trivial
          call — a launch, a refactor, a treasury move — gets convened here. Seven seats, one
          decision, full transcript. Hermes vetoes; the operator signs.
        </p>
      </section>

      <section style={{ padding: "32px 0 96px" }}>
        <div className="dl-section-label">
          <span className="dl-section-num">§ 01</span>
          <span className="dl-section-rule" />
          <span className="dl-section-title">SEATS</span>
        </div>
        <div className="dl-grid dl-style-bench" style={{ marginTop: 16 }}>
          {SEATS.map((s, i) => (
            <div
              key={s.label}
              className="dl-card dl-card-bench"
              style={{ ["--card-accent" as never]: s.color } as React.CSSProperties}
            >
              <div className="dl-card-bench-stripe" style={{ background: s.color }} />
              <div className="dl-card-bench-top">
                <div
                  className="dl-monogram"
                  style={{
                    width: 44,
                    height: 44,
                    background: `linear-gradient(135deg, ${s.color}22 0%, ${s.color}08 100%)`,
                    borderColor: `${s.color}40`,
                    color: s.color,
                    fontSize: 16,
                  }}
                >
                  {s.label}
                </div>
                <span className="dl-card-idx">SEAT · {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="dl-card-bench-body">
                <div className="dl-card-name">{s.role}</div>
                <div className="dl-card-role">{s.who}</div>
              </div>
              <div className="dl-card-bench-foot">
                <span>↗ R-147 · OPEN</span>
                <span className="dl-card-drop">turn 3/3</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
