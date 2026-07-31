import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/danslab/Nav";
import { Footer } from "@/components/danslab/Footer";
import { SpaceBackground } from "@/components/danslab/SpaceBackground";
import { PRODUCTS } from "@/lib/danslab-data";

const productionProjectCount = PRODUCTS.length;

export const metadata: Metadata = {
  metadataBase: new URL("https://danslab.vercel.app"),
  title: {
    default: "DansLab - A human-led autonomous AI lab",
    template: "%s | DansLab",
  },
  description:
    `A fleet of 30+ AI agents orchestrated across 5 droplets and a Mac Studio, with ${productionProjectCount} RepoAudit-verified production projects.`,
  keywords: [
    "DansLab",
    "multi-agent AI",
    "autonomous AI lab",
    "RepoAudit",
    "CrawdBot",
    "CrawBoard",
    "ZmartRise",
    "OpenClaw",
    "Dan Semenescu",
    "Cluj-Napoca AI",
  ],
  authors: [{ name: "Dan Semenescu", url: "https://github.com/DansiDanutz" }],
  openGraph: {
    title: "DansLab - A human-led autonomous AI lab",
    description:
      `30+ agents, ${productionProjectCount} RepoAudit-verified production projects, and one human orchestrating the DansLab fleet.`,
    type: "website",
    url: "https://danslab.vercel.app",
    siteName: "DansLab",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DansLab - A human-led autonomous AI lab",
    description:
      `30+ agents, ${productionProjectCount} audited production projects, and one human. Built by Dan Semenescu in Cluj-Napoca.`,
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
