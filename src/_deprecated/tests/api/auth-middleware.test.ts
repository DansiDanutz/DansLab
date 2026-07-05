import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware";
import { _resetRateLimitStore } from "../../lib/rate-limit";

const VALID_TOKEN = "test-token-1234567890abcdef-32chars";

function makeRequest(authHeader?: string): NextRequest {
  const headers = new Headers();
  if (authHeader) headers.set("authorization", authHeader);
  return new NextRequest(new URL("http://localhost/api/pipeline/run"), {
    headers,
  });
}

describe("auth middleware: /api/pipeline/* gate", () => {
  let originalToken: string | undefined;
  let originalMax: string | undefined;

  beforeEach(() => {
    originalToken = process.env.PIPELINE_API_TOKEN;
    originalMax = process.env.PIPELINE_RATE_LIMIT_PER_MIN;
    // Keep auth tests isolated from any rate-limit state from prior tests
    _resetRateLimitStore();
    // Set a generous cap so auth tests never accidentally hit 429
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "10000";
  });

  afterEach(() => {
    if (originalToken === undefined) delete process.env.PIPELINE_API_TOKEN;
    else process.env.PIPELINE_API_TOKEN = originalToken;
    if (originalMax === undefined) delete process.env.PIPELINE_RATE_LIMIT_PER_MIN;
    else process.env.PIPELINE_RATE_LIMIT_PER_MIN = originalMax;
  });

  test("returns 501 when PIPELINE_API_TOKEN is unset (fail-closed)", () => {
    delete process.env.PIPELINE_API_TOKEN;
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.equal(res.status, 501);
  });

  test("returns 501 when PIPELINE_API_TOKEN is too short", () => {
    process.env.PIPELINE_API_TOKEN = "short";
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    assert.equal(res.status, 501);
  });

  test("returns 401 when no Authorization header is sent", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest());
    assert.equal(res.status, 401);
    assert.equal(res.headers.get("WWW-Authenticate"), "Bearer");
  });

  test("returns 401 when Authorization header has wrong scheme", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest(`Basic ${VALID_TOKEN}`));
    assert.equal(res.status, 401);
  });

  test("returns 401 when bearer token does not match", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest("Bearer wrong-token-but-correct-length-32"));
    assert.equal(res.status, 401);
  });

  test("returns 401 when bearer is correct prefix but wrong length", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}extra`));
    assert.equal(res.status, 401);
  });

  test("passes through when bearer token matches exactly", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    // NextResponse.next() returns status 200 with x-middleware-next header
    assert.notEqual(res.status, 401);
    assert.notEqual(res.status, 501);
    assert.notEqual(res.status, 429);
    assert.equal(res.headers.get("x-middleware-next"), "1");
  });

  test("accepts lowercase 'bearer' scheme (RFC 6750 case-insensitive)", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest(`bearer ${VALID_TOKEN}`));
    assert.notEqual(res.status, 401);
  });

  test("returns 401 when bearer token is empty after scheme", () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest("Bearer "));
    assert.equal(res.status, 401);
  });

  test("response bodies are JSON-shaped with ok=false", async () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    const res = middleware(makeRequest());
    const body = await res.json();
    assert.equal(body.ok, false);
    assert.equal(typeof body.error, "string");
  });

  test("returns 429 after configured per-minute quota is exceeded", async () => {
    process.env.PIPELINE_API_TOKEN = VALID_TOKEN;
    process.env.PIPELINE_RATE_LIMIT_PER_MIN = "2";

    const first = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    const second = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));
    const third = middleware(makeRequest(`Bearer ${VALID_TOKEN}`));

    assert.equal(first.headers.get("x-middleware-next"), "1");
    assert.equal(second.headers.get("x-middleware-next"), "1");
    assert.equal(third.status, 429);
    assert.equal(third.headers.get("X-RateLimit-Remaining"), "0");
    assert.ok(Number(third.headers.get("Retry-After")) >= 1);
    const body = await third.json();
    assert.equal(body.ok, false);
    assert.equal(body.error, "rate limit exceeded");
  });
});
