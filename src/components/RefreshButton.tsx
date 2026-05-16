"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

/**
 * Triggers a Server Component re-render so the dashboard re-queries
 * the pipeline status. Uses startTransition so the spinner animates
 * for the full duration of the re-fetch.
 */
export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:opacity-60"
      aria-label="Refresh pipeline status"
    >
      <RefreshCw size={12} className={isPending ? "animate-spin" : ""} />
      <span>{isPending ? "Refreshing…" : "Refresh"}</span>
    </button>
  );
}
