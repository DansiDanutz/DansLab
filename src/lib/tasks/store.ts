import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TASKS_BUCKET, TASKS_PUBLIC_KEY, TASKS_URL } from "./config";
import { parseEvent, parseTask, type Task, type TaskEvent } from "./model";

const MAX_TASKS = 200;
const MAX_EVENTS = 500;
/** Long enough to watch a film, short enough that a copied link soon stops working. */
const LINK_SECONDS = 3600;

let client: SupabaseClient | null = null;
export function tasksClient(): SupabaseClient {
  client ??= createClient(TASKS_URL, TASKS_PUBLIC_KEY, { auth: { flowType: "pkce", storageKey: "danslab-tasks" } });
  return client;
}

const isPresent = <T,>(value: T | null): value is T => value !== null;

export async function loadTasks(): Promise<Task[]> {
  const { data, error } = await tasksClient().from("dl_tasks").select("*").order("opened_at", { ascending: false }).limit(MAX_TASKS);
  if (error) throw new Error(error.message);
  return (data ?? []).map(parseTask).filter(isPresent);
}

/** The latest events, oldest first. */
export async function loadEvents(taskId: string): Promise<TaskEvent[]> {
  const { data, error } = await tasksClient().from("dl_task_events").select("id, at, status, who, text").eq("task_id", taskId).order("id", { ascending: false }).limit(MAX_EVENTS);
  if (error) throw new Error(error.message);
  return (data ?? []).map(parseEvent).filter(isPresent).reverse();
}

export async function fileLink(path: string, downloadAs?: string): Promise<string> {
  const { data, error } = await tasksClient().storage.from(TASKS_BUCKET).createSignedUrl(path, LINK_SECONDS, downloadAs ? { download: downloadAs } : undefined);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
