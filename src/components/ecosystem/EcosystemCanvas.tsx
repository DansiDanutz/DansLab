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
      className="relative w-full h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #0c1222 0%, #050a14 50%, #000000 100%)",
      }}
      onClick={handleBackgroundClick}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "gridDrift 25s linear infinite",
        }}
      />

      {/* Zone glows */}
      <div className="absolute left-1/2 top-[14%] h-16 w-[50%] -translate-x-1/2 rounded-full bg-indigo-500/4 blur-[60px]" />
      <div className="absolute left-1/2 top-[44%] h-24 w-[30%] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[80px]" />
      <div className="absolute left-1/2 top-[68%] h-20 w-[60%] -translate-x-1/2 rounded-full bg-emerald-500/3 blur-[60px]" />

      {/* SVG connections layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
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
      <div className="absolute inset-0">
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
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
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
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 pointer-events-none">
        {/* Left nav */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/"
            className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-zinc-400 transition hover:border-zinc-600 hover:text-white backdrop-blur-md"
          >
            Home
          </Link>
          <Link
            href="/lab"
            className="rounded-full border border-cyan-500/30 bg-cyan-500/8 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/15 backdrop-blur-md"
          >
            Lab
          </Link>
        </div>

        {/* Center title */}
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            DansLab Ecosystem
          </h1>
          <p className="text-[9px] text-zinc-600 mt-0.5 hidden sm:block">
            Click agents to explore &bull; Play scenarios below
          </p>
        </div>

        {/* Right badges */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="hidden sm:flex gap-1">
            {["Claude", "Codex", "Qwen", "OpenClaw"].map((m) => (
              <span
                key={m}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-500 backdrop-blur-md"
              >
                {m}
              </span>
            ))}
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 backdrop-blur-md">
            Revenue
          </span>
        </div>
      </div>

      {/* ===== CONNECTION LEGEND ===== */}
      <motion.div
        className="absolute bottom-16 left-3 z-30 hidden sm:flex flex-col gap-1 rounded-lg border border-zinc-800/60 bg-zinc-950/70 px-3 py-2 backdrop-blur-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-0.5">Connections</span>
        {connectionLegend.map((c) => (
          <div key={c.type} className="flex items-center gap-1.5">
            <div className="h-[2px] w-4 rounded-full" style={{ background: c.color }} />
            <span className="text-[9px] text-zinc-500">{c.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ===== STATS ===== */}
      <motion.div
        className="absolute bottom-16 right-3 z-30 hidden sm:flex items-center gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/70 px-3 py-2 backdrop-blur-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[9px] text-zinc-500">
          <span className="text-zinc-300 font-semibold">{agents.length}</span> agents
        </span>
        <span className="text-zinc-700">&middot;</span>
        <span className="text-[9px] text-zinc-500">
          <span className="text-zinc-300 font-semibold">{connections.length}</span> connections
        </span>
      </motion.div>

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
