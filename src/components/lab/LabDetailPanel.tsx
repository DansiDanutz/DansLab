"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LabAgent {
  id: string;
  name: string;
  role: string;
  project?: string;
  type: "main" | "support" | "infra" | "slack";
  color: string;
  glow: string;
  initials: string;
  description: string;
}

interface LabConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface LabDetailPanelProps {
  agent: LabAgent;
  agents: LabAgent[];
  connections: LabConnection[];
  onClose: () => void;
}

export default function LabDetailPanel({
  agent,
  agents,
  connections,
  onClose,
}: LabDetailPanelProps) {
  const relatedConnections = connections.filter(
    (connection) => connection.from === agent.id || connection.to === agent.id
  );
  const agentMap = new Map(agents.map((entry) => [entry.id, entry]));

  return (
    <motion.div
      className="fixed right-0 top-0 z-50 h-full w-[380px] max-w-[90vw] overflow-y-auto border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-xl"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold font-mono"
            style={{
              border: `2px solid ${agent.color}`,
              boxShadow: `0 0 20px ${agent.glow}`,
              color: agent.color,
              background: `${agent.color}15`,
            }}
          >
            {agent.initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">{agent.name}</h2>
            <span className="text-sm font-medium" style={{ color: agent.color }}>
              {agent.role}
            </span>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-zinc-400">
          {agent.description}
        </p>

        {agent.project && (
          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Project
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {agent.project}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Lab Links
          </h3>
          <div className="space-y-2">
            {relatedConnections.map((connection) => {
              const otherId =
                connection.from === agent.id ? connection.to : connection.from;
              const other = agentMap.get(otherId);
              if (!other) return null;

              return (
                <div
                  key={connection.id}
                  className="flex items-center gap-2 rounded bg-zinc-900/50 p-2 text-sm"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold font-mono"
                    style={{
                      borderColor: other.color,
                      color: other.color,
                    }}
                  >
                    {other.initials}
                  </span>
                  <span className="text-zinc-300">{other.name}</span>
                  {connection.label && (
                    <span className="ml-auto text-xs text-zinc-600">
                      {connection.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
