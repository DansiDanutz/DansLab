"use client";

import Link from "next/link";
import { DocHero, GradientText } from "@/components/docs/DocHero";
import { DocCard, DocCardGrid } from "@/components/docs/DocCard";
import { agents } from "@/components/ecosystem/data/agents";
import { scenarios } from "@/components/ecosystem/scenarios/scenarioData";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function DocsPage() {
  // Count agents by type
  const mainAgents = agents.filter((a) => a.type === "main").length;
  const openclawAgents = agents.filter((a) => a.type === "support").filter((a) => a.id.startsWith("openclaw")).length;
  const supportAgents = agents.filter((a) => a.type === "support").length;

  const stats = [
    { value: agents.length, label: "Total Agents", icon: "🤖", gradient: "from-blue-400 to-cyan-400" },
    { value: scenarios.length, label: "Workflows", icon: "⚡", gradient: "from-purple-400 to-pink-400" },
    { value: mainAgents, label: "Main Agents", icon: "🎯", gradient: "from-emerald-400 to-teal-400" },
    { value: supportAgents, label: "Support Systems", icon: "🔧", gradient: "from-orange-400 to-amber-400" },
  ];

  return (
    <div>
      <DocHero
        title="DansLab Documentation"
        description="Comprehensive guide to the AI-first software company architecture, agent ecosystem, and operational workflows."
        badge="v1.0"
        icon="📚"
      />

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={statVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-950/70 hover:shadow-lg"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <div className="relative">
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="mb-2 block text-2xl"
              >
                {stat.icon}
              </motion.span>
              <p className="text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Executive Summary */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 shadow-[0_0_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_0_60px_rgba(59,130,246,0.1)]">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <h2 className="relative mb-3 text-xl font-semibold text-zinc-100">
            What is <GradientText>DansLab</GradientText>?
          </h2>
          <p className="relative text-base leading-7 text-zinc-400">
            DansLab is an AI-native software company built on autonomous agents.
            At its core, <span className="text-zinc-300 font-medium">Dan</span> (human
            founder) sets direction, <span className="text-zinc-300 font-medium">David</span>{" "}
            (main orchestrator) coordinates work, and specialized agents handle
            domain execution across creator tools, agent creation, framework
            building, and crypto trading.
          </p>
          <div className="relative mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 transition-all hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span>👤</span>
              <span>Human</span>
            </motion.span>
            <span className="text-zinc-700">→</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 transition-all hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span>🧠</span>
              <span>Orchestrator</span>
            </motion.span>
            <span className="text-zinc-700">→</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 transition-all hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span>⚡</span>
              <span>Specialists</span>
            </motion.span>
            <span className="text-zinc-700">→</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 transition-all hover:border-zinc-600 hover:bg-zinc-900"
            >
              <span>⚙️</span>
              <span>Execution</span>
            </motion.span>
          </div>
        </div>
      </motion.section>

      {/* Main Sections */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.05 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Explore Documentation
        </h2>
        <DocCardGrid>
          <DocCard
            title="Agents"
            description="Meet all 25+ agents in the ecosystem - from main orchestrators to specialized support systems."
            icon="🤖"
            href="/docs/agents"
            badge={`${agents.length} Agents`}
            delay={0}
          />
          <DocCard
            title="Workflows"
            description="Watch operational scenarios in action - bug fixes, learning loops, feature delivery, and more."
            icon="⚡"
            href="/docs/workflows"
            badge={`${scenarios.length} Scenarios`}
            delay={0.05}
          />
          <DocCard
            title="Architecture"
            description="Understand the system topology, company model, and physical infrastructure."
            icon="🏗️"
            href="/docs/architecture"
            delay={0.1}
          />
          <DocCard
            title="OpenClaw Team"
            description="The internal specialist layer - research, build, review, automation, and operations."
            icon="🦞"
            href="/docs/openclaw"
            delay={0.15}
          />
          <DocCard
            title="Support Systems"
            description="Infrastructure that keeps the lab running - monitoring, deployment, memory, and payments."
            icon="🔧"
            href="/docs/support"
            delay={0.2}
          />
          <DocCard
            title="Projects"
            description="Repository and product architecture - DansLab, CrawdBot, MyWork, and more."
            icon="📦"
            href="/docs/projects"
            delay={0.25}
          />
        </DocCardGrid>
      </motion.section>

      {/* Quick Links */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mt-10"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/lab", icon: "🔬", label: "Lab View" },
            { href: "/ecosystem", icon: "🌐", label: "Ecosystem Map" },
            { href: "https://nervix.ai", icon: "🚀", label: "Nervix Platform", external: true },
          ].map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-900/20"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-900/20"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
