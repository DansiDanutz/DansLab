import { DocHero } from "@/components/docs/DocHero";
import { agents, agentMap } from "@/components/ecosystem/data/agents";

// Support system agents (excluding OpenClaw)
const supportAgents = agents.filter(
  (a) => a.type === "support" && !a.id.startsWith("openclaw")
);
const infraAgents = agents.filter((a) => a.type === "infra");
const channelAgents = agents.filter((a) => a.type === "channel");

export default function SupportPage() {
  return (
    <div>
      <DocHero
        title="Support Systems"
        description="Infrastructure and operational systems that keep the DansLab running - monitoring, deployment, memory, learning, and more."
        badge="Infrastructure"
        icon="🔧"
      />

      {/* Overview */}
      <section className="mb-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <p className="text-base leading-7 text-zinc-400">
            Support systems form the operational substrate of DansLab. They
            provide monitoring, diagnostics, deployment, source control,
            autonomous execution, structured workflows, memory, learning, model
            optimization, payments, connectivity, and database services.
          </p>
        </div>
      </section>

      {/* Infrastructure */}
      {infraAgents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-100">
            Infrastructure
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infraAgents.map((agent) => (
              <a
                key={agent.id}
                href={`/docs/agents/${agent.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: agent.color,
                      color: "#fff",
                    }}
                  >
                    {agent.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-100">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-zinc-400">
                  {agent.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Support Systems */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Operational Support
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportAgents.map((agent) => (
            <a
              key={agent.id}
              href={`/docs/agents/${agent.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
              style={{
                borderLeftColor: agent.color,
                borderLeftWidth: "3px",
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: agent.color,
                    color: agent.type === "main" ? "#000" : "#fff",
                  }}
                >
                  {agent.initials}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-zinc-100">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{agent.role}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                {agent.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Communication Channels */}
      {channelAgents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-100">
            Communication Channels
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {channelAgents.map((agent) => (
              <a
                key={agent.id}
                href={`/docs/agents/${agent.id}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: agent.color,
                      color: "#fff",
                    }}
                  >
                    {agent.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{agent.role}</p>
                  </div>
                </div>
                <p className="text-xs leading-6 text-zinc-400">
                  {agent.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* System Categories */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          System Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">📊</span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Monitoring & Diagnostics
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Monitor, Doctor - Health and incident response
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🚀</span>
            <h3 className="text-sm font-semibold text-zinc-100">Deployment</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Vercel, GitHub, Pope - Code flow and releases
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🧠</span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Memory & Learning
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Vector, Learning, Model - Knowledge and optimization
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">💳</span>
            <h3 className="text-sm font-semibold text-zinc-100">Business</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Stripe, Supabase - Payments and database
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
