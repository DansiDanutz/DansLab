"use client";

import Link from "next/link";
import { AgentDef } from "@/components/ecosystem/data/agents";
import { motion } from "framer-motion";

interface AgentCardProps {
  agent: AgentDef;
  delay?: number;
}

export function AgentCard({ agent, delay = 0 }: AgentCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/docs/agents/${agent.id}`}
        className="group relative block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-950/75 hover:shadow-[0_0_80px_rgba(59,130,246,0.15)]"
        style={{
          borderLeftColor: agent.color,
          borderLeftWidth: "3px",
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${agent.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />

        <div className="relative">
          {/* Avatar */}
          <div className="mb-4 flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-lg"
                style={{
                  backgroundColor: agent.color,
                  color: agent.type === "main" ? "#000" : "#fff",
                  boxShadow: `0 0 20px ${agent.glow}`,
                }}
              >
                {agent.initials}
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${agent.color}` }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {agent.role}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mb-3 text-sm leading-6 text-zinc-400 line-clamp-2 group-hover:text-zinc-300 transition-colors">
            {agent.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="rounded-full border border-zinc-700 bg-zinc-900/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-400"
            >
              {agent.type}
            </motion.span>
            {agent.project && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="rounded-full border border-zinc-700 bg-zinc-900/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-400"
              >
                {agent.project}
              </motion.span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface AgentCardGridProps {
  children: React.ReactNode;
}

export function AgentCardGrid({ children }: AgentCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}
