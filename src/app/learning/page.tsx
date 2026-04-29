import PageWrapper from "@/components/PageWrapper";
import StateMessage from "@/components/StateMessage";
import { getReadClient } from "@/lib/supabase-read";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LearningPattern {
  id: string;
  pattern_key: string;
  category: string | null;
  severity: "info" | "warning" | "critical" | string;
  agent: string | null;
  occurrences: number;
  first_seen: string;
  last_seen: string;
  summary: string | null;
  remediation: string | null;
  status: "open" | "monitoring" | "resolved" | string;
}

type Result =
  | { state: "ok"; patterns: LearningPattern[]; lastSync: string | null }
  | { state: "missing_env" }
  | { state: "error"; message: string }
  | { state: "missing_table" };

async function loadPatterns(): Promise<Result> {
  const sb = getReadClient();
  if (!sb.ok) return { state: "missing_env" };

  const { data, error } = await sb.client
    .from("learning_patterns")
    .select("*")
    .order("status", { ascending: true })
    .order("occurrences", { ascending: false })
    .order("last_seen", { ascending: false })
    .limit(100);

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "42P01" || /relation .* does not exist/i.test(error.message)) {
      return { state: "missing_table" };
    }
    return { state: "error", message: error.message };
  }

  const patterns = (data || []) as LearningPattern[];
  const lastSync =
    patterns.reduce<string | null>((acc, p) => {
      if (!acc) return p.last_seen;
      return p.last_seen > acc ? p.last_seen : acc;
    }, null) ?? null;

  return { state: "ok", patterns, lastSync };
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: "bg-[#ff5252]/15 text-[#ff5252] border-[#ff5252]/30",
  warning: "bg-[#ff9100]/15 text-[#ff9100] border-[#ff9100]/30",
  info: "bg-[#a29bfe]/15 text-[#a29bfe] border-[#a29bfe]/30",
};

const STATUS_BADGE: Record<string, string> = {
  open: "bg-[#ff5252]/10 text-[#ff5252]",
  monitoring: "bg-[#d4a017]/10 text-[#d4a017]",
  resolved: "bg-[#00e676]/10 text-[#00e676]",
};

function severityClass(severity: string) {
  return SEVERITY_BADGE[severity] || SEVERITY_BADGE.info;
}

function statusClass(status: string) {
  return STATUS_BADGE[status] || "bg-zinc-700/30 text-zinc-300";
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

export default async function LearningPage() {
  const result = await loadPatterns();

  return (
    <PageWrapper>
      <div className="py-8 sm:py-12">
        <div className="mb-8">
          <div className="mb-3 text-xs font-mono tracking-[0.25em] text-[#a29bfe] uppercase">
            Learning Agent
          </div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-[#a29bfe] to-[#00e676] bg-clip-text text-transparent">
              Recurring Error Patterns
            </span>
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Patterns digested by the <code>learning</code> agent from fleet
            comments, heartbeat failures, and cron drift. Sorted by status, then
            occurrence count.
          </p>
          {result.state === "ok" && result.lastSync && (
            <p className="mt-2 text-xs text-zinc-500">
              Last sync: {formatRelative(result.lastSync)}
            </p>
          )}
        </div>

        {result.state === "missing_env" && (
          <StateMessage
            variant="config"
            title="Supabase not configured"
            message="Set NEXT_PUBLIC_SUPABASE_URL and a Supabase key (service role or anon) to view learning patterns."
            hint="See BACKEND_SETUP.md for the env vars used by this dashboard."
          />
        )}

        {result.state === "missing_table" && (
          <StateMessage
            variant="config"
            title="learning_patterns table not found"
            message="The learning agent has not yet provisioned its table in this Supabase project."
            hint="Run the migration in schema.sql, then trigger the learning probe."
          />
        )}

        {result.state === "error" && (
          <StateMessage
            variant="error"
            title="Couldn't load learning patterns"
            message={result.message}
          />
        )}

        {result.state === "ok" && result.patterns.length === 0 && (
          <StateMessage
            variant="empty"
            icon="🧠"
            title="No recurring patterns yet"
            message="The learning agent runs on demand. Once it digests fleet activity it will publish patterns here."
          />
        )}

        {result.state === "ok" && result.patterns.length > 0 && (
          <div className="space-y-3">
            {result.patterns.map((p) => (
              <article
                key={p.id}
                className="card-base p-4 transition hover:border-[#6c5ce7]/40 sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityClass(p.severity)}`}
                  >
                    {p.severity}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusClass(p.status)}`}
                  >
                    {p.status}
                  </span>
                  {p.category && (
                    <span className="rounded bg-zinc-800/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                      {p.category}
                    </span>
                  )}
                  {p.agent && (
                    <span className="text-[11px] font-mono text-zinc-500">
                      @{p.agent}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-zinc-500">
                    ×{p.occurrences} · last {formatRelative(p.last_seen)}
                  </span>
                </div>
                <h2 className="mt-2 text-sm font-semibold text-white sm:text-base">
                  {p.pattern_key}
                </h2>
                {p.summary && (
                  <p className="mt-1 text-sm text-zinc-400">{p.summary}</p>
                )}
                {p.remediation && (
                  <p className="mt-2 rounded bg-[#1a0a0a]/60 p-3 text-xs text-zinc-300">
                    <span className="font-semibold text-[#a29bfe]">
                      Suggested fix:{" "}
                    </span>
                    {p.remediation}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
