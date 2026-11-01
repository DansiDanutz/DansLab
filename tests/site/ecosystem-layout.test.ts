import assert from "node:assert/strict";
import { test } from "node:test";

import { AGENT_MAP, CONNECTIONS, SCENARIOS, TIERS } from "../../src/app/ecosystem/data";
import { computeLayout, edgePath, metricsFor } from "../../src/app/ecosystem/map-layout";

const WIDTHS = [320, 375, 768, 1024, 1440];
const tierNodeIds = TIERS.flatMap((tier) => tier.nodes);

test("every ecosystem node belongs to exactly one tier", () => {
  assert.equal(new Set(tierNodeIds).size, tierNodeIds.length, "a node is listed in two tiers");
  for (const id of tierNodeIds) assert.ok(AGENT_MAP.has(id), `${id} has no agent record`);
});

test("connections and scenarios only reference nodes on the map", () => {
  const onMap = new Set(tierNodeIds);
  const connIds = new Set(CONNECTIONS.map((c) => c.id));
  for (const c of CONNECTIONS) {
    assert.ok(onMap.has(c.from) && onMap.has(c.to), `${c.id} points off the map`);
  }
  for (const s of SCENARIOS) {
    for (const step of s.steps) {
      for (const id of step.agents) assert.ok(onMap.has(id), `${s.id} highlights unknown node ${id}`);
      for (const id of step.conns) assert.ok(connIds.has(id), `${s.id} lights unknown edge ${id}`);
    }
  }
});

for (const width of WIDTHS) {
  test(`layout at ${width}px keeps every node inside the canvas with room for its label`, () => {
    const layout = computeLayout(TIERS, width);
    const minGap = metricsFor(width).minColumn;
    const points = tierNodeIds.map((id) => ({ id, ...layout.nodes[id] }));

    for (const p of points) {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${p.id} was not placed`);
      assert.ok(p.x >= minGap / 2 - 1 && p.x <= width - minGap / 2 + 1, `${p.id} overflows horizontally (${p.x})`);
      assert.ok(p.y > 0 && p.y < layout.height, `${p.id} overflows vertically`);
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const [a, b] = [points[i], points[j]];
        if (Math.abs(a.y - b.y) < 1) {
          assert.ok(Math.abs(a.x - b.x) >= minGap - 0.5, `${a.id} and ${b.id} overlap at ${width}px`);
        }
      }
    }
  });
}

test("tier bands stack in order without overlapping", () => {
  const { tiers } = computeLayout(TIERS, 1024);
  for (let i = 1; i < tiers.length; i++) {
    assert.ok(tiers[i].top >= tiers[i - 1].top + tiers[i - 1].height, `${tiers[i].id} overlaps ${tiers[i - 1].id}`);
  }
});

test("edge paths curve between tiers and arc within a row", () => {
  assert.match(edgePath({ x: 0, y: 0 }, { x: 100, y: 200 }), /^M 0 0 C /);
  assert.match(edgePath({ x: 0, y: 50 }, { x: 100, y: 50 }), /^M 0 50 Q 50 \d+(\.\d+)? 100 50$/);
});
