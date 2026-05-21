import { SectionLabel } from "@/components/danslab/atoms";

export const metadata = {
  title: "The Story of DansLab",
  description:
    "How a Romanian poker player turned his garage into a 30-agent autonomous AI lab shipping five products across two continents.",
};

const CHAPTERS = [
  {
    n: "I",
    title: "Variance, math, and the long game",
    body:
      "Dan starts as a professional poker player in Cluj-Napoca. Twenty-five years at the table teach him three things that later become the company's DNA: edge survives variance, position is everything, and the river always tells the truth.",
  },
  {
    n: "II",
    title: "Math + Informatics, but the table is the school",
    body:
      "A Math and Informatics degree gives him the toolkit. Cluj's tech scene gives him the network. But the actual product instincts — read the room, size the bet, fold fast — come from running a poker club, not a CS lecture.",
  },
  {
    n: "III",
    title: "Crypto, the licensed way",
    body:
      "While most Romanian crypto runs offshore, Dan co-founds Kryptostack under Stack Finance LLC — the first licensed Romanian crypto exchange. Slow to launch, sticky to keep. Then comes IdolRise on Solana — a creator-economy bet on token-aligned communities.",
  },
  {
    n: "IV",
    title: "The agents arrive",
    body:
      "2025 turns sub-agents from a toy into a workforce. Dan starts naming them. David runs the fleet from a Mac Studio. Dexter ships code from a droplet. Memo PMs. Nano enrolls new agents. Sienna trades. Hermes — the most capable brain — vetoes.",
  },
  {
    n: "V",
    title: "Five products. One operator. One fleet.",
    body:
      "Today DansLab is five products live (Nervix.ai, CrawdBot, MyWork-AI, zmarty.me, OpenClaw) plus the SemeClaw war-room protocol that signs every non-trivial call. 30+ agents on five droplets and a Mac Studio. Frankfurt and US-East edges. The lab runs while Dan sleeps.",
  },
  {
    n: "VI",
    title: "The bet on 2027",
    body:
      "By 2027 the most interesting companies won't be measured by headcount but by how well one operator plus a named fleet can coordinate. Kryptostack proves regulated crypto fits in that model. IdolRise tests the creator variant. DansLab is the playbook.",
  },
];

export default function StoryPage() {
  return (
    <>
      <section style={{ padding: "48px 0 24px" }}>
        <SectionLabel n={5} title="STORY // ORIGINS" />
        <h1 className="dl-hero-title">
          From poker tables to
          <br />
          <span className="dl-title-accent">a thirty-agent lab</span>
        </h1>
        <p className="dl-hero-lede" style={{ maxWidth: 720, marginTop: 24 }}>
          <span className="dl-drop">T</span>he story of how a Romanian poker professional turned
          decision-theory at the table into a working autonomous AI company in Cluj-Napoca.
          Twenty-five years of variance, one fleet of named agents, five products live.
        </p>
      </section>

      <section style={{ padding: "32px 0 96px", maxWidth: 820 }}>
        {CHAPTERS.map((c) => (
          <article
            key={c.n}
            style={{
              padding: "32px 0",
              borderTop: "1px solid var(--dl-accent-line)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 36,
                  fontStyle: "italic",
                  color: "var(--dl-accent-hot)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.n}.
              </span>
              <h2 className="dl-h2" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>
                {c.title}
              </h2>
            </div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--ink-dim)",
                maxWidth: 680,
              }}
            >
              {c.body}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
