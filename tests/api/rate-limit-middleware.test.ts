import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../../src/middleware";
import { _resetRateLimitStore } from "../../src/lib/rate-limit";

const VALID_TOKEN = "test-token-1234567890abcdef-32chars";

function makeRequest(authHeader: string, ip = "10.0.0.1"): NextRequest {
  const headers = new Headers();
  headers.set("authorization", authHeader);
  headers.set("x-forwarded-for", ip);
  return new NextRequest(new URL("http://localhost/api/pipeline/run"), { headers });
}

describe("rate limit middleware integration", () => {
  let originalToken: string | undefined;
  let originalMax: string | undefined;

  beforeEach(() => {
    originalToken = process.env.PIPELINE_API_TOKEN;
    originalMax = process.env.PIPELINE_RATE_LIMIT_PER_MIN;
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    _resetRateLimitStore();
  });

  afterEach(() => {
    if (originalToken === undefined) delete process.env.PIPELINE_API_TOKEN;
    else process.env.PIPELINE_API_TOKEN = originalToken;
    if (originalMax === undefined) delete process.env.PIPELINE_RATE_LIMIT_PER_MIN;
    else process.env.PIPELINE_RATE_LIMIT_PER_MIN = originalMax;
  });

  test("first 3 requests pass with valid token + low cap", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "3";
    for (let i = 0; i < 3; i++) {
      const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
      assert.notEqual(res.status, 429, `req ${i + 1} should pass`);
    }
  });

  test("4th request returns 429 once cap is 3", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "3";
    for (let i = 0; i < 3; i++) middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.equal(res.status, 429);
  });

  test("429 includes Retry-After and X-RateLimit-* headers", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "1";
    middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get("Retry-After")) > 0);
    assert.equal(res.headers.get("X-RateLimit-Limit"), "1");
    assert.equal(res.headers.get("X-RateLimit-Remaining"), "0");
    assert.ok(Number(res.headers.get("X-RateLimit-Reset")) > 0);
  });

  test("different IPs with same token are throttled independently", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "2";
    // Burn ip1's quota
    middleware(makeRequest(`Bearer ${VALID_TOKEN}`, "10.0.0.1"));
    middleware(makeRequest(`Bearer ${VALID_TOKEN}`, "10.0.0.1"));
    const blocked = middleware(makeRequest(`Bearer ${VALID_TOKEN}`, "10.0.0.1"));
    assert.equal(blocked.status, 429);
    // ip2 should still be fresh
    const fresh = middleware(makeRequest(`Bearer ${VALID_TOKEN}`, "10.0.0.2"));
    assert.notEqual(fresh.status, 429);
  });

  test("401 requests do not consume rate budget", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "2";
    // 10 bad-token requests
    for (let i = 0; i < 10; i++) {
      middleware(makeRequest("Bearer wrong-token-but-correct-length-32"));
    }
    // Valid token should still have full budget
    const ok = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.notEqual(ok.status, 429);
    assert.equal(ok.headers.get("X-RateLimit-Remaining"), "1");
  });

  test("passing requests carry X-RateLimit-* headers", () => {
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "10";
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.equal(res.headers.get("X-RateLimit-Limit"), "10");
    assert.equal(res.headers.get("X-RateLimit-Remaining"), "9");
    assert.ok(Number(res.headers.get("X-RateLimit-Reset")) > 0);
  });
});
