import { NextResponse, type NextRequest } from "next/server";

import { isValidBasicAuth } from "@/lib/basic-auth";

/**
 * Gates the INTERNAL fleet audit dashboard (/audit) behind HTTP Basic Auth.
 *
 * DansLab is a public marketing site with no user system, and the audit
 * dashboard exposes internal security posture (which projects are unaudited),
 * so it must never be public. Set AUDIT_USER and AUDIT_PASS in the deployment
 * env. If they're unset in production the route fails CLOSED (503) rather than
 * serving the dashboard openly. The page is served by the /audit route handler
 * (src/app/audit/route.ts); it is deliberately NOT under /public, where a
 * static file would bypass this gate.
 */
export const config = { matcher: ["/audit"] };

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
    return NextResponse.next();
  }

  const header = req.headers.get("authorization") ?? "";
  if (isValidBasicAuth(header, user, pass)) {
    return NextResponse.next();
  }
  return unauthorized();
}
