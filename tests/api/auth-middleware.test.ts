import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../../src/middleware";

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

  beforeEach(() => {
    originalToken = process.env.PIPELINE_API_TOKEN;
  });

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.PIPELINE_API_TOKEN;
    } else {
      process.env.PIPELINE_API_TOKEN = originalToken;
    }
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
});
