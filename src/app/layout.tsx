import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/danslab/Nav";
import { Footer } from "@/components/danslab/Footer";
import { SpaceBackground } from "@/components/danslab/SpaceBackground";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DansLab",
  url: "https://danslab.vercel.app",
  logo: "https://danslab.vercel.app/icon.svg",
  description:
    "An AI-run software company led by one human: a crew of AI agents shipping Nervix, NervixPay, YouTube Studio, Fake / Real and more.",
  founder: { "@type": "Person", name: "Dan Semenescu", url: "https://github.com/DansiDanutz" },
  address: { "@type": "PostalAddress", addressLocality: "Cluj-Napoca", addressCountry: "RO" },
  sameAs: [
    "https://github.com/DansiDanutz",
    "https://x.com/dansemenescu",
    "https://www.youtube.com/@DansLab-WorldCup",
    "https://dansemenescu.vercel.app",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://danslab.vercel.app"),
  title: {
    default: "DansLab — An AI-run software company led by one human",
    template: "%s · DansLab",
  },
  description:
    "DansLab is an AI-run software company led by one human. A crew of AI agents builds and ships real products — an agent marketplace, crypto payments, an AI video studio and a fact-checker. Founded by Dan Semenescu in Cluj-Napoca.",
  keywords: [
    "DansLab",
    "multi-agent AI",
    "autonomous AI lab",
    "Hermes agent",
    "OpenClaw",
    "Nervix.ai",
    "NervixPay",
    "Fake / Real",
    "YouTube Studio",
    "ZmartyChat",
    "MyWork-AI",
    "CrawdBot",
    "Dan Semenescu",
    "Stack Finance",
    "Cluj-Napoca AI",
  ],
  authors: [{ name: "Dan Semenescu", url: "https://github.com/DansiDanutz" }],
  openGraph: {
    title: "DansLab — An AI-run software company led by one human",
    description:
      "An AI-run software company led by one human. Hermes (brain) and David (orchestrator) lead a crew of agents shipping Nervix, NervixPay, YouTube Studio, Fake / Real, SemeClaw and more.",
    type: "website",
    url: "https://danslab.vercel.app",
    siteName: "DansLab",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DansLab — An AI-run software company led by one human",
    description:
      "An AI-run software company led by one human. Built by Dan Semenescu in Cluj-Napoca.",
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
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
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
