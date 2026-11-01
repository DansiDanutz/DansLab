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

test("the product grid renders art from both registries", () => {
  const grid = readFileSync(new URL("../../src/components/danslab/Products.tsx", import.meta.url), "utf8");

  assert.match(grid, /import \{ ProductCovers \} from "\.\/ProductCovers";/);
  assert.match(grid, /const Art = ProductArt\[p\.id\] \?\? ProductCovers\[p\.id\];/);
});

test("animated covers pause for reduced-motion users", () => {
  const covers = readFileSync(new URL("../../src/components/danslab/ProductCovers.tsx", import.meta.url), "utf8");

  assert.match(covers, /prefers-reduced-motion: reduce/);
  assert.match(covers, /pauseAnimations\(\)/);
  assert.match(covers, /<svg ref=\{svgRef\}/);
});
