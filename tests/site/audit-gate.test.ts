import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { NextRequest } from "next/server";

import { GET } from "../../src/app/audit/route";
import { middleware } from "../../src/middleware";
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

const ENV_KEYS = ["AUDIT_USER", "AUDIT_PASS", "AUDIT_DATA", "NODE_ENV"] as const;
const savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));

function setEnv(values: Partial<Record<(typeof ENV_KEYS)[number], string>>): void {
  for (const k of ENV_KEYS) {
    const v = values[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

afterEach(() => {
  for (const k of ENV_KEYS) {
    const v = savedEnv[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

const auditRequest = (authorization?: string) =>
  new NextRequest("http://localhost/audit", authorization ? { headers: { authorization } } : {});
const basic = (creds: string) => "Basic " + Buffer.from(creds, "utf8").toString("base64");
// A pass-through response carries this header; a block (401/503) does not.
const isPassThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";

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

test(".env.example documents every audit variable", () => {
  const env = readFileSync(".env.example", "utf8");
  for (const key of ["AUDIT_USER", "AUDIT_PASS", "AUDIT_DATA"]) assert.match(env, new RegExp(`^${key}=`, "m"));
  assert.doesNotMatch(env, /claude\.ai\/code\/artifact/);
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

test("middleware returns 503 when credentials are unset, in every environment", async () => {
  for (const nodeEnv of ["production", "development", "test"]) {
    for (const env of [{}, { AUDIT_USER: "dan" }, { AUDIT_PASS: "secret" }, { AUDIT_USER: "", AUDIT_PASS: "" }]) {
      setEnv({ ...env, NODE_ENV: nodeEnv });
      for (const header of [undefined, basic("dan:secret")]) {
        const res = middleware(auditRequest(header));
        assert.equal(res.status, 503, `NODE_ENV=${nodeEnv} env=${JSON.stringify(env)}`);
        assert.equal(isPassThrough(res), false);
        assert.doesNotMatch(await res.text(), /Audit Dashboard/);
      }
    }
  }
});

test("middleware returns 401 with a Basic challenge on missing or wrong credentials", () => {
  setEnv({ AUDIT_USER: "dan", AUDIT_PASS: "secret", NODE_ENV: "production" });
  for (const header of [undefined, "", basic("dan:wrong"), basic("other:secret"), "Bearer x", "Basic !!!"]) {
    const res = middleware(auditRequest(header));
    assert.equal(res.status, 401, `header=${header}`);
    assert.match(res.headers.get("www-authenticate") ?? "", /^Basic realm=/);
    assert.equal(isPassThrough(res), false);
  }
});

test("middleware passes through on valid credentials, including non-ASCII", () => {
  setEnv({ AUDIT_USER: "dán", AUDIT_PASS: "pässwörd€", NODE_ENV: "production" });
  const res = middleware(auditRequest(basic("dán:pässwörd€")));
  assert.equal(res.status, 200);
  assert.equal(isPassThrough(res), true);
});

test("/audit route handler serves private data with no-store, noindex headers", async () => {
  setEnv({ AUDIT_DATA: DATA });
  const res = GET();
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/html/);
  assert.match(res.headers.get("cache-control") ?? "", /no-store/);
  assert.match(res.headers.get("x-robots-tag") ?? "", /noindex/);
  const html = await res.text();
  assert.match(html, /Alpha &#60;b&#62;/);
  assert.match(html, /id="stat-tracked" data-base="3">3</);
});

test("/audit route handler renders an empty table when AUDIT_DATA is unset", async () => {
  setEnv({});
  const html = await GET().text();
  assert.match(html, /No audit data configured/);
});
