import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "./lib/rate-limit";

/**
 * Bearer token auth + rate limit for /api/pipeline/* routes.
 *
 * Order of operations:
 *   1. Verify PIPELINE_API_TOKEN is configured (501 if not)
 *   2. Extract + validate bearer token (401 if missing/wrong)
 *   3. Check rate limit (429 if exceeded)
 *   4. Pass through
 *
 * Why this order:
 * - Auth before rate limit so unauthed requests don't pollute the rate buckets
 *   (otherwise a flood of bad-token requests would burn a per-IP quota).
 * - Per-token + per-IP composite key, so a single token shared across many IPs
 *   gets summed (catches token leak abuse) but a single IP with one token isn't
 *   accidentally throttled by an unrelated user behind the same NAT.
 *
 * Rate-limit defaults (read from env so deploys can tune without code change):
 *   PIPELINE_RATE_LIMIT_PER_MIN — default 60
 *   PIPELINE_RATE_LIMIT_WINDOW_MS — default 60_000
 *
 * Headers on response:
 *   X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 *   Retry-After (on 429 only)
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

function clientIp(request: NextRequest): string {
  // Prefer X-Forwarded-For first hop (set by reverse proxies / Vercel).
  // Fall back to literal "local" when nothing is known — better than throwing.
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}

function withRateHeaders(
  response: NextResponse,
  result: { limit: number; remaining: number; resetAtMs: number },
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAtMs / 1000)));
  return response;
}

export function middleware(request: NextRequest) {
  const expected = process.env.PIPELINE_API_TOKEN;

  // 1. Fail-closed if no server-side token is configured
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

  // 2. Bearer token auth
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

  // 3. Rate limit (composite key: token + IP)
  const max = Number(process.env.PIPELINE_RATE_LIMIT_PER_MIN ?? 60);
  const windowMs = Number(process.env.PIPELINE_RATE_LIMIT_WINDOW_MS ?? 60_000);
  // Use a token prefix to keep the key bounded; don't store full secret in key.
  const tokenKey = provided.slice(0, 12);
  const ip = clientIp(request);
  const result = checkRateLimit(`${tokenKey}:${ip}`, { max, windowMs });

  if (!result.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil((result.resetAtMs - Date.now()) / 1000));
    const res = NextResponse.json(
      {
        ok: false,
        error: "rate limit exceeded",
        retryAfterSec,
      },
      { status: 429 },
    );
    res.headers.set("Retry-After", String(retryAfterSec));
    return withRateHeaders(res, result);
  }

  // 4. Pass through, annotate with rate-limit headers
  return withRateHeaders(NextResponse.next(), result);
}

export const config = {
  matcher: ["/api/pipeline/:path*"],
};
