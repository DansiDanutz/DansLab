import Image from "next/image";
import type { Video } from "@/lib/videos";

function VideoFrame({ video }: { video: Video }) {
  const { source, title, poster } = video;
  switch (source.kind) {
    case "file":
      return (
        <video controls playsInline preload="none" poster={poster} aria-label={title}>
          <source src={source.url} type="video/mp4" />
        </video>
      );
    case "youtube":
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${source.id}`}
          title={title}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
        />
      );
    case "soon":
      return (
        <>
          <Image src={poster} alt="" fill sizes="(max-width: 720px) 100vw, 360px" />
          <span className="video-soon">Coming soon</span>
        </>
      );
  }
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="video-card">
      <div className="video-frame">
        <VideoFrame video={video} />
      </div>
      <div className="video-info">
        <h2>{video.title}</h2>
        <span className="video-length">{video.length}</span>
        {video.tagline ? <p>{video.tagline}</p> : null}
      </div>
    </article>
  );
}
