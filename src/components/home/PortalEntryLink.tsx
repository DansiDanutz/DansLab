"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PcPortalCard } from "./EntryIllustrations";

export default function PortalEntryLink() {
  const router = useRouter();
  const [activating, setActivating] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        if (activating) return;
        setActivating(true);
        window.setTimeout(() => {
          router.push("/lab");
        }, 420);
      }}
      className="text-left"
      aria-label="Enter DansLab"
    >
      <PcPortalCard activating={activating} />
    </button>
  );
}
