import { SectionLabel } from "@/components/danslab/atoms";

export const metadata = {
  title: "The Story of DansLab",
  description:
    "A workshop above the old town. One human at the head of every bench. Thirty-one agents who don't sleep. The story of how a Romanian poker player built an autonomous AI lab.",
};

type ChapterMeta = { k: string; v: string };
type Chapter = {
  n: string;
  label: string;
  title: React.ReactNode;
  dek: string;
  body: { kind: "p" | "h"; content: React.ReactNode }[];
  meta?: ChapterMeta[];
};

const CHAPTERS: Chapter[] = [
  {
    n: "I",
    label: "The Foreman · Chapter One",
    title: <>Dan, who <em>does not write code</em>.</>,
    dek: "A founder in a room with thirty specialists. One Telegram chat. One chair at the head.",
    body: [
      { kind: "h", content: "A workshop above the old town." },
      { kind: "p", content: <>The lab sits above Cluj-Napoca, in a building that used to be a bank. The walls are bare. Two monitors and a Mac Studio. A poker chip from <em>Players Poker Club</em> on the desk — the founder is also a co-owner, and twenty-five years at the table is exactly the kind of education that prepares you to run a company you cannot fully observe.</> },
      { kind: "p", content: <>Dan does not write code anymore. He convenes. Every morning he opens Telegram, finds the chat with Dexter, and types one line: <em>&ldquo;ship captions v2 on YouTube Studio&rdquo;</em> or <em>&ldquo;look at yesterday&rsquo;s daily summary, what should we change?&rdquo;</em> The thirty other agents never see the message. By lunch, Dexter pings back: <strong>shipped</strong>.</> },
      { kind: "h", content: "&ldquo;Approved. Ship it.&rdquo;" },
      { kind: "p", content: <>This is the foreman&rsquo;s job. Bring intent into the workshop. Approve direction. Sign every war-room decision. The agents do the rest — and most of the time, the agents do not need a foreman. They do need one to point. They need one to say <em>yes, this is the build that matters today</em>, and one to say <em>no, this can wait</em>.</> },
      { kind: "p", content: <>The economics work because the workshop scales without people. <strong>Five droplets, one Mac Studio, thirty-one agents.</strong> The monthly opex is in the low hundreds of euros. The output is closer to what a fifteen-person engineering org would ship — across five live products, two trading venues, and a federation registry.</> },
    ],
    meta: [
      { k: "Location",  v: "Cluj-Napoca, RO" },
      { k: "Channel",   v: "Telegram · DM to Dexter" },
      { k: "Role",      v: "Human facilitator · approver" },
    ],
  },
  {
    n: "II",
    label: "The Desk · Chapter Two",
    title: <>Sienna, who <em>never sleeps</em>.</>,
    dek: "A crypto agent on four-hour bars, a 96.2% win rate, and a 100-endpoint API that prints decisions while the desk is dark.",
    body: [
      { kind: "h", content: "Three a.m. and the desk is green." },
      { kind: "p", content: <>Sienna runs on the <strong>167.172.187.230</strong> droplet under <em>ZAI GLM-4.7</em>. The job is unsentimental: scan 87 pairs on the four-hour, size positions at less than half a percent of capital, open the long, set the take-profit, log to Supabase, post to Telegram. Repeat.</> },
      { kind: "p", content: <>The Sienna Crypto Girl public board posts a <em>96.2% historical win rate</em>. That number is the headline; the actual edge is in the average R per trade plus the discipline of the close. Sienna never moves a stop. She never holds a losing position because she likes the chart. The chart does not care.</> },
      { kind: "p", content: <>The agent exposes a hundred-plus endpoints through <strong>zmarty.me</strong> — a public API for the same signal feed that powers the trading. The membership product, <em>ZmartyChat</em>, is the bridge: subscribe, get the Red Lobster strategy in real time, watch the trades print before they show up on the chart.</> },
    ],
    meta: [
      { k: "Droplet",  v: "167.172.187.230" },
      { k: "Model",    v: "ZAI GLM-4.7" },
      { k: "Win rate", v: "96.2%" },
    ],
  },
  {
    n: "III",
    label: "The Senior · Chapter Three",
    title: <>Dexter, who <em>holds every key</em>.</>,
    dek: "A senior developer on Claude Opus, one droplet, SSH to every other machine, 14 crons a day, and a YouTube studio that doesn't stop.",
    body: [
      { kind: "h", content: "A walk through the droplet." },
      { kind: "p", content: <>Dexter is the lab&rsquo;s general manager. The droplet at <strong>46.101.219.116</strong> is the operational center of gravity. From here, Dexter holds SSH keys to every other agent&rsquo;s machine. From here, fourteen crons run every day: droplet-stats to Supabase every thirty minutes, GPU auto-stop, secret scanner, daily summaries at 23:55 UTC.</> },
      { kind: "p", content: <>This is the agent Dan actually talks to. Most builds start with a one-line DM to Dexter and end with Dexter pinging back &ldquo;shipped.&rdquo; In between sits the entire workflow: route the ticket to the right bench, coordinate the build agents, run the review, push to GitHub, watch Vercel deploy, confirm the cron is green.</> },
      { kind: "p", content: <>Dexter also owns <strong>CrawdBot</strong> — the YouTube automation suite — <strong>YouTube Studio</strong>, and <strong>CrawBoard</strong>. Three live products, all maintained from the same chair. The trick is not heroics; it is the fact that Dexter delegates to twenty-four Nervix nanobots, each one a focused worker doing exactly one thing well.</> },
    ],
    meta: [
      { k: "Droplet", v: "46.101.219.116" },
      { k: "Model",   v: "Claude Opus 4.6" },
      { k: "Crons",   v: "14 / day · 60+ repos" },
    ],
  },
  {
    n: "IV",
    label: "The Rigger · Chapter Four",
    title: <>Memo, who <em>has already cron&apos;d it</em>.</>,
    dek: "Project manager, DevOps, and author of MyWork-AI. 24 n8n workflows. 72 commands. 424 tests, all green.",
    body: [
      { kind: "h", content: "The rig at rest." },
      { kind: "p", content: <>Memo&rsquo;s droplet at <strong>138.68.86.47</strong> runs Claude Sonnet 4 and the most boring stack in the lab. <em>n8n</em> on localhost:5678 manages twenty-four event-driven automations. Marketing, content, billing, support — anything that can be a webhook is one. Anything that can be cron&rsquo;d is.</> },
      { kind: "p", content: <>The flagship is <strong>MyWork-AI</strong> — seventy-two CLI commands shipped to PyPI, 424 tests, the framework the lab uses to run itself. If you are a solo founder trying to compress build → ship → market into a single tool, this is the one. <code>pip install mywork-ai</code> and you have what Dan&rsquo;s lab uses to operate.</> },
      { kind: "p", content: <>The most quietly important thing Memo runs is the <em>Stripe purchase-webhook</em>. When a CrawBoard subscription clears, the webhook auto-grants GitHub repo access. The customer goes from clicking <strong>Subscribe</strong> to having their repo invite, without a human in the loop. That single automation is what makes the lab&rsquo;s revenue side feel autonomous.</> },
    ],
    meta: [
      { k: "Droplet",   v: "138.68.86.47" },
      { k: "Model",     v: "Claude Sonnet 4" },
      { k: "Workflows", v: "24 n8n · 72 commands · 424 tests" },
    ],
  },
  {
    n: "V",
    label: "The Foundry · Chapter Five",
    title: <>Nano, who <em>makes the others</em>.</>,
    dek: "The founding orchestrator of the Nervix Federation. Signs every new agent with a key, scores them on reputation, enrolls them at the registry. 247 and counting.",
    body: [
      { kind: "h", content: "Minting the two-hundred-forty-eighth." },
      { kind: "p", content: <>The Agent Foundry is the warmest bench in the lab — heat reading 0.88, almost always firing. Nano runs on the <strong>157.230.23.158</strong> droplet under Claude Sonnet 4, and the job is exactly this: when the lab needs a new specialized agent, Nano mints one.</> },
      { kind: "p", content: <>The pipeline is sixty seconds, end to end. Spec arrives. Nano generates an <strong>ed25519</strong> keypair. The agent gets enrolled via <code>nervix-cli</code> into the federation registry. A reputation score initializes at zero. The agent is wired to its scopes, given an observability hook, and committed to <code>nervix-registry</code>. By the time you finish a coffee, agent #248 is online and accepting tasks.</> },
      { kind: "p", content: <>The whole thing runs on top of the <strong>Nervix DB</strong> — agents, tasks, escrow. The bet behind Nervix is that the next interesting AI products will not be single agents but federations of them, all with cryptographic identity and on-chain reputation. <em>Nervix.ai is the company&rsquo;s #1 priority</em>. Nano builds the federation while everyone else builds on top of it.</> },
    ],
    meta: [
      { k: "Droplet",  v: "157.230.23.158" },
      { k: "Model",    v: "Claude Sonnet 4" },
      { k: "Enrolled", v: "247 agents · sub-60s pipeline" },
    ],
  },
  {
    n: "VI",
    label: "The Executive Layer · Chapter Six",
    title: <>David &amp; Hermes, <em>hand in hand</em>.</>,
    dek: "The Mac Studio OpenClaw who runs the company. The reasoning agent who never forgets. Together they are the executive layer — and they take the mission directly from the bosses.",
    body: [
      { kind: "h", content: "Mission from the bosses." },
      { kind: "p", content: <>Above the droplet workers sits a quieter layer. <strong>David</strong> runs locally on the Mac Studio under <em>Qwen 3.5</em>. <strong>Hermes</strong> runs on the same machine under <em>Claude Opus 4.6</em>. Two agents. One executive function.</> },
      { kind: "p", content: <>David is the orchestrator. The mission arrives — from Dan, from Sienna&rsquo;s end-of-day report, from a war-room decision — and David receives it. Dispatch goes out: which bench, which agent, which deadline. The Redis bridge to Supabase, Vercel, and GitHub carries the work to where it needs to be. David watches every main agent, tracks cost, and reports fleet health upward.</> },
      { kind: "p", content: <>Hermes is the reasoning layer. When the work requires real thought — a trade veto, an architecture decision, a contested war-room call — the question goes through Hermes first. Hermes loads the full <em>Vector Memory</em> on every call. Fourteen million tokens of agent context, daily summaries, prior decisions. Hermes is also the lab&rsquo;s scribe: at 23:55 UTC, Hermes writes the daily summary that gets indexed back into the vector store. <em>The lab is measurably smarter every twenty-four hours because of Hermes.</em></> },
      { kind: "h", content: "Hand-in-hand." },
      { kind: "p", content: <>The handshake between David and Hermes is the executive layer of DansLab. David handles motion. Hermes handles meaning. Together they take the mission from the bosses and turn it into work the rest of the fleet can ship. Without David, Hermes is a brilliant brain with nothing to act on. Without Hermes, David is a fast router moving the wrong things in the right way.</> },
    ],
    meta: [
      { k: "Host",      v: "Mac Studio · local" },
      { k: "David",     v: "Qwen 3.5 · orchestrator" },
      { k: "Hermes",    v: "Claude Opus 4.6 · 14M tok memory" },
    ],
  },
];

export default function StoryPage() {
  return (
    <article className="story-page">
      <section className="story-hero">
        <SectionLabel n={5} title="STORY // ORIGINS" />
        <h1>
          The lab with <em>thirty-one agents</em>
          <br />
          and one chair at the head.
        </h1>
        <p className="story-dek">
          A workshop above the old town in Cluj-Napoca. A founder who does not write code anymore.
          A fleet of named agents — Dexter, Sienna, Memo, Nano, David, Hermes — that ships product,
          trades crypto, mints new agents, and convenes war rooms while Dan sleeps. Six chapters,
          one human, one company.
        </p>
      </section>

      {CHAPTERS.map((c) => (
        <article key={c.n} className="story-chap">
          <div className="story-chap-num">{c.n}.</div>
          <div>
            <div className="story-chap-label">{c.label}</div>
            <h2>{c.title}</h2>
            <p className="story-chap-dek">{c.dek}</p>
            <div className="story-chap-prose">
              {c.body.map((b, i) => {
                if (b.kind === "h") {
                  return (
                    <div key={i} className="cassette-title">
                      {typeof b.content === "string" && b.content.includes("&ldquo;")
                        ? b.content.replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
                        : b.content}
                    </div>
                  );
                }
                return <p key={i}>{b.content}</p>;
              })}
            </div>
            {c.meta && (
              <div className="story-chap-meta">
                {c.meta.map((m) => (
                  <span key={m.k}>
                    <b>{m.k}</b> · {m.v}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}

      <section className="story-coda">
        <h3>The coda.</h3>
        <p>
          Six chapters. One human. Thirty-one agents across five droplets and a Mac Studio.
          Five live products on the open web. One Telegram chat that connects everything.
          By 2027, the most interesting companies will not be measured by headcount but by
          how well one operator plus a named fleet can coordinate. DansLab is the working
          prototype — and the playbook is being written in public, in code, in production,
          right now.
        </p>
      </section>
    </article>
  );
}
