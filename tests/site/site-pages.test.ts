import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { SITE_PAGES } from "../../src/lib/site-nav";

const footer = readFileSync(new URL("../../src/components/danslab/Footer.tsx", import.meta.url), "utf8");

test("every page in the app directory is in the site page list", () => {
  const appDir = new URL("../../src/app/", import.meta.url);
  const routes = readdirSync(appDir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith("page.tsx"))
    .map((file) => "/" + file.replace(/\/?page\.tsx$/, ""));
  assert.deepEqual(SITE_PAGES.map((page) => page.href).sort(), [...routes].sort());
  assert.equal(new Set(SITE_PAGES.map((page) => page.label)).size, SITE_PAGES.length, "two pages share a label");
});

test("the footer links every page except Home from the shared list", () => {
  assert.match(footer, /from "@\/lib\/site-nav"/, "footer keeps its own hand-written page links");
  assert.match(footer, /SITE_PAGES\.filter\(\(page\) => page\.href !== "\/"\)/);
  assert.doesNotMatch(footer, /<a href="\/(ecosystem|lab|semeclaw|story|contact)"/, "a hard-coded page link is back");
});
