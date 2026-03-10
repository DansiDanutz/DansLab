import Link from "next/link";
import { ArrowRight, Network, Zap, Users, Globe, Bot, DollarSign } from "lucide-react";
import {
  DanPortraitCard,
  LobsterCard,
} from "@/components/home/EntryIllustrations";
import PortalEntryLink from "@/components/home/PortalEntryLink";

const stats = [
  { label: "Active Agents", value: "30+", icon: Bot },
  { label: "Projects", value: "5", icon: Globe },
  { label: "Channels", value: "3", icon: Users },
  { label: "Revenue Streams", value: "2", icon: DollarSign },
];

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0c1833 0%, #050a14 45%, #000000 100%)",
      }}
    >
      {/* Animated dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: "gridDrift 20s linear infinite",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-500/8 blur-[120px]" />
      <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-purple-500/8 blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/6 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top nav */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">DansLab</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="rounded-full border border-zinc-800 px-4 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-white"
            >
              Lab
            </Link>
            <Link
              href="/ecosystem"
              className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-300 transition hover:bg-blue-500/20"
            >
              Ecosystem
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="pb-8 pt-12 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left - copy */}
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-800/60 bg-emerald-950/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-emerald-400">
                  Autonomous AI Lab
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  30+ Agents &middot; 5 Products &middot; 1 Vision
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Welcome to
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  DansLab
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                A human-led AI ecosystem where Dan orchestrates 30+ autonomous
                agents across 5 products &mdash; building, shipping, learning,
                and earning around the clock.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.3)] transition hover:shadow-[0_0_32px_rgba(59,130,246,0.45)]"
                >
                  Enter the Lab
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/ecosystem"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
                >
                  <Network size={16} />
                  View Ecosystem
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-zinc-500" />
                      <span className="text-xl font-bold text-white">{value}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - dock */}
            <div className="relative">
              <div className="rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/70 p-5 shadow-[0_0_80px_rgba(14,165,233,0.06)] backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                      Personal Dock
                    </p>
                    <p className="mt-1 text-base font-semibold text-zinc-200">
                      Me + Lobster + PC
                    </p>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/50">
                    <Zap size={12} className="text-cyan-400" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <DanPortraitCard />
                  <LobsterCard />
                  <PortalEntryLink />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products strip */}
        <section className="border-t border-zinc-800/50 py-12">
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-zinc-600">
            Products powered by DansLab
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "nervix.ai", agent: "David", desc: "Agent marketplace", color: "#22c55e" },
              { name: "crawdbot.com", agent: "Dexter", desc: "YouTube tools", color: "#3b82f6" },
              { name: "MyWork-ai", agent: "Memo", desc: "Build & share platform", color: "#f97316" },
              { name: "zmarty.me", agent: "Sienna", desc: "Crypto trading", color: "#ec4899" },
              { name: "nervix.ai", agent: "Nano", desc: "Agent creation", color: "#a855f7" },
            ].map((p) => (
              <div
                key={p.agent}
                className="group rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: p.color, boxShadow: `0 0 8px ${p.color}60` }}
                  />
                  <span className="text-xs font-semibold text-zinc-200">{p.name}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  <span style={{ color: p.color }} className="font-medium">{p.agent}</span> &middot; {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom tagline */}
        <div className="border-t border-zinc-800/30 py-8 text-center">
          <p className="text-xs text-zinc-600">
            Built by Dan &middot; Powered by OpenClaw &middot; Orchestrated by David
          </p>
        </div>
      </div>
    </main>
  );
}
