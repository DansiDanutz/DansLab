import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

import { AUDIT_HTML } from "../../src/internal/audit-html";

test("audit dashboard is not a public static file", () => {
  assert.equal(existsSync("public/audit.html"), false);
});

test("audit dashboard markup is served from the gated route module", () => {
  assert.match(AUDIT_HTML, /Audit Dashboard/);
});

test("fixed-findings total matches the audited rows' chips", () => {
  const chips = [...AUDIT_HTML.matchAll(/<span class="chip [chml]">(\d+)[CHML]<\/span>/g)];
  const sum = chips.reduce((n, m) => n + Number(m[1]), 0);
  assert.match(AUDIT_HTML, new RegExp(`<span class="n">${sum}</span><span class="l">Findings fixed`));
});
