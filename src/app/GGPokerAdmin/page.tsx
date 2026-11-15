import type { Metadata } from "next";
import GuideClient from "@/components/ggpoker-guide/GuideClient";
import { GUIDE_CHAPTERS } from "@/lib/ggpoker-guide/data";

export const metadata: Metadata = {
  title: "GGPokerAdmin — Ghidul complet DanGG",
  description:
    "Învață administrarea DanGG, pas cu pas: toate cele 18 secțiuni, Marketplace, utilizatori, mese, turnee, backup, exemple și exerciții interactive. Ghid complet în română.",
  alternates: { canonical: "/GGPokerAdmin" },
  openGraph: {
    title: "DanGG, explicat. Ghidul complet de administrare",
    description:
      "De la primul clic la operarea zilnică. Instrucțiuni în română, exemple, căutare și exerciții pentru fiecare secțiune din admin.",
    url: "https://danslab.vercel.app/GGPokerAdmin",
    siteName: "DansLab",
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GGPokerAdmin — Ghidul complet DanGG",
    description: "Toate cele 18 secțiuni de administrare, explicate în română, pas cu pas.",
  },
};

export default function GGPokerAdminGuidePage() {
  return <GuideClient chapters={GUIDE_CHAPTERS} />;
}
