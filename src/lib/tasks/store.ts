import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TASKS_BUCKET, TASKS_PUBLIC_KEY, TASKS_URL } from "./config";
import { parseEvent, parseTask, type Task, type TaskEvent } from "./model";

export const PAGE_TASKS = 100;
const MAX_ROWS = 1000;
const TASK_ID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const MAX_EVENTS = 500;
/** Long enough to watch a film, short enough that a copied link soon stops working. */
const LINK_SECONDS = 3600;

let client: SupabaseClient | null = null;
export function tasksClient(): SupabaseClient {
  client ??= createClient(TASKS_URL, TASKS_PUBLIC_KEY, { auth: { flowType: "pkce", storageKey: "danslab-tasks" } });
  return client;
}

const isPresent = <T,>(value: T | null): value is T => value !== null;

/** Whether this account is one of those let in; the database decides, and shows nothing to the others. */
export async function canRead(): Promise<boolean> {
  const { data, error } = await tasksClient().rpc("dl_tasks_can_read");
  if (error) throw new Error(error.message);
  return data === true;
}

/** The newest tasks, as many as asked for; the server gives at most a thousand rows at a time. */
export async function loadTasks(count: number): Promise<{ tasks: Task[]; hasMore: boolean }> {
  let rows: Record<string, unknown>[] = [];
  while (rows.length <= count) {
    const last = Math.min(rows.length + MAX_ROWS, count + 1) - 1;
    const { data, error } = await tasksClient().from("dl_tasks").select("*").order("opened_at", { ascending: false }).order("id").range(rows.length, last);
    if (error) throw new Error(error.message);
    if (!data.length) break;
    rows = [...rows, ...data];
  }
  return { tasks: rows.slice(0, count).map(parseTask).filter(isPresent), hasMore: rows.length > count };
}

/** One task by its link, however old. */
export async function loadTask(id: string): Promise<Task | null> {
  if (!TASK_ID.test(id)) return null;
  const { data, error } = await tasksClient().from("dl_tasks").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? parseTask(data) : null;
}

/** The latest events, oldest first. */
export async function loadEvents(taskId: string): Promise<TaskEvent[]> {
  const { data, error } = await tasksClient().from("dl_task_events").select("id, at, status, who, text").eq("task_id", taskId).order("at", { ascending: false }).order("id", { ascending: false }).limit(MAX_EVENTS);
  if (error) throw new Error(error.message);
  return (data ?? []).map(parseEvent).filter(isPresent).reverse();
}

export async function fileLink(path: string, downloadAs?: string): Promise<string> {
  const { data, error } = await tasksClient().storage.from(TASKS_BUCKET).createSignedUrl(path, LINK_SECONDS, downloadAs ? { download: downloadAs } : undefined);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
