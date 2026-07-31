import { HomeShell } from "@/components/danslab/HomeShell";
import { getYoutubeStats } from "@/lib/youtube-stats";

export default async function Home() {
  const yt = await getYoutubeStats();
  const youtubeKpi = yt
    ? `${yt.subscribers} subscribers${yt.videos ? ` · ${yt.videos} videos` : ""}`
    : undefined;
  return <HomeShell youtubeKpi={youtubeKpi} />;
}
