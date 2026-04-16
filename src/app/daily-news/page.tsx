import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getDiscoveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

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

const CATEGORY_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string }
> = {
  "NERVIX (Agent Marketplace)": {
    icon: "\uD83C\uDF10",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  "YOUTUBE STUDIO (Content Pipeline)": {
    icon: "\uD83C\uDFAC",
    color: "text-red-400",
    gradient: "from-red-500/20 to-red-600/5",
  },
  "FLEET DEVOPS (Self-Healing)": {
    icon: "\uD83D\uDD27",
    color: "text-green-400",
    gradient: "from-green-500/20 to-green-600/5",
  },
  "HOT THIS WEEK": {
    icon: "\uD83D\uDD25",
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
};

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

async function getDiscoveries(): Promise<{
  grouped: Record<string, Discovery[]>;
  date: string;
  total: number;
}> {
  const supabase = getDiscoveryClient();
  if (!supabase) {
    return { grouped: {}, date: "", total: 0 };
  }

  const { data, error } = await supabase
    .from("daily_discoveries")
    .select("*")
    .order("date", { ascending: false })
    .order("relevance_score", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to fetch discoveries:", error);
    return { grouped: {}, date: "", total: 0 };
  }

  const discoveries = (data || []) as Discovery[];
  const latestDate = discoveries[0]?.date || "";

  const todayDiscoveries = discoveries.filter((d) => d.date === latestDate);

  const grouped: Record<string, Discovery[]> = {};
  for (const d of todayDiscoveries) {
    if (!grouped[d.category]) grouped[d.category] = [];
    grouped[d.category].push(d);
  }

  return { grouped, date: latestDate, total: todayDiscoveries.length };
}

export default async function DailyNewsPage() {
  const { grouped, date, total } = await getDiscoveries();

  const categoryOrder = [
    "NERVIX (Agent Marketplace)",
    "YOUTUBE STUDIO (Content Pipeline)",
    "FLEET DEVOPS (Self-Healing)",
    "HOT THIS WEEK",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{"\uD83D\uDD2D"}</span>
            <h1 className="text-3xl font-bold tracking-tight">Daily Discovery</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Open source intelligence for DansLab projects
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              {"\uD83D\uDCC5"} {date || "No data yet"}
            </span>
            <span className="flex items-center gap-1.5">
              {"\uD83D\uDCE6"} {total} repos discovered
            </span>
            <span className="flex items-center gap-1.5">
              {"\uD83D\uDD04"} Updated daily at 7:00 AM EET
            </span>
          </div>
        </div>

        {total === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">{"\uD83D\uDD2D"}</p>
            <p className="text-xl">No discoveries yet today</p>
            <p className="text-sm mt-2">
              The discovery engine runs daily at 7:00 AM EET
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {categoryOrder.map((category) => {
              const repos = grouped[category];
              if (!repos || repos.length === 0) return null;
              const config = CATEGORY_CONFIG[category] || {
                icon: "\uD83D\uDCCC",
                color: "text-gray-400",
                gradient: "from-gray-500/20 to-gray-600/5",
              };

              return (
                <section key={category}>
                  {/* Category Header */}
                  <div
                    className={`flex items-center gap-3 mb-4 pb-3 border-b border-gray-800`}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <h2 className={`text-xl font-semibold ${config.color}`}>
                      {category}
                    </h2>
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                      {repos.length} repos
                    </span>
                  </div>

                  {/* Repo Cards */}
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
                              {"\u2B50"} {formatStars(repo.stars)}
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

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-600">
          <p>
            Powered by DansLab Discovery Engine on Memo {"\u2022"} Data from
            GitHub API {"\u2022"} Stored in Supabase
          </p>
          <p className="mt-1">
            {"\uD83E\uDD16"} Built by David (Fleet Orchestrator) {"\u2022"}{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
