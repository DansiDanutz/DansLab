import { test } from "node:test";
import assert from "node:assert/strict";

import sitemap from "../../src/app/sitemap";
import robots from "../../src/app/robots";

const ROUTES = ["/", "/ecosystem", "/lab", "/semeclaw", "/story", "/contact"];

test("sitemap lists every public route exactly once", () => {
  const entries = sitemap();
  const paths = entries.map((e) => new URL(e.url).pathname);
  assert.deepEqual(paths.sort(), [...ROUTES].sort());
  for (const entry of entries) {
    assert.ok(entry.url.startsWith("https://danslab.vercel.app"));
  }
});

test("robots allows crawling and points at the sitemap", () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  assert.equal(rules?.allow, "/");
  assert.equal(r.sitemap, "https://danslab.vercel.app/sitemap.xml");
});
