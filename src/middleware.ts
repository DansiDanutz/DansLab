import { NextRequest, NextResponse } from "next/server";

/**
 * Bearer token auth for /api/pipeline/* routes.
 *
 * Why: pipeline endpoints trigger Python subprocesses that spend money
 * (LLM tokens, render compute, optional uploads). Public access = trivial
 * cost-burn vector. This gate enforces a shared bearer token.
 *
 * Token comes from PIPELINE_API_TOKEN env var. Compared in constant time
 * to prevent timing attacks. Missing env var fails closed (501 — refuses
 * to serve auth-gated routes if no token is configured).
 *
 * Read-only metric endpoints stay open intentionally; pipeline-controlling
 * routes (status, run, jobs, configs, metrics) are all gated.
 */

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function extractBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function middleware(request: NextRequest) {
  const expected = process.env.PIPELINE_API_TOKEN;

  // Fail-closed: if the server has no token configured, refuse to serve
  // the protected routes. This prevents "deployed without auth setup" from
  // silently exposing pipeline control.
  if (!expected || expected.length < 16) {
    return NextResponse.json(
      {
        ok: false,
        error: "pipeline auth not configured",
        detail: "PIPELINE_API_TOKEN must be set to a value of at least 16 chars",
      },
      { status: 501 },
    );
  }

  const provided = extractBearer(request.headers.get("authorization"));
  if (!provided) {
    return NextResponse.json(
      { ok: false, error: "missing bearer token" },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  if (!constantTimeEqual(provided, expected)) {
    return NextResponse.json(
      { ok: false, error: "invalid bearer token" },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/pipeline/:path*"],
};
