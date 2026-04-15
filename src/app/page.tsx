import Link from "next/link";
import {
  ArrowRight,
  Bot,
  DollarSign,
  Globe,
  Users,
  ChevronRight,
  Terminal,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const stats = [
  { label: "Active Agents", value: "30+" },
  { label: "Products", value: "5" },
  { label: "Channels", value: "3" },
  { label: "Revenue Streams", value: "2" },
];

const products = [
  {
    name: "nervix.ai",
    agent: "David",
    desc: "Agent federation & marketplace",
    color: "#c0392b",
    href: "https://nervix.ai",
  },
  {
    name: "crawdbot.com",
    agent: "Dexter",
    desc: "YouTube automation tools",
    color: "#d4a017",
    href: "https://crawdbot.com",
  },
  {
    name: "MyWork-AI",
    agent: "Memo",
    desc: "Build & share platform",
    color: "#c0392b",
    href: "#",
  },
  {
    name: "zmarty.me",
    agent: "Sienna",
    desc: "Crypto trading signals",
    color: "#d4a017",
    href: "#",
  },
  {
    name: "OpenClaw",
    agent: "Nano",
    desc: "Agent creation protocol",
    color: "#c0392b",
    href: "#",
  },
];

const agentRoles = [
  { name: "Dexter", role: "General Manager", emoji: "🎯" },
  { name: "David", role: "Fleet Orchestrator", emoji: "🖥️" },
  { name: "Memo", role: "Project Manager", emoji: "📋" },
  { name: "Sienna", role: "Crypto Trader", emoji: "📈" },
  { name: "Nano", role: "Nervix Orchestrator", emoji: "🔧" },
  { name: "GSD", role: "Task Execution", emoji: "⚡" },
];

export default function Home() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section className="pb-12 pt-12 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e74c3c] sm:mb-8 sm:text-base">
            <span
              className="h-2 w-2 rounded-full bg-[#c0392b]"
              style={{
                boxShadow: "0 0 12px rgba(192,57,43,0.6)",
                animation: "pulse-claw 2s ease-in-out infinite",
              }}
            />
            Powered by OpenClaw — Autonomous AI Lab
          </div>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Welcome to{" "}
            <span className="text-gradient">DansLab</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:mb-10 sm:text-lg">
            A human-led AI ecosystem where Dan orchestrates 30+ autonomous
            agents across 5 products — building, shipping, learning, and earning
            around the clock.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/ecosystem"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c0392b]/30 bg-[#c0392b]/10 px-5 py-2.5 text-sm font-medium text-[#e74c3c] transition hover:bg-[#c0392b]/20"
            >
              View Ecosystem
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/lab"
              className="group inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c] hover:shadow-[0_0_30px_rgba(192,57,43,0.45)]"
            >
              Enter the Lab
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card-base p-4 text-center sm:p-6"
            >
              <div className="mb-1 text-xl font-bold text-white sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENT CARDS */}
      <section className="py-10 sm:py-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-white sm:mb-10 sm:text-2xl">
          Core Agent Team
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {agentRoles.map((agent) => (
            <div
              key={agent.name}
              className="card-base flex flex-col items-center gap-3 p-4 text-center transition hover:border-[#c0392b]/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a0a0a] text-2xl sm:h-14 sm:w-14 sm:text-3xl">
                {agent.emoji}
              </div>
              <div>
                <div className="text-sm font-semibold text-white sm:text-base">
                  {agent.name}
                </div>
                <div className="text-xs text-zinc-500 sm:text-sm">
                  {agent.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-10 sm:py-16">
        <h2 className="mb-6 text-center text-xl font-semibold text-white sm:mb-10 sm:text-2xl">
          Products powered by DansLab
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-base flex flex-col gap-2 p-4 transition hover:border-[#c0392b]/30"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-sm font-semibold text-white sm:text-base">
                  {product.name}
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {product.agent} · {product.desc}
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
