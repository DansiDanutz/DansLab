import { AUDIT_HTML } from "@/internal/audit-html";

// Only reached after src/middleware.ts has passed the Basic-Auth check.
export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response(AUDIT_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
