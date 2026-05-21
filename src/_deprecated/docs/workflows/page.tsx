import { DocHero } from "@/components/docs/DocHero";
import { WorkflowCard, WorkflowCardGrid } from "@/components/docs/WorkflowCard";
import { scenarios } from "@/components/ecosystem/scenarios/scenarioData";

export default function WorkflowsPage() {
  return (
    <div>
      <DocHero
        title="Workflows"
        description="Watch operational scenarios in action - see how agents coordinate across bug fixes, learning loops, feature delivery, and more."
        badge={`${scenarios.length} Scenarios`}
        icon="⚡"
      />

      {/* Intro */}
      <section className="mb-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">
            How Workflows Work
          </h2>
          <p className="text-base leading-7 text-zinc-400">
            Each workflow scenario shows a real operational flow in the DansLab
            system. Click any scenario to see the step-by-step animation of how
            agents coordinate, communicate, and execute work together.
          </p>
        </div>
      </section>

      {/* Workflow Types */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Operational Scenarios
        </h2>
        <WorkflowCardGrid>
          {scenarios.map((scenario) => (
            <WorkflowCard key={scenario.id} scenario={scenario} />
          ))}
        </WorkflowCardGrid>
      </section>

      {/* Quick Info */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Workflow Types
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🔧</span>
            <h3 className="text-sm font-semibold text-zinc-100">Bug Fix</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Incident detection, diagnosis, and automated repair
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🧠</span>
            <h3 className="text-sm font-semibold text-zinc-100">Learning</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Pattern extraction and system optimization
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">✨</span>
            <h3 className="text-sm font-semibold text-zinc-100">New Feature</h3>
            <p className="mt-1 text-xs text-zinc-500">
              From idea to deployed product
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">💰</span>
            <h3 className="text-sm font-semibold text-zinc-100">Revenue</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Subscription flow and agent monetization
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <span className="mb-2 block text-2xl">🧬</span>
            <h3 className="text-sm font-semibold text-zinc-100">Lab Sync</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Internal coordination and feedback loops
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
