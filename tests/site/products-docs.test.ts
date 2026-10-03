import { test } from "node:test";
import assert from "node:assert/strict";

import { AGENTS, CORE_AGENT_ORDER, PRODUCTS } from "../../src/lib/danslab-data";
import { PROJECT_DOCS } from "../../src/lib/project-docs";

test("product ids are unique", () => {
  const ids = PRODUCTS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every product docs link points at an existing docs page", () => {
  const docIds = new Set(PROJECT_DOCS.map((d) => d.id));
  for (const product of PRODUCTS) {
    if (!product.docs) continue;
    assert.equal(product.docs, `/docs/${product.id}`, `${product.id} docs path`);
    assert.ok(docIds.has(product.id), `${product.id} is missing a PROJECT_DOCS entry`);
  }
});

test("every docs page belongs to a product", () => {
  const productIds = new Set(PRODUCTS.map((p) => p.id));
  for (const doc of PROJECT_DOCS) {
    assert.ok(productIds.has(doc.id), `${doc.id} has no matching product`);
  }
});

test("product links are absolute https urls or in-site paths", () => {
  for (const product of PRODUCTS) {
    assert.match(product.href, /^(https:\/\/|\/)/, `${product.id} href`);
    assert.notEqual(product.href, "#", `${product.id} has a placeholder link`);
  }
});

test("flagship tier holds the production-ready products", () => {
  const flagship = PRODUCTS.filter((p) => p.tier === "flagship").map((p) => p.id);
  for (const id of ["nervix", "nervixpay", "youtubestudio", "fakereal", "semeclaw"]) {
    assert.ok(flagship.includes(id), `${id} should be flagship`);
  }
});

test("core crew resolves to eight known agents flagged core", () => {
  assert.equal(CORE_AGENT_ORDER.length, 8);
  for (const id of CORE_AGENT_ORDER) {
    const agent = AGENTS.find((a) => a.id === id);
    assert.ok(agent, `${id} is not defined in AGENTS`);
    assert.equal(agent?.core, true, `${id} should be flagged core`);
  }
});
