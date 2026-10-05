import { NextResponse, type NextRequest } from "next/server";

import { checkAuditAccess } from "@/lib/basic-auth";

/**
 * Gates the INTERNAL fleet audit dashboard (/audit) behind HTTP Basic Auth.
 *
 * DansLab is a public marketing site with no user system, and the audit
 * dashboard exposes internal security posture (which projects are unaudited),
 * so it must never be public. Set AUDIT_USER and AUDIT_PASS in the deployment
 * env. If either is unset, in any environment, the route fails CLOSED (503)
 * rather than serving the dashboard openly. The page is served by the /audit route handler
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
  const access = checkAuditAccess(
    process.env.AUDIT_USER,
    process.env.AUDIT_PASS,
    req.headers.get("authorization") ?? "",
  );

  if (access === "allowed") return NextResponse.next();
  if (access === "unconfigured") {
    // Fail closed in every environment, including local dev.
    return new NextResponse("Audit dashboard is not configured.", { status: 503 });
  }
  return unauthorized();
}
