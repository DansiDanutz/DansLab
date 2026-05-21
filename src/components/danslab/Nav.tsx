"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Lab", href: "/lab" },
  { label: "SemeClaw", href: "/semeclaw" },
  { label: "Story", href: "/story" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="dl-nav">
      <div className="dl-nav-inner">
        <Link href="/" className="dl-logo">
          <span className="dl-logo-mark">D</span>
          Dans<span style={{ color: "var(--dl-accent-hot)" }}>Lab</span>
          <span className="dl-logo-sub">{"// v2026.4"}</span>
        </Link>
        <div className="dl-nav-links">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`dl-nav-link ${active ? "is-active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <a
          className="dl-nav-cta"
          href="https://nervix.ai"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff", boxShadow: "0 0 8px #fff" }} />
          Enter Lab
        </a>
      </div>
    </nav>
  );
}
