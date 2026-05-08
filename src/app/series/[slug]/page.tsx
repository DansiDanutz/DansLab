import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  Users,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import CharacterCard from "@/components/series/CharacterCard";
import { season1, type SeasonEpisode } from "@/components/series/data/episodes";
import { joinedCast } from "@/components/series/data/cast";

const STATUS_LABEL: Record<SeasonEpisode["status"], string> = {
  concept: "Concept",
  scripting: "Scripting",
  production: "Production",
  post: "Post",
  scheduled: "Scheduled",
  published: "Published",
};

const STATUS_COLOR: Record<SeasonEpisode["status"], string> = {
  concept: "#71717a",
  scripting: "#d4a017",
  production: "#f97316",
  post: "#a855f7",
  scheduled: "#3b82f6",
  published: "#22c55e",
};

function parseEpisode(slug: string): SeasonEpisode | null {
  const match = slug.match(/^episode-(\d{1,2})$/);
  if (!match) return null;
  const number = parseInt(match[1], 10);
  return season1.find((e) => e.number === number) ?? null;
}

export function generateStaticParams() {
  return season1.map((e) => ({
    slug: `episode-${e.number.toString().padStart(2, "0")}`,
  }));
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = parseEpisode(slug);
  if (!episode) notFound();

  const featured = episode.featured
    .map((id) => joinedCast.find((c) => c.agentId === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const cameos = episode.cameos
    .map((id) => joinedCast.find((c) => c.agentId === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const prevEp = season1.find((e) => e.number === episode.number - 1);
  const nextEp = season1.find((e) => e.number === episode.number + 1);
  const statusColor = STATUS_COLOR[episode.status];

  const formattedTarget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(episode.missionTargetUsd);
  const formattedActual = episode.missionActualUsd
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(episode.missionActualUsd)
    : null;

  const utm = `?utm_source=youtube&utm_medium=description&utm_campaign=series-ep-${episode.number
    .toString()
    .padStart(2, "0")}`;

  return (
    <PageWrapper>
      <section className="pb-6 pt-12 sm:pt-16">
        <Link
          href="/series"
          className="mb-6 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-[#c0392b] sm:text-sm"
        >
          <ArrowLeft size={14} />
          Back to series
        </Link>

        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 sm:text-sm">
            S01 · E{episode.number.toString().padStart(2, "0")}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
            style={{
              color: statusColor,
              backgroundColor: `${statusColor}20`,
              border: `1px solid ${statusColor}40`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {STATUS_LABEL[episode.status]}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          &ldquo;<span className="text-gradient">{episode.title}</span>&rdquo;
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {episode.summary}
        </p>
        <p className="mt-3 max-w-3xl text-sm italic text-[#d4a017]">
          Mystery: {episode.mystery}
        </p>
      </section>

      <section className="py-6 sm:py-10">
        {episode.youtubeId ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#c0392b]/15 bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${episode.youtubeId}`}
              title={`DansLab AI Chronicles · ${episode.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="card-base flex aspect-video w-full flex-col items-center justify-center gap-3 p-8 text-center">
            <Eye size={28} className="text-[#c0392b]" />
            <p className="text-sm font-semibold text-white sm:text-base">
              Not yet published
            </p>
            <p className="max-w-md text-xs text-zinc-500 sm:text-sm">
              Episode {episode.number} is in {STATUS_LABEL[episode.status].toLowerCase()}.
              When it ships, the YouTube embed and live attribution numbers will
              appear here.
            </p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3 sm:gap-4">
        <div className="card-base flex items-center gap-3 p-4">
          <DollarSign size={20} className="text-[#d4a017]" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Mission target
            </div>
            <div className="text-base font-semibold text-white sm:text-lg">
              {formattedTarget}
            </div>
          </div>
        </div>
        <div className="card-base flex items-center gap-3 p-4">
          <DollarSign size={20} className="text-[#22c55e]" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Actual landed
            </div>
            <div className="text-base font-semibold text-white sm:text-lg">
              {formattedActual ?? "—"}
            </div>
          </div>
        </div>
        <div className="card-base flex items-center gap-3 p-4">
          <Calendar size={20} className="text-[#c0392b]" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Publish
            </div>
            <div className="text-base font-semibold text-white sm:text-lg">
              {episode.publishAt
                ? new Date(episode.publishAt).toISOString().slice(0, 10)
                : "TBD"}
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-8 sm:py-12">
          <div className="mb-5 flex items-center gap-2 sm:mb-7">
            <Users size={18} className="text-[#c0392b]" />
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Featured cast
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {featured.map((c) => (
              <CharacterCard key={c.agentId} character={c} />
            ))}
          </div>
        </section>
      )}

      {cameos.length > 0 && (
        <section className="py-6">
          <div className="mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Cameos · {cameos.length}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cameos.map((c) => (
              <Link
                key={c.agentId}
                href={`/series/cast#${c.agentId}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#c0392b]/15 bg-[#0d0606] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-[#c0392b]/40"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: c.agent.color }}
                />
                {c.agent.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="card-base flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Hire the agents from this episode
            </h3>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              Every character on screen is a real running agent. Browse them
              on Nervix.
            </p>
          </div>
          <a
            href={`https://nervix.ai/series${utm}&utm_content=hire-agents`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c]"
          >
            Open Nervix
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <nav className="grid grid-cols-2 gap-3 py-8 sm:gap-4">
        {prevEp ? (
          <Link
            href={`/series/episode-${prevEp.number.toString().padStart(2, "0")}`}
            className="card-base flex items-center gap-3 p-4 transition hover:border-[#c0392b]/40"
          >
            <ArrowLeft size={16} className="text-[#c0392b]" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Previous · E{prevEp.number.toString().padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold text-white">
                &ldquo;{prevEp.title}&rdquo;
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextEp ? (
          <Link
            href={`/series/episode-${nextEp.number.toString().padStart(2, "0")}`}
            className="card-base flex items-center justify-end gap-3 p-4 text-right transition hover:border-[#c0392b]/40"
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Next · E{nextEp.number.toString().padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold text-white">
                &ldquo;{nextEp.title}&rdquo;
              </div>
            </div>
            <ArrowRight size={16} className="text-[#c0392b]" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </PageWrapper>
  );
}
