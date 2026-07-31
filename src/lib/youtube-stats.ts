// Server-only: fetch live channel stats from the public YouTube page.
// Falls back to null on any failure — callers keep the static KPI.
import { YOUTUBE_CHANNEL_URL } from "@/lib/danslab-data";

const REVALIDATE_SECONDS = 60 * 60 * 24; // daily

export type YoutubeStats = {
  subscribers: string; // e.g. "13.9K"
  videos: string | null; // e.g. "133"
};

export async function getYoutubeStats(): Promise<YoutubeStats | null> {
  try {
    const res = await fetch(`${YOUTUBE_CHANNEL_URL}/about`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "SOCS=CAI",
        "User-Agent": "Mozilla/5.0 (compatible; DansLabBot/1.0)",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const subs = html.match(/"subscriberCountText":"([\d.,]+\s?[KM]?)\s/);
    if (!subs) return null;

    const videos = html.match(/"videoCountText":"([\d.,]+)\s/);
    return {
      subscribers: subs[1].replace(/\s+$/, "").replace(",", "."),
      videos: videos ? videos[1] : null,
    };
  } catch {
    return null;
  }
}
