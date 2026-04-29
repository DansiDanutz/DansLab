import PageWrapper from "@/components/PageWrapper";
import StateMessage from "@/components/StateMessage";
import { getReadClient } from "@/lib/supabase-read";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WorkflowRun {
  id: string;
  workflow_id: string;
  workflow_name: string;
  status: "success" | "error" | "running" | "waiting" | string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  trigger: string | null;
  error_message: string | null;
}

interface RuntimeSnapshot {
  workflow_id: string;
  workflow_name: string;
  total: number;
  success: number;
  errors: number;
  running: number;
  last_run_at: string;
  last_status: string;
  avg_duration_ms: number;
  last_error: string | null;
}

type Result =
  | { state: "ok"; runs: WorkflowRun[]; snapshots: RuntimeSnapshot[] }
  | { state: "missing_env" }
  | { state: "missing_table" }
  | { state: "error"; message: string };

const RUN_LIMIT = 100;

function summarize(runs: WorkflowRun[]): RuntimeSnapshot[] {
  const byWorkflow = new Map<string, WorkflowRun[]>();
  for (const run of runs) {
    const list = byWorkflow.get(run.workflow_id) || [];
    list.push(run);
    byWorkflow.set(run.workflow_id, list);
  }

  const snapshots: RuntimeSnapshot[] = [];
  byWorkflow.forEach((list) => {
    const sorted = [...list].sort((a, b) =>
      a.started_at < b.started_at ? 1 : -1,
    );
    const last = sorted[0];
    const durations = list
      .map((r) => r.duration_ms)
      .filter((v): v is number => typeof v === "number" && v >= 0);
    const avg = durations.length
      ? Math.round(durations.reduce((s, v) => s + v, 0) / durations.length)
      : 0;
    snapshots.push({
      workflow_id: last.workflow_id,
      workflow_name: last.workflow_name,
      total: list.length,
      success: list.filter((r) => r.status === "success").length,
      errors: list.filter((r) => r.status === "error").length,
      running: list.filter((r) => r.status === "running").length,
      last_run_at: last.started_at,
      last_status: last.status,
      avg_duration_ms: avg,
      last_error:
        sorted.find((r) => r.status === "error")?.error_message ?? null,
    });
  });

  return snapshots.sort((a, b) =>
    a.last_run_at < b.last_run_at ? 1 : -1,
  );
}

async function loadRuns(): Promise<Result> {
  const sb = getReadClient();
  if (!sb.ok) return { state: "missing_env" };

  const { data, error } = await sb.client
    .from("n8n_workflow_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(RUN_LIMIT);

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "42P01" || /relation .* does not exist/i.test(error.message)) {
      return { state: "missing_table" };
    }
    return { state: "error", message: error.message };
  }

  const runs = (data || []) as WorkflowRun[];
  return { state: "ok", runs, snapshots: summarize(runs) };
}

const STATUS_DOT: Record<string, string> = {
  success: "bg-[#00e676] shadow-[0_0_6px_#00e676]",
  error: "bg-[#ff5252] shadow-[0_0_6px_#ff5252]",
  running: "bg-[#a29bfe] shadow-[0_0_6px_#a29bfe]",
  waiting: "bg-[#d4a017]",
};

function statusDot(status: string) {
  return STATUS_DOT[status] || "bg-zinc-600";
}

function formatDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default async function N8NPage() {
  const result = await loadRuns();

  return (
    <PageWrapper>
      <div className="py-8 sm:py-12">
        <div className="mb-8">
          <div className="mb-3 text-xs font-mono tracking-[0.25em] text-[#a29bfe] uppercase">
            n8n Workflow Runtime
          </div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-[#a29bfe] to-[#00e676] bg-clip-text text-transparent">
              Workflow Runtime
            </span>
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Most recent {RUN_LIMIT} executions from Memo&apos;s n8n instance
            (port 5678 → tunneled to Mac Studio :15678). The <code>n8n</code>{" "}
            agent ingests these every 4h.
          </p>
        </div>

        {result.state === "missing_env" && (
          <StateMessage
            variant="config"
            title="Supabase not configured"
            message="Set NEXT_PUBLIC_SUPABASE_URL and a Supabase key (service role or anon) to view workflow runtime."
            hint="See BACKEND_SETUP.md for the env vars used by this dashboard."
          />
        )}

        {result.state === "missing_table" && (
          <StateMessage
            variant="config"
            title="n8n_workflow_runs table not found"
            message="The n8n agent has not yet provisioned its run-history table in this Supabase project."
            hint="Run the migration in schema.sql, then trigger the n8n probe."
          />
        )}

        {result.state === "error" && (
          <StateMessage
            variant="error"
            title="Couldn't load workflow runs"
            message={result.message}
          />
        )}

        {result.state === "ok" && result.runs.length === 0 && (
          <StateMessage
            variant="empty"
            icon="🔁"
            title="No workflow runs recorded"
            message="Either n8n has not executed any workflow recently, or the agent has not synced runs into Supabase yet."
          />
        )}

        {result.state === "ok" && result.runs.length > 0 && (
          <>
            <section className="mb-10">
              <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe]">
                Workflows ({result.snapshots.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.snapshots.map((s) => {
                  const successRate = s.total
                    ? Math.round((s.success / s.total) * 100)
                    : 0;
                  return (
                    <div key={s.workflow_id} className="card-base p-4 sm:p-5">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot(s.last_status)}`}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                            {s.workflow_name}
                          </h3>
                          <p className="font-mono text-[10px] text-zinc-600">
                            {s.workflow_id}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-zinc-500">
                          {formatRelative(s.last_run_at)}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                        <div>
                          <div className="text-base font-bold text-white">
                            {s.total}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                            Runs
                          </div>
                        </div>
                        <div>
                          <div
                            className={`text-base font-bold ${
                              successRate >= 95
                                ? "text-[#00e676]"
                                : successRate >= 80
                                  ? "text-[#d4a017]"
                                  : "text-[#ff5252]"
                            }`}
                          >
                            {successRate}%
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                            Success
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-[#ff5252]">
                            {s.errors}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                            Errors
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-zinc-200">
                            {formatDuration(s.avg_duration_ms)}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                            Avg
                          </div>
                        </div>
                      </div>
                      {s.last_error && (
                        <p className="mt-3 rounded bg-[#ff5252]/10 p-2 text-[11px] text-[#ff5252]">
                          {s.last_error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-4 border-b border-[#c0392b]/15 pb-2 text-lg font-semibold text-[#a29bfe]">
                Recent runs
              </h2>
              <div className="card-base overflow-hidden">
                <div className="hidden grid-cols-[16px_1fr_120px_90px_120px] items-center gap-3 border-b border-[#c0392b]/10 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-500 sm:grid">
                  <span />
                  <span>Workflow</span>
                  <span>Trigger</span>
                  <span>Duration</span>
                  <span>Started</span>
                </div>
                <ul className="divide-y divide-[#c0392b]/10">
                  {result.runs.map((r) => (
                    <li
                      key={r.id}
                      className="grid grid-cols-[16px_1fr] items-center gap-3 px-4 py-2.5 text-xs sm:grid-cols-[16px_1fr_120px_90px_120px]"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusDot(r.status)}`}
                        title={r.status}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-zinc-200">
                          {r.workflow_name}
                        </div>
                        {r.error_message && (
                          <div className="truncate text-[10px] text-[#ff5252]">
                            {r.error_message}
                          </div>
                        )}
                      </div>
                      <span className="hidden truncate text-zinc-500 sm:inline">
                        {r.trigger || "—"}
                      </span>
                      <span className="hidden text-zinc-400 sm:inline">
                        {formatDuration(r.duration_ms)}
                      </span>
                      <span className="hidden text-zinc-500 sm:inline">
                        {formatRelative(r.started_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
