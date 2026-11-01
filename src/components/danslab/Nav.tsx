"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Lab", href: "/lab" },
  { label: "SemeClaw", href: "/semeclaw" },
  { label: "Story", href: "/story" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const pathname = usePathname();
  // Phones hide the inline links; the toggle opens them as a dropdown panel.
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="dl-nav">
      <div className="dl-nav-inner">
        <Link href="/" className="dl-logo">
          <span className="dl-logo-mark">D</span>
          Dans<span style={{ color: "var(--dl-accent-hot)" }}>Lab</span>
          <span className="dl-logo-sub">{"// v2026.4"}</span>
        </Link>
        <div id="dl-nav-links" className={`dl-nav-links ${open ? "is-open" : ""}`}>
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`dl-nav-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="dl-nav-actions">
          <Link
            className="dl-nav-cta"
            href="/#dl-products"
            onClick={() => setOpen(false)}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff", boxShadow: "0 0 8px #fff" }} />
            View Projects
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="dl-nav-toggle"
            aria-expanded={open}
            aria-controls="dl-nav-links"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`dl-nav-burger ${open ? "is-open" : ""}`} aria-hidden />
          </button>
        </div>
      </div>
    </nav>
  );
}
