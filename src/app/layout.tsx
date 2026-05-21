import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/danslab/Nav";
import { Footer } from "@/components/danslab/Footer";
import { SpaceBackground } from "@/components/danslab/SpaceBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://danslab.vercel.app"),
  title: {
    default: "DansLab — A human-led autonomous AI lab",
    template: "%s · DansLab",
  },
  description:
    "A fleet of 30+ AI agents orchestrated across 5 droplets and a Mac Studio. Building, shipping, trading 24/7. Founded by Dan Semenescu in Cluj-Napoca.",
  keywords: [
    "DansLab",
    "multi-agent AI",
    "autonomous AI lab",
    "Hermes agent",
    "OpenClaw",
    "Nervix.ai",
    "ZmartyChat",
    "MyWork-AI",
    "CrawdBot",
    "Dan Semenescu",
    "Stack Finance",
    "Cluj-Napoca AI",
  ],
  authors: [{ name: "Dan Semenescu", url: "https://github.com/DansiDanutz" }],
  openGraph: {
    title: "DansLab — A human-led autonomous AI lab",
    description:
      "30+ agents · 5 products · 1 human. Hermes (brain) + David (orchestrator) lead a droplet fleet shipping Nervix.ai, CrawdBot, MyWork-AI, zmarty.me, OpenClaw.",
    type: "website",
    url: "https://danslab.vercel.app",
    siteName: "DansLab",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DansLab — A human-led autonomous AI lab",
    description:
      "30+ agents · 5 products · 1 human. Built by Dan Semenescu in Cluj-Napoca.",
    creator: "@dansemenescu",
  },
  robots: { index: true, follow: true },
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
