import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// tsconfig keeps JSX as-is, so the nav is checked as source rather than rendered.
const nav = readFileSync(new URL("../../src/components/danslab/Nav.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");

const phoneBlock = css.slice(css.indexOf("@media (max-width: 720px)"));

test("phones get a menu button that exposes every page link", () => {
  assert.match(nav, /className="dl-nav-toggle"/, "no menu button in the nav");
  assert.match(nav, /aria-expanded=\{open\}/, "menu button does not report its state");
  assert.match(nav, /aria-controls="dl-nav-links"/, "menu button is not tied to the links");
  assert.match(nav, /id="dl-nav-links"/);
  assert.match(phoneBlock, /\.dl-nav-toggle\s*\{[^}]*display:\s*inline-flex/, "menu button stays hidden on phones");
  assert.match(phoneBlock, /\.dl-nav-links\.is-open\s*\{[^}]*display:\s*flex/, "open menu never shows the links");
});

test("the phone menu closes after navigating or pressing Escape", () => {
  assert.match(nav, /useEffect\(\(\) => setOpen\(false\), \[pathname\]\)/, "menu stays open on the next page");
  assert.match(nav, /e\.key === "Escape"/, "Escape does not close the menu");
});

test("the nav reaches the contact page on every screen size", () => {
  assert.match(nav, /href: "\/contact"/);
});
