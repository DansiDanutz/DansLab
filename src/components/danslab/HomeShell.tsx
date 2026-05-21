"use client";

import { useState } from "react";
import type { Agent } from "@/lib/danslab-data";
import { Hero } from "./Hero";
import { StatStrip } from "./StatStrip";
import { AgentGrid } from "./AgentGrid";
import { Products } from "./Products";
import { Drawer } from "./Drawer";

export function HomeShell() {
  const [openAgent, setOpenAgent] = useState<Agent | null>(null);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <Hero
        onEnterLab={() => scrollTo("#dl-agents")}
        onViewEcosystem={() => scrollTo("#dl-products")}
      />
      <StatStrip />
      <AgentGrid onOpen={setOpenAgent} />
      <Products />
      <Drawer agent={openAgent} onClose={() => setOpenAgent(null)} />
    </>
  );
}
