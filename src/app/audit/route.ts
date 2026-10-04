import { renderAuditPage } from "@/lib/audit-page";

// Only reached after src/middleware.ts has passed the Basic-Auth check.
// Fleet data comes from the private AUDIT_DATA env var, never from the repo.
export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response(renderAuditPage(process.env.AUDIT_DATA), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
