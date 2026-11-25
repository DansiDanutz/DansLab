#!/usr/bin/env node
// Writes one task to the private newsroom at danslab.vercel.app/tasks. Runs on Dan's Mac
// with the Supabase CLI's own sign-in, so no key is stored here or on the site.
//
//   task open   <key> --title T [--request R] [--source claude|semeos] [--kind K] [--at ISO]
//   task update <key> --text T [--status working|waiting] [--who W] [--at ISO]
//   task finish <key> --result R [--status done|unfinished|stopped] [--skill NAME] [--skill-new]
//                     [--video F] [--skill-file F] [--file F] [--at ISO]
//   task attach <key> [--video F] [--skill-file F] [--file F] [--skill NAME] [--skill-new]
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, realpathSync } from "node:fs";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

const run = promisify(execFile);
const CONFIG = join(homedir(), ".config/danslab-tasks/config.json");
const BUCKET = "dl-tasks";
const MAX_FILE = 50 * 1024 * 1024;
const CLI_MS = 10 * 60_000;
const KEY = /^[\w.:-]{1,120}$/;
const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const REF = /^[a-z]{20}$/;
const LIMITS = { title: 200, request: 4000, result: 20000, text: 4000, who: 80, skill: 200, kind: 40 };
const STATES = { open: ["open"], update: ["working", "waiting"], finish: ["done", "unfinished", "stopped"] };
const TYPES = { ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".json": "application/json", ".md": "text/markdown", ".txt": "text/plain", ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".html": "text/plain", ".zip": "application/zip" };
const SECRET = /\b(?:sk|rk|pk)[-_](?:live|test|proj|ant|or)?[-_]?[A-Za-z0-9_-]{16,}|\bgh[pousr]_[A-Za-z0-9]{20,}|\bgithub_pat_\w{20,}|\bAKIA[0-9A-Z]{16}\b|\bsb_secret_\w+|\beyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]*|\bxox[abprs]-[\w-]{10,}|\bAIza[\w-]{30,}|\b\d{8,10}:AA[\w-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g;

export const redact = (text) => text.replace(SECRET, "[cheie ascunsă]");

/** Text for one field: without secrets, never longer than its column. */
const field = (name, value) => value === undefined ? undefined : redact(String(value)).trim().slice(0, LIMITS[name]);

export function readCommand(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      title: { type: "string" }, request: { type: "string" }, source: { type: "string" }, kind: { type: "string" },
      text: { type: "string" }, status: { type: "string" }, who: { type: "string" }, result: { type: "string" }, at: { type: "string" },
      skill: { type: "string" }, "skill-new": { type: "boolean" },
      video: { type: "string", multiple: true }, "skill-file": { type: "string", multiple: true }, file: { type: "string", multiple: true },
    },
  });
  const [action, key, ...rest] = positionals;
  if (!["open", "update", "finish", "attach"].includes(action) || rest.length) throw new Error("Use: task open|update|finish|attach <key>");
  if (!KEY.test(key ?? "")) throw new Error("The key must be 1-120 letters, digits or . _ : -");
  const status = action === "attach" ? undefined : values.status ?? STATES[action][0];
  if (status && !STATES[action].includes(status)) throw new Error(`${action} takes one of: ${STATES[action].join(", ")}`);
  if (values.source && !["claude", "semeos"].includes(values.source)) throw new Error("The source is claude or semeos");
  if (values.at && Number.isNaN(Date.parse(values.at))) throw new Error("--at must be a date");
  const task = {
    key, action, status,
    source: values.source ?? "claude",
    at: values.at ? new Date(values.at).toISOString() : new Date().toISOString(),
    isSkillNew: values["skill-new"] === true,
    ...Object.fromEntries(Object.keys(LIMITS).map((name) => [name, field(name, values[name])])),
  };
  if (action === "open" && !task.title) throw new Error("open needs --title");
  if (action === "update" && !task.text) throw new Error("update needs --text");
  if (action === "finish" && !task.result) throw new Error("finish needs --result");
  const files = [["video", values.video], ["skill", values["skill-file"]], ["file", values.file]]
    .flatMap(([kind, paths]) => (paths ?? []).map((path) => ({ kind, path })));
  return { task, files };
}

/** One statement; the data travels as base64, so nothing in it is ever read as SQL. */
export function statementFor(task, ownerId) {
  if (!UUID.test(ownerId)) throw new Error("The owner in the config is not an account id");
  const data = Buffer.from(JSON.stringify({ ...task, owner: ownerId })).toString("base64");
  const head = `with p as (select convert_from(decode('${data}','base64'),'utf8')::jsonb as j)`;
  const mine = `t.key = p.j->>'key' and t.owner_id = (p.j->>'owner')::uuid`;
  const event = (from) => `, e as (insert into public.dl_task_events (task_id, at, status, who, text)
 select ${from}.id, (p.j->>'at')::timestamptz, p.j->>'status', coalesce(p.j->>'who', ''), coalesce(p.j->>'text', '') from ${from}, p returning id)`;
  const merged = `t.files || coalesce((select jsonb_agg(f) from jsonb_array_elements(p.j->'files') f where not t.files @> jsonb_build_array(jsonb_build_object('path', f->'path'))), '[]'::jsonb)`;
  const extras = `skill_name = coalesce(p.j->>'skill', t.skill_name), skill_is_new = t.skill_is_new or (p.j->>'isSkillNew')::boolean, files = ${merged}`;
  if (task.action === "open") {
    return `${head}, w as (insert into public.dl_tasks (owner_id, key, source, kind, title, request, status, opened_at, updated_at)
 select (j->>'owner')::uuid, j->>'key', j->>'source', coalesce(nullif(j->>'kind', ''), 'other'), j->>'title', coalesce(j->>'request', ''), 'open', (j->>'at')::timestamptz, (j->>'at')::timestamptz from p
 on conflict (key) do nothing returning id)${event("w")} select id from w`;
  }
  const sets = {
    update: `status = p.j->>'status', finished_at = null, updated_at = now()`,
    finish: `status = p.j->>'status', result = p.j->>'result', finished_at = (p.j->>'at')::timestamptz, updated_at = now(), ${extras}`,
    attach: `updated_at = now(), ${extras}`,
  }[task.action];
  const written = `${head}, w as (update public.dl_tasks t set ${sets} from p where ${mine} returning t.id)`;
  return `${written}${task.action === "attach" ? "" : event("w")} select id from w`;
}

export function safeName(path) {
  const ext = extname(path).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10);
  const stem = basename(path, extname(path)).normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\w.-]+/g, "-").replace(/^[-.]+|-+$/g, "").slice(0, 80);
  return (stem || "fisier") + ext;
}

async function hashOf(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex").slice(0, 16);
}

/** A film over the limit is made smaller; anything else over it is refused. */
async function fitted(file, dir) {
  const { size } = await stat(file.path);
  if (size <= MAX_FILE) return file.path;
  if (file.kind !== "video") throw new Error(`${basename(file.path)} is over 50 MB`);
  const small = join(dir, `${basename(file.path, extname(file.path))}.mp4`);
  await run("ffmpeg", ["-v", "error", "-y", "-i", file.path, "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-preset", "fast", "-crf", "28", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", small], { timeout: CLI_MS });
  if ((await stat(small)).size > MAX_FILE) throw new Error(`${basename(file.path)} is over 50 MB even after it was made smaller`);
  return small;
}

async function readConfig() {
  const { projectRef, ownerId } = JSON.parse(await readFile(CONFIG, "utf8"));
  if (!REF.test(projectRef ?? "") || !UUID.test(ownerId ?? "")) throw new Error(`${CONFIG} must hold projectRef and ownerId`);
  return { projectRef, ownerId };
}

const supabase = (args, dir) => run("supabase", [...args, "--workdir", dir], { timeout: CLI_MS, maxBuffer: 4 * 1024 * 1024, cwd: dir });

async function upload(file, key, { projectRef, ownerId }, dir) {
  const path = await fitted(file, dir);
  const name = safeName(path);
  const type = TYPES[extname(name)] ?? "application/octet-stream";
  const stored = `${ownerId}/${key.replace(/[^\w.-]/g, "-")}/${await hashOf(path)}-${name}`;
  try {
    await supabase(["storage", "cp", path, `ss:///${BUCKET}/${stored}`, "--content-type", type, "--experimental", "--linked", "--project-ref", projectRef, "--yes"], dir);
  } catch (error) {
    // The name holds the content's hash, so a file that is already there is this same file.
    if (!/already exists|Duplicate/i.test(`${error.stderr} ${error.stdout}`)) throw error;
  }
  return { kind: file.kind, name, path: stored, type, size: (await stat(path)).size };
}

async function main() {
  const { task, files } = readCommand(process.argv.slice(2));
  const config = await readConfig();
  const dir = await mkdtemp(join(process.env.DANSLAB_TASKS_TMP || tmpdir(), "danslab-task-"));
  try {
    const kept = [];
    for (const file of files) kept.push(await upload(file, task.key, config, dir));
    const { stdout } = await supabase(["db", "query", statementFor({ ...task, files: kept }, config.ownerId), "--linked", "--project-ref", config.projectRef, "--output-format", "json"], dir);
    if (!UUID_ANYWHERE.test(stdout)) throw new Error(task.action === "open" ? "This key is already used by another task" : "No task has this key");
    console.log(`${task.action}: ${task.key}${task.status ? ` (${task.status})` : ""}${kept.length ? `, ${kept.length} files` : ""}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
const UUID_ANYWHERE = /"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}"/;

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    // Only the cause: a failed command's own text repeats the whole statement.
    console.error(redact(String(error.stderr || (error.cmd ? "The Supabase CLI failed" : error.message))).slice(0, 600));
    process.exitCode = 1;
  });
}
