"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Users, X } from "lucide-react";

export type Variant = "v2" | "v1" | "source";
export type Tier = "human" | "council" | "capital" | "channel" | "pod" | "infra";

export type TeamMember = {
  file: string;
  agentKey: string;
  variant: Variant;
  src: string;
  name: string;
  role: string;
  description: string;
  color: string;
  tier: Tier;
};

const TIER_ORDER: Tier[] = ["human", "council", "capital", "channel", "pod", "infra"];

const TIER_META: Record<Tier, { label: string; subtitle: string }> = {
  human: {
    label: "The Human",
    subtitle: "Dan. The only human in the room.",
  },
  council: {
    label: "Mac Studio Council",
    subtitle: "The fleet's brain. Recurring cast that runs every war-room scene.",
  },
  capital: {
    label: "The Four Capitals",
    subtitle: "Droplet leads. Each one has a city of their own and a signature episode.",
  },
  channel: {
    label: "Channel & Slack",
    subtitle: "Comms wall. Less screen time, but every one has a moment.",
  },
  pod: {
    label: "OpenClaw Pod",
    subtitle: "Internal builders. Ensemble in the bullpen.",
  },
  infra: {
    label: "Infrastructure",
    subtitle: "Rooms, dispatchers, hardware — the unspoken cast.",
  },
};

const VARIANT_LABEL: Record<Variant, string> = {
  v2: "V2",
  v1: "V1",
  source: "SRC",
};

const VARIANT_TONE: Record<Variant, string> = {
  v2: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
  v1: "border-zinc-600/60 bg-zinc-800/60 text-zinc-300",
  source: "border-amber-400/40 bg-amber-400/15 text-amber-300",
};

const ALL_VARIANTS: Variant[] = ["v2", "v1", "source"];

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TeamGallery({ team }: { team: TeamMember[] }) {
  const [variantFilter, setVariantFilter] = useState<Set<Variant>>(new Set(["v2"]));
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<TeamMember | null>(null);

  // Esc closes the lightbox.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const counts = useMemo(() => {
    const c: Record<Variant, number> = { v2: 0, v1: 0, source: 0 };
    for (const m of team) c[m.variant]++;
    return c;
  }, [team]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return team.filter((m) => {
      if (!variantFilter.has(m.variant)) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.agentKey.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    });
  }, [team, variantFilter, query]);

  const grouped = useMemo(() => {
    const map = new Map<Tier, TeamMember[]>();
    for (const m of filtered) {
      if (!map.has(m.tier)) map.set(m.tier, []);
      map.get(m.tier)!.push(m);
    }
    return TIER_ORDER.filter((t) => map.has(t)).map((t) => ({
      tier: t,
      meta: TIER_META[t],
      items: map.get(t)!.sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [filtered]);

  const toggleVariant = (v: Variant) => {
    setVariantFilter((prev) => {
      const next = new Set(prev);
      if (next.has(v)) {
        if (next.size === 1) return prev; // never empty
        next.delete(v);
      } else {
        next.add(v);
      }
      return next;
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="pb-6 pt-12 sm:pt-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-[#c0392b] sm:text-sm"
        >
          <ArrowLeft size={14} />
          Back home
        </Link>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-3 py-1 text-xs text-[#e74c3c] sm:text-sm">
          <Users size={12} />
          The team · {team.length} renders · {new Set(team.map((m) => m.agentKey)).size} agents
        </div>
        <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          The <span className="text-gradient">Team</span>
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Every agent that runs in DansLab, with the role they play in the lab and on the show.
          Tap any tile to open the full-resolution render.
        </p>
      </section>

      {/* Sticky controls */}
      <section className="sticky top-[57px] z-30 -mx-4 mb-6 border-b border-[#c0392b]/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, agent key…"
              className="w-full rounded-full border border-[#c0392b]/20 bg-[#0d0606] py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c0392b]/50 focus:outline-none"
            />
          </div>
          <div className="flex shrink-0 gap-1.5">
            {ALL_VARIANTS.map((v) => {
              const active = variantFilter.has(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVariant(v)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition ${
                    active
                      ? VARIANT_TONE[v]
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {VARIANT_LABEL[v]} · {counts[v]}
                </button>
              );
            })}
          </div>
        </div>
        {/* Tier scroll-rail */}
        <div className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 text-xs">
          {grouped.map((g) => (
            <a
              key={g.tier}
              href={`#tier-${g.tier}`}
              className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-zinc-400 transition hover:border-[#c0392b]/40 hover:text-white"
            >
              {g.meta.label} <span className="ml-1 text-zinc-600">{g.items.length}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Empty state */}
      {filtered.length === 0 && (
        <section className="py-16 text-center">
          <p className="text-sm text-zinc-500">No renders match those filters.</p>
        </section>
      )}

      {/* Tier sections */}
      {grouped.map((g) => (
        <section key={g.tier} id={`tier-${g.tier}`} className="scroll-mt-40 py-8 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
            <div>
              <h2 className="text-lg font-semibold text-white sm:text-2xl">{g.meta.label}</h2>
              <p className="mt-1 max-w-3xl text-xs text-zinc-500 sm:text-sm">{g.meta.subtitle}</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              {g.items.length} {g.items.length === 1 ? "render" : "renders"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((m) => (
              <button
                key={m.file}
                type="button"
                onClick={() => setActive(m)}
                className="group relative block overflow-hidden rounded-2xl border border-[#c0392b]/15 bg-[#0d0606] text-left transition duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: `0 0 0 0 ${hexToRgba(m.color, 0)}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 14px 40px -18px ${hexToRgba(m.color, 0.55)}, 0 0 0 1px ${hexToRgba(m.color, 0.35)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${hexToRgba(m.color, 0)}`;
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={m.src}
                    alt={`${m.name} — ${m.role}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Color wash from the agent's signature color */}
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-30 transition group-hover:opacity-60"
                    style={{ background: `linear-gradient(180deg, transparent 40%, ${hexToRgba(m.color, 0.6)} 100%)` }}
                  />
                  {/* Top row chips */}
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                    <span
                      className="rounded-md border bg-black/50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider backdrop-blur"
                      style={{
                        borderColor: hexToRgba(m.color, 0.5),
                        color: m.color,
                      }}
                    >
                      {m.role}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider backdrop-blur ${VARIANT_TONE[m.variant]}`}
                    >
                      {VARIANT_LABEL[m.variant]}
                    </span>
                  </div>
                </div>
                <div className="border-t border-[#c0392b]/10 bg-gradient-to-b from-black/0 to-black/30 p-4">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: m.color,
                        boxShadow: `0 0 10px ${hexToRgba(m.color, 0.7)}`,
                      }}
                    />
                    <h3 className="truncate text-base font-semibold text-white">{m.name}</h3>
                    <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      {m.agentKey}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                    {m.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} full-resolution render`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border bg-[#0d0606]"
            style={{ borderColor: hexToRgba(active.color, 0.4) }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white transition hover:bg-black/80"
            >
              <X size={16} />
            </button>
            <div className="relative max-h-[70vh] w-full">
              <Image
                src={active.src}
                alt={active.name}
                width={1600}
                height={1200}
                className="h-auto max-h-[70vh] w-full object-contain"
              />
            </div>
            <div
              className="border-t p-5"
              style={{ borderColor: hexToRgba(active.color, 0.25) }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: active.color,
                    boxShadow: `0 0 12px ${hexToRgba(active.color, 0.8)}`,
                  }}
                />
                <h2 className="text-xl font-semibold text-white">{active.name}</h2>
                <span
                  className="rounded-md border bg-black/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  style={{ borderColor: hexToRgba(active.color, 0.5), color: active.color }}
                >
                  {active.role}
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {active.file}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">
                {active.description}
              </p>
              <a
                href={active.src}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white"
              >
                Open full-resolution file →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
