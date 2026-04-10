"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Shield, Sparkles, Wrench } from "lucide-react";
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

const floatMap: Record<AgentDef["type"], { distance: number; duration: number }> = {
  main: { distance: 5, duration: 4.8 },
  support: { distance: 3, duration: 4.2 },
  infra: { distance: 4, duration: 5.4 },
  channel: { distance: 2.5, duration: 3.8 },
  slack: { distance: 2.5, duration: 3.6 },
};

const TEAM_AVATAR_SOURCES: Partial<Record<AgentDef["id"], string>> = {
  dan: "/avatars/dan.jpg",
  dexter: "/avatars/dexter.jpg",
  nano: "/avatars/nano.svg",
  memo: "/avatars/memo.jpg",
  sienna: "/avatars/sienna.jpg",
};

function ClawGlyph({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
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
  const avatarSrc = TEAM_AVATAR_SOURCES[agent.id];

  if (avatarSrc) {
    return (
      <div
        className={`overflow-hidden rounded-full border border-white/15 ${
          isHighlighted ? "scale-105" : ""
        }`}
        style={{ width: 52, height: 52 }}
      >
        <img
          src={avatarSrc}
          alt={agent.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
    );
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
  const float = floatMap[agent.type];
  const driftSeed = agent.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const floatDelay = (driftSeed % 10) * 0.17;
  const isOpenClawAgent = agent.id.startsWith("openclaw-");
  const nodeRadiusClass = isOpenClawAgent ? "rounded-[14px]" : "rounded-full";
  const labelRadiusClass = isOpenClawAgent ? "rounded-[10px]" : "rounded-full";

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
        y: [0, -float.distance, 0, float.distance * 0.45, 0],
      }}
      whileHover={{ scale: 1.12 }}
      transition={{
        scale: { type: "spring", stiffness: 260, damping: 20 },
        opacity: { duration: 0.25 },
        y: {
          duration: float.duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Pulse ring */}
      {(isActive || isHighlighted) && (
        <motion.div
          className={`absolute ${nodeRadiusClass}`}
          style={{
            width: size.ring,
            height: size.ring,
            border: `2px solid ${agent.color}`,
            opacity: isOpenClawAgent ? 0.28 : 0.5,
            boxShadow: isOpenClawAgent
              ? `inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 18px ${agent.glow}`
              : undefined,
          }}
          animate={{
            scale: isOpenClawAgent ? [1, 1.12, 1] : [1, 1.4, 1],
            opacity: isOpenClawAgent ? [0.22, 0.05, 0.22] : [0.5, 0, 0.5],
          }}
          transition={{
            duration: isOpenClawAgent ? 2.6 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Node circle */}
      <div
        className={`${nodeRadiusClass} flex items-center justify-center font-bold relative`}
        style={{
          width: size.outer,
          height: size.outer,
          background: isOpenClawAgent
            ? `linear-gradient(145deg, rgba(7,11,22,0.98), rgba(9,14,27,0.94) 45%, ${agent.color}22 100%)`
            : `radial-gradient(circle at 30% 30%, ${agent.color}33, ${agent.color}11)`,
          border: `2px solid ${agent.color}`,
          boxShadow: isActive || isHighlighted
            ? `0 0 20px ${agent.glow}, 0 0 40px ${agent.glow}`
            : `0 0 8px ${agent.glow}`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {isOpenClawAgent && (
          <>
            <div
              className={`absolute inset-[5px] ${nodeRadiusClass} opacity-[0.18]`}
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
                backgroundSize: "9px 9px",
              }}
            />
            <div
              className={`absolute inset-[9px] ${nodeRadiusClass} border border-white/12`}
            />
            <div
              className={`absolute inset-[13px] ${nodeRadiusClass} opacity-60`}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 28%, transparent 28%, transparent 72%, rgba(255,255,255,0.06) 72%, rgba(255,255,255,0.14))",
              }}
            />
            <motion.div
              className={`absolute inset-[7px] ${nodeRadiusClass} pointer-events-none`}
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.12) 48%, transparent 100%)",
                mixBlendMode: "screen",
              }}
              animate={{ y: [-10, 10, -10], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
            />
          </>
        )}
        <div
          className={`relative z-10 flex items-center justify-center transition-transform ${
            isHighlighted ? "scale-105" : ""
          }`}
        >
          {renderGlyph(agent, isHighlighted)}
        </div>
      </div>

      {/* Label */}
      <div className="pointer-events-none mt-1 text-center whitespace-nowrap">
        <div
          className={`inline-flex max-w-[7.5rem] items-center justify-center border border-white/10 bg-zinc-950/78 px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-[0_6px_16px_rgba(0,0,0,0.22)] backdrop-blur-md ${labelRadiusClass}`}
          style={{ color: agent.color }}
        >
          <span className="truncate">{agent.name}</span>
        </div>
        {agent.project && (
          <div className={`mt-1 inline-flex max-w-[8.5rem] items-center justify-center border border-zinc-800/80 bg-zinc-950/72 px-2 py-0.5 text-[9px] text-zinc-500 shadow-[0_4px_12px_rgba(0,0,0,0.18)] backdrop-blur-md ${labelRadiusClass}`}>
            <span className="truncate">{agent.project}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
