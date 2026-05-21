import Link from "next/link";
import { Scenario } from "@/components/ecosystem/scenarios/scenarioData";
import { Play } from "lucide-react";
import { getScenarioAgents } from "@/lib/docs-data";

interface WorkflowCardProps {
  scenario: Scenario;
}

export function WorkflowCard({ scenario }: WorkflowCardProps) {
  const participatingAgents = getScenarioAgents(scenario.id);
  const stepCount = scenario.steps.length;

  return (
    <Link
      href={`/docs/workflows/${scenario.id}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-950/75 hover:shadow-[0_0_60px_rgba(59,130,246,0.1)] hover:scale-[1.02]"
    >
      {/* Icon */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-3xl">{scenario.icon}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
          <Play size={14} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-zinc-100">{scenario.name}</h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-zinc-400 line-clamp-2">
        {scenario.description}
      </p>

      {/* Metadata */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>{stepCount} steps</span>
        <span>{participatingAgents.length} agents</span>
      </div>

      {/* Agent Preview */}
      <div className="mt-3 flex -space-x-2">
        {participatingAgents.slice(0, 5).map((agent) => {
          if (!agent) return null;
          return (
            <div
              key={agent.id}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 text-[10px] font-bold"
              style={{
                backgroundColor: agent.color,
                color: agent.type === "main" ? "#000" : "#fff",
              }}
              title={agent.name}
            >
              {agent.initials}
            </div>
          );
        })}
        {participatingAgents.length > 5 && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-800 text-[10px] font-medium text-zinc-400">
            +{participatingAgents.length - 5}
          </div>
        )}
      </div>
    </Link>
  );
}

interface WorkflowCardGridProps {
  children: React.ReactNode;
}

export function WorkflowCardGrid({ children }: WorkflowCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}
