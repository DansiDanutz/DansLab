"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Network, Sparkles } from "lucide-react";
import AgentNode from "@/components/ecosystem/nodes/AgentNode";
import ConnectionLine from "@/components/ecosystem/connections/ConnectionLine";
import { getNodeCenter } from "@/lib/ecosystem-utils";
import LabDetailPanel from "./LabDetailPanel";

type LabAgent = {
  id: string;
  name: string;
  role: string;
  project?: string;
  type: "main" | "support" | "infra" | "slack";
  color: string;
  glow: string;
  initials: string;
  description: string;
};

type LabConnection = {
  id: string;
  from: string;
  to: string;
  type: "data" | "ssh" | "deploy" | "monitor" | "comms";
  label?: string;
};

const agents: LabAgent[] = [
  {
    id: "dan",
    name: "Dan",
    role: "Human",
    project: "Operator",
    type: "main",
    color: "#f8fafc",
    glow: "rgba(248,250,252,0.35)",
    initials: "DN",
    description:
      "Human at the edge of the lab. Sets direction, reviews output, and makes the final calls.",
  },
  {
    id: "david",
    name: "David",
    role: "Orchestrator",
    project: "Mac Studio",
    type: "infra",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    initials: "DV",
    description:
      "Primary orchestrator running on Mac Studio. Routes tasks, delegates work, and keeps the OpenClaw mesh aligned.",
  },
  {
    id: "openclaw-1",
    name: "OpenClaw-01",
    role: "Builder",
    type: "support",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    initials: "O1",
    description: "Build-focused OpenClaw agent for shipping implementation work.",
  },
  {
    id: "openclaw-2",
    name: "OpenClaw-02",
    role: "Researcher",
    type: "support",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
    initials: "O2",
    description: "Research and planning OpenClaw agent for discovery and solution mapping.",
  },
  {
    id: "openclaw-3",
    name: "OpenClaw-03",
    role: "Reviewer",
    type: "support",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    initials: "O3",
    description: "Review-focused OpenClaw agent for validation, QA thinking, and risk checks.",
  },
  {
    id: "openclaw-4",
    name: "OpenClaw-04",
    role: "Automation",
    type: "support",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
    initials: "O4",
    description: "Automation-heavy OpenClaw agent for scripts, glue, and repetitive task handling.",
  },
  {
    id: "kimiclaw",
    name: "KimiClaw",
    role: "Signal Amplifier",
    type: "slack",
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.35)",
    initials: "KC",
    description: "Broadcasts wins, opportunities, and useful movement across the lab.",
  },
  {
    id: "kiloclaw",
    name: "KiloClaw",
    role: "Moderator",
    type: "slack",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.35)",
    initials: "KL",
    description: "Keeps the room clean, prioritizes noise, and enforces order in the team flow.",
  },
  {
    id: "manusclaw",
    name: "ManusClaw",
    role: "Operator",
    type: "slack",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    initials: "MC",
    description: "Executes focused operational runs and converts plans into concrete action sequences.",
  },
];

const positions = {
  dan: { x: 50, y: 16 },
  david: { x: 50, y: 38 },
  "openclaw-1": { x: 18, y: 48 },
  "openclaw-2": { x: 33, y: 64 },
  "openclaw-3": { x: 67, y: 64 },
  "openclaw-4": { x: 82, y: 48 },
  kimiclaw: { x: 28, y: 82 },
  kiloclaw: { x: 50, y: 88 },
  manusclaw: { x: 72, y: 82 },
} as const;

const connections: LabConnection[] = [
  { id: "dan-david", from: "dan", to: "david", type: "data", label: "Direction" },
  { id: "david-o1", from: "david", to: "openclaw-1", type: "ssh", label: "Assign" },
  { id: "david-o2", from: "david", to: "openclaw-2", type: "ssh", label: "Assign" },
  { id: "david-o3", from: "david", to: "openclaw-3", type: "ssh", label: "Assign" },
  { id: "david-o4", from: "david", to: "openclaw-4", type: "ssh", label: "Assign" },
  { id: "o1-o2", from: "openclaw-1", to: "openclaw-2", type: "data", label: "Handoff" },
  { id: "o3-o4", from: "openclaw-3", to: "openclaw-4", type: "data", label: "Handoff" },
  { id: "david-kimi", from: "david", to: "kimiclaw", type: "comms", label: "Broadcast" },
  { id: "david-kilo", from: "david", to: "kiloclaw", type: "comms", label: "Moderate" },
  { id: "david-manus", from: "david", to: "manusclaw", type: "comms", label: "Operate" },
  { id: "kimi-kilo", from: "kimiclaw", to: "kiloclaw", type: "comms", label: "Signal" },
  { id: "kilo-manus", from: "kiloclaw", to: "manusclaw", type: "comms", label: "Control" },
];

export default function LabCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const selectedConnections = useMemo(
    () =>
      new Set(
        connections
          .filter(
            (connection) =>
              connection.from === selectedAgent || connection.to === selectedAgent
          )
          .map((connection) => connection.id)
      ),
    [selectedAgent]
  );

  const selectedNeighbors = useMemo(
    () =>
      new Set(
        connections
          .filter(
            (connection) =>
              connection.from === selectedAgent || connection.to === selectedAgent
          )
          .flatMap((connection) => [connection.from, connection.to])
      ),
    [selectedAgent]
  );

  const activeAgent =
    agents.find((agent) => agent.id === selectedAgent) ?? null;

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #0c1222 0%, #050a14 55%, #000000 100%)",
      }}
      onClick={() => setSelectedAgent(null)}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridDrift 20s linear infinite",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        {connections.map((connection) => {
          const fromPos = positions[connection.from as keyof typeof positions];
          const toPos = positions[connection.to as keyof typeof positions];
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

          const isActive = selectedConnections.has(connection.id);
          const isDimmed = !!selectedAgent && !isActive;

          return (
            <ConnectionLine
              key={connection.id}
              id={connection.id}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              type={connection.type}
              isActive={isActive}
              isDimmed={isDimmed}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0">
        {agents.map((agent) => {
          const pos = positions[agent.id as keyof typeof positions];
          const isHighlighted =
            selectedAgent === agent.id || selectedNeighbors.has(agent.id);
          const isDimmed = !!selectedAgent && !isHighlighted;

          return (
            <div
              key={agent.id}
              className="absolute"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <AgentNode
                agent={agent}
                isActive={selectedAgent === agent.id}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
                onClick={() =>
                  setSelectedAgent((current) =>
                    current === agent.id ? null : agent.id
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          onClick={(event) => event.stopPropagation()}
        >
          <ArrowLeft size={14} />
          Home
        </Link>
        <Link
          href="/ecosystem"
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/15"
          onClick={(event) => event.stopPropagation()}
        >
          <Network size={14} />
          Ecosystem
        </Link>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          DansLab Internal Lab
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Dan, David on Mac Studio, and the OpenClaw mesh inside the lab
        </p>
      </div>

      <div className="absolute right-4 top-4 z-30 flex gap-1.5">
        {["OpenClaw", "Mac Studio", "Human-in-the-loop"].map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2 py-0.5 text-[10px] text-zinc-400"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 w-[min(92vw,840px)] -translate-x-1/2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full border border-orange-400/30 bg-orange-400/10 p-2 text-orange-300">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              Click any node to inspect the internal team.
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              David sits in the middle as orchestrator, Dan sets direction, and
              the OpenClaw agents split execution, moderation, amplification,
              and operational runs.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeAgent && (
          <LabDetailPanel
            agent={activeAgent}
            agents={agents}
            connections={connections}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
