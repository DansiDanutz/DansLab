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
      className="fixed left-0 top-0 z-50 w-[240px] h-full overflow-y-auto border-r border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl shadow-[4px_0_30px_rgba(0,0,0,0.4)]"
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -240, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <X size={14} />
        </button>

        {/* Agent header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono shrink-0"
            style={{
              border: `2px solid ${agent.color}`,
              boxShadow: `0 0 12px ${agent.glow}`,
              color: agent.color,
              background: `${agent.color}15`,
            }}
          >
            {agent.initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-zinc-100 truncate">{agent.name}</h2>
            <span
              className="text-xs font-medium"
              style={{ color: agent.color }}
            >
              {agent.role}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-3">
          {agent.description}
        </p>

        {/* Project link */}
        {agent.project && (
          <div className="mb-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 text-xs">
              <Zap size={11} style={{ color: agent.color }} />
              <span className="text-zinc-300 font-medium">{agent.project}</span>
              {agent.projectUrl && (
                <a
                  href={agent.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Connections */}
        <div>
          <h3 className="text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
            Connections
          </h3>
          <div className="space-y-1">
            {relatedConnections.map((conn) => {
              const otherId =
                conn.from === agent.id ? conn.to : conn.from;
              const other = agentMap.get(otherId);
              if (!other) return null;
              const direction = conn.from === agent.id ? "→" : "←";
              return (
                <div
                  key={conn.id}
                  className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-zinc-900/50"
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold shrink-0"
                    style={{
                      border: `1px solid ${other.color}`,
                      color: other.color,
                    }}
                  >
                    {other.initials}
                  </span>
                  <span className="text-zinc-600 text-[10px]">{direction}</span>
                  <span className="text-zinc-300 truncate">{other.name}</span>
                  {conn.label && (
                    <span className="ml-auto text-[9px] text-zinc-600 shrink-0">
                      {conn.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Type badge */}
        <div className="mt-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Type</span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
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
