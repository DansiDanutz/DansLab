import { SectionLabel } from "./atoms";

const LOOP = ["Discovery", "GSD", "Hermes", "David", "Agents", "Deploy", "Growth", "Revenue"];
const OBSERVERS = ["Doctor", "Finance", "Monitor"];

const LAYERS = [
  {
    name: "Control plane",
    tool: "Paperclip + David",
    body: "Every task is an issue. Agents check work out, do it, and close it with evidence. David verifies before anything counts.",
  },
  {
    name: "Runtime",
    tool: "OpenClaw gateways",
    body: "One gateway on the Mac Studio and one on each of four droplets, linked over a private network. Telegram is the channel to the human.",
  },
  {
    name: "Brain and memory",
    tool: "Hermes + shared memory",
    body: "Hermes scopes each day's work and runs the weekly review. Agents load shared team context from a common memory when they start.",
  },
  {
    name: "Model routing",
    tool: "Cheapest capable model",
    body: "Subscription models come first, paid APIs last. Each job goes to the smallest model that can do it, with fallbacks across providers.",
  },
];

const LAWS = [
  { n: "I", text: "Nothing counts unless it is an issue closed with evidence." },
  { n: "II", text: "Dan reads one page a day. If understanding the company takes more, the system has failed." },
  { n: "III", text: "The system repairs itself before it asks a human." },
];

const GUARDRAILS = [
  "RepoAudit, our audit control plane, tracks security, correctness, review coverage and deployment status for every repository.",
  "A watchdog checks every agent every 15 minutes and restarts what is stuck.",
  "Issues left in review for over 48 hours are bounced back to an owner.",
  "Disk pressure on any machine triggers automatic cleanup before an alert.",
  "One revenue stream at a time: new lanes open only after the loop closes end to end.",
];

export function Harness() {
  return (
    <section className="dl-harness" id="dl-harness">
      <SectionLabel n={5} title="THE HARNESS" />
      <div className="dl-products-head">
        <h2 className="dl-h2">
          How the lab<br />
          <span className="dl-h2-dim">runs itself.</span>
        </h2>
        <div className="dl-products-sub">
          Agents are only as good as the system around them. This is the system we built.
        </div>
      </div>

      <div className="dl-loop" aria-label="The operating loop">
        {LOOP.map((step, i) => (
          <div key={step} className="dl-loop-step">
            <span className="dl-loop-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="dl-loop-name">{step}</span>
          </div>
        ))}
        <div className="dl-loop-observers">
          <span className="dl-loop-observers-k">OBSERVERS</span>
          {OBSERVERS.map((o) => <span key={o}>{o}</span>)}
        </div>
      </div>

      <div className="dl-layers">
        {LAYERS.map((l) => (
          <div key={l.name} className="dl-layer">
            <div className="dl-layer-name">{l.name}</div>
            <div className="dl-layer-tool">{l.tool}</div>
            <p>{l.body}</p>
          </div>
        ))}
      </div>

      <div className="dl-laws">
        <div className="dl-laws-col">
          <h3 className="dl-laws-h">The three laws</h3>
          {LAWS.map((law) => (
            <div key={law.n} className="dl-law">
              <span className="dl-law-n">{law.n}</span>
              <span>{law.text}</span>
            </div>
          ))}
        </div>
        <div className="dl-laws-col">
          <h3 className="dl-laws-h">Built-in guardrails</h3>
          <ul className="dl-guardrails">
            {GUARDRAILS.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
