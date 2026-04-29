import Link from "next/link";
import StateMessage from "@/components/StateMessage";
import { getReadClient } from "@/lib/supabase-read";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Discovery {
  id: string;
  date: string;
  category: string;
  repo_name: string;
  repo_url: string;
  stars: number;
  language: string | null;
  description: string | null;
  relevance_score: number;
  relevance_reason: string | null;
  project_tag: string | null;
}

const ARCHIVE_LIMIT = 14;
const PAGE_LIMIT = 200;

const CATEGORY_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string }
> = {
  "NERVIX (Agent Marketplace)": {
    icon: "🌐",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  "YOUTUBE STUDIO (Content Pipeline)": {
    icon: "🎬",
    color: "text-red-400",
    gradient: "from-red-500/20 to-red-600/5",
  },
  "FLEET DEVOPS (Self-Healing)": {
    icon: "🔧",
    color: "text-green-400",
    gradient: "from-green-500/20 to-green-600/5",
  },
  "HOT THIS WEEK": {
    icon: "🔥",
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
};

const CATEGORY_ORDER = [
  "NERVIX (Agent Marketplace)",
  "YOUTUBE STUDIO (Content Pipeline)",
  "FLEET DEVOPS (Self-Healing)",
  "HOT THIS WEEK",
];

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return String(stars);
}

function getLanguageColor(lang: string | null): string {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-500",
    Python: "bg-green-500",
    Rust: "bg-orange-600",
    Go: "bg-cyan-500",
    HTML: "bg-red-500",
    CSS: "bg-purple-500",
  };
  return colors[lang || ""] || "bg-gray-500";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type LoadResult =
  | {
      state: "ok";
      grouped: Record<string, Discovery[]>;
      date: string;
      total: number;
      archive: string[];
    }
  | { state: "missing_env" }
  | { state: "missing_table" }
  | { state: "error"; message: string };

async function getDiscoveries(requestedDate?: string): Promise<LoadResult> {
  const sb = getReadClient();
  if (!sb.ok) return { state: "missing_env" };

  const dateFilter = requestedDate && ISO_DATE.test(requestedDate)
    ? requestedDate
    : null;

  let query = sb.client
    .from("daily_discoveries")
    .select("*")
    .order("date", { ascending: false })
    .order("relevance_score", { ascending: false })
    .limit(PAGE_LIMIT);

  if (dateFilter) {
    query = query.eq("date", dateFilter);
  }

  const { data, error } = await query;

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "42P01" || /relation .* does not exist/i.test(error.message)) {
      return { state: "missing_table" };
    }
    return { state: "error", message: error.message };
  }

  const discoveries = (data || []) as Discovery[];

  const archiveSet = new Set<string>();
  if (!dateFilter) {
    for (const d of discoveries) archiveSet.add(d.date);
  } else {
    const { data: archiveData } = await sb.client
      .from("daily_discoveries")
      .select("date")
      .order("date", { ascending: false })
      .limit(500);
    for (const row of (archiveData || []) as { date: string }[]) {
      archiveSet.add(row.date);
    }
  }
  const archive = Array.from(archiveSet).sort().reverse().slice(0, ARCHIVE_LIMIT);

  const targetDate = dateFilter || discoveries[0]?.date || archive[0] || "";
  const todayDiscoveries = discoveries.filter((d) => d.date === targetDate);

  const grouped: Record<string, Discovery[]> = {};
  for (const d of todayDiscoveries) {
    if (!grouped[d.category]) grouped[d.category] = [];
    grouped[d.category].push(d);
  }

  return {
    state: "ok",
    grouped,
    date: targetDate,
    total: todayDiscoveries.length,
    archive,
  };
}

function formatArchiveLabel(date: string, latest: string | null): string {
  if (date === latest) return `${date} · latest`;
  const today = new Date();
  const target = new Date(`${date}T00:00:00Z`);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / 86_400_000,
  );
  if (diffDays <= 0) return date;
  if (diffDays === 1) return `${date} · 1 day ago`;
  return `${date} · ${diffDays} days ago`;
}

export default async function DailyNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.date) ? params.date[0] : params.date;
  const result = await getDiscoveries(requested);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔭</span>
            <h1 className="text-3xl font-bold tracking-tight">
              Daily Discovery
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Open source intelligence for DansLab projects
          </p>
          {result.state === "ok" && (
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                📅 {result.date || "No data yet"}
              </span>
              <span className="flex items-center gap-1.5">
                📦 {result.total} repos discovered
              </span>
              <span className="flex items-center gap-1.5">
                🔄 Updated daily at 7:00 AM EET
              </span>
            </div>
          )}
        </div>

        {result.state === "missing_env" && (
          <StateMessage
            variant="config"
            title="Supabase not configured"
            message="Set NEXT_PUBLIC_SUPABASE_URL and a Supabase key (service role or anon) to view discoveries."
            hint="See BACKEND_SETUP.md for the env vars used by this dashboard."
          />
        )}

        {result.state === "missing_table" && (
          <StateMessage
            variant="config"
            title="daily_discoveries table not found"
            message="The discovery agent has not yet provisioned its table in this Supabase project."
            hint="Run the migration in schema.sql, then trigger the discovery probe."
          />
        )}

        {result.state === "error" && (
          <StateMessage
            variant="error"
            title="Couldn't load discoveries"
            message={result.message}
          />
        )}

        {result.state === "ok" && (
          <>
            {result.archive.length > 1 && (
              <section
                aria-label="Archive"
                className="mb-8 rounded-lg border border-gray-800/60 bg-gray-900/40 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Archive
                  </h2>
                  <span className="text-[10px] text-gray-600">
                    Last {result.archive.length} days
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.archive.map((d) => {
                    const isActive = d === result.date;
                    const label = formatArchiveLabel(d, result.archive[0]);
                    return (
                      <Link
                        key={d}
                        href={d === result.archive[0] ? "/daily-news" : `/daily-news?date=${d}`}
                        className={
                          isActive
                            ? "rounded-full border border-blue-500/60 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300"
                            : "rounded-full border border-gray-700 bg-gray-800/40 px-3 py-1 text-xs text-gray-400 transition hover:border-gray-600 hover:text-gray-200"
                        }
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {requested && requested !== result.date && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-200"
              >
                No discoveries archived for{" "}
                <span className="font-mono">{requested}</span>. Showing{" "}
                {result.date || "the most recent day"} instead.
              </div>
            )}

            {result.total === 0 ? (
              <StateMessage
                variant="empty"
                icon="🔭"
                title={
                  result.date
                    ? `No discoveries for ${result.date}`
                    : "No discoveries yet"
                }
                message="The discovery engine runs daily at 7:00 AM EET on Memo. Check back after the next run."
              />
            ) : (
              <div className="space-y-8">
                {CATEGORY_ORDER.map((category) => {
                  const repos = result.grouped[category];
                  if (!repos || repos.length === 0) return null;
                  const config = CATEGORY_CONFIG[category] || {
                    icon: "📌",
                    color: "text-gray-400",
                    gradient: "from-gray-500/20 to-gray-600/5",
                  };

                  return (
                    <section key={category}>
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
                        <span className="text-2xl">{config.icon}</span>
                        <h2
                          className={`text-xl font-semibold ${config.color}`}
                        >
                          {category}
                        </h2>
                        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                          {repos.length} repos
                        </span>
                      </div>

                      <div className="grid gap-3">
                        {repos.map((repo, idx) => (
                          <a
                            key={repo.id}
                            href={repo.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-4 rounded-lg bg-gradient-to-r ${config.gradient} border border-gray-800/50 hover:border-gray-700 transition-all hover:translate-x-1`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-500 text-sm font-mono w-5">
                                    {idx + 1}.
                                  </span>
                                  <h3 className="font-semibold text-gray-100 truncate">
                                    {repo.repo_name.split("/").pop()}
                                  </h3>
                                  {repo.language && (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                      <span
                                        className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}
                                      />
                                      {repo.language}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                                  {repo.relevance_reason || repo.description}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {repo.repo_name}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                                  ⭐ {formatStars(repo.stars)}
                                </span>
                                {repo.relevance_score > 0 && (
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      repo.relevance_score >= 7
                                        ? "bg-green-500/20 text-green-400"
                                        : repo.relevance_score >= 4
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-gray-500/20 text-gray-400"
                                    }`}
                                  >
                                    {repo.relevance_score}/10
                                  </span>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-600">
          <p>
            Powered by DansLab Discovery Engine on Memo • Data from GitHub API •
            Stored in Supabase
          </p>
          <p className="mt-1">
            🤖 Built by David (Fleet Orchestrator) •{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
