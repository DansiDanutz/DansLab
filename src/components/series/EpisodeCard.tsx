import Link from "next/link";
import { Calendar, DollarSign, ChevronRight } from "lucide-react";
import type { SeasonEpisode } from "@/components/series/data/episodes";

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

export default function EpisodeCard({ episode }: { episode: SeasonEpisode }) {
  const statusColor = STATUS_COLOR[episode.status];
  const formattedTarget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(episode.missionTargetUsd);

  return (
    <Link
      href={`/series/episode-${episode.number.toString().padStart(2, "0")}`}
      className="card-base group flex h-full flex-col gap-3 p-5 transition hover:border-[#c0392b]/40"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
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
      <h3 className="text-xl font-semibold text-white">
        &ldquo;{episode.title}&rdquo;
      </h3>
      <p className="text-sm leading-relaxed text-zinc-400">{episode.summary}</p>
      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[#c0392b]/10 pt-3">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <DollarSign size={12} className="text-[#d4a017]" />
          <span>
            Mission target{" "}
            <span className="font-mono text-zinc-300">{formattedTarget}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Calendar size={12} className="text-[#c0392b]" />
          <span className="font-mono">
            {episode.publishAt
              ? new Date(episode.publishAt).toISOString().slice(0, 10)
              : "TBD"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] italic text-zinc-500">
          Mystery: {episode.mystery}
        </span>
        <ChevronRight
          size={14}
          className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-[#c0392b]"
        />
      </div>
    </Link>
  );
}
