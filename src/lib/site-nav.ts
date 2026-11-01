// The site's own pages, in menu order. The header menu and the footer both read
// this list so a page added here shows up in both places.
export const SITE_PAGES = [
  { label: "Home", href: "/" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Lab", href: "/lab" },
  { label: "SemeClaw", href: "/semeclaw" },
  { label: "Story", href: "/story" },
  { label: "Contact", href: "/contact" },
] as const;
