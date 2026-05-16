"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Studio", href: "/studio" },
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
            <Film size={18} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-white sm:text-lg">
            YouTube Pipeline
          </span>
          <span className="hidden rounded-full border border-[#c0392b]/25 bg-[#c0392b]/10 px-2 py-0.5 text-[9px] font-mono font-semibold text-[#e74c3c] sm:inline">
            v2.0
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
        </div>
      )}
    </nav>
  );
}
