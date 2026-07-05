import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Regression guard: public pages must never publish routable IPv4
// addresses (the fleet's droplet IPs were exposed on /story and /lab
// before 2026-07-05). Loopback is the only allowed literal.
const IPV4 = /\b(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\b/g;
const ALLOWED = new Set(["127.0.0.1", "0.0.0.0"]);
const SCAN_DIRS = ["src/app", "src/components", "src/lib"];
const SKIP_DIRS = new Set(["_deprecated", "node_modules"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css|mdx?)$/.test(name)) out.push(p);
  }
  return out;
}

test("no routable IPv4 literals in shipped site source", () => {
  const offenders: string[] = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(IPV4)) {
        const ip = match[0];
        const octets = ip.split(".").map(Number);
        const isVersionLike = octets.some((o) => o > 255);
        if (!ALLOWED.has(ip) && !isVersionLike) {
          offenders.push(`${file}: ${ip}`);
        }
      }
    }
  }
  assert.deepEqual(offenders, []);
});
