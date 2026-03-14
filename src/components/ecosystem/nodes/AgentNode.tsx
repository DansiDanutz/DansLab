"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Shield, Wrench } from "lucide-react";
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

/* Maps agent id to avatar file extension in /public/avatars/ */
const avatarAgents: Record<string, string> = {
  dan: "jpg", david: "jpg", dexter: "jpg",
  nano: "png", sienna: "jpg", memo: "jpg",
};

function AgentAvatar({
  agentId, size, color, initials,
}: {
  agentId: string; size: number; color: string; initials: string;
}) {
  const [imgError, setImgError] = useState(false);
  const ext = avatarAgents[agentId] || "png";

  if (imgError) {
    return (
      <span className="text-sm font-bold" style={{ color }}>
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/avatars/${agentId}.${ext}`}
      alt={agentId}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      onError={() => setImgError(true)}
    />
  );
}

function ClawGlyph({ color, label }: { color: string; label: string }) {
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
      <text x="32" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
        {label}
      </text>
    </svg>
  );
}

function renderGlyph(agent: AgentDef, isHighlighted: boolean) {
  if (agent.id in avatarAgents) {
    const imgSize = agent.type === "main" || agent.id === "dan" ? 54 : 36;
    return (
      <AgentAvatar
        agentId={agent.id}
        size={imgSize}
        color={agent.color}
        initials={agent.initials}
      />
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
    <span className={`${sizeMap[agent.type].text} font-mono`} style={{ color: agent.color }}>
      {agent.initials}
    </span>
  );
}

export default function AgentNode({
  agent, isActive, isHighlighted, isDimmed, onClick,
}: AgentNodeProps) {
  const isOpenClaw = agent.id.startsWith("openclaw-");
  const size = isOpenClaw
    ? { outer: 64, inner: 52, text: "text-sm" as const, ring: 68 }
    : sizeMap[agent.type];
  const borderRadius = isOpenClaw ? "30%" : "50%";

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1 cursor-pointer select-none"
      style={{ transform: "translate(-50%, -50%)", zIndex: isActive ? 20 : 10 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isDimmed ? 0.3 : 1 }}
      whileHover={{ scale: 1.12 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {(isActive || isHighlighted) && (
        <motion.div
          className="absolute"
          style={{
            width: size.ring ?? size.outer + 4,
            height: size.ring ?? size.outer + 4,
            border: `2px solid ${agent.color}`,
            borderRadius, opacity: 0.5,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div
        className="flex items-center justify-center font-bold relative overflow-hidden"
        style={{
          width: size.outer, height: size.outer, borderRadius,
          background: `radial-gradient(circle at 30% 30%, ${agent.color}33, ${agent.color}11)`,
          border: `2px solid ${agent.color}`,
          boxShadow: isActive || isHighlighted
            ? `0 0 20px ${agent.glow}, 0 0 40px ${agent.glow}`
            : `0 0 8px ${agent.glow}`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className={`flex items-center justify-center transition-transform ${isHighlighted ? "scale-105" : ""}`}>
          {renderGlyph(agent, isHighlighted)}
        </div>
      </div>

      <div className="text-center whitespace-nowrap">
        <div className="text-[10px] font-semibold tracking-wide" style={{ color: agent.color }}>
          {agent.name}
        </div>
        {agent.project && <div className="text-[9px] text-zinc-500">{agent.project}</div>}
      </div>
    </motion.div>
  );
}
