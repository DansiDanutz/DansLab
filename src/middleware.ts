import { NextResponse, type NextRequest } from "next/server";

/**
 * Gates the INTERNAL fleet audit dashboard (/audit) behind HTTP Basic Auth.
 *
 * DansLab is a public marketing site with no user system, and the audit
 * dashboard exposes internal security posture (which projects are unaudited),
 * so it must never be public. Set AUDIT_USER and AUDIT_PASS in the deployment
 * env. If they're unset in production the route fails CLOSED (503) rather than
 * serving the dashboard openly. The page itself lives at /public/audit.html;
 * this rewrites the clean /audit URL onto it after the auth check, and also
 * guards direct hits on /audit.html.
 */
export const config = { matcher: ["/audit", "/audit.html"] };

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function serveDashboard(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/audit.html";
  return NextResponse.rewrite(url);
}

function unauthorized(): NextResponse {
  // Header values are Latin-1 only — keep the realm plain ASCII.
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="DansLab internal", charset="UTF-8"' },
  });
}

export function middleware(req: NextRequest): NextResponse {
  const user = process.env.AUDIT_USER;
  const pass = process.env.AUDIT_PASS;

  if (!user || !pass) {
    // Never serve it open. Denied in prod; allowed in dev for convenience.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Audit dashboard is not configured.", { status: 503 });
    }
    return serveDashboard(req);
  }

  const header = req.headers.get("authorization") ?? "";
  const expected = "Basic " + btoa(`${user}:${pass}`);
  if (header && constantTimeEqual(header, expected)) {
    return serveDashboard(req);
  }
  return unauthorized();
}
