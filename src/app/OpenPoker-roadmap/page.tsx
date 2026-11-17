import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenPoker Roadmap — DansLab",
  description: "Daily OpenPoker delivery report: what shipped, what is waiting for review, and what to do today.",
};

export const dynamic = "force-dynamic";

type Focus = { kind: string; label: string; detail: string; url: string };
type Pull = {
  number: number;
  title: string;
  author: string;
  url: string;
  merged_at?: string;
  created_at?: string;
  age_days?: number;
  draft?: boolean;
  labels: string[];
  comments?: number;
};
type Submission = {
  plugin_id: string | null;
  pr_number: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  nick: string | null;
};
type Roadmap = {
  repo: string;
  generated_at: string;
  totals: {
    shipped_7d: number;
    shipped_24h: number;
    awaiting_review: number;
    drafts: number;
    pending_contributor_submissions: number;
  };
  shipped: Pull[];
  awaiting: Pull[];
  pending_submissions: Submission[];
  focus: Focus[];
  errors: string[];
};

const SOURCE = "https://dangg.live/roadmap.json";
const REPO_URL = "https://github.com/OpenPoker4all/OpenPoker";

async function loadRoadmap(): Promise<Roadmap | null> {
  try {
    const response = await fetch(SOURCE, { next: { revalidate: 300 } });
    if (!response.ok) return null;
    return (await response.json()) as Roadmap;
  } catch {
    return null;
  }
}

function relative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

function PullRow({ pr, shipped = false }: { pr: Pull; shipped?: boolean }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/5 py-3 last:border-0">
      <a
        href={pr.url}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-xs text-emerald-300/80 hover:text-emerald-200"
      >
        #{pr.number}
      </a>
      <a href={pr.url} target="_blank" rel="noreferrer" className="flex-1 text-sm text-zinc-200 hover:text-white">
        {pr.title}
      </a>
      <span className="text-xs text-zinc-500">{pr.author}</span>
      <span className="font-mono text-[11px] text-zinc-600">
        {shipped && pr.merged_at
          ? relative(pr.merged_at)
          : pr.draft
            ? "draft"
            : `${pr.age_days ?? 0}d open`}
      </span>
    </li>
  );
}

export default async function OpenPokerRoadmapPage() {
  const roadmap = await loadRoadmap();

  return (
    <main className="min-h-screen bg-[#05070a] text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400/80">
          OpenPoker // roadmap
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What shipped, what is waiting.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Regenerated every morning at 06:00 UTC by Hermes from the live repository: merged
              work, open reviews and contributor submissions. This page reads the published
              roadmap and never stores a copy of its own.
            </p>
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-300 hover:border-emerald-400/50 hover:text-white"
          >
            Open repository
          </a>
        </div>

        {!roadmap ? (
          <div className="mt-12 rounded-xl border border-amber-400/25 bg-amber-400/5 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300">
              Roadmap not published yet
            </p>
            <p className="mt-2 text-sm text-zinc-300">
              Hermes has not written today&apos;s roadmap yet, or the endpoint is unreachable. It
              retries every five minutes; the source is{" "}
              <a className="text-emerald-300 hover:text-emerald-200" href={SOURCE}>
                {SOURCE}
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                label="Shipped 24h"
                value={roadmap.totals.shipped_24h}
                hint={`${roadmap.totals.shipped_7d} merged this week`}
              />
              <Stat
                label="Awaiting review"
                value={roadmap.totals.awaiting_review}
                hint={`${roadmap.totals.drafts} drafts in progress`}
              />
              <Stat
                label="Contributor queue"
                value={roadmap.totals.pending_contributor_submissions}
                hint="plugin submissions pending"
              />
              <Stat label="Updated" value={relative(roadmap.generated_at)} hint="Hermes daily routine" />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
              <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Today
                </h2>
                {roadmap.focus.length === 0 ? (
                  <p className="mt-3 text-sm text-zinc-400">
                    Nothing is waiting for review. Pick the next item from the repository backlog.
                  </p>
                ) : (
                  <ol className="mt-3 space-y-3">
                    {roadmap.focus.map((item) => (
                      <li key={item.label} className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-emerald-200 hover:text-emerald-100"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-emerald-200">{item.label}</span>
                        )}
                        <p className="mt-1 text-xs text-zinc-400">{item.detail}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Awaiting approval
                </h2>
                <ul className="mt-2">
                  {roadmap.awaiting.length === 0 ? (
                    <li className="py-3 text-sm text-zinc-400">No open pull requests.</li>
                  ) : (
                    roadmap.awaiting.map((pr) => <PullRow key={pr.number} pr={pr} />)
                  )}
                </ul>
                {roadmap.pending_submissions.length > 0 && (
                  <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">
                      Contributor submissions
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-zinc-300">
                      {roadmap.pending_submissions.slice(0, 5).map((submission) => (
                        <li key={`${submission.plugin_id}-${submission.created_at}`}>
                          {submission.plugin_id ?? "plugin"} · {submission.nick ?? "unknown"} ·{" "}
                          {submission.created_at.slice(0, 10)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>

            <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Shipped this week
                </h2>
                <span className="text-xs text-zinc-600">{roadmap.totals.shipped_7d} merged</span>
              </div>
              <ul className="mt-2">
                {roadmap.shipped.slice(0, 24).map((pr) => (
                  <PullRow key={pr.number} pr={pr} shipped />
                ))}
              </ul>
            </section>

            {roadmap.errors.length > 0 && (
              <p className="mt-6 font-mono text-xs text-amber-400/80">
                Partial data: {roadmap.errors.join(" · ")}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
