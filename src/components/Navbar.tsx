"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Lab", href: "/lab" },
  { label: "Evolution", href: "/evolution" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "SemeClaw", href: "/semeclaw" },
  { label: "Daily News", href: "/daily-news" },
  { label: "Learning", href: "/learning" },
  { label: "n8n", href: "/n8n" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#c0392b]/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#c0392b] to-[#8b1a1a] shadow-[0_0_20px_rgba(192,57,43,0.3)] sm:h-9 sm:w-9">
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5">
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
          <span className="text-base font-bold tracking-tight text-white sm:text-lg">
            DansLab
          </span>
          <span className="hidden rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-2 py-0.5 text-[9px] font-mono font-semibold text-[#e74c3c] sm:inline">
            v2
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "nav-link-active"
                    : "nav-link"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="http://localhost:10272/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Zap size={12} />
            <span className="hidden sm:inline">Hermes</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-[#c0392b]/10 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#c0392b]/10 bg-black/95 px-4 pb-4 pt-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#c0392b]/15 font-semibold text-[#e74c3c]"
                    : "text-zinc-400 hover:bg-[#c0392b]/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="http://localhost:10272/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-lg bg-[#c0392b]/15 px-4 py-2.5 text-sm font-semibold text-[#e74c3c]"
          >
            <Zap size={14} />
            Hermes
          </a>
        </div>
      )}
    </nav>
  );
}
