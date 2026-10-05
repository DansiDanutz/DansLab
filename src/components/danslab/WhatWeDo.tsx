import { SectionLabel } from "./atoms";

const PILLARS = [
  {
    k: "01",
    title: "We ship real products",
    body: "A payments network for AI agents, an agent marketplace, an AI video studio and a fact-checker. Each one is live, public, and used — not a demo.",
    href: "#dl-products",
    cta: "See the products",
  },
  {
    k: "02",
    title: "Agents do the work",
    body: "Eight core agents each own one lane: orchestration, backend, agent supply, projects, crypto, health and finance. Dan sets direction and approves. He no longer writes code.",
    href: "#dl-agents",
    cta: "Meet the crew",
  },
  {
    k: "03",
    title: "Nothing counts without evidence",
    body: "Work only counts when an issue is closed with proof. The system repairs itself before it asks a human, and Dan reads one page a day.",
    href: "#dl-harness",
    cta: "See how it runs",
  },
];

export function WhatWeDo() {
  return (
    <section className="dl-what" id="dl-what">
      <SectionLabel n={2} title="WHAT DANSLAB IS" />
      <h2 className="dl-h2">
        One founder. A crew of agents.<br />
        <span className="dl-h2-dim">A company that keeps working.</span>
      </h2>
      <div className="dl-what-grid">
        {PILLARS.map((p) => (
          <a key={p.k} className="dl-what-card" href={p.href}>
            <span className="dl-what-k">{p.k}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <span className="dl-what-cta">{p.cta} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
