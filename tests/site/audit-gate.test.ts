import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { AUDIT_TEMPLATE } from "../../src/internal/audit-html";
import { parseAuditData, renderAuditPage } from "../../src/lib/audit-page";

const DATA = JSON.stringify({
  updated: "2026-01-02",
  projects: [
    {
      name: "Alpha <b>",
      path: "/secret/alpha",
      verdict: "go",
      date: "2026-01-01",
      findings: { c: 1, h: 2, m: 3, l: 4 },
      reportUrl: "https://example.test/report?a=1&b=2",
    },
    { name: "Beta", path: "/secret/beta", verdict: "due" },
    { name: "Gamma", path: "/secret/gamma", verdict: "none", reportUrl: "javascript:alert(1)" },
  ],
});

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "_deprecated") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

test("audit dashboard is not a public static file", () => {
  assert.equal(existsSync("public/audit.html"), false);
});

test("committed source carries no fleet inventory, local paths or artifact URLs", () => {
  const forbidden = [/claude\.ai\/code\/artifact/, /~\/Projects\//, /~\/Desktop\//, /~\/Fable/];
  const auditFiles = /(^|\/)(audit|internal)(\/|-)|middleware\.ts$/;
  for (const file of walk("src")) {
    const text = readFileSync(file, "utf8");
    for (const re of forbidden) assert.doesNotMatch(text, re, `${file} matches ${re}`);
    if (auditFiles.test(file)) assert.doesNotMatch(text, /PokerAgent/, `${file} names an audited project`);
  }
});

test("template has placeholders for private data", () => {
  for (const key of ["{{STATS}}", "{{ROWS}}", "{{UPDATED}}"]) assert.ok(AUDIT_TEMPLATE.includes(key));
});

test("renders rows and stats from AUDIT_DATA, escaping markup", () => {
  const html = renderAuditPage(DATA);
  assert.match(html, /Alpha &#60;b&#62;/);
  assert.doesNotMatch(html, /Alpha <b>/);
  assert.match(html, /href="https:\/\/example\.test\/report\?a=1&#38;b=2"/);
  assert.match(html, /id="stat-tracked" data-base="3">3</);
  assert.match(html, /id="stat-notaudited" data-base="2">2</);
  assert.match(html, /<span class="n">10<\/span><span class="l">Findings fixed/);
  assert.match(html, /Last updated: 2026-01-02\./);
  assert.doesNotMatch(html, /\{\{/);
});

test("drops non-https report links", () => {
  assert.doesNotMatch(renderAuditPage(DATA), /javascript:/);
});

test("fails closed to an empty table when AUDIT_DATA is missing or invalid", () => {
  for (const raw of [undefined, "", "not json", '{"projects":[{"name":""}]}', '{"projects":"x"}']) {
    const html = renderAuditPage(raw);
    assert.match(html, /No audit data configured/);
    assert.match(html, /id="stat-tracked" data-base="0">0</);
  }
  assert.equal(parseAuditData("{}"), null);
});
