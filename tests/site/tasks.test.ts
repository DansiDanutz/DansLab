import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { byDay, dayLabel, duration, fileSize, matchesFilter, parseEvent, parseTask, statusLabel, STATUSES, type Task } from "../../src/lib/tasks/model";
import { checkedPath, readCommand, redact, safeName, statementFor } from "../../scripts/task.mjs";

const OWNER = "11111111-2222-3333-4444-555555555555";
const row = { id: "a", title: "Bilet de avion", opened_at: "2026-11-25T10:00:00Z", status: "working" };
const task = (over: Record<string, unknown> = {}): Task => {
  const parsed = parseTask({ ...row, ...over });
  assert.ok(parsed);
  return parsed;
};
const sent = (sql: string) => JSON.parse(Buffer.from(sql.match(/decode\('([A-Za-z0-9+/=]+)'/)![1], "base64").toString());
const statement = (argv: string[], files: unknown[] = []) => statementFor({ ...readCommand(argv).task, files }, OWNER);

test("a stored row becomes a task, and a broken one is left out", () => {
  const parsed = task({
    files: [{ kind: "video", name: "film.mp4", path: "x/film.mp4", type: "video/mp4", size: 9 }, { kind: "odd", name: "a", path: "b" }, null, { name: "no path" }],
    skill_name: "Find a flight",
    skill_is_new: true,
  });
  assert.deepEqual(parsed.files.map((file) => file.kind), ["video", "file"]);
  assert.deepEqual([parsed.skillName, parsed.isSkillNew, parsed.source, parsed.finishedAt], ["Find a flight", true, "claude", null]);
  assert.equal(task({ status: "nonsense" }).status, "open");
  assert.equal(parseTask({ ...row, title: "" }), null);
  assert.equal(parseTask({ ...row, opened_at: "never" }), null);
  assert.equal(parseEvent({ id: 1, at: "never" }), null);
  const event = { id: 1, at: row.opened_at, status: "done", who: "Hermes", text: "Gata" };
  assert.deepEqual(parseEvent(event), event);
});

test("tasks are grouped by the day in Romania, newest first", () => {
  const now = new Date("2026-11-25T12:00:00Z");
  const groups = byDay([
    task({ id: "old", opened_at: "2026-11-20T10:00:00Z" }),
    task({ id: "late", opened_at: "2026-11-24T22:30:00Z" }),
    task({ id: "new" }),
    task({ id: "yesterday", opened_at: "2026-11-24T20:00:00Z" }),
  ], now);
  assert.deepEqual(groups.map((group) => [group.label, group.tasks.map(({ id }) => id).join()]), [["Astăzi", "new,late"], ["Ieri", "yesterday"], ["vineri, 20 noiembrie 2026", "old"]]);
  assert.equal(dayLabel("2026-11-25T01:00:00Z", now), "Astăzi");
});

test("every status has its own words, and the filters follow it", () => {
  assert.equal(new Set(STATUSES.map(statusLabel)).size, STATUSES.length);
  const shown = STATUSES.map((status) => (["running", "done", "all"] as const).map((filter) => Number(matchesFilter(task({ status }), filter))).join(""));
  assert.deepEqual(shown, ["101", "101", "101", "011", "001", "001"]);
});

test("durations and sizes are short", () => {
  const from = "2026-11-25T10:00:00Z";
  const ends = ["2026-11-25T10:00:42Z", "2026-11-25T10:05:00Z", "2026-11-25T12:05:00Z", "2026-11-25T09:00:00Z"];
  assert.deepEqual(ends.map((end) => duration(from, end)), ["42 s", "5 min", "2 h 5 min", "0 s"]);
  assert.deepEqual([10, 45_000, 12_340_000].map(fileSize), ["1 KB", "45 KB", "12,3 MB"]);
});

test("the page is never indexed and the site key can only be the public one", () => {
  const page = readFileSync(new URL("../../src/app/tasks/page.tsx", import.meta.url), "utf8");
  assert.match(page, /index: false/);
  const config = readFileSync(new URL("../../src/lib/tasks/config.ts", import.meta.url), "utf8");
  const payload = config.match(/eyJ[\w-]+\.([\w-]+)\./)![1];
  assert.equal(JSON.parse(Buffer.from(payload, "base64url").toString()).role, "anon");
});

test("only listed accounts read, and the list itself stays out of this public repository", () => {
  const sql = readFileSync(new URL("../../supabase/tasks/readers.sql", import.meta.url), "utf8");
  assert.doesNotMatch(sql, /[\w.]+@[\w-]+\.\w+|github:\d/);
  const rules = sql.split("create policy").slice(1);
  assert.equal(rules.length, 3);
  for (const rule of rules) assert.match(rule, /dl_private\.readable_owners\(\)/);
  for (const dropped of ["dl_tasks read own", "dl_task_events read own", "dl_tasks files read own"]) assert.ok(sql.includes(`drop policy "${dropped}"`));
  // A password or a mailed link proves nothing here, and neither does an address the token merely claims.
  assert.match(sql, /a->>'method' = 'oauth'/);
  assert.doesNotMatch(sql, /jwt\(\)->>?'email'/);
  assert.match(sql, /'email_verified' = 'true'/);
});

test("nothing a task says is read as SQL", () => {
  const nasty = "'); drop table public.dl_tasks; -- $$";
  const sql = statement(["open", "k1", "--title", nasty, "--request", nasty]);
  assert.ok(!sql.includes("drop table"));
  assert.deepEqual([sent(sql).title, sent(sql).owner, sent(sql).source], [nasty, OWNER, "claude"]);
  assert.throws(() => statementFor(readCommand(["open", "k1", "--title", "x"]).task, "' or 1=1"), /account id/);
});

test("each action writes only its own part, and only to this account's task", () => {
  assert.match(statement(["open", "k1", "--title", "x"]), /on conflict \(key\) do nothing/);
  const update = statement(["update", "k1", "--text", "Caut zboruri", "--status", "waiting"]);
  assert.match(update, /update public\.dl_tasks t set status/);
  assert.match(update, /insert into public\.dl_task_events/);
  assert.ok(!update.includes("result ="));
  assert.match(update, /t\.status in \('open','working','waiting'\)/);
  const finish = statement(["finish", "k1", "--result", "420 lei", "--skill", "Find a flight", "--skill-new"], [{ kind: "video", path: "p" }]);
  assert.deepEqual([sent(finish).status, sent(finish).skill, sent(finish).isSkillNew, sent(finish).files.length], ["done", "Find a flight", true, 1]);
  const attach = statement(["attach", "k1"]);
  assert.ok(!attach.includes("dl_task_events") && !attach.includes("status ="));
  for (const sql of [update, finish, attach]) assert.match(sql, /t\.owner_id = \(p\.j->>'owner'\)::uuid/);
});

test("a wrong command is refused before anything is sent", () => {
  const wrong = [
    [], ["drop", "k"], ["open", "k"], ["open", "a b", "--title", "x"], ["update", "k"], ["update", "k", "--text", "x", "--status", "done"],
    ["finish", "k"], ["finish", "k", "--result", "x", "--status", "working"], ["open", "k", "--title", "x", "--source", "x"],
    ["open", "k", "--title", "x", "--at", "soon"], ["open", "k", "extra", "--title", "x"], ["open", "..", "--title", "x"], ["update", "k", "--text", "x", "--file", "a.txt"],
  ];
  for (const argv of wrong) assert.throws(() => readCommand(argv), undefined, argv.join(" "));
  const { files, task: finished } = readCommand(["finish", "k", "--result", "ok", "--video", "a.mp4", "--skill-file", "s.json", "--file", "b.txt", "--at", "2026-11-25T10:00:00+02:00"]);
  assert.deepEqual([files.map((file) => file.kind), finished.at], [["video", "skill", "file"], "2026-11-25T08:00:00.000Z"]);
});

test("secrets never leave the Mac and long text is cut", () => {
  // Joined here so that no scanner reads this file as a leak.
  const parts = [
    ["sk-ant-", "api03-abcdefghijklmnop"], ["ghp_", "a".repeat(36)], ["AKIA", "ABCDEFGHIJKLMNOP"], ["eyJhbGciOiJI", "UzI1NiJ9.eyJyb2xlIjoi.abc"],
    ["sb_secret_", "abc123"], ["sk_live_", "a".repeat(24)], ["123456789:", `AA${"b".repeat(33)}`], ["-----BEGIN ", "PRIVATE KEY-----\nabc"],
  ];
  for (const secret of parts.map((pair) => pair.join(""))) assert.equal(redact(`cheia ${secret}`), "cheia [cheie ascunsă]");
  for (const [text, kept] of [["password=hunter22", "password="], ["API_KEY: \"abcdefgh\"", "API_KEY: \""], ["parola: abcdef1", "parola: "], ["Authorization: Bearer abcdefghijklmnop", "Authorization: Bearer "], ["postgres://user:pass@host/db", "postgres://"]]) {
    assert.ok(redact(text).startsWith(`${kept}[cheie ascunsă]`), redact(text));
  }
  const plain = "skill nou, task-uri, sk-9 și 420 lei";
  assert.equal(redact(plain), plain);
  assert.equal(readCommand(["open", "k", "--title", "x".repeat(500)]).task.title!.length, 200);
  assert.equal(readCommand(["open", "k", "--title", `a\u0000${"x".repeat(198)}😀y`]).task.title, `a${"x".repeat(198)}😀`);
});

test("a stored file name is plain", () => {
  assert.deepEqual(["/a/Cameră de ședință.mp4", "../../x", "/tmp/.hidden.JSON", "/a/***"].map(safeName), ["Camera-de-sedinta.mp4", "x", "hidden.json", "fisier"]);
});

test("only plain, visible files of a known kind are sent", async () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "task-")));
  mkdirSync(join(dir, ".ssh"));
  for (const name of ["ok.md", ".env", "id_rsa", "key.pem", ".ssh/a.txt"]) writeFileSync(join(dir, name), "x");
  assert.equal(await checkedPath(join(dir, "ok.md")), join(dir, "ok.md"));
  for (const name of [".env", "id_rsa", "key.pem", ".ssh/a.txt", "missing.md"]) await assert.rejects(checkedPath(join(dir, name)), undefined, name);
});
