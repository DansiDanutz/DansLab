import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "Architecture map of the DansLab fleet — every agent, channel and service in seven tiers, with five real workflows (bug fix, ship feature, learn, revenue, lab sync) traced end-to-end across Slack, Telegram, GitHub and Vercel.",
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
