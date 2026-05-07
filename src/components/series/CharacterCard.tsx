import Image from "next/image";
import Link from "next/link";
import type { JoinedCastMember } from "@/components/series/data/cast";

export default function CharacterCard({
  character,
  showLink = true,
}: {
  character: JoinedCastMember;
  showLink?: boolean;
}) {
  const { agent, archetype, voiceName, prop, artUrl, firstAppearance } =
    character;
  const hasArt = artUrl !== "";

  const inner = (
    <div
      className="card-base group flex h-full flex-col overflow-hidden p-0 transition hover:border-[#c0392b]/40"
      style={{
        boxShadow: hasArt
          ? `0 0 0 1px ${agent.glow.replace("0.4", "0.15")}`
          : undefined,
      }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden bg-[#1a0a0a]"
        style={{
          background: hasArt
            ? undefined
            : `linear-gradient(135deg, ${agent.glow.replace("0.4", "0.25")}, transparent)`,
        }}
      >
        {hasArt ? (
          <Image
            src={artUrl}
            alt={agent.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{
                backgroundColor: agent.color,
                boxShadow: `0 0 40px ${agent.glow}`,
              }}
            >
              {agent.initials}
            </div>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 60%, #0a0505 100%)`,
          }}
        />
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white backdrop-blur-sm">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: agent.color }}
          />
          {hasArt ? "REF LOCKED" : "REF TODO"}
        </div>
        <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
          E{firstAppearance.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-white">{agent.name}</h3>
          <span
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: agent.color }}
          >
            {agent.role}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">{archetype}</p>
        <dl className="mt-auto grid grid-cols-1 gap-1 text-[11px] text-zinc-500">
          <div className="flex justify-between gap-2">
            <dt className="text-zinc-600">Voice</dt>
            <dd className="truncate text-right text-zinc-400">{voiceName}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-zinc-600">Prop</dt>
            <dd className="truncate text-right text-zinc-400">{prop}</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  if (!showLink) return inner;

  return (
    <Link href={`/series/cast#${agent.id}`} className="block h-full">
      {inner}
    </Link>
  );
}
