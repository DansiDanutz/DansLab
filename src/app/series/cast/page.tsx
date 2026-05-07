import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import CharacterCard from "@/components/series/CharacterCard";
import { joinedCast } from "@/components/series/data/cast";

const TIER_LABEL = {
  human: "The Human",
  council: "Mac Studio Council",
  capital: "The Four Capitals",
  channel: "Channel & Slack Agents",
} as const;

const TIER_DESCRIPTION = {
  human: "Dan. The only human in the room.",
  council:
    "The fleet's brain. They live on Mac Studio. The recurring cast.",
  capital:
    "The droplet leads. Each one has a signature episode and a city of their own.",
  channel:
    "They run the comms wall. Less screen time, but every one has a moment.",
} as const;

const TIER_ORDER: Array<keyof typeof TIER_LABEL> = [
  "human",
  "council",
  "capital",
  "channel",
];

export default function CastPage() {
  const lockedCount = joinedCast.filter((c) => c.artUrl !== "").length;

  return (
    <PageWrapper>
      <section className="pb-8 pt-12 sm:pt-16">
        <Link
          href="/series"
          className="mb-6 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-[#c0392b] sm:text-sm"
        >
          <ArrowLeft size={14} />
          Back to series
        </Link>
        <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          The <span className="text-gradient">Cast</span>
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {joinedCast.length} characters across the fleet. Every one is a real
          running agent with a Telegram bot. {lockedCount} have locked reference
          art; the rest are commissioned in the per-episode pipeline.
        </p>
      </section>

      {TIER_ORDER.map((tier) => {
        const members = joinedCast.filter((c) => c.tier === tier);
        if (members.length === 0) return null;
        return (
          <section key={tier} className="py-8 sm:py-10">
            <div className="mb-5 sm:mb-7">
              <h2 className="text-lg font-semibold text-white sm:text-2xl">
                {TIER_LABEL[tier]}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                {TIER_DESCRIPTION[tier]}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
              {members.map((c) => (
                <div key={c.agentId} id={c.agentId} className="scroll-mt-24">
                  <CharacterCard character={c} showLink={false} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section className="py-12">
        <div className="card-base p-6 sm:p-8">
          <h3 className="text-base font-semibold text-white sm:text-lg">
            Visual canon
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {joinedCast
              .filter((c) => c.artUrl !== "")
              .map((c) => (
                <div
                  key={c.agentId}
                  className="relative aspect-square overflow-hidden rounded-xl border border-[#c0392b]/15 bg-[#0d0606]"
                >
                  <Image
                    src={c.artUrl}
                    alt={c.agent.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white">
                      {c.agent.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Locked references for the canonical look. New characters are
            generated to match: Pixar-style 3D agent on a real photographic
            AI-lab plate, ID badge on chest, signature color glow, one role
            prop. See <code className="text-[#c0392b]">content/series/CASTING.md</code>
            {" "}for the prompt template.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
