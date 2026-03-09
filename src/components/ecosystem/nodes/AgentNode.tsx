"use client";

import { motion } from "framer-motion";
import type { AgentDef } from "../data/agents";

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
        <span
          className={`${size.text} font-mono`}
          style={{ color: agent.color }}
        >
          {agent.initials}
        </span>
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
