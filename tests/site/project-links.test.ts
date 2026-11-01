import assert from "node:assert/strict";
import { test } from "node:test";

import { PRODUCTS, YOUTUBE_CHANNEL_URL } from "../../src/lib/danslab-data";

// Curated flagship set: only polished, live surfaces, one card per product.
const FLAGSHIP_PROJECT_IDS = [
  "adnow",
  "dailystock",
  "danslabvideo",
  "dexty",
  "fakereal",
  "nervix",
  "nervixpay",
  "preflop",
  "reality",
  "repoaudit",
  "shikaku",
  "worldcup26",
  "youtube",
  "zmarty",
].sort();

// Removed as duplicates, placeholders, login-only shells or this site itself.
const EXCLUDED_PROJECT_IDS = [
  "danslab",
  "crawdbot",
  "crawboard",
  "marketplace",
  "zmartrise",
  "pokerclubcluj",
  "pokercluj",
  "pokeragent",
  "livetranslation",
  "dansemenescu",
  "danmatei",
  "scoalafotbal",
  "staticdeployment",
];

test("project grid shows exactly the curated flagship set", () => {
  const ids = PRODUCTS.map((product) => product.id).sort();

  assert.deepEqual(ids, FLAGSHIP_PROJECT_IDS);
  for (const id of EXCLUDED_PROJECT_IDS) {
    assert.ok(!ids.includes(id), `${id} must not be listed`);
  }
});

test("project cards have no duplicate ids, names or destinations", () => {
  const unique = (values: string[]) => new Set(values.map((v) => v.toLowerCase())).size;

  assert.equal(unique(PRODUCTS.map((p) => p.id)), PRODUCTS.length);
  assert.equal(unique(PRODUCTS.map((p) => p.name)), PRODUCTS.length);
  assert.equal(unique(PRODUCTS.map((p) => new URL(p.href).hostname.replace(/^www\./, ""))), PRODUCTS.length);
});

test("project cards use HTTPS destinations without placeholders", () => {
  for (const product of PRODUCTS) {
    assert.match(product.href, /^https:\/\//, `${product.name} must use HTTPS`);
    assert.notEqual(product.href, "#", `${product.name} must not use a placeholder link`);
  }
});

test("flagship products use their canonical public destinations", () => {
  const hrefById = new Map(PRODUCTS.map((product) => [product.id, product.href]));

  assert.equal(hrefById.get("nervix"), "https://nervix.ai");
  assert.equal(hrefById.get("nervixpay"), "https://nervixpay.live");
  assert.equal(hrefById.get("fakereal"), "https://www.fake-real.live");
  assert.equal(hrefById.get("dexty"), "https://dexty.live");
  assert.equal(hrefById.get("repoaudit"), "https://repoaudit.vercel.app");
  assert.equal(hrefById.get("youtube"), YOUTUBE_CHANNEL_URL);
});
