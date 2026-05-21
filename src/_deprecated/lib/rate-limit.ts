/**
 * In-memory sliding-window rate limiter.
 *
 * Design choices:
 * - Sliding window with bucket-of-timestamps. Simple, accurate, no clock skew.
 * - Per-key state. Caller picks the key (bearer token, IP, composite).
 * - In-memory only. Resets on process restart. Single-instance only.
 *   For multi-instance deploys, swap the store implementation for Redis.
 * - Cleanup: lazy eviction on each check; entries with no recent hits drop out.
 *
 * Why not a library:
 * - Next.js edge middleware constrains imports; this stays zero-dep.
 * - Token-bucket libraries add complexity we don't need for a single per-token
 *   limit. Sliding window gives accurate burst behavior with one parameter pair.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number; // epoch ms when the oldest in-window hit will expire
}

export interface RateLimitOptions {
  /** Window size in milliseconds. Default 60_000 (1 minute). */
  windowMs?: number;
  /** Max requests allowed in window. Default 60. */
  max?: number;
}

// Module-scoped store. One Map keyed by rate-limit key, value is array of hit timestamps (ms).
const store = new Map<string, number[]>();

/**
 * Records a hit and returns whether it was allowed under the limit.
 *
 * Mutation note: stores write-side state in the module-scoped Map. The Map is
 * the cache, not the source of truth. Each call rewrites the value for `key`
 * with a fresh filtered+appended array; we never mutate an existing array.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 60;
  const now = Date.now();
  const windowStart = now - windowMs;

  const prevHits = store.get(key) ?? [];
  // Keep only hits within the window
  const inWindow = prevHits.filter((t) => t > windowStart);

  if (inWindow.length >= max) {
    // Do NOT record this hit (it's rejected). Keep the existing filtered set.
    store.set(key, inWindow);
    const oldestHit = inWindow[0];
    return {
      allowed: false,
      limit: max,
      remaining: 0,
      resetAtMs: oldestHit + windowMs,
    };
  }

  // Allowed — append this hit immutably
  const next = [...inWindow, now];
  store.set(key, next);
  return {
    allowed: true,
    limit: max,
    remaining: Math.max(0, max - next.length),
    resetAtMs: next[0] + windowMs,
  };
}

/**
 * Test-only helper. Clears all rate-limit state.
 * Do not call in production code paths.
 */
export function _resetRateLimitStore(): void {
  store.clear();
}
