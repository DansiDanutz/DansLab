import { DocHero, GradientText } from "@/components/docs/DocHero";
import { DocCard, DocCardGrid } from "@/components/docs/DocCard";

export default function ArchitecturePage() {
  return (
    <div>
      <DocHero
        title="System Architecture"
        description="The complete topology of DansLab - from physical infrastructure to operational workflows."
        badge="Architecture"
        icon="🏗️"
      />

      {/* Company Model */}
      <section id="company" className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Company Model
        </h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <p className="text-base leading-7 text-zinc-400">
            DansLab operates as an{" "}
            <span className="text-zinc-300">AI-first software company</span>{" "}
            with a hub-and-spoke architecture:
          </p>
          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                1
              </span>
              <span>
                <span className="text-zinc-200">Dan</span> (human founder) sets
                strategic direction
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                2
              </span>
              <span>
                <span className="text-zinc-200">David</span> (main orchestrator)
                interprets and delegates work
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                3
              </span>
              <span>
                <span className="text-zinc-200">Runtime agents</span> (Dexter,
                Nano, Memo, Sienna) handle domain execution
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                4
              </span>
              <span>
                <span className="text-zinc-200">OpenClaw team</span> provides
                specialist labor (research, build, review, automation)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                5
              </span>
              <span>
                <span className="text-zinc-200">Support systems</span> enable
                operations (monitoring, deployment, memory, payments)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Loop */}
      <section id="topology" className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Strategic Loop
        </h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <p className="mb-4 text-base text-zinc-400">
            The company operates through a continuous improvement loop:
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1.5 text-blue-100">
              Idea
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-emerald-100">
              Orchestration
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-1.5 text-purple-100">
              Execution
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-amber-100">
              Review
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-cyan-100">
              Deploy
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-pink-500/40 bg-pink-500/15 px-3 py-1.5 text-pink-100">
              Revenue
            </span>
            <span className="text-zinc-600">→</span>
            <span className="rounded-full border border-orange-500/40 bg-orange-500/15 px-3 py-1.5 text-orange-100">
              Learning
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            Each cycle improves execution quality, reduces friction, and expands
            capabilities.
          </p>
        </div>
      </section>

      {/* Physical Topology */}
      <section id="layers" className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">
          Runtime Layers
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">👤</span>
              <h3 className="font-semibold text-zinc-100">Human Layer</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Dan sets direction, approves major outcomes, and acts as final
              override.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <h3 className="font-semibold text-zinc-100">Orchestration Layer</h3>
            </div>
            <p className="text-sm text-zinc-400">
              David interprets goals, delegates work, coordinates handoffs, and
              routes outputs.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h3 className="font-semibold text-zinc-100">Execution Layer</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Dexter, Sienna, Memo, and Nano own domain-specific delivery lanes.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🦞</span>
              <h3 className="font-semibold text-zinc-100">Specialist Layer</h3>
            </div>
            <p className="text-sm text-zinc-400">
              OpenClaw agents provide focused specialist behavior across
              research, build, review, and automation.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🔧</span>
              <h3 className="font-semibold text-zinc-100">Support Layer</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Monitoring, memory, payments, deploy, versioning, GitHub,
              database, and communication systems keep the lab operational.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Learn More
        </h2>
        <DocCardGrid>
          <DocCard
            title="Agents"
            description="Explore all agents and their specific roles in the system."
            icon="🤖"
            href="/docs/agents"
          />
          <DocCard
            title="Workflows"
            description="See operational scenarios and how agents coordinate."
            icon="⚡"
            href="/docs/workflows"
          />
          <DocCard
            title="Support Systems"
            description="Deep dive into infrastructure and operational support."
            icon="🔧"
            href="/docs/support"
          />
        </DocCardGrid>
      </section>
    </div>
  );
}
