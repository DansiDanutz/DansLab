import Image from "next/image";
import type { Video } from "@/lib/videos";

function VideoFrame({ video }: { video: Video }) {
  const { source, title } = video;
  if (source.kind === "youtube") {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${source.id}`}
        title={title}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
      />
    );
  }
  return (
    <>
      <Image src={source.poster} alt="" fill sizes="(max-width: 720px) 100vw, 360px" />
      <span className="video-soon">Coming soon</span>
    </>
  );
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
