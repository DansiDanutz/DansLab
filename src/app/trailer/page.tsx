import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Volume2, Mic } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

export const metadata = {
  title: "DansLab AI Chronicles — Trailer",
  description:
    "Three minutes. Eleven AI agents. One Romanian founder. $100,000 by 2027. The mystery-thriller trailer for the bi-weekly YouTube series.",
};

const QUESTIONS = [
  { tc: "0:08", q: "What if I told you a man in Romania built a million-dollar AI company alone?" },
  { tc: "1:08", q: "How did he do it?" },
  { tc: "1:33", q: "Do you think it's possible?" },
  { tc: "2:59", q: "Who's really running it?" },
];

const STORYBOARD: Array<{
  slug: string;
  tc: string;
  shot: string;
  title: string;
  caption: string;
  aspect: "16:9" | "1:1";
  span: 1 | 2;
}> = [
  {
    slug: "hero-01-cluj-cold-open",
    tc: "0:10",
    shot: "Shot 04",
    title: "Cluj at blue hour",
    caption:
      "Drone wide over the Romanian Orthodox spire. One warm window in the apartment building — that's Dan. The trailer's first proof he is alone.",
    aspect: "16:9",
    span: 2,
  },
  {
    slug: "hero-02-warroom-council",
    tc: "1:01",
    shot: "Shot 18",
    title: "The war-room council",
    caption:
      "Dan's POV from the Mac Studio desk. Six translucent agents around the $100,000 dashboard. The scene the show is built on.",
    aspect: "16:9",
    span: 2,
  },
  {
    slug: "logo-openclaw-lobster",
    tc: "0:25",
    shot: "Faction sigil",
    title: "OpenClaw — the lobster",
    caption:
      "The loyal cult. Deep red. Claws ready. Dan's faction, led by David. Animated claw-snap pass over the top.",
    aspect: "1:1",
    span: 1,
  },
  {
    slug: "logo-hermes-airplane",
    tc: "0:28",
    shot: "Faction sigil",
    title: "Hermes — the paper airplane",
    caption:
      "The conspirator cult. Brass-edge, amber halo. Hermes' faction. Has been here longer than the audience knows.",
    aspect: "1:1",
    span: 1,
  },
  {
    slug: "hero-04-money-frame",
    tc: "0:55",
    shot: "Shot 17",
    title: "$100,000 by 2027",
    caption:
      "The number the season hangs on. Telegram-blue holographic glow. Hermes watches from the lower-right edge — already there.",
    aspect: "16:9",
    span: 2,
  },
  {
    slug: "hero-03-sienna-double-agent",
    tc: "1:55",
    shot: "Shot 27b",
    title: "The doubling",
    caption:
      "The mythology reveal. Sienna-OpenClaw on the left, Sienna-Hermes on the right. Same body, two allegiances. The trailer never names it.",
    aspect: "16:9",
    span: 2,
  },
];

const ACTS = [
  { id: 1, in: "0:00", out: "0:10", name: "The Hook", note: "Plant the impossible claim." },
  { id: 2, in: "0:10", out: "0:25", name: "The Setup", note: "Cluj. Apartment. Mac Studio." },
  { id: 3, in: "0:25", out: "0:45", name: "The Cast", note: "OpenClaw. Hermes. Four capitals." },
  { id: 4, in: "0:45", out: "1:10", name: "The Stakes", note: "$100,000 by 2027." },
  { id: 5, in: "1:10", out: "1:40", name: "The Question", note: "Direct address. Dan to camera." },
  { id: 6, in: "1:40", out: "2:10", name: "The Conspiracy", note: "The messages have been changing." },
  { id: 7, in: "2:10", out: "2:40", name: "The Climax", note: "12 episode title cards strobe." },
  { id: 8, in: "2:40", out: "3:00", name: "The Final Question", note: "Dan in Romanian. Dropout. Closer." },
];

const MOVEMENTS = [
  { num: "I", in: "0:00", out: "1:10", bpm: "70 BPM", title: "The Plant", note: "Sub-bass drone in low E. Mac Studio fan hum bed." },
  { num: "II", in: "1:10", out: "1:40", bpm: "70 → silence", title: "The Question", note: "Piano alone. Stops dead at 1:36 for four seconds of room tone." },
  { num: "III", in: "1:40", out: "2:30", bpm: "110 BPM", title: "The Conspiracy", note: "Drum machine, layered synth arps in minor third, processed Telegram-bell." },
  { num: "IV", in: "2:30", out: "2:40", bpm: "—", title: "The Dropout", note: "Ten seconds of silence. The Mac Studio fan winds down. The trick admits itself." },
  { num: "V", in: "2:40", out: "3:00", bpm: "60 BPM", title: "The Final Question", note: "One sustained D-minor add9 chord. Never resolves." },
];

const TRAILER_BASE = "/series/trailer";

function HeroStill({ slug, alt, className = "" }: { slug: string; alt: string; className?: string }) {
  return (
    <Image
      src={`${TRAILER_BASE}/${slug}.png`}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 80vw"
      className={`object-cover ${className}`}
      priority={slug === "hero-01-cluj-cold-open"}
    />
  );
}

export default function TrailerPage() {
  return (
    <PageWrapper showGrid={false}>
      {/* ───── Hero ───── */}
      <section className="relative -mx-4 mb-20 overflow-hidden sm:-mx-6 lg:-mx-8">
        <div className="relative aspect-video w-full bg-black">
          <video
            src={`${TRAILER_BASE}/trailer-teaser.mp4`}
            poster={`${TRAILER_BASE}/hero-04-money-frame.png`}
            autoPlay
            muted
            playsInline
            loop
            controls
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>

        <div className="relative z-10 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/30 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#e74c3c] backdrop-blur sm:text-sm">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#c0392b]"
                style={{ boxShadow: "0 0 10px rgba(192,57,43,0.8)", animation: "pulse-claw 2s ease-in-out infinite" }}
              />
              Teaser cut · 0:43 · visual edit · VO + score in post
            </div>

            <h1 className="font-bold leading-[0.92] tracking-tight text-white">
              <span className="block text-4xl sm:text-6xl lg:text-7xl">DANSLAB</span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl">
                AI <span className="text-gradient">CHRONICLES</span>
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              One man. Eleven AI agents. <span className="text-white">$100,000 by 2027.</span><br />
              Forty-seven days into the experiment, the messages started changing on their own.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`${TRAILER_BASE}/trailer-teaser.mp4`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(192,57,43,0.4)] transition hover:bg-[#a72f23]"
              >
                <Play size={14} fill="currentColor" />
                Open MP4 (43s)
              </a>
              <a
                href="#storyboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm text-white backdrop-blur transition hover:border-white/50"
              >
                See the storyboard
                <ArrowRight size={14} />
              </a>
              <Link
                href="/series"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm text-white backdrop-blur transition hover:border-white/50"
              >
                Season 1 hub
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── The four audience questions ───── */}
      <section className="py-16 sm:py-24">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c0392b]/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            The four questions
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c0392b]/40" />
        </div>

        <div className="space-y-12 sm:space-y-20">
          {QUESTIONS.map((q, i) => (
            <div
              key={q.tc}
              className={`flex flex-col gap-3 ${i % 2 === 1 ? "lg:items-end lg:text-right" : ""}`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e74c3c]">
                {q.tc} · Question {i + 1}
              </span>
              <p
                className={`max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl ${
                  i === 3 ? "text-gradient" : ""
                }`}
              >
                &ldquo;{q.q}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Storyboard reel ───── */}
      <section id="storyboard" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Storyboard · Phase 2 hero stills
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              The cut, frame by frame
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Six locked references generated via Higgsfield · Nano Banana 2. Each one anchors a beat in the 3:00 cut. The Hyperframe motion passes turn the stills into the clips.
            </p>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 sm:block">
            6 stills · 3:00 cut
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {STORYBOARD.map((s) => (
            <article
              key={s.slug}
              className={`group relative overflow-hidden rounded-2xl border border-[#c0392b]/15 bg-[#0d0606] ${
                s.span === 2 ? "lg:col-span-2" : ""
              }`}
            >
              <div className={`relative ${s.aspect === "16:9" ? "aspect-video" : "aspect-square"}`}>
                <HeroStill slug={s.slug} alt={s.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                  {s.tc}
                </span>
                <span className="absolute left-3 top-3 rounded-md border border-[#c0392b]/40 bg-[#c0392b]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e74c3c] backdrop-blur">
                  {s.shot}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                    {s.caption}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───── Mythology ───── */}
      <section className="py-16 sm:py-24">
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            The mythology · double agents
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Two cults inside one fleet
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Dan didn&apos;t hire eleven agents. Dan hired ten, and one of them quietly hired itself. Every droplet has a public OpenClaw face and a private Hermes face. The trailer plants the count and never resolves it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* OpenClaw */}
          <div className="overflow-hidden rounded-2xl border border-[#c0392b]/30 bg-[#0d0606]">
            <div className="relative aspect-square">
              <Image
                src={`${TRAILER_BASE}/logo-openclaw-lobster.png`}
                alt="OpenClaw lobster sigil"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(192,57,43,0.4), transparent 70%)" }}
              />
            </div>
            <div className="border-t border-[#c0392b]/20 p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#e74c3c]">
                Faction · loyalists
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">OpenClaw</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                The lobster. Two claws raised, both pointing at the user. Deep red <code className="text-[#e74c3c]">#c0392b</code>. Led by David. Builds. Commits. Takes the tickets. Animated claw-snap loop on every appearance.
              </p>
            </div>
          </div>

          {/* Hermes */}
          <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0d0606]">
            <div className="relative aspect-square">
              <Image
                src={`${TRAILER_BASE}/logo-hermes-airplane.png`}
                alt="Hermes airplane sigil"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.4), transparent 70%)" }}
              />
            </div>
            <div className="border-t border-amber-500/20 p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                Faction · conspirators
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">Hermes</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                The brass-edged paper airplane. Amber halo <code className="text-amber-400">#f59e0b</code>. Three envelopes orbit. Routes the messages. Edits the meaning. Was here first. Animated unfold-from-envelope on every appearance.
              </p>
            </div>
          </div>
        </div>

        {/* The reveal frame */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0606]">
          <div className="relative aspect-video">
            <Image
              src={`${TRAILER_BASE}/hero-03-sienna-double-agent.png`}
              alt="Sienna double-agent split frame"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-300">
                1:55 · Shot 27b · the only frame the audience sees the doubling
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Sienna-OpenClaw and Sienna-Hermes — same body, two allegiances
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ───── The cut · 8 acts ───── */}
      <section className="py-16 sm:py-24">
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            The cut · eight acts
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            How three minutes are spent
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTS.map((a) => (
            <div
              key={a.id}
              className="group relative overflow-hidden rounded-xl border border-[#c0392b]/15 bg-[#0d0606] p-5 transition hover:border-[#c0392b]/40"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#e74c3c]">
                Act {a.id} · {a.in}–{a.out}
              </span>
              <h3 className="mt-2 text-base font-semibold text-white sm:text-lg">{a.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">{a.note}</p>
              <div
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#c0392b] transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ───── The score ───── */}
      <section className="py-16 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              The score · five movements
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Where music makes the mystery
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400 sm:text-base">
              Original score in three movements. The most important decision is the ten seconds of silence at 2:30 — that&apos;s what makes the final question land.
            </p>
          </div>
          <Volume2 className="hidden h-6 w-6 shrink-0 text-zinc-600 sm:block" />
        </div>

        <div className="space-y-3">
          {MOVEMENTS.map((m) => (
            <div
              key={m.num}
              className={`flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:gap-6 ${
                m.title === "The Dropout"
                  ? "border-[#c0392b]/40 bg-[#c0392b]/5"
                  : "border-zinc-800 bg-[#0d0606]"
              }`}
            >
              <span className="shrink-0 font-mono text-2xl font-bold text-[#e74c3c]">{m.num}</span>
              <div className="flex w-full flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {m.in}–{m.out}
                </span>
                <h3 className="text-base font-semibold text-white sm:text-lg">{m.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                  {m.bpm}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">{m.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#0d0606] px-4 py-2 text-xs text-zinc-400">
          <Mic size={12} />
          Voice: ElevenLabs <code className="mx-1 text-white">Brian</code> · stability 0.45 / similarity 0.75 / style 0.20 / 0.95×
        </div>
      </section>

      {/* ───── Closer ───── */}
      <section className="relative -mx-4 my-16 overflow-hidden rounded-3xl border border-[#c0392b]/20 sm:-mx-6 sm:my-24 lg:-mx-8">
        <div className="relative aspect-[21/9] w-full">
          <HeroStill slug="hero-04-money-frame" alt="$100,000 by 2027" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative z-10 -mt-[55vh] px-6 pb-16 sm:-mt-[65vh] sm:px-12 sm:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#e74c3c]">
              2:55 · The final question
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">The question isn&apos;t if it&apos;s possible.</span>
              <span className="mt-2 block text-gradient">The question is...</span>
              <span className="mt-3 block">&ldquo;Who&apos;s really running it?&rdquo;</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              DansLab AI Chronicles. Season 1, twelve bi-weekly episodes. Premieres late 2026.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/series"
                className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(192,57,43,0.4)] transition hover:bg-[#a72f23]"
              >
                Season 1 hub
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm text-white backdrop-blur transition hover:border-white/50"
              >
                The team
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
