import Link from "next/link";
import {
  ArrowRight,
  Network,
  Bot,
  DollarSign,
  Globe,
  Users,
  Zap,
  Activity,
  ChevronRight,
} from "lucide-react";
import { DanAvatar } from "@/components/avatars";

const stats = [
  { label: "Active Agents", value: "30+", icon: Bot },
  { label: "Products", value: "5", icon: Globe },
  { label: "Channels", value: "3", icon: Users },
  { label: "Revenue Streams", value: "2", icon: DollarSign },
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
  { name: "Dexter", role: "General Manager", icon: "🎯" },
  { name: "David", role: "Fleet Orchestrator", icon: "🖥️" },
  { name: "Memo", role: "Project Manager", icon: "📋" },
  { name: "Sienna", role: "Crypto Trader", icon: "📈" },
  { name: "Nano", role: "Nervix Orchestrator", icon: "🔧" },
  { name: "GSD", role: "Task Execution", icon: "⚡" },
];

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0a0a 0%, #0a0505 45%, #000000 100%)",
      }}
    >
      {/* Grid background - nervix style */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(192,57,43,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(192,57,43,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "gridDrift 25s linear infinite",
        }}
      />

      {/* Glow orbs - red/gold nervix palette */}
      <div className="absolute top-[15%] left-[20%] h-[500px] w-[500px] rounded-full bg-[#c0392b]/[0.06] blur-[150px]" />
      <div className="absolute bottom-[25%] right-[20%] h-[400px] w-[400px] rounded-full bg-[#d4a017]/[0.05] blur-[120px]" />
      <div className="absolute top-[50%] right-[30%] h-[300px] w-[300px] rounded-full bg-[#8b1a1a]/[0.08] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* ───── NAVBAR ───── */}
        <nav className="flex items-center justify-between border-b border-[#c0392b]/10 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            {/* OpenClaw Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#c0392b] to-[#8b1a1a] shadow-[0_0_20px_rgba(192,57,43,0.3)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M7 14c-3-0.5-5 1-5.5 3.5 2.5 1 5 0.5 7-1M17 14c3-0.5 5 1 5.5 3.5-2.5 1-5 0.5-7-1M9 8c-1.2 1.2-2 3-2 5 0 3 2.5 5.5 5 5.5s5-2.5 5-5.5c0-2-0.8-3.8-2-5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="10.5" r="1" fill="white" />
                <circle cx="14" cy="10.5" r="1" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              DansLab
            </span>
            <span className="rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-2 py-0.5 text-[9px] font-mono font-semibold text-[#e74c3c]">
              v2
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="rounded-full border border-[#c0392b]/20 px-4 py-1.5 text-xs text-zinc-400 transition hover:border-[#c0392b]/40 hover:text-[#e74c3c]"
            >
              Lab
            </Link>
            <Link
              href="/ecosystem"
              className="flex items-center gap-1.5 rounded-full bg-[#c0392b] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c] hover:shadow-[0_0_30px_rgba(192,57,43,0.45)]"
            >
              <Activity size={12} />
              Ecosystem
            </Link>
          </div>
        </nav>

        {/* ───── HERO ───── */}
        <section className="pb-12 pt-16 sm:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Status badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e74c3c]">
              <span className="h-2 w-2 rounded-full bg-[#c0392b] shadow-[0_0_12px_rgba(192,57,43,0.6)]" style={{ animation: "pulse-claw 2s ease-in-out infinite" }} />
              Powered by OpenClaw — Autonomous AI Lab
            </div>

            {/* OpenClaw Hero Icon */}
            <div className="relative mb-8 inline-block">
              <div className="relative">
                <svg viewBox="0 0 120 120" className="mx-auto h-28 w-28 sm:h-36 sm:w-36" style={{ animation: "floatGentle 4s ease-in-out infinite" }}>
                  <defs>
                    <linearGradient id="clawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e74c3c" />
                      <stop offset="50%" stopColor="#c0392b" />
                      <stop offset="100%" stopColor="#8b1a1a" />
                    </linearGradient>
                    <filter id="clawGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" />
                    </filter>
                  </defs>
                  {/* Body */}
                  <ellipse cx="60" cy="62" rx="22" ry="28" fill="url(#clawGrad)" opacity="0.9" />
                  <ellipse cx="60" cy="52" rx="16" ry="16" fill="#e74c3c" opacity="0.3" />
                  {/* Left claw */}
                  <path d="M40 38c-10-8-18-7-20 2 9 1 16 5 20 11" fill="none" stroke="#e74c3c" strokeWidth="5" strokeLinecap="round" />
                  <path d="M33 48c-12 2-19 8-19 16 10-1 18 1 23 7" fill="none" stroke="#c0392b" strokeWidth="6" strokeLinecap="round" />
                  {/* Right claw */}
                  <path d="M80 38c10-8 18-7 20 2-9 1-16 5-20 11" fill="none" stroke="#e74c3c" strokeWidth="5" strokeLinecap="round" />
                  <path d="M87 48c12 2 19 8 19 16-10-1-18 1-23 7" fill="none" stroke="#c0392b" strokeWidth="6" strokeLinecap="round" />
                  {/* Eyes */}
                  <circle cx="52" cy="46" r="3" fill="#0a0505" />
                  <circle cx="68" cy="46" r="3" fill="#0a0505" />
                  <circle cx="53" cy="45" r="1" fill="#e74c3c" opacity="0.5" />
                  <circle cx="69" cy="45" r="1" fill="#e74c3c" opacity="0.5" />
                  {/* Legs */}
                  <path d="M48 80l-10 16" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
                  <path d="M56 86l-4 18" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
                  <path d="M72 80l10 16" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
                  <path d="M64 86l4 18" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-[#c0392b]/20 blur-3xl" />
              </div>
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-[#e74c3c] via-[#d4a017] to-[#e74c3c] bg-clip-text text-transparent" style={{ textShadow: "0 0 40px rgba(192,57,43,0.3)" }}>
                DansLab
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              A human-led AI ecosystem where{" "}
              <span className="font-semibold text-[#d4a017]">Dan</span>{" "}
              orchestrates 30+ autonomous agents across 5 products — building,
              shipping, learning, and earning around the clock.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/ecosystem"
                className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(192,57,43,0.35)] transition hover:bg-[#e74c3c] hover:shadow-[0_0_40px_rgba(192,57,43,0.5)]"
              >
                <Network size={18} />
                View Ecosystem
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-8 py-3.5 text-sm font-medium text-white transition hover:border-[#c0392b]/40 hover:bg-[#c0392b]/20"
              >
                Enter the Lab
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#c0392b]/15 bg-[#0d0606]/60 px-4 py-3.5 backdrop-blur-sm transition hover:border-[#c0392b]/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon size={14} className="text-[#c0392b]" />
                    <span className="text-2xl font-bold text-white">
                      {value}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── OPERATOR + MASCOT ───── */}
        <section className="border-t border-[#c0392b]/10 py-14">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dan card */}
            <div className="group rounded-2xl border border-[#c0392b]/15 bg-[#0d0606]/60 p-6 text-center backdrop-blur-sm transition hover:border-[#c0392b]/30">
              <div className="relative mx-auto mb-4 h-20 w-20">
                <div className="absolute inset-0 rounded-full bg-[#c0392b]/10 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#c0392b]/30 bg-gradient-to-br from-[#1a0a0a] to-[#0a0505] shadow-[0_0_30px_rgba(192,57,43,0.15)]">
                  <DanAvatar size="xl" className="h-14 w-14 ring-2 ring-[#c0392b]/20" />
                  <div className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0505] bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                Human Operator
              </p>
              <p className="mt-1 text-lg font-bold text-white">Dan</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Romanian entrepreneur commanding the entire lab via Telegram DM to Dexter.
              </p>
            </div>

            {/* OpenClaw Lobster mascot - RED */}
            <div className="group rounded-2xl border border-[#c0392b]/15 bg-[#0d0606]/60 p-6 text-center backdrop-blur-sm transition hover:border-[#c0392b]/30">
              <div className="relative mx-auto mb-4 h-20 w-20">
                <div className="absolute inset-0 rounded-full bg-[#c0392b]/15 blur-xl" />
                <div className="relative" style={{ animation: "floatGentle 4.5s ease-in-out infinite" }}>
                  <svg viewBox="0 0 80 80" className="h-20 w-20">
                    <defs>
                      <linearGradient id="lobRed" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e74c3c" />
                        <stop offset="50%" stopColor="#c0392b" />
                        <stop offset="100%" stopColor="#8b1a1a" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="40" cy="42" rx="16" ry="20" fill="url(#lobRed)" />
                    <ellipse cx="40" cy="34" rx="12" ry="11" fill="#e74c3c" opacity="0.4" />
                    {/* Claws */}
                    <path d="M26 26c-7-6-12-5-14 1 6 1 11 4 14 8" fill="none" stroke="#e74c3c" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M54 26c7-6 12-5 14 1-6 1-11 4-14 8" fill="none" stroke="#e74c3c" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M22 32c-8 1-13 5-13 11 7-0.5 12 1 16 5" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
                    <path d="M58 32c8 1 13 5 13 11-7-0.5-12 1-16 5" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
                    {/* Eyes */}
                    <circle cx="35" cy="30" r="2" fill="#0a0505" />
                    <circle cx="45" cy="30" r="2" fill="#0a0505" />
                    {/* Legs */}
                    <path d="M33 54l-7 11" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M39 58l-3 12" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M47 54l7 11" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" />
                    <path d="M41 58l3 12" stroke="#e74c3c" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                OpenClaw Mascot
              </p>
              <p className="mt-1 text-lg font-bold text-[#e74c3c]">Lobster</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                The red claw — symbol of the OpenClaw protocol powering all agents.
              </p>
            </div>

            {/* PC Portal */}
            <Link
              href="/ecosystem"
              className="group rounded-2xl border border-[#c0392b]/25 bg-[#c0392b]/[0.06] p-6 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#c0392b]/40 hover:bg-[#c0392b]/10 sm:col-span-2 lg:col-span-1"
            >
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#c0392b]/10 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[#c0392b]/30 bg-[#0a0505] shadow-[0_0_30px_rgba(192,57,43,0.2)]">
                  <div
                    className="absolute inset-3 rounded-xl border border-[#c0392b]/20 bg-gradient-to-br from-[#c0392b]/10 to-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(192,57,43,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(192,57,43,0.15) 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                  <Network size={28} className="relative text-[#e74c3c]" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                Agent Network
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                View Ecosystem
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#e74c3c]">
                Open the live graph <ChevronRight size={12} />
              </p>
            </Link>
          </div>
        </section>

        {/* ───── AGENT ROLES ───── */}
        <section className="border-t border-[#c0392b]/10 py-12">
          <p className="mb-8 text-center text-[10px] uppercase tracking-[0.35em] text-zinc-600">
            Core Agent Team
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {agentRoles.map((a) => (
              <div
                key={a.name}
                className="rounded-xl border border-[#c0392b]/10 bg-[#0d0606]/50 px-3 py-4 text-center transition hover:border-[#c0392b]/25"
              >
                <span className="text-2xl">{a.icon}</span>
                <p className="mt-2 text-xs font-bold text-white">{a.name}</p>
                <p className="mt-0.5 text-[10px] text-zinc-500">{a.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── PRODUCTS ───── */}
        <section className="border-t border-[#c0392b]/10 py-12">
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-zinc-600">
            Products powered by DansLab
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {products.map((p) => (
              <div
                key={p.name + p.agent}
                className="group rounded-xl border border-[#c0392b]/10 bg-[#0d0606]/50 p-4 transition hover:border-[#c0392b]/25 hover:bg-[#0d0606]/70"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: p.color,
                      boxShadow: `0 0 8px ${p.color}60`,
                    }}
                  />
                  <span className="text-xs font-semibold text-zinc-200">
                    {p.name}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  <span style={{ color: p.color }} className="font-medium">
                    {p.agent}
                  </span>{" "}
                  &middot; {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <div className="border-t border-[#c0392b]/10 py-8 text-center">
          <p className="text-xs text-zinc-600">
            Built by Dan &middot; Powered by{" "}
            <span className="text-[#c0392b]">OpenClaw</span> &middot;
            Orchestrated by David
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-claw {
              0%, 100% { box-shadow: 0 0 12px rgba(192,57,43,0.3); }
              50% { box-shadow: 0 0 24px rgba(192,57,43,0.6), 0 0 48px rgba(192,57,43,0.2); }
            }
          `,
        }}
      />
    </main>
  );
}
