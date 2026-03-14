"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { agents } from "./data/agents";
import { connections } from "./data/connections";
import { positions } from "./data/positions";
import { getNodeCenter } from "@/lib/ecosystem-utils";
import AgentNode from "./nodes/AgentNode";
import ConnectionLine from "./connections/ConnectionLine";
import AgentDetailPanel from "./panels/AgentDetailPanel";
import ScenarioPanel from "./panels/ScenarioPanel";
import { useScenario } from "./scenarios/useScenario";
import { agentMap } from "./data/agents";

const connectionLegend = [
  { type: "data", color: "#3b82f6", label: "Data" },
  { type: "ssh", color: "#22c55e", label: "SSH" },
  { type: "deploy", color: "#f97316", label: "Deploy" },
  { type: "monitor", color: "#eab308", label: "Monitor" },
  { type: "comms", color: "#6366f1", label: "Comms" },
];

export default function EcosystemCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = useScenario();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!scenario.isPlaying) {
      idleTimerRef.current = setTimeout(() => {
        const ids = scenario.scenarios.map((s) => s.id);
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        scenario.play(randomId);
      }, 15000);
    }
  }, [scenario]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleAgentClick = (agentId: string) => {
    resetIdleTimer();
    if (scenario.isPlaying) scenario.stop();
    setSelectedAgent(selectedAgent === agentId ? null : agentId);
  };

  const handleBackgroundClick = () => {
    resetIdleTimer();
    if (scenario.isPlaying) scenario.stop();
    setSelectedAgent(null);
  };

  const handleScenarioPlay = (id: string) => {
    resetIdleTimer();
    setSelectedAgent(null);
    scenario.play(id);
  };

  const hasSelection = selectedAgent !== null;
  const selectedConnections = hasSelection
    ? new Set(
        connections
          .filter((c) => c.from === selectedAgent || c.to === selectedAgent)
          .map((c) => c.id)
      )
    : new Set<string>();
  const selectedNeighbors = hasSelection
    ? new Set(
        connections
          .filter((c) => c.from === selectedAgent || c.to === selectedAgent)
          .flatMap((c) => [c.from, c.to])
      )
    : new Set<string>();

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className="relative w-full h-screen bg-zinc-950 overflow-hidden select-none pb-14"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,40,0.8),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Zone glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(100,100,140,0.06),transparent_60%)]" />

      {/* SVG connections layer */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        {connections.map((conn) => {
          const fromPos = positions[conn.from];
          const toPos = positions[conn.to];
          if (!fromPos || !toPos) return null;
          const from = getNodeCenter(fromPos.x, fromPos.y, dimensions.width, dimensions.height);
          const to = getNodeCenter(toPos.x, toPos.y, dimensions.width, dimensions.height);
          const isScenarioActive = scenario.activeConnections.has(conn.id);
          const isSelectionActive = selectedConnections.has(conn.id);
          const isActive = isScenarioActive || isSelectionActive;
          const isDimmed =
            (hasSelection && !isSelectionActive) ||
            (scenario.isPlaying && !isScenarioActive);
          return (
            <ConnectionLine
              key={conn.id}
              id={conn.id}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              type={conn.type}
              isActive={isActive}
              isDimmed={isDimmed}
            />
          );
        })}
      </svg>

      {/* HTML nodes layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {agents.map((agent) => {
          const pos = positions[agent.id];
          if (!pos) return null;
          const isScenarioActive = scenario.activeAgents.has(agent.id);
          const isSelectionActive =
            selectedAgent === agent.id || selectedNeighbors.has(agent.id);
          const isActive = isScenarioActive || selectedAgent === agent.id;
          const isHighlighted = isSelectionActive || isScenarioActive;
          const isDimmed =
            (hasSelection && !isSelectionActive) ||
            (scenario.isPlaying && !isScenarioActive);
          return (
            <div
              key={agent.id}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <AgentNode
                agent={agent}
                isActive={isActive}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
                onClick={() => handleAgentClick(agent.id)}
              />
            </div>
          );
        })}
      </div>

      {/* ===== TOP BAR ===== */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-start justify-between px-4 pt-3">
          {/* Left nav */}
          <div className="flex gap-2 pointer-events-auto">
            <Link href="/" className="px-3 py-1 rounded-md border border-zinc-800 text-zinc-400 text-xs hover:text-zinc-200 hover:border-zinc-600 transition-colors bg-zinc-950/50 backdrop-blur-sm">
              Home
            </Link>
            <Link href="/lab" className="px-3 py-1 rounded-md border border-zinc-800 text-zinc-400 text-xs hover:text-zinc-200 hover:border-zinc-600 transition-colors bg-zinc-950/50 backdrop-blur-sm">
              Lab
            </Link>
          </div>

          {/* Center title */}
          <div className="text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DansLab Ecosystem
            </h1>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              Click agents to explore &bull; Play scenarios below
            </p>
          </div>

          {/* Right badges */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {["Claude", "Codex", "Qwen", "OpenClaw"].map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-md border border-zinc-800 text-[10px] text-zinc-500 bg-zinc-950/50 backdrop-blur-sm"
              >
                {m}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md border border-amber-800/50 text-[10px] text-amber-400 bg-amber-950/30 backdrop-blur-sm">
              Revenue
            </span>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM-RIGHT: LEGEND + STATS ===== */}
      <div className="absolute bottom-16 right-4 z-30 flex items-center gap-3 text-[10px] text-zinc-600 bg-zinc-950/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-zinc-800/50">
        {connectionLegend.map((c) => (
          <div key={c.type} className="flex items-center gap-1">
            <div
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            <span>{c.label}</span>
          </div>
        ))}
        <span className="text-zinc-700">|</span>
        <span>
          <span className="text-zinc-400">{agents.length}</span> agents
        </span>
        <span className="text-zinc-700">&middot;</span>
        <span>
          <span className="text-zinc-400">{connections.length}</span> connections
        </span>
      </div>

      {/* Agent detail panel */}
      <AnimatePresence>
        {selectedAgent && agentMap.get(selectedAgent) && (
          <AgentDetailPanel
            agent={agentMap.get(selectedAgent)!}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>

      {/* Scenario panel */}
      <ScenarioPanel
        scenarios={scenario.scenarios}
        activeScenario={scenario.activeScenario}
        narration={scenario.narration}
        isPlaying={scenario.isPlaying}
        onPlay={handleScenarioPlay}
        onStop={scenario.stop}
      />
    </div>
  );
}
