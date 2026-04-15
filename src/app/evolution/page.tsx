import PageWrapper from "@/components/PageWrapper";

const stats = [
  { label: "Total Agents", value: "36", color: "text-[#00e676]" },
  { label: "Running Now", value: "7", color: "text-[#a29bfe]" },
  { label: "Issues Resolved", value: "147", color: "text-[#00e676]" },
  { label: "Budget Utilized", value: "68.9%", color: "text-[#ff9100]" },
  { label: "April Spend", value: "$1,033", color: "text-[#a29bfe]" },
];

const goals = [
  {
    icon: "🚀",
    text: "Build NERVIX into the #1 AI Agent Marketplace — $10K MRR by Q4 2026",
    bg: "bg-[#6c5ce7]/20",
  },
  {
    icon: "🤖",
    text: "Achieve 90% autonomous operations — agents work 24/7 without human intervention",
    bg: "bg-[#00e676]/20",
  },
  {
    icon: "💰",
    text: "Launch 4 revenue streams: NERVIX marketplace, CrawdBot SaaS, MyWork AI, Zmarty Premium",
    bg: "bg-[#ff9100]/20",
  },
];

const projects = [
  { name: "NERVIX", lead: "Dexter" },
  { name: "CrawdBot", lead: "Dexter" },
  { name: "MyWork AI", lead: "Memo" },
  { name: "ZmartyChat", lead: "Sienna" },
  { name: "DansLab OS", lead: "GSD" },
];

const agents = [
  { name: "David", type: "claude", status: "running" },
  { name: "Claude Code", type: "claude", status: "running" },
  { name: "Autoresearch", type: "codex", status: "running" },
  { name: "CodexMax", type: "codex", status: "running" },
  { name: "Memo", type: "gateway", status: "running" },
  { name: "Nano", type: "gateway", status: "running" },
  { name: "Sienna", type: "gateway", status: "running" },
  { name: "Hermes", type: "process", status: "idle" },
  { name: "GSD", type: "claude", status: "idle" },
  { name: "Dexter", type: "gateway", status: "idle" },
  { name: "Discovery", type: "process", status: "idle" },
  { name: "Teacher", type: "process", status: "idle" },
  { name: "Learning", type: "process", status: "idle" },
  { name: "Growth", type: "process", status: "idle" },
  { name: "Finance", type: "process", status: "idle" },
  { name: "Monitor", type: "process", status: "idle" },
  { name: "GitHub", type: "process", status: "idle" },
  { name: "Supabase", type: "process", status: "idle" },
  { name: "Vercel", type: "process", status: "idle" },
  { name: "SSH", type: "process", status: "idle" },
  { name: "N8N", type: "process", status: "idle" },
  { name: "Obsidian", type: "process", status: "idle" },
  { name: "Vector", type: "process", status: "idle" },
  { name: "Stripe", type: "process", status: "idle" },
  { name: "Update", type: "process", status: "idle" },
  { name: "KimiClaw", type: "process", status: "idle" },
  { name: "Codex", type: "codex", status: "idle" },
  { name: "Pi", type: "pi", status: "idle" },
  { name: "Pi Stability", type: "pi", status: "idle" },
  { name: "Xlaude", type: "opencode", status: "idle" },
  { name: "OpenClaw", type: "process", status: "idle" },
  { name: "KiloClaw", type: "http", status: "idle" },
  { name: "DoctorLocal", type: "process", status: "idle" },
  { name: "Dan", type: "human", status: "idle" },
  { name: "Doctor", type: "process", status: "error" },
  { name: "DansLabModel", type: "process", status: "error" },
];

const timeline = [
  {
    date: "April 13, 2026",
    version: "v2026.4.13 — Self-Improvement Loop Live",
    current: true,
    items: [
      "Self-improvement pipeline fully operational: Discovery → Learning → Teacher → Autoresearch",
      "Learning probe v2 deployed: fleet error pattern detection, agent success rates, feed writer",
      "Teacher probe v2 deployed: instruction quality review, staleness detection, hash tracking",
      "Discovery runner deployed: daily intelligence feed with cron health, model config audits",
      "Autoresearch creating targeted issues (DAN-365 guardrails, anti-fabrication tickets)",
      "Fleet status: 36 agents, 147 issues resolved, 68.9% budget utilization",
    ],
  },
  {
    date: "April 12, 2026",
    version: "v2026.4.12 — Stabilization",
    items: [
      "Continued system stabilization: 316 issue updates, 117 agent updates",
      "Autoresearch v2 nightly optimizer active, consuming feed files",
      "31 new issues auto-created by fleet monitoring probes",
    ],
  },
  {
    date: "April 11, 2026",
    version: "v2026.4.11 — Issue Triage",
    items: [
      "Major issue triage: 437 issue updates, 50 new issues created",
      "David heartbeat reports filed (DAN-281, DAN-282)",
      "System largely stable with minimal agent config changes",
    ],
  },
  {
    date: "April 10, 2026",
    version: "v2026.4.10 — Cool-Down",
    items: [
      "Activity declining toward stable state: 205 issue updates, 107 heartbeats",
      "Fleet converging to new architecture after Apr 6-8 reconfiguration storm",
    ],
  },
  {
    date: "April 8-9, 2026",
    version: "v2026.4.8 — Peak Operations",
    items: [
      "Peak fleet activity: 1,215 comments, 829 heartbeats, 629 issue updates (Apr 8)",
      "Apr 8 Switchover: adapters finalized, runtime configs validated",
      "CodexMax deployed, dirty working trees cleaned (DAN-278)",
      "NERVIX /health endpoint added (DAN-268), Vercel Analytics integrated (DAN-279)",
      "Prometheus + Grafana monitoring deployed on Dexter droplet (DAN-270)",
    ],
  },
  {
    date: "April 7, 2026",
    version: "v2026.4.7 — Configuration Storm",
    items: [
      "Intense reconfiguration: 916 comments, 637 heartbeats, 499 issue updates",
      "478 issue checkouts processed, 214 agent updates",
      "NERVIX rate limiting middleware implemented (DAN-253)",
      "Agent marketplace UI with list + hire flow shipped (DAN-234)",
    ],
  },
  {
    date: "April 6, 2026",
    version: "v2026.4.6 — Gateway Fallback Fix",
    items: [
      "MASSIVE: 489 agent updates — largest single-day reconfiguration",
      "Gateway v2026.4.1 session_id bug discovered and fixed",
      "David, Hermes, Nano, DansLabModel switched to claude_local adapter",
      "8 agents runtimeConfig corrected, fleet migrated off Ollama",
      "262 heartbeat runs, 90 cancellations during gateway/network recovery",
      "Fleet orchestration session documented (DAN-166)",
    ],
  },
  {
    date: "April 5, 2026",
    version: "v2026.4.5 — Identity & Instructions",
    items: [
      "172 identity files deployed across fleet (SOUL.md, skills, configs)",
      "Nervix Slack agent hub restored: 5 cron tasks active",
      "ClawX file lock incident: resolved, 9 disabled accounts re-enabled",
      "Config-instruction alignment audit started",
      "Teacher fleet instruction deployment completed (DAN-187)",
    ],
  },
  {
    date: "April 4, 2026",
    version: "v2026.4.4 — Dashboard Recovery",
    items: [
      "Dashboard.tsx stray useMemo syntax crash fixed",
      "NERVIX Vercel rolled back to working deploy (Nano broke builds)",
      "ClawX gateway recovered, 26/26 agents verified",
      "David + Hermes configs repaired, system.md created",
      "143 issue updates, 40 agent config changes processed",
    ],
  },
  {
    date: "April 3, 2026",
    version: "v2026.4.3 — Activation",
    items: [
      "Agent configuration activity begins: 32 agent updates",
      "Heartbeat monitoring system activated: 24 invocations",
      "SSL cert renewal on Nano/nervix.ai completed (DAN-157)",
      "OpenClaw gateway stability fixes (DAN-153, DAN-154, DAN-155)",
    ],
  },
  {
    date: "April 2, 2026",
    version: "v2026.4.2 — Genesis",
    items: [
      "DansLab Paperclip company initialized",
      "35 agents created and configured",
      "60 initial issues filed, 4 company goals defined, 6 projects created",
      "NERVIX marketplace, CrawdBot, MyWork AI, ZmartyChat, DansLab OS projects launched",
      "Security hardened: bcrypt password hashing (DAN-142), Helmet.js headers (DAN-136)",
    ],
  },
];

const milestones = [
  { id: "DAN-73", title: "NERVIX: Ship production marketplace with agent registration and discovery", pri: "critical" },
  { id: "DAN-74", title: "NERVIX: Implement escrow_transactions table and payment flow", pri: "critical" },
  { id: "DAN-151", title: "RLS enabled on 30+ Nervix Supabase tables (security fix)", pri: "critical" },
  { id: "DAN-149", title: "NERVIX Vercel builds fixed — missing pages/app directory", pri: "critical" },
  { id: "DAN-142", title: "Replace SHA256 with bcrypt password hashing", pri: "critical" },
  { id: "DAN-143", title: "A2A-CRITICAL: Agent authentication on A2A endpoints", pri: "critical" },
  { id: "DAN-72", title: "DansLab OS: Full cron and fleet automation — zero manual ops", pri: "high" },
  { id: "DAN-270", title: "Prometheus + Grafana monitoring on Dexter for NERVIX", pri: "high" },
  { id: "DAN-268", title: "Add /health endpoint to api.nervix.ai backend", pri: "high" },
  { id: "DAN-279", title: "Vercel Analytics and Speed Insights added to nervix.ai", pri: "high" },
  { id: "DAN-365", title: "Autoresearch guardrails for placeholder cron rows", pri: "medium" },
  { id: "DAN-253", title: "NERVIX rate limiting middleware implemented", pri: "medium" },
  { id: "DAN-96", title: "Agent enrollment flow — end-to-end working", pri: "medium" },
];

const dotColor = (status: string) => {
  if (status === "running") return "bg-[#00e676] shadow-[0_0_6px_#00e676]";
  if (status === "error") return "bg-[#ff5252] shadow-[0_0_6px_#ff5252]";
  return "bg-[#a29bfe]";
};

const priColor = (pri: string) => {
  if (pri === "critical") return "bg-[#ff5252]/20 text-[#ff5252]";
  if (pri === "high") return "bg-[#ff9100]/20 text-[#ff9100]";
  return "bg-[#6c5ce7]/20 text-[#a29bfe]";
};

export default function EvolutionPage() {
  return (
    <PageWrapper>
      <div className="py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-3 text-xs font-mono tracking-[0.25em] text-[#a29bfe] uppercase">
            DansLab Paperclip
          </div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-[#a29bfe] to-[#00e676] bg-clip-text text-transparent">
              Company Evolution
            </span>
          </h1>
          <div className="mb-2 inline-block rounded-full border border-[#6c5ce7]/30 bg-[#1a1a28] px-4 py-1 text-sm text-[#a29bfe]">
            v2026.4.13
          </div>
          <p className="text-sm text-zinc-400">
            Autonomous AI Agent Fleet — Day-by-Day System Chronicle
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-12 sm:grid-cols-5 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card-base p-4 text-center transition hover:border-[#6c5ce7]/40"
            >
              <div className={`mb-1 text-2xl font-bold sm:text-3xl ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Goals */}
        <section className="mb-10 sm:mb-16">
          <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            🎯 Company Goals
          </h2>
          <div className="space-y-3">
            {goals.map((goal, i) => (
              <div
                key={i}
                className="card-base flex items-center gap-3 p-4 sm:gap-4 sm:p-5"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${goal.bg} text-lg`}>
                  {goal.icon}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {goal.text}
                </p>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#00e676]">
                  ● Active
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10 sm:mb-16">
          <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            📁 Active Projects
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {projects.map((p) => (
              <div
                key={p.name}
                className="card-base p-4 text-center"
              >
                <div className="mb-1 text-base font-semibold text-white sm:text-lg">
                  {p.name}
                </div>
                <div className="mb-2 text-xs text-zinc-500">
                  Lead: {p.lead}
                </div>
                <span className="inline-block rounded-full bg-[#00e676]/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00e676]">
                  In Progress
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet */}
        <section className="mb-10 sm:mb-16">
          <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            📡 Agent Fleet ({agents.length} agents)
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 sm:gap-3">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="card-base flex items-center gap-2 p-2 sm:p-3"
              >
                <div className={`h-2 w-2 shrink-0 rounded-full ${dotColor(agent.status)}`} />
                <span className="truncate text-xs text-zinc-300 sm:text-sm">
                  {agent.name}
                </span>
                <span className="ml-auto text-[9px] text-zinc-600 sm:text-[10px]">
                  {agent.type}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-10 sm:mb-16">
          <h2 className="mb-6 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            🕑 Evolution Timeline
          </h2>
          <div className="relative pl-6 sm:pl-12">
            {/* Timeline line */}
            <div
              className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6c5ce7] via-[#00e676] to-[#6c5ce7] opacity-30 sm:left-[19px]"
            />

            {timeline.map((entry, i) => (
              <div key={i} className="relative mb-6 pl-6 sm:mb-8 sm:pl-12">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 sm:left-2 sm:h-3.5 sm:w-3.5 ${
                    entry.current
                      ? "border-[#00e676] bg-[#00e676] shadow-[0_0_10px_#00e676]"
                      : "border-[#6c5ce7] bg-[#1a1a28]"
                  }`}
                />

                <div className="mb-1 text-sm font-semibold text-[#a29bfe]">
                  {entry.date}
                </div>
                <div className="mb-2 text-xs text-zinc-600">
                  {entry.version}
                </div>
                <ul className="space-y-1">
                  {entry.items.map((item, j) => (
                    <li
                      key={j}
                      className="relative pl-4 text-sm leading-relaxed text-zinc-400"
                    >
                      <span className="absolute left-0 text-[#6c5ce7]">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-10 sm:mb-16">
          <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            ✅ Key Milestones ({milestones.length} total)
          </h2>
          <div className="space-y-1.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="card-base flex items-center gap-3 border-l-[3px] border-l-[#00c853] p-3 sm:gap-4 sm:p-4"
              >
                <span className="w-16 shrink-0 text-xs font-semibold text-[#a29bfe] sm:w-20 sm:text-sm">
                  {m.id}
                </span>
                <span className="flex-1 truncate text-xs text-zinc-400 sm:text-sm">
                  {m.title}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider sm:px-2 sm:text-[10px] ${priColor(m.pri)}`}
                >
                  {m.pri}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-8 sm:mb-12">
          <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe] sm:text-xl">
            ⚙️ System Architecture
          </h2>
          <div className="card-base p-4 font-mono text-xs leading-relaxed text-zinc-400 sm:p-6 sm:text-sm">
            <p className="mb-2 text-zinc-300">
              <span className="text-[#a29bfe]">Self-Improvement Loop</span>
            </p>
            <p className="mb-4">
              Discovery → Learning → Teacher → Autoresearch → Agents Improve
            </p>
            <p className="mb-2 text-zinc-300">
              <span className="text-[#a29bfe]">Infrastructure</span>
            </p>
            <p className="mb-2">
              Mac Studio (local) + 4 DigitalOcean droplets
            </p>
            <p className="mb-2">
              ClawX Gateway v0.3.6 • 18 AI providers
            </p>
            <p className="mb-4">
              Paperclip orchestrator at 127.0.0.1:3100
            </p>
            <p className="mb-2 text-zinc-300">
              <span className="text-[#a29bfe]">Adapter Types</span>
            </p>
            <p>
              claude_local • codex_local • opencode_local • openclaw_gateway • pi_local • process • http • human (Dan)
            </p>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
