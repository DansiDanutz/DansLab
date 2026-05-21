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
  { type: "data", color: "#3b82f6", label: "Data", glow: "rgba(59,130,246,0.4)" },
  { type: "ssh", color: "#22c55e", label: "SSH", glow: "rgba(34,197,94,0.4)" },
  { type: "deploy", color: "#f97316", label: "Deploy", glow: "rgba(249,115,22,0.4)" },
  { type: "monitor", color: "#eab308", label: "Monitor", glow: "rgba(234,179,8,0.4)" },
  { type: "comms", color: "#6366f1", label: "Comms", glow: "rgba(99,102,241,0.4)" },
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
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "gridDrift 25s linear infinite",
        }}
      />

      {/* Enhanced zone glows */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[14%] h-16 w-[50%] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-[80px]"
      />
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute left-1/2 top-[44%] h-24 w-[30%] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[100px]"
      />
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute left-1/2 top-[68%] h-20 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-[80px]"
      />

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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="group relative overflow-hidden rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-zinc-400 transition-all hover:border-zinc-600 hover:text-white backdrop-blur-md"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/lab"
              className="group relative overflow-hidden rounded-full border border-cyan-500/30 bg-cyan-500/8 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-500/15 backdrop-blur-md"
            >
              <span className="relative z-10">Lab</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/docs"
              className="group relative overflow-hidden rounded-full border border-purple-500/30 bg-purple-500/8 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-500/15 backdrop-blur-md"
            >
              <span className="relative z-10">Docs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          </motion.div>
        </div>

        {/* Center title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            DansLab Ecosystem
          </h1>
          <p className="text-[9px] text-zinc-600 mt-0.5 hidden sm:block">
            Click agents to explore &bull; Play scenarios below
          </p>
        </motion.div>

        {/* Right badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-1.5 pointer-events-auto"
        >
          <div className="hidden sm:flex gap-1">
            {["Claude", "Codex", "Qwen", "OpenClaw"].map((m, index) => (
              <motion.span
                key={m}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-500 backdrop-blur-md cursor-default"
              >
                {m}
              </motion.span>
            ))}
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 backdrop-blur-md"
          >
            Revenue
          </motion.span>
        </motion.div>
      </div>

      {/* ===== BOTTOM-RIGHT: ENHANCED LEGEND + STATS ===== */}
      <motion.div
        className="absolute bottom-16 right-3 z-30 hidden sm:flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/80 px-4 py-2.5 backdrop-blur-md shadow-lg"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          {connectionLegend.map((c, index) => (
            <motion.div
              key={c.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 group"
            >
              <div
                className="h-[2px] w-4 rounded-full shadow-sm transition-shadow group-hover:shadow-md"
                style={{
                  background: c.color,
                  boxShadow: `0 0 8px ${c.glow}`
                }}
              />
              <span className="text-[8px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {c.label}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.5 }}
          className="flex items-center gap-1"
        >
          <span className="text-[9px] text-zinc-500">
            <span className="text-zinc-300 font-semibold">{agents.length}</span> agents
          </span>
        </motion.div>
        <div className="h-4 w-px bg-zinc-800" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          className="flex items-center gap-1"
        >
          <span className="text-[9px] text-zinc-500">
            <span className="text-zinc-300 font-semibold">{connections.length}</span> connections
          </span>
        </motion.div>
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
