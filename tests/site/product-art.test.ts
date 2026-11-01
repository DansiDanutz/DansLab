import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { PRODUCTS } from "../../src/lib/danslab-data";

// Read the art registries as source so the test needs no JSX runtime.
const registryKeys = (file: string, exportName: string) => {
  const source = readFileSync(new URL(`../../src/components/danslab/${file}`, import.meta.url), "utf8");
  const body = source.slice(source.indexOf(`export const ${exportName}`));
  return new Set([...body.matchAll(/^\s+([a-z0-9]+):\s+[A-Z]\w+,$/gm)].map((m) => m[1]));
};

test("every product card has cover art instead of the placeholder", () => {
  const keys = new Set([
    ...registryKeys("ProductArt.tsx", "ProductArt"),
    ...registryKeys("ProductCovers.tsx", "ProductCovers"),
  ]);

  for (const product of PRODUCTS) {
    assert.ok(keys.has(product.id), `${product.name} is missing cover art`);
  }
});
