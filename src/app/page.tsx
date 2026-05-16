import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import RefreshButton from "@/components/RefreshButton";
import { getPipelineStatus } from "@/lib/pipeline-status";
import type { EngineHealth, QueueHealth } from "@/lib/pipeline-status";
import {
  Play,
  Film,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  TrendingUp,
  DollarSign,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

// Always fetch fresh — pipeline status changes too fast to cache.
export const dynamic = "force-dynamic";

interface JobCardProps {
  id: string;
  title: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  engine: string;
  createdAt: string;
}

// Recent jobs — still mock until /api/pipeline/jobs is extracted to a lib.
// Tracked as the next dashboard wire-up slice.
const MOCK_RECENT_JOBS: JobCardProps[] = [
  {
    id: "job-001",
    title: "Meet the Team — YouTube Pipeline Intro",
    status: "completed",
    progress: 100,
    engine: "HyperFrames",
    createdAt: "2026-05-16",
  },
  {
    id: "job-002",
    title: "Crypto Daily News — May 16",
    status: "running",
    progress: 62,
    engine: "HyperFrames",
    createdAt: "2026-05-16",
  },
];

interface StatsViewModel {
  totalVideos: number;
  thisMonth: number;
  successRate: number;
  avgCost: number;
  queueDepth: number;
  activeJobs: number;
}

function deriveStats(queue: QueueHealth): StatsViewModel {
  return {
    // Aggregations TBD — still mock until /api/pipeline/metrics is extracted.
    totalVideos: 0,
    thisMonth: 0,
    successRate: 0,
    avgCost: 0,
    // Real data from the queue probe:
    queueDepth: queue.queued,
    activeJobs: queue.processing,
  };
}

export default async function Dashboard() {
  const status = await getPipelineStatus();
  const stats = deriveStats(status.queue);
  const jobs = MOCK_RECENT_JOBS;

  const pipelineLabel = status.healthy ? "Pipeline Online" : "Pipeline Degraded";
  const pipelineDotClass = status.healthy ? "animate-pulse" : "";

  return (
    <PageWrapper>
      {/* Header */}
      <section className="pb-8 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div
              className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                status.healthy
                  ? "border-[#c0392b]/25 bg-[#c0392b]/10 text-[#e74c3c]"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              <Activity size={12} className={pipelineDotClass} />
              {pipelineLabel}
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              YouTube Pipeline
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              AI-powered video production — research to render to upload
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton />
            <Link
              href="/studio"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Play size={14} />
              New Video
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {[
          { label: "Videos", value: stats.totalVideos.toString(), icon: Film },
          { label: "This Month", value: stats.thisMonth.toString(), icon: TrendingUp },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: CheckCircle2 },
          { label: "Avg Cost", value: `$${stats.avgCost.toFixed(2)}`, icon: DollarSign },
          { label: "Queue", value: stats.queueDepth.toString(), icon: Clock },
          { label: "Active", value: stats.activeJobs.toString(), icon: Activity },
        ].map((stat) => (
          <div key={stat.label} className="card-base p-4 text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5 text-zinc-500">
              <stat.icon size={14} />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-white sm:text-2xl">
              {stat.value}
            </div>
          </div>
        ))}
      </section>

      {/* Engines + Recent Jobs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Engine Health — REAL DATA */}
        <div className="card-base p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Engine Health</h3>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400">
              live
            </span>
          </div>
          <div className="space-y-2">
            {status.engines.map((engine: EngineHealth) => (
              <div
                key={engine.name}
                className="flex items-center justify-between rounded-lg bg-zinc-900/50 px-3 py-2"
              >
                <span className="text-sm text-zinc-300">{engine.name}</span>
                {engine.healthy ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <AlertCircle size={12} />
                    Offline
                  </span>
                )}
              </div>
            ))}
            {/* Queue is part of pipeline-status — show it alongside engines */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-900/50 px-3 py-2">
              <span className="text-sm text-zinc-300">Queue</span>
              {status.queue.healthy ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={12} />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <AlertCircle size={12} />
                  Offline
                </span>
              )}
            </div>
          </div>
          <p className="mt-3 text-[10px] text-zinc-600">
            Last check: {new Date(status.lastRun).toLocaleTimeString()}
          </p>
        </div>

        {/* Recent Jobs — STILL MOCK (next slice) */}
        <div className="card-base p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Jobs</h3>
            <Link
              href="/studio"
              className="inline-flex items-center gap-1 text-xs text-[#e74c3c] transition hover:text-white"
            >
              View All
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 rounded-lg bg-zinc-900/50 p-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    job.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : job.status === "running"
                      ? "bg-[#c0392b]/10 text-[#e74c3c]"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {job.status === "completed" ? (
                    <CheckCircle2 size={18} />
                  ) : job.status === "running" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {job.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{job.engine}</span>
                    <span>·</span>
                    <span>{job.createdAt}</span>
                    {job.status === "running" && (
                      <>
                        <span>·</span>
                        <span className="text-[#e74c3c]">{job.progress}%</span>
                      </>
                    )}
                  </div>
                </div>
                {job.status === "running" && (
                  <div className="hidden w-24 sm:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-[#c0392b] transition-all duration-500"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-zinc-600">
            Showing sample data — live jobs feed wires up in the next slice.
          </p>
        </div>
      </div>

      {/* Pipeline Steps */}
      <section className="mt-8">
        <div className="card-base p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">10-Step Pipeline</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: 1, name: "Research", desc: "Topic discovery" },
              { step: 2, name: "Script", desc: "Narration draft" },
              { step: 3, name: "Visual", desc: "Design brief" },
              { step: 4, name: "Scenes", desc: "Composition" },
              { step: 5, name: "Audio", desc: "TTS + music" },
              { step: 6, name: "Subtitles", desc: "Caption sync" },
              { step: 7, name: "Render", desc: "HF + Remotion" },
              { step: 8, name: "QA", desc: "Validation" },
              { step: 9, name: "Final", desc: "Assembly" },
              { step: 10, name: "Upload", desc: "YouTube + SEO" },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-center gap-3 rounded-lg bg-zinc-900/50 px-3 py-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c0392b]/10 text-xs font-bold text-[#e74c3c]">
                  {s.step}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{s.name}</div>
                  <div className="text-[10px] text-zinc-500">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
