import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getPipelineStatus } from "../../lib/pipeline-status";

/**
 * These tests run against a process with no engines available (CI is fine —
 * none of HyperFrames/ComfyUI/Remotion/Ollama exist there). The function
 * must gracefully degrade and still return a valid shape.
 *
 * If you run locally and have engines installed, the `healthy: false`
 * assertions on individual engines will not hold — skip those tests in
 * that environment by setting LIVE_PIPELINE_ENGINES=1.
 */

const LIVE = process.env.LIVE_PIPELINE_ENGINES === "1";

describe("getPipelineStatus", () => {
  test("returns a complete PipelineStatus shape", async () => {
    const status = await getPipelineStatus();
    assert.equal(typeof status.healthy, "boolean");
    assert.ok(Array.isArray(status.engines));
    assert.ok(status.engines.length > 0, "engines array should not be empty");
    assert.equal(typeof status.queue, "object");
    assert.equal(typeof status.queue.queued, "number");
    assert.equal(typeof status.queue.processing, "number");
    assert.equal(typeof status.queue.dead_letter, "number");
    assert.equal(typeof status.queue.total_jobs, "number");
    assert.equal(typeof status.lastRun, "string");
    assert.equal(typeof status.version, "string");
  });

  test("lastRun is a recent ISO timestamp", async () => {
    const before = Date.now();
    const status = await getPipelineStatus();
    const parsed = Date.parse(status.lastRun);
    assert.ok(!Number.isNaN(parsed), "lastRun must be parseable ISO date");
    assert.ok(parsed >= before - 1000, "lastRun must be >= before-call time");
    assert.ok(parsed <= Date.now() + 1000, "lastRun must be <= now");
  });

  test("each engine entry has a string name and boolean healthy", async () => {
    const status = await getPipelineStatus();
    for (const engine of status.engines) {
      assert.equal(typeof engine.name, "string", `engine name: ${JSON.stringify(engine)}`);
      assert.ok(engine.name.length > 0, "engine name must not be empty");
      assert.equal(typeof engine.healthy, "boolean", `engine healthy: ${JSON.stringify(engine)}`);
    }
  });

  test("version is non-empty", async () => {
    const status = await getPipelineStatus();
    assert.ok(status.version.length > 0);
  });

  test("does not throw when engines are unreachable", async () => {
    if (LIVE) return; // skip in environments where engines exist
    // The function must not throw — it should return false for unreachable engines
    await assert.doesNotReject(getPipelineStatus());
  });

  test("overall healthy is false when no engines + no queue", async () => {
    if (LIVE) return; // skip when engines are live
    const status = await getPipelineStatus();
    // In CI / dev without engines, queue.healthy=false because python pipeline
    // import will fail, and engines all false too. So overall must be false.
    if (!status.queue.healthy && status.engines.every((e) => !e.healthy)) {
      assert.equal(status.healthy, false);
    }
  });
});
