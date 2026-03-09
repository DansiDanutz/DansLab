"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Shield, Sparkles, Wrench } from "lucide-react";
import type { AgentDef } from "../data/agents";
import { DanAvatar } from "@/components/avatars";

interface AgentNodeProps {
  agent: AgentDef;
  isActive: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

const sizeMap = {
  main: { outer: 76, inner: 64, text: "text-lg", ring: 80 },
  support: { outer: 52, inner: 42, text: "text-xs", ring: 56 },
  infra: { outer: 88, inner: 74, text: "text-xl", ring: 92 },
  channel: { outer: 52, inner: 42, text: "text-xs", ring: 56 },
  slack: { outer: 48, inner: 38, text: "text-xs", ring: 52 },
};

function ClawGlyph({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9">
      <path
        d="M20 39c-6-1-11 2-12 8 6 2 11 1 16-2M44 39c6-1 11 2 12 8-6 2-11 1-16-2M24 23c-3 3-5 7-5 12 0 7 6 12 13 12s13-5 13-12c0-5-2-9-5-12"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="28" r="2" fill={color} />
      <circle cx="38" cy="28" r="2" fill={color} />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
    </svg>
  );
}

function renderGlyph(agent: AgentDef, isHighlighted: boolean) {
  if (agent.id === "dan") {
    return <DanAvatar size="xl" className="h-10 w-10 ring-2 ring-white/10" />;
  }

  if (agent.id === "david") {
    return (
      <div className="relative flex h-11 w-11 items-center justify-center">
        <Cpu size={30} color={agent.color} strokeWidth={1.8} />
        <div className="absolute inset-0 rounded-full border border-white/10" />
      </div>
    );
  }

  if (agent.id === "mac-studio") {
    return <Bot size={30} color={agent.color} strokeWidth={1.8} />;
  }

  if (agent.id.startsWith("openclaw-")) {
    return <ClawGlyph color={agent.color} label={agent.initials} />;
  }

  if (agent.id === "kimiclaw") {
    return <Sparkles size={24} color={agent.color} strokeWidth={2} />;
  }

  if (agent.id === "kiloclaw") {
    return <Shield size={24} color={agent.color} strokeWidth={2} />;
  }

  if (agent.id === "manusclaw") {
    return <Wrench size={24} color={agent.color} strokeWidth={2} />;
  }

  return (
    <span
      className={`${sizeMap[agent.type].text} font-mono`}
      style={{ color: agent.color }}
    >
      {agent.initials}
    </span>
  );
}

export default function AgentNode({
  agent,
  isActive,
  isHighlighted,
  isDimmed,
  onClick,
}: AgentNodeProps) {
  const size = sizeMap[agent.type];

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1 cursor-pointer select-none"
      style={{
        transform: "translate(-50%, -50%)",
        zIndex: isActive ? 20 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: isDimmed ? 0.3 : 1,
      }}
      whileHover={{ scale: 1.12 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Pulse ring */}
      {(isActive || isHighlighted) && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size.ring,
            height: size.ring,
            border: `2px solid ${agent.color}`,
            opacity: 0.5,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Node circle */}
      <div
        className="rounded-full flex items-center justify-center font-bold relative"
        style={{
          width: size.outer,
          height: size.outer,
          background: `radial-gradient(circle at 30% 30%, ${agent.color}33, ${agent.color}11)`,
          border: `2px solid ${agent.color}`,
          boxShadow: isActive || isHighlighted
            ? `0 0 20px ${agent.glow}, 0 0 40px ${agent.glow}`
            : `0 0 8px ${agent.glow}`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div
          className={`flex items-center justify-center transition-transform ${
            isHighlighted ? "scale-105" : ""
          }`}
        >
          {renderGlyph(agent, isHighlighted)}
        </div>
      </div>

      {/* Label */}
      <div className="text-center whitespace-nowrap">
        <div
          className="text-[10px] font-semibold tracking-wide"
          style={{ color: agent.color }}
        >
          {agent.name}
        </div>
        {agent.project && (
          <div className="text-[9px] text-zinc-500">{agent.project}</div>
        )}
      </div>
    </motion.div>
  );
}
