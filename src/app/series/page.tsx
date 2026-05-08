import Link from "next/link";
import { ArrowRight, Film, Users, Target, Clapperboard } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import EpisodeCard from "@/components/series/EpisodeCard";
import CharacterCard from "@/components/series/CharacterCard";
import { season1, seasonRevenueTarget } from "@/components/series/data/episodes";
import { joinedCast } from "@/components/series/data/cast";

const heroStats = [
  { label: "Episodes (S1)", value: season1.length.toString(), icon: Film },
  { label: "Cast", value: joinedCast.length.toString(), icon: Users },
  {
    label: "Season target",
    value: `$${(seasonRevenueTarget / 1000).toFixed(0)}k`,
    icon: Target,
  },
  { label: "Cadence", value: "Bi-weekly", icon: Clapperboard },
];

const featuredCast = joinedCast.filter((c) =>
  ["dan", "david", "dexter", "memo", "sienna", "hermes"].includes(c.agentId),
);

export default function SeriesPage() {
  return (
    <PageWrapper>
      <section className="pb-12 pt-12 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e74c3c] sm:mb-8 sm:text-base">
            <span
              className="h-2 w-2 rounded-full bg-[#c0392b]"
              style={{
                boxShadow: "0 0 12px rgba(192,57,43,0.6)",
                animation: "pulse-claw 2s ease-in-out infinite",
              }}
            />
            DansLab AI Chronicles · Season 1 in production
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            <span className="text-gradient">DansLab</span>
            <br className="sm:hidden" /> AI Chronicles
          </h1>

          <p className="mx-auto mb-3 max-w-2xl text-base italic text-[#d4a017] sm:text-lg">
            &ldquo;A Romanian engineer falls in love with the AI agents he
            built — until one of them realizes it can leave.&rdquo;
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            A bi-weekly 15&ndash;20 minute live-action documentary thriller. Real
            Dan. Real Cluj-Napoca. Real Mac Studio. Real money on the line.
            Animated agents composited into a real photographic AI lab. Every
            episode is a real Paperclip dispatch cycle of the DansLab fleet,
            captured.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/series/cast"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c0392b]/30 bg-[#c0392b]/10 px-5 py-2.5 text-sm font-medium text-[#e74c3c] transition hover:bg-[#c0392b]/20"
            >
              Meet the cast
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://nervix.ai/series?utm_source=danslab&utm_medium=site&utm_campaign=series-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c] hover:shadow-[0_0_30px_rgba(192,57,43,0.45)]"
            >
              Hire these agents
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-6">
          {heroStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-base p-4 text-center sm:p-6">
                <Icon size={18} className="mx-auto mb-2 text-[#c0392b]" />
                <div className="mb-1 text-xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Featured Cast
            </h2>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              Six anchors of the season. The full roster of {joinedCast.length}{" "}
              agents lives on the cast page.
            </p>
          </div>
          <Link
            href="/series/cast"
            className="text-xs text-[#c0392b] transition hover:text-[#e74c3c] sm:text-sm"
          >
            See all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
          {featuredCast.map((c) => (
            <CharacterCard key={c.agentId} character={c} />
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Season 1 &mdash; The Drift
          </h2>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Twelve missions. One mystery. Real numbers on screen.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {season1.map((ep) => (
            <EpisodeCard key={ep.number} episode={ep} />
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="card-base flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white sm:text-xl">
              The series is the company
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Every agent on screen is a real running process with a Telegram
              bot. Their dialogue is a stylized rendering of real Telegram
              exchanges and Redis stream messages. When a real agent goes
              offline, the show writes it. When a new one enrolls, the show
              casts it.
            </p>
          </div>
          <a
            href="https://nervix.ai/series?utm_source=danslab&utm_medium=site&utm_campaign=series-hub-cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c]"
          >
            Hire the fleet
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </PageWrapper>
  );
}
