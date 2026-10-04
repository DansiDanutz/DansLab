import { YOUTUBE_CHANNEL_URL } from "@/lib/danslab-data";
import { SectionLabel } from "./atoms";

const PIPELINE_STEPS = [
  "Research", "Script", "Visual", "Scenes", "Audio",
  "Subtitles", "Render", "QA", "Final", "Add-ons",
];

const LINKS = [
  { label: "Watch the channel", note: "WorldCup Central on YouTube", href: YOUTUBE_CHANNEL_URL, external: true },
  { label: "Collect the cards", note: "Free legend cards — watch the story, unlock the card", href: "https://worldcup26.world", external: true },
  { label: "See how videos are made", note: "The YouTube Studio pipeline", href: "/docs/youtubestudio", external: false },
];

export function ChannelBridge({ youtubeKpi }: { youtubeKpi?: string }) {
  return (
    <section className="dl-bridge" id="dl-channel">
      <SectionLabel n={3} title="FROM THE CHANNEL" />
      <div className="dl-bridge-grid">
        <div>
          <h2 className="dl-h2">
            Came from YouTube?<br />
            <span className="dl-h2-dim">You&rsquo;re in the right place.</span>
          </h2>
          <p className="dl-bridge-copy">
            <b>WorldCup Central</b> is our channel: AI World Cup 2026 simulations, forgotten football
            legends and impossible matchups. Every video is produced by the lab on this page, using
            our own production pipeline.
          </p>
          {youtubeKpi && <div className="dl-bridge-kpi">{youtubeKpi}</div>}
        </div>

        <div className="dl-bridge-links">
          {LINKS.map((l) => (
            <a
              key={l.label}
              className="dl-bridge-link"
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer noopener" : undefined}
            >
              <span className="dl-bridge-link-label">{l.label}</span>
              <span className="dl-bridge-link-note">{l.note}</span>
              <span className="dl-bridge-link-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <div className="dl-pipeline" aria-label="YouTube Studio production pipeline">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step} className="dl-pipeline-step">
            <span className="dl-pipeline-n">{String(i + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
