import Link from "next/link";
import { ArrowRight, Network, Sparkles } from "lucide-react";
import {
  DanPortraitCard,
  LobsterCard,
} from "@/components/home/EntryIllustrations";
import PortalEntryLink from "@/components/home/PortalEntryLink";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #0c1222 0%, #050a14 52%, #000000 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridDrift 20s linear infinite",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            DansLab Entry
          </span>
          <span className="rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-400">
            Me + Lobster + PC
          </span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/65 p-6 shadow-[0_0_80px_rgba(59,130,246,0.12)] backdrop-blur-xl sm:p-10">
          <div className="absolute -left-16 top-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10">
              <h1 className="max-w-4xl text-5xl font-bold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Step into
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-300 bg-clip-text text-transparent">
                  {" "}
                  DansLab
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                Start from the personal dock, then enter the internal lab where
                Dan, David on Mac Studio, and the OpenClaw team coordinate the
                system.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/15 px-5 py-3 text-sm font-medium text-blue-100 transition hover:border-blue-400 hover:bg-blue-500/20"
                >
                  Enter DansLab
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/ecosystem"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  <Network size={16} />
                  Ecosystem
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ["Human Anchor", "Dan at the edge of the system"],
                  ["OpenClaw Core", "David + internal agent mesh"],
                  ["Live Map", "Expanded ecosystem interactions"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-4"
                  >
                    <p className="text-sm font-semibold text-zinc-100">
                      {title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[1.75rem] border border-zinc-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.92))] p-6 shadow-[0_0_60px_rgba(14,165,233,0.08)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                      Dock
                    </p>
                    <p className="mt-1 text-lg font-semibold text-zinc-100">
                      Personal launch scene
                    </p>
                  </div>
                  <Sparkles className="text-cyan-300" size={18} />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <DanPortraitCard />
                  <LobsterCard />

                  <PortalEntryLink />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
