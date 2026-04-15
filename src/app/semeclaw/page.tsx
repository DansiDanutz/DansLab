"use client";

import { useState, useEffect } from "react";
import { Terminal, Github } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const WAR_ROOM_URL = "http://127.0.0.1:8765";

export default function SemeClawPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        await fetch(`${WAR_ROOM_URL}/api/state`, {
          signal: controller.signal,
          mode: "no-cors",
        });
        clearTimeout(timeout);
        setIframeLoaded(true);
      } catch {
        setIframeError(true);
      }
    };
    checkServer();
  }, []);

  return (
    <PageWrapper>
      <div className="py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e74c3c]">
            <span
              className="h-2 w-2 rounded-full bg-[#c0392b]"
              style={{ boxShadow: "0 0 12px rgba(192,57,43,0.6)" }}
            />
            War Room — AI Agent Fleet Coordinator
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">SemeClaw</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Multi-agent research pipeline with Dexter, David, Memo & Hermes.
            Research → Strategy → Architecture → Writing → Paperclip tracking.
            Powered by qwen3.6-plus with live browser automation & code sandbox.
          </p>
        </div>

        {/* Quick links */}
        <div className="mb-6 flex flex-wrap gap-3">
          <a
            href="https://github.com/DansiDanutz/SemeClaw"
            target="_blank"
            rel="noopener noreferrer"
            className="card-base inline-flex items-center gap-1.5 px-4 py-2 text-xs text-zinc-300 transition hover:border-[#c0392b]/40 hover:text-white"
          >
            <Github size={12} />
            GitHub Repo
          </a>
          <div className="card-base inline-flex items-center gap-1.5 px-4 py-2 text-xs text-zinc-500">
            <Terminal size={12} />
            python war_room/war_room.py run &quot;your task&quot;
          </div>
        </div>

        {/* Dashboard iframe or placeholder */}
        {iframeError ? (
          <div className="card-base p-8 text-center sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#c0392b]/30 bg-gradient-to-br from-[#1a0a0a] to-[#0a0505] shadow-[0_0_30px_rgba(192,57,43,0.15)]">
              <Terminal size={28} className="text-[#c0392b]" />
            </div>
            <h2 className="text-lg font-bold text-white">
              War Room Server Not Running
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Start the War Room dashboard to see the live interface here:
            </p>
            <div className="mx-auto mt-4 max-w-md rounded-lg border border-[#c0392b]/20 bg-[#0a0505] p-4 text-left">
              <p className="font-mono text-xs text-[#e74c3c]">
                cd ~/SemeClaw
                <br />
                uv run python war_room/dashboard/server.py
              </p>
            </div>
            <div className="mt-6 space-y-2 text-left text-xs text-zinc-500">
              <p className="font-semibold text-zinc-400">Available commands:</p>
              <p className="font-mono">
                <span className="text-[#d4a017]">war_room.py run</span>{" "}
                &quot;Research AI marketplaces&quot; — Run a task
              </p>
              <p className="font-mono">
                <span className="text-[#d4a017]">war_room.py logs</span> —
                View run history
              </p>
              <p className="font-mono">
                <span className="text-[#d4a017]">war_room.py board</span> —
                Show Paperclip board
              </p>
              <p className="font-mono">
                <span className="text-[#d4a017]">war_room.py report</span>{" "}
                latest — Show last report
              </p>
            </div>
          </div>
        ) : (
          <div className="card-base overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#c0392b]/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#c0392b]" />
                <span className="text-[11px] font-mono text-zinc-400">
                  War Room Dashboard — {WAR_ROOM_URL}
                </span>
              </div>
              <a
                href={WAR_ROOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#e74c3c] hover:underline"
              >
                Open in new tab →
              </a>
            </div>
            <iframe
              src={WAR_ROOM_URL}
              className="w-full border-0"
              style={{ height: "calc(100vh - 220px)", minHeight: "600px" }}
              title="SemeClaw War Room Dashboard"
              allow="clipboard-write"
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
