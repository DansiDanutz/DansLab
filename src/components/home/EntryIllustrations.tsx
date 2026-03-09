import { Monitor, Sparkles } from "lucide-react";
import { DanAvatar } from "@/components/avatars";

export function DanPortraitCard() {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-center transition hover:border-blue-500/40 hover:bg-zinc-900">
      <div className="relative mx-auto h-32 w-32">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-blue-400/40 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.26),rgba(15,23,42,0.96))] shadow-[0_0_36px_rgba(59,130,246,0.22)]">
          <div className="absolute inset-3 rounded-[1.3rem] border border-white/10" />
          <div className="absolute -top-1 right-3 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
          <DanAvatar size="xl" className="h-16 w-16 ring-2 ring-white/10" />
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
        Myself
      </p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">Dan</p>
      <p className="mt-2 text-sm text-zinc-500">
        Human operator at the edge of the lab.
      </p>
    </div>
  );
}

export function LobsterCard() {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-center transition hover:border-orange-400/40 hover:bg-zinc-900">
      <div className="relative mx-auto h-32 w-32">
        <div className="absolute inset-0 rounded-full bg-orange-400/10 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-[floatGentle_4.5s_ease-in-out_infinite]">
          <svg viewBox="0 0 160 160" className="h-full w-full">
            <defs>
              <linearGradient id="lobsterShell" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="55%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="82" rx="34" ry="42" fill="url(#lobsterShell)" />
            <ellipse cx="80" cy="65" rx="26" ry="24" fill="#fb923c" opacity="0.55" />
            <path d="M52 48c-14-12-24-10-28 2 13 2 22 7 28 16" fill="none" stroke="#fdba74" strokeWidth="7" strokeLinecap="round" />
            <path d="M108 48c14-12 24-10 28 2-13 2-22 7-28 16" fill="none" stroke="#fdba74" strokeWidth="7" strokeLinecap="round" />
            <path d="M43 59c-17 2-26 10-26 22 14-1 24 2 31 10" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
            <path d="M117 59c17 2 26 10 26 22-14-1-24 2-31 10" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
            <circle cx="68" cy="56" r="4" fill="#082f49" />
            <circle cx="92" cy="56" r="4" fill="#082f49" />
            <path d="M64 101 48 124" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <path d="M78 111 68 136" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <path d="M96 111 106 136" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <path d="M108 101 124 124" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
        Lobster
      </p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">Mascot</p>
      <p className="mt-2 text-sm text-zinc-500">
        The weird little energy source behind the operation.
      </p>
    </div>
  );
}

interface PcPortalCardProps {
  activating?: boolean;
}

export function PcPortalCard({ activating = false }: PcPortalCardProps) {
  return (
    <div
      className={`group rounded-3xl border border-cyan-500/35 bg-cyan-500/10 p-5 text-center transition hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-500/15 ${
        activating ? "scale-[1.03] border-cyan-300 bg-cyan-500/20" : ""
      }`}
    >
      <div className="relative mx-auto h-32 w-32">
        <div
          className={`absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-500 ${
            activating ? "scale-125 bg-cyan-300/25 blur-3xl" : ""
          }`}
        />
        <div
          className={`absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-cyan-400/45 bg-slate-950/90 shadow-[0_0_34px_rgba(34,211,238,0.24)] transition-all duration-500 ${
            activating ? "scale-110 shadow-[0_0_58px_rgba(34,211,238,0.45)]" : ""
          }`}
        >
          <div className="absolute inset-3 rounded-[1.3rem] border border-cyan-400/20" />
          <div
            className={`absolute inset-[18px] overflow-hidden rounded-[1rem] border border-cyan-400/25 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.22),rgba(15,23,42,0.96))] transition-all duration-500 ${
              activating ? "border-cyan-300/50" : ""
            }`}
          >
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)", backgroundSize: "14px 14px" }} />
            <div
              className={`absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all duration-500 ${
                activating ? "scale-[2.4] opacity-80" : ""
              }`}
            />
            <Sparkles className="absolute right-2 top-2 text-cyan-200/70" size={12} />
          </div>
          <Monitor className="relative text-cyan-300" size={56} strokeWidth={1.5} />
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
        PC
      </p>
      <p className="mt-1 text-lg font-semibold text-white">
        Click to enter the lab
      </p>
      <p className="mt-2 text-sm text-cyan-100/70">
        Open the internal graph with David and the OpenClaw team.
      </p>
    </div>
  );
}
