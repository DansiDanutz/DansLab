import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Footer } from "../../src/components/danslab/Footer";
import { SITE_PAGES } from "../../src/lib/site-nav";

// tests/tsconfig.json compiles JSX, so components can be rendered here rather than read as source.
function footerPageLinks(): { href: string; label: string }[] {
  const html = renderToStaticMarkup(createElement(Footer));
  const column = html.match(/<h4>LAB<\/h4><ul>(.*?)<\/ul>/);
  assert.ok(column, "footer has no LAB column");
  return [...column[1].matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(([, href, label]) => ({ href, label }));
}

test("every page in the app directory is in the site page list", () => {
  const appDir = new URL("../../src/app/", import.meta.url);
  const routes = readdirSync(appDir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith("page.tsx"))
    .map((file) => "/" + file.replace(/\/?page\.tsx$/, ""));
  assert.deepEqual(SITE_PAGES.map((page) => page.href).sort(), [...routes].sort());
  assert.equal(new Set(SITE_PAGES.map((page) => page.label)).size, SITE_PAGES.length, "two pages share a label");
});

test("the rendered footer links every page except Home, Contact included", () => {
  assert.deepEqual(footerPageLinks(), [
    { href: "/ecosystem", label: "Ecosystem" },
    { href: "/lab", label: "Lab" },
    { href: "/semeclaw", label: "SemeClaw" },
    { href: "/story", label: "Story" },
    { href: "/contact", label: "Contact" },
  ]);
});
