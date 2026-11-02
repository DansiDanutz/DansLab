import assert from "node:assert/strict";
import { test } from "node:test";

// The browser bundle intentionally supports CommonJS for its deterministic data helpers.
const charts = require("../../public/viewer-charts.js");

test("chart summaries report equity movement and trade extremes", () => {
  const summaries = charts.chartSummaries({
    equity: [{ ts: 1, equity: 100 }, { ts: 2, equity: 112.5 }, { ts: 3, equity: 108 }],
    trades: [{ pnl: -3 }, { pnl: 8 }, { pnl: 0 }],
  });

  assert.match(summaries.equitySummary, /latest 108\.0 USDT · \+8\.0 since first sample/);
  assert.match(summaries.equitySummary, /range 100\.0–112\.5/);
  assert.match(summaries.tradeSummary, /3 closes · 1 positive · 2 non-positive · best \+8\.0 · worst -3\.0 USDT/);
});
