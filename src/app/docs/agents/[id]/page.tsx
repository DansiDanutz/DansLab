import { notFound } from "next/navigation";
import { DocHero, GradientText } from "@/components/docs/DocHero";
import { agents, agentMap } from "@/components/ecosystem/data/agents";
import { connectionMap } from "@/components/ecosystem/data/connections";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  return agents.map((agent) => ({
    id: agent.id,
  }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = agentMap.get(id);

  if (!agent) {
    notFound();
  }

  // Get all connections for this agent
  const agentConnections = Array.from(connectionMap.values()).filter(
    (conn) => conn.from === agent.id || conn.to === agent.id
  );

  // Get related agents
  const relatedAgentIds = agentConnections.map((conn) =>
    conn.from === agent.id ? conn.to : conn.from
  );
  const relatedAgents = relatedAgentIds
    .map((agentId) => agentMap.get(agentId))
    .filter(Boolean);

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/docs/agents"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft size={16} />
        <span>Back to Agents</span>
      </Link>

      {/* Agent Header */}
      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/65 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold shadow-xl"
            style={{
              backgroundColor: agent.color,
              color: agent.type === "main" ? "#000" : "#fff",
              boxShadow: `0 0 40px ${agent.glow}`,
            }}
          >
            {agent.initials}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-zinc-100">{agent.name}</h1>
              <span
                className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500"
              >
                {agent.type}
              </span>
            </div>
            <p className="text-lg text-zinc-300">{agent.role}</p>
            {agent.project && (
              <a
                href={agent.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-400"
              >
                {agent.project}
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-base leading-7 text-zinc-400">
          {agent.description}
        </p>
      </div>

      {/* Connections */}
      {agentConnections.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Connections ({agentConnections.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {agentConnections.map((conn) => {
              const otherAgentId =
                conn.from === agent.id ? conn.to : conn.from;
              const otherAgent = agentMap.get(otherAgentId);

              if (!otherAgent) return null;

              const isOutbound = conn.from === agent.id;

              return (
                <Link
                  key={conn.id}
                  href={`/docs/agents/${otherAgent.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: otherAgent.color,
                        color: otherAgent.type === "main" ? "#000" : "#fff",
                      }}
                    >
                      {otherAgent.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">
                        {otherAgent.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {conn.label || conn.type}{" "}
                        <span className="text-zinc-600">
                          {isOutbound ? "→" : "←"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Agents */}
      {relatedAgents.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">
            Related Agents
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedAgents.slice(0, 6).map((related) => {
              if (!related) return null;
              return (
                <Link
                  key={related.id}
                  href={`/docs/agents/${related.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-950/65 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/75"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: related.color,
                        color: related.type === "main" ? "#000" : "#fff",
                      }}
                    >
                      {related.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">
                        {related.name}
                      </p>
                      <p className="text-xs text-zinc-500">{related.role}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
