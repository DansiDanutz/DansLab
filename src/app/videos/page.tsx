import { SectionLabel } from "@/components/danslab/atoms";
import { VideoCard } from "@/components/danslab/VideoCard";
import { VIDEOS } from "@/lib/videos";

export const metadata = {
  title: "Videos · DansLab",
  description: "Every Dan's Lab episode in one place, from The Origin to The Flywheel.",
};

export default function VideosPage() {
  return (
    <div className="videos-page">
      <header className="contact-hero">
        <SectionLabel n={7} title="VIDEOS // DAN'S LAB" />
        <h1>
          Every <em>episode</em>, in one place.
        </h1>
        <p>How the lab was built, one film at a time. Press play on any of them.</p>
      </header>
      <div className="videos-grid">
        {VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
