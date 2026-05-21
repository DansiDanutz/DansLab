import { DocHero } from "@/components/docs/DocHero";
import { DocCard, DocCardGrid } from "@/components/docs/DocCard";
import { agents } from "@/components/ecosystem/data/agents";

// Get all OpenClaw agents
const openclawAgents = agents.filter((a) => a.id.startsWith("openclaw"));
const slackAgents = agents.filter((a) => a.type === "slack");

export default function OpenClawPage() {
  return (
    <div>
      <DocHero
        title="OpenClaw Team"
        description="The internal specialist layer that provides research, build, review, automation, moderation, and amplification capabilities."
        badge="Specialist Team"
        icon="🦞"
      />

      {/* Overview */}
      <section className="mb-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <h2 className="mb-3 text-xl font-semibold text-zinc-100">
            The OpenClaw Philosophy
          </h2>
          <p className="text-base leading-7 text-zinc-400">
            The OpenClaw team exists to prevent the system from collapsing into
            one generalist agent trying to do everything poorly. The design
            principle is{" "}
            <span className="text-zinc-300">specialization by workflow stage</span>
            — each agent has a specific mission and operates within clear
            boundaries.
          </p>
        </div>
      </section>

      {/* Operating Sequence */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Operating Sequence
        </h2>
        <div className="space-y-3">
          {[
            { step: 1, title: "Dan sets direction", desc: "Human defines goals and priorities" },
            { step: 2, title: "David interprets and delegates", desc: "Orchestrator routes work to appropriate specialists" },
            { step: 3, title: "OpenClaw-02 clarifies the work", desc: "Researcher reduces ambiguity before build begins" },
            { step: 4, title: "OpenClaw-01 builds", desc: "Builder turns plans into implementation" },
            { step: 5, title: "OpenClaw-03 reviews", desc: "Reviewer protects quality and catches issues" },
            { step: 6, title: "OpenClaw-04 automates", desc: "Automation handles repeatable tasks" },
            { step: 7, title: "ManusClaw operationalizes", desc: "Operator carries work across the finish line" },
            { step: 8, title: "KiloClaw maintains signal quality", desc: "Moderator keeps communication clean" },
            { step: 9, title: "KimiClaw amplifies outcomes", desc: "Advertiser makes results visible" },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950/65 p-4"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-sm font-semibold text-zinc-400">
                {step}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core OpenClaw Agents */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Core OpenClaw Agents
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {openclawAgents.map((agent) => (
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
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
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

      {/* Channel Agents */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Channel Agents
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Specialized agents that operate within communication channels
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {slackAgents.map((agent) => (
            <a
              key={agent.id}
              href={`/docs/agents/${agent.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: agent.color,
                    color: "#fff",
                  }}
                >
                  {agent.initials}
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {agent.name}
                </h3>
              </div>
              <p className="text-xs text-zinc-500">{agent.role}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Learn More
        </h2>
        <DocCardGrid>
          <DocCard
            title="All Agents"
            description="See every agent in the ecosystem including OpenClaw members."
            icon="🤖"
            href="/docs/agents"
          />
          <DocCard
            title="Workflows"
            description="Watch OpenClaw agents in action during operational scenarios."
            icon="⚡"
            href="/docs/workflows"
          />
          <DocCard
            title="Architecture"
            description="Understand how OpenClaw fits into the broader system topology."
            icon="🏗️"
            href="/docs/architecture"
          />
        </DocCardGrid>
      </section>
    </div>
  );
}
