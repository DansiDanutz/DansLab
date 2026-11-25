export const STATUSES = ["open", "working", "waiting", "done", "unfinished", "stopped"] as const;
export type TaskStatus = (typeof STATUSES)[number];
export type TaskFileKind = "video" | "skill" | "file";
export type TaskFile = { kind: TaskFileKind; name: string; path: string; type: string; size: number };
export type TaskEvent = { id: number; at: string; status: TaskStatus; who: string; text: string };
export type Task = {
  id: string;
  source: "claude" | "semeos";
  kind: string;
  title: string;
  request: string;
  status: TaskStatus;
  result: string;
  skillName: string | null;
  isSkillNew: boolean;
  files: TaskFile[];
  openedAt: string;
  updatedAt: string;
  finishedAt: string | null;
};

const LABELS: Record<TaskStatus, string> = {
  open: "Deschis",
  working: "În lucru",
  waiting: "Te așteaptă pe tine",
  done: "Gata",
  unfinished: "Neterminat",
  stopped: "Oprit",
};
const ZONE = "Europe/Bucharest";
const DAY_MS = 86_400_000;
const KINDS: readonly string[] = ["video", "skill", "file"];

export const statusLabel = (status: TaskStatus): string => LABELS[status];
export const isRunning = (status: TaskStatus): boolean => status === "open" || status === "working" || status === "waiting";

const text = (value: unknown): string => (typeof value === "string" ? value : "");
const asStatus = (value: unknown): TaskStatus => STATUSES.find((status) => status === value) ?? "open";

function parseFile(value: unknown): TaskFile[] {
  if (typeof value !== "object" || value === null) return [];
  const { kind, name, path, type, size } = value as Record<string, unknown>;
  if (!text(name) || !text(path)) return [];
  return [{
    kind: KINDS.includes(text(kind)) ? (kind as TaskFileKind) : "file",
    name: text(name),
    path: text(path),
    type: text(type),
    size: typeof size === "number" && size > 0 ? size : 0,
  }];
}

/** One stored row; null when it is not a task this page can show. */
export function parseTask(row: Record<string, unknown>): Task | null {
  if (!text(row.id) || !text(row.title) || Number.isNaN(Date.parse(text(row.opened_at)))) return null;
  return {
    id: text(row.id),
    source: row.source === "semeos" ? "semeos" : "claude",
    kind: text(row.kind) || "other",
    title: text(row.title),
    request: text(row.request),
    status: asStatus(row.status),
    result: text(row.result),
    skillName: text(row.skill_name) || null,
    isSkillNew: row.skill_is_new === true,
    files: Array.isArray(row.files) ? row.files.flatMap(parseFile) : [],
    openedAt: text(row.opened_at),
    updatedAt: text(row.updated_at) || text(row.opened_at),
    finishedAt: text(row.finished_at) || null,
  };
}

export function parseEvent(row: Record<string, unknown>): TaskEvent | null {
  if (typeof row.id !== "number" || Number.isNaN(Date.parse(text(row.at)))) return null;
  return { id: row.id, at: text(row.at), status: asStatus(row.status), who: text(row.who), text: text(row.text) };
}

export const clock = (at: string): string =>
  new Intl.DateTimeFormat("ro-RO", { timeZone: ZONE, hour: "2-digit", minute: "2-digit" }).format(new Date(at));
const dayKey = (at: Date): string => new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(at);

export function dayLabel(at: string, now: Date): string {
  const key = dayKey(new Date(at));
  if (key === dayKey(now)) return "Astăzi";
  if (key === dayKey(new Date(now.getTime() - DAY_MS))) return "Ieri";
  return new Intl.DateTimeFormat("ro-RO", { timeZone: ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(at));
}

/** Newest first, one group per day in Romania. */
export function byDay(tasks: readonly Task[], now: Date): { label: string; tasks: Task[] }[] {
  const sorted = [...tasks].sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt));
  const days = new Map<string, Task[]>();
  for (const task of sorted) {
    const key = dayKey(new Date(task.openedAt));
    days.set(key, [...(days.get(key) ?? []), task]);
  }
  return [...days.values()].map((group) => ({ label: dayLabel(group[0].openedAt, now), tasks: group }));
}

export function duration(from: string, to: string): string {
  const seconds = Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / 1000));
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

export function fileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

export type TaskFilter = "all" | "running" | "done";
export const matchesFilter = (task: Task, filter: TaskFilter): boolean =>
  filter === "all" || (filter === "done" ? task.status === "done" : isRunning(task.status));
