"use client";

import Link from "next/link";
import { DocHero } from "@/components/docs/DocHero";
import { DocCard, DocCardGrid } from "@/components/docs/DocCard";
import { motion } from "framer-motion";

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

export default function OverviewPage() {
  return (
    <div>
      <DocHero
        title="Documentation Overview"
        description="Quick start guide to the DansLab documentation and key concepts."
        badge="Getting Started"
        icon="📋"
      />

      {/* Welcome Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-semibold text-zinc-100">
            Welcome to DansLab
          </h2>
          <p className="text-base leading-7 text-zinc-400">
            DansLab is an AI-native software company built on autonomous agents. This
            documentation will help you understand the architecture, explore the agent
            ecosystem, and learn how workflows operate across the system.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5">
              <span>👤</span>
              <span>Human in the loop</span>
            </span>
            <span className="text-zinc-700">→</span>
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5">
              <span>🧠</span>
              <span>AI Orchestration</span>
            </span>
            <span className="text-zinc-700">→</span>
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5">
              <span>⚡</span>
              <span>Specialized Execution</span>
            </span>
          </div>
        </div>
      </motion.section>

      {/* Quick Start */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Quick Start
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
          >
            <span className="text-2xl mb-2 block">1</span>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              Explore the Architecture
            </h3>
            <p className="text-xs text-zinc-500">
              Start with the Architecture section to understand how Dan, David, and
              the agent ecosystem work together.
            </p>
            <Link
              href="/docs/architecture"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              View Architecture →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
          >
            <span className="text-2xl mb-2 block">2</span>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              Meet the Agents
            </h3>
            <p className="text-xs text-zinc-500">
              Browse all 25+ agents - from main orchestrators to specialized support
              systems.
            </p>
            <Link
              href="/docs/agents"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              View Agents →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
          >
            <span className="text-2xl mb-2 block">3</span>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              Watch Workflows
            </h3>
            <p className="text-xs text-zinc-500">
              See operational scenarios in action - bug fixes, learning loops, and
              feature delivery.
            </p>
            <Link
              href="/docs/workflows"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              View Workflows →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
          >
            <span className="text-2xl mb-2 block">4</span>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">
              Understand OpenClaw
            </h3>
            <p className="text-xs text-zinc-500">
              Learn about the internal specialist team that handles research,
              build, review, and automation.
            </p>
            <a
              href="/docs/openclaw"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              View OpenClaw →
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Concepts */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Key Concepts
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-blue-400">🏗️</span>
              Hub-and-Spoke Model
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Dan (human) at the center, connected to Mac Studio (infrastructure),
              which orchestrates David (main AI) and coordinates all specialized agents.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-green-400">🦞</span>
              OpenClaw Specialization
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Internal specialist agents for research, build, review, automation,
              operations, moderation, and amplification.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              Operational Scenarios
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Predefined workflows for bug fixes, learning loops, new features, revenue
              generation, and internal coordination.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-orange-400">🔧</span>
              Support Infrastructure
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Monitoring, deployment, memory, learning, model optimization, payments,
              and communication systems keep everything running.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Documentation Sections */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Documentation Sections
        </h2>
        <DocCardGrid>
          <DocCard
            title="Architecture"
            description="System topology, company model, and runtime layers explained."
            icon="🏗️"
            href="/docs/architecture"
            delay={0}
          />
          <DocCard
            title="Agents"
            description="All agents with roles, connections, and workflow participation."
            icon="🤖"
            href="/docs/agents"
            delay={0.05}
          />
          <DocCard
            title="Workflows"
            description="Animated scenarios showing operational flows in action."
            icon="⚡"
            href="/docs/workflows"
            delay={0.1}
          />
          <DocCard
            title="OpenClaw Team"
            description="Specialist agents and their operating sequence."
            icon="🦞"
            href="/docs/openclaw"
            delay={0.15}
          />
          <DocCard
            title="Support Systems"
            description="Infrastructure keeping the lab operational."
            icon="🔧"
            href="/docs/support"
            delay={0.2}
          />
          <DocCard
            title="Projects"
            description="Repository and product architecture overview."
            icon="📦"
            href="/docs/projects"
            delay={0.25}
          />
        </DocCardGrid>
      </motion.section>
    </div>
  );
}
