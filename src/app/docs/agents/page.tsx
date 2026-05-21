"use client";

import { useState } from "react";
import { DocHero } from "@/components/docs/DocHero";
import { AgentCard, AgentCardGrid } from "@/components/docs/AgentCard";
import { agents } from "@/components/ecosystem/data/agents";
import { useSearchParams } from "next/navigation";

const agentTypes = [
  { value: "all", label: "All Agents", count: agents.length },
  { value: "main", label: "Main Agents", count: agents.filter((a) => a.type === "main").length },
  { value: "support", label: "Support", count: agents.filter((a) => a.type === "support").length },
  { value: "infra", label: "Infrastructure", count: agents.filter((a) => a.type === "infra").length },
  { value: "channel", label: "Channels", count: agents.filter((a) => a.type === "channel").length },
  { value: "slack", label: "Slack Agents", count: agents.filter((a) => a.type === "slack").length },
];

export default function AgentsPage() {
  const [selectedType, setSelectedType] = useState("all");

  const filteredAgents =
    selectedType === "all"
      ? agents
      : agents.filter((agent) => agent.type === selectedType);

  return (
    <div>
      <DocHero
        title="Agents"
        description="Meet all the agents in the DansLab ecosystem - from main orchestrators to specialized support systems."
        badge={`${agents.length} Agents`}
        icon="🤖"
      />

      {/* Filter Tabs */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex flex-wrap gap-2">
          {agentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {type.label}
              <span className="ml-2 text-xs opacity-60">({type.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <AgentCardGrid>
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </AgentCardGrid>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-12 text-center">
          <p className="text-zinc-400">No agents found for this category.</p>
        </div>
      )}

      {/* Quick Categories */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Quick Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="text-sm font-semibold text-zinc-100">Main Agents</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Dan, David, Dexter, Nano, Memo, Sienna - Core company leadership
              and domain owners
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="text-sm font-semibold text-zinc-100">OpenClaw Team</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Builders, researchers, reviewers, and automation specialists
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="text-sm font-semibold text-zinc-100">Support Systems</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Monitoring, deployment, GitHub, memory, learning, and infrastructure
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-4">
            <h3 className="text-sm font-semibold text-zinc-100">Communication</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Telegram, Slack, Discord, and channel-specific agents
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
