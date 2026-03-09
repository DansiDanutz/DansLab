"use client";

import { motion } from "framer-motion";
import { X, ExternalLink, Zap } from "lucide-react";
import type { AgentDef } from "../data/agents";
import { connections } from "../data/connections";
import { agentMap } from "../data/agents";

interface AgentDetailPanelProps {
  agent: AgentDef;
  onClose: () => void;
}

export default function AgentDetailPanel({
  agent,
  onClose,
}: AgentDetailPanelProps) {
  const relatedConnections = connections.filter(
    (c) => c.from === agent.id || c.to === agent.id
  );

  return (
    <motion.div
      className="fixed right-0 top-0 h-full w-[380px] max-w-[90vw] z-50 bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 overflow-y-auto"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Agent header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-mono"
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
            <span
              className="text-sm font-medium"
              style={{ color: agent.color }}
            >
              {agent.role}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          {agent.description}
        </p>

        {/* Project link */}
        {agent.project && (
          <div className="mb-6 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} style={{ color: agent.color }} />
              <span className="text-zinc-300 font-medium">{agent.project}</span>
              {agent.projectUrl && (
                <a
                  href={agent.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Connections */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
            Connections
          </h3>
          <div className="space-y-2">
            {relatedConnections.map((conn) => {
              const otherId =
                conn.from === agent.id ? conn.to : conn.from;
              const other = agentMap.get(otherId);
              if (!other) return null;
              const direction = conn.from === agent.id ? "→" : "←";
              return (
                <div
                  key={conn.id}
                  className="flex items-center gap-2 text-sm p-2 rounded bg-zinc-900/50"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                    style={{
                      border: `1px solid ${other.color}`,
                      color: other.color,
                    }}
                  >
                    {other.initials}
                  </span>
                  <span className="text-zinc-500">{direction}</span>
                  <span className="text-zinc-300">{other.name}</span>
                  {conn.label && (
                    <span className="ml-auto text-xs text-zinc-600">
                      {conn.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Type badge */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 uppercase tracking-wider">Type</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                border: `1px solid ${agent.color}40`,
                color: agent.color,
                background: `${agent.color}10`,
              }}
            >
              {agent.type}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
