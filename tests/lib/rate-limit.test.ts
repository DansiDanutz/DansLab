import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, _resetRateLimitStore } from "../../src/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => _resetRateLimitStore());

  test("allows requests under the limit", () => {
    for (let i = 0; i < 5; i++) {
      const r = checkRateLimit("k", { max: 5, windowMs: 60_000 });
      assert.equal(r.allowed, true);
    }
  });

  test("blocks once the limit is reached and reports remaining=0", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("k", { max: 3, windowMs: 60_000 });
    const blocked = checkRateLimit("k", { max: 3, windowMs: 60_000 });
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
  });

  test("keys are independent", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("a", { max: 3, windowMs: 60_000 });
    const blocked = checkRateLimit("a", { max: 3, windowMs: 60_000 });
    const fresh = checkRateLimit("b", { max: 3, windowMs: 60_000 });
    assert.equal(blocked.allowed, false);
    assert.equal(fresh.allowed, true);
  });

  test("remaining counts down correctly", () => {
    const r1 = checkRateLimit("k", { max: 3, windowMs: 60_000 });
    const r2 = checkRateLimit("k", { max: 3, windowMs: 60_000 });
    const r3 = checkRateLimit("k", { max: 3, windowMs: 60_000 });
    assert.equal(r1.remaining, 2);
    assert.equal(r2.remaining, 1);
    assert.equal(r3.remaining, 0);
  });

  test("resetAtMs is in the future on first hit", () => {
    const r = checkRateLimit("k", { max: 5, windowMs: 60_000 });
    assert.ok(r.resetAtMs > Date.now());
    assert.ok(r.resetAtMs <= Date.now() + 60_000);
  });

  test("very small window expires hits", async () => {
    checkRateLimit("k", { max: 2, windowMs: 50 });
    checkRateLimit("k", { max: 2, windowMs: 50 });
    const blocked = checkRateLimit("k", { max: 2, windowMs: 50 });
    assert.equal(blocked.allowed, false);
    await new Promise((r) => setTimeout(r, 80));
    const after = checkRateLimit("k", { max: 2, windowMs: 50 });
    assert.equal(after.allowed, true);
  });
});
