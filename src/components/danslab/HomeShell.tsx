"use client";

import { useState } from "react";
import type { Agent } from "@/lib/danslab-data";
import { Hero } from "./Hero";
import { StatStrip } from "./StatStrip";
import { WhatWeDo } from "./WhatWeDo";
import { ChannelBridge } from "./ChannelBridge";
import { Products } from "./Products";
import { Harness } from "./Harness";
import { AgentGrid } from "./AgentGrid";
import { Drawer } from "./Drawer";

const SCROLL_OFFSET_PX = 60;

export function HomeShell({ youtubeKpi }: { youtubeKpi?: string }) {
  const [openAgent, setOpenAgent] = useState<Agent | null>(null);

  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <Hero
        onSeeProducts={() => scrollTo("#dl-products")}
        onSeeHarness={() => scrollTo("#dl-harness")}
      />
      <StatStrip />
      <WhatWeDo />
      <ChannelBridge youtubeKpi={youtubeKpi} />
      <Products youtubeKpi={youtubeKpi} />
      <Harness />
      <AgentGrid onOpen={setOpenAgent} />
      <Drawer agent={openAgent} onClose={() => setOpenAgent(null)} />
    </>
  );
}
