"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ChevronRight, Terminal, Github } from "lucide-react";

const WAR_ROOM_URL = "http://127.0.0.1:8765";

export default function SemeClawPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    // Check if the War Room server is accessible
    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const resp = await fetch(`${WAR_ROOM_URL}/api/state`, {
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
    <main
      className="relative min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0a0a 0%, #0a0505 45%, #000000 100%)",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(192,57,43,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(192,57,43,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#c0392b]/[0.06] blur-[150px]" />
      <div className="absolute bottom-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#d4a017]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* ───── NAVBAR ───── */}
        <nav className="flex items-center justify-between border-b border-[#c0392b]/10 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#c0392b] to-[#8b1a1a] shadow-[0_0_20px_rgba(192,57,43,0.3)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M7 14c-3-0.5-5 1-5.5 3.5 2.5 1 5 0.5 7-1M17 14c3-0.5 5 1 5.5 3.5-2.5 1-5 0.5-7-1M9 8c-1.2 1.2-2 3-2 5 0 3 2.5 5.5 5 5.5s5-2.5 5-5.5c0-2-0.8-3.8-2-5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="10.5" r="1" fill="white" />
                <circle cx="14" cy="10.5" r="1" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              DansLab
            </span>
            <span className="rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-2 py-0.5 text-[9px] font-mono font-semibold text-[#e74c3c]">
              v2
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="rounded-full border border-[#c0392b]/20 px-4 py-1.5 text-xs text-zinc-400 transition hover:border-[#c0392b]/40 hover:text-[#e74c3c]"
            >
              Lab
            </Link>
            <Link
              href="/evolution.html"
              className="rounded-full border border-[#c0392b]/20 px-4 py-1.5 text-xs text-zinc-400 transition hover:border-[#c0392b]/40 hover:text-[#e74c3c]"
            >
              Evolution
            </Link>
            <Link
              href="/ecosystem.html"
              className="rounded-full border border-[#c0392b]/20 px-4 py-1.5 text-xs text-zinc-400 transition hover:border-[#c0392b]/40 hover:text-[#e74c3c]"
            >
              Ecosystem
            </Link>
            <Link
              href="/semeclaw"
              className="rounded-full border border-[#e74c3c]/40 bg-[#c0392b]/15 px-4 py-1.5 text-xs font-semibold text-[#e74c3c] transition hover:border-[#e74c3c]/60 hover:bg-[#c0392b]/25"
            >
              SemeClaw
            </Link>
            <a
              href="http://localhost:10272/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#c0392b] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(192,57,43,0.3)] transition hover:bg-[#e74c3c] hover:shadow-[0_0_30px_rgba(192,57,43,0.45)]"
            >
              <Zap size={12} />
              Hermes
            </a>
          </div>
        </nav>

        {/* ───── SEMECLAW CONTENT ───── */}
        <div className="pb-8 pt-8">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e74c3c]">
              <span className="h-2 w-2 rounded-full bg-[#c0392b] shadow-[0_0_12px_rgba(192,57,43,0.6)]" />
              War Room — AI Agent Fleet Coordinator
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              <span className="bg-gradient-to-r from-[#e74c3c] via-[#d4a017] to-[#e74c3c] bg-clip-text text-transparent">
                SemeClaw
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
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
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c0392b]/20 bg-[#0d0606]/60 px-4 py-2 text-xs text-zinc-300 transition hover:border-[#c0392b]/40 hover:text-white"
            >
              <Github size={12} />
              GitHub Repo
            </a>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c0392b]/20 bg-[#0d0606]/60 px-4 py-2 text-xs text-zinc-500">
              <Terminal size={12} />
              python war_room/war_room.py run &quot;your task&quot;
            </div>
          </div>

          {/* Dashboard iframe or placeholder */}
          {iframeError ? (
            <div className="rounded-2xl border border-[#c0392b]/15 bg-[#0d0606]/60 p-12 text-center backdrop-blur-sm">
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
            <div className="relative overflow-hidden rounded-2xl border border-[#c0392b]/15 bg-[#0d0606]/60 backdrop-blur-sm">
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

        {/* ───── FOOTER ───── */}
        <div className="border-t border-[#c0392b]/10 py-8 text-center">
          <p className="text-xs text-zinc-600">
            Built by Dan &middot; Powered by{" "}
            <span className="text-[#c0392b]">OpenClaw</span> &middot;
            Orchestrated by David
          </p>
        </div>
      </div>
    </main>
  );
}
