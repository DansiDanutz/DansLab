import assert from "node:assert/strict";
import { test } from "node:test";

import { PRODUCTS, YOUTUBE_CHANNEL_URL } from "../../src/lib/danslab-data";

const AUDITED_PROJECT_IDS = [
  "adsemeclaw",
  "crawboard",
  "crawdbot",
  "dailystock",
  "danmatei",
  "dansemenescu",
  "danslab",
  "danslabvideo",
  "game1",
  "livetranslation",
  "marketplace",
  "pokeragent",
  "pokercluj",
  "pokerclubcluj",
  "repoaudit",
  "scoalafotbal",
  "staticdeployment",
  "worldcup",
  "zmartrise",
].sort();

test("project grid contains the audited production set and live YouTube channel", () => {
  const auditedIds = PRODUCTS
    .filter((product) => product.id !== "youtube")
    .map((product) => product.id)
    .sort();

  assert.deepEqual(auditedIds, AUDITED_PROJECT_IDS);
  assert.equal(PRODUCTS.length, AUDITED_PROJECT_IDS.length + 1);
  assert.equal(PRODUCTS.find((product) => product.id === "youtube")?.href, YOUTUBE_CHANNEL_URL);
});

test("project cards use unique HTTPS destinations without placeholders", () => {
  const ids = PRODUCTS.map((product) => product.id);
  const hrefs = PRODUCTS.map((product) => product.href);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(hrefs).size, hrefs.length);

  for (const product of PRODUCTS) {
    assert.match(product.href, /^https:\/\//, `${product.name} must use HTTPS`);
    assert.notEqual(product.href, "#", `${product.name} must not use a placeholder link`);
  }
});

test("redirected products use their canonical public destinations", () => {
  const hrefById = new Map(PRODUCTS.map((product) => [product.id, product.href]));

  assert.equal(hrefById.get("repoaudit"), "https://repoaudit.vercel.app");
  assert.equal(hrefById.get("crawboard"), "https://team.crawdbot.com");
  assert.equal(hrefById.get("youtube"), "https://www.youtube.com/@DansLab-WorldCup");
});
