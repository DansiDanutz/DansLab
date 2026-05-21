import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/danslab/Nav";
import { Footer } from "@/components/danslab/Footer";
import { SpaceBackground } from "@/components/danslab/SpaceBackground";

export const metadata: Metadata = {
  title: "DansLab — A human-led autonomous AI lab",
  description:
    "A fleet of 30+ AI agents orchestrated across 5 droplets and a Mac Studio. Building, shipping, trading 24/7. Founded by Dan Semenescu in Cluj-Napoca.",
  openGraph: {
    title: "DansLab — A human-led autonomous AI lab",
    description:
      "30+ agents · 5 products · 1 human. Hermes (brain) + David (orchestrator) lead a droplet fleet shipping Nervix.ai, CrawdBot, MyWork-AI, zmarty.me, OpenClaw.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SpaceBackground />
        <div className="dl-app">
          <div className="dl-grid-overlay" />
          <Nav />
          <main className="dl-wrap">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
