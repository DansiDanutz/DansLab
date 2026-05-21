import { DocHero } from "@/components/docs/DocHero";

const responsibilities = [
  {
    layer: "Strategy",
    owner: "Dan",
    responsibilities: [
      "Direction setting",
      "Quality and taste validation",
      "Business priorities",
      "Final approval",
      "Scope ownership",
    ],
  },
  {
    layer: "Orchestration",
    owner: "David",
    responsibilities: [
      "Delegation and routing",
      "Sequencing and coordination",
      "Ecosystem management",
      "Communication handling",
      "Support system integration",
    ],
  },
  {
    layer: "Product Domain",
    owner: "Dexter, Nano, Memo, Sienna",
    responsibilities: [
      "Specialized output in creator tools",
      "Agent creation and enrollment",
      "Framework building",
      "Trading and crypto intelligence",
    ],
  },
  {
    layer: "Internal Specialist",
    owner: "OpenClaw Team",
    responsibilities: [
      "Research and discovery",
      "Build and implementation",
      "Review and QA",
      "Automation and scripts",
      "Operations and moderation",
      "Amplification and promotion",
    ],
  },
  {
    layer: "Monitoring & Repair",
    owner: "Monitor, Doctor",
    responsibilities: [
      "Health tracking",
      "Incident detection",
      "Diagnostics and analysis",
      "System recovery",
    ],
  },
  {
    layer: "Delivery & Source Control",
    owner: "GitHub, Vercel, Pope, AutoForge",
    responsibilities: [
      "Code flow management",
      "Validation and testing",
      "Deployment execution",
      "CI/CD pipeline",
    ],
  },
  {
    layer: "Memory & Learning",
    owner: "Vector, Learning, Model, GSD",
    responsibilities: [
      "Knowledge capture",
      "Pattern optimization",
      "Tool updates",
      "Structured execution",
    ],
  },
  {
    layer: "Business Systems",
    owner: "Stripe, Marketplace, Brain Platform",
    responsibilities: [
      "Payment processing",
      "Revenue management",
      "Product distribution",
      "Subscription handling",
    ],
  },
  {
    layer: "Communications",
    owner: "Slack, Telegram, Discord, Channel Agents",
    responsibilities: [
      "Signal routing",
      "Update distribution",
      "Moderation and filtering",
      "Amplification",
    ],
  },
];

export default function ResponsibilitiesPage() {
  return (
    <div>
      <DocHero
        title="Team Responsibilities"
        description="Clear ownership and decision rights across the DansLab ecosystem - who does what and how work flows through the system."
        badge="Organization"
        icon="👥"
      />

      {/* Overview */}
      <section className="mb-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <p className="text-base leading-7 text-zinc-400">
            The DansLab operating model is built on{" "}
            <span className="text-zinc-300">clear ownership boundaries</span>.
            Each layer has a primary owner with defined responsibilities, ensuring
            work flows efficiently from strategy to execution to learning.
          </p>
        </div>
      </section>

      {/* Responsibility Matrix */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Responsibility Matrix
        </h2>
        <div className="space-y-4">
          {responsibilities.map((resp) => (
            <div
              key={resp.layer}
              className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {resp.layer}
                </span>
                <span className="text-sm text-zinc-500">Owner:</span>
                <span className="text-sm font-medium text-zinc-200">
                  {resp.owner}
                </span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {resp.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <span className="mt-1.5 flex h-1 w-1 flex-shrink-0 rounded-full bg-zinc-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Rights */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Decision Rights
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <h3 className="mb-3 text-base font-semibold text-zinc-100">
              Strategic Decisions
            </h3>
            <p className="mb-3 text-sm text-zinc-400">
              Company direction, product priorities, major investments
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-300">
                Dan
              </span>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-500">Final approval</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <h3 className="mb-3 text-base font-semibold text-zinc-100">
              Operational Decisions
            </h3>
            <p className="mb-3 text-sm text-zinc-400">
              Task routing, agent selection, workflow coordination
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-300">
                David
              </span>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-500">Delegates work</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <h3 className="mb-3 text-base font-semibold text-zinc-100">
              Technical Decisions
            </h3>
            <p className="mb-3 text-sm text-zinc-400">
              Implementation approach, code structure, technical choices
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-300">
                OpenClaw-02
              </span>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-500">Research & plan</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <h3 className="mb-3 text-base font-semibold text-zinc-100">
              Quality Decisions
            </h3>
            <p className="mb-3 text-sm text-zinc-400">
              Code review, testing, validation, deployment approval
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-300">
                OpenClaw-03
              </span>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-500">Reviews & approves</span>
            </div>
          </div>
        </div>
      </section>

      {/* Escalation Paths */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Escalation Paths
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="mb-2 text-sm font-semibold text-zinc-100">
              Technical Issues
            </h3>
            <p className="text-xs text-zinc-500">
              OpenClaw agents → David → Dan (for critical decisions)
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="mb-2 text-sm font-semibold text-zinc-100">
              System Incidents
            </h3>
            <p className="text-xs text-zinc-500">
              Monitor detects → Doctor diagnoses → David routes fix → OpenClaw
              executes
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="mb-2 text-sm font-semibold text-zinc-100">
              Communication Issues
            </h3>
            <p className="text-xs text-zinc-500">
              KiloClaw moderates → escalates to David/Doctor if needed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
