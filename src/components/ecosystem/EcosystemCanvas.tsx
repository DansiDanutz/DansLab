"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
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

export default function EcosystemCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = useScenario();

  // Track container size
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

  // Idle autoplay
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

  // Determine which nodes/connections to highlight
  const hasSelection = selectedAgent !== null;
  const selectedConnections = hasSelection
    ? new Set(
        connections
          .filter(
            (c) => c.from === selectedAgent || c.to === selectedAgent
          )
          .map((c) => c.id)
      )
    : new Set<string>();
  const selectedNeighbors = hasSelection
    ? new Set(
        connections
          .filter(
            (c) => c.from === selectedAgent || c.to === selectedAgent
          )
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
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridDrift 20s linear infinite",
        }}
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

          const from = getNodeCenter(
            fromPos.x,
            fromPos.y,
            dimensions.width,
            dimensions.height
          );
          const to = getNodeCenter(
            toPos.x,
            toPos.y,
            dimensions.width,
            dimensions.height
          );

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
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <AgentNode
                agent={agent}
                isActive={isActive}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
                onClick={() => {
                  // Stop propagation handled inside
                  handleAgentClick(agent.id);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Title overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          DansLab Ecosystem
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Click agents to explore &bull; Watch scenarios below
        </p>
      </div>

      {/* AI Models badge */}
      <div className="absolute top-4 right-4 z-30 flex gap-1.5">
        {["Claude Code", "Codex", "Qwen 3.5"].map((model) => (
          <span
            key={model}
            className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-400"
          >
            {model}
          </span>
        ))}
      </div>

      {/* Revenue badge */}
      <div className="absolute top-4 left-4 z-30">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400">
          Subscriptions + Credits
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
