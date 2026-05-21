import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecosystem — DansLab",
  description:
    "Interactive 3D map of the 28-agent DansLab fleet — pan, zoom, drag, and watch 5 real workflows (bug fix, ship feature, learn, revenue, lab sync) execute end-to-end across Slack, Telegram, GitHub, and Vercel.",
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
