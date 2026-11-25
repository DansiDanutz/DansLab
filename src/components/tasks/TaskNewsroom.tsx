"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { matchesFilter, taskPath, type Task, type TaskFilter } from "@/lib/tasks/model";
import { loadTask, loadTasks, PAGE_TASKS, tasksClient } from "@/lib/tasks/store";
import { SignIn, takeAskedTask } from "./SignIn";
import { TaskFeed } from "./TaskFeed";
import { TaskStory } from "./TaskStory";

const REFRESH_MS = 15_000;
const FILTERS: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "Toate" },
  { id: "running", label: "În lucru" },
  { id: "done", label: "Gata" },
];

const openFromUrl = (): string | null => new URLSearchParams(window.location.search).get("t");

function useSession(): { session: Session | null; isReady: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    const { data } = tasksClient().auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, isReady };
}

/** The list and the open task, kept fresh while the page is visible. An old open task is not in the list. */
function useTasks(userId: string | undefined, openId: string | null, count: number): { tasks: Task[] | null; linked: Task | null; isMissing: boolean; hasMore: boolean; error: string } {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [linked, setLinked] = useState<Task | null>(null);
  const [missingId, setMissingId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setTasks(null);
    setLinked(null);
  }, [userId]);
  useEffect(() => {
    if (!userId) return;
    let isLive = true;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const next = await loadTasks(count);
        const found = openId && !next.tasks.some((task) => task.id === openId) ? await loadTask(openId) : null;
        if (!isLive) return;
        setTasks(next.tasks);
        setHasMore(next.hasMore);
        setLinked(found);
        setMissingId(openId && !found && !next.tasks.some((task) => task.id === openId) ? openId : null);
        setError("");
      } catch {
        if (isLive) setError("Nu pot citi taskurile acum. Încerc din nou singur.");
      }
    };
    void refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      isLive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [userId, openId, count]);
  return { tasks, linked, isMissing: openId !== null && missingId === openId, hasMore, error };
}

function useOpenTask(isSignedIn: boolean): [string | null, (id: string | null) => void] {
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setOpenId(openFromUrl());
    // Not before signing in: until then the address holds the code that signs in.
    const asked = isSignedIn ? takeAskedTask() : null;
    if (asked && !openFromUrl()) window.history.replaceState(null, "", taskPath(asked));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [isSignedIn]);
  const open = useCallback((id: string | null) => {
    window.history.pushState(null, "", id ? taskPath(id) : "/tasks");
    setOpenId(id);
    window.scrollTo({ top: 0 });
  }, []);
  return [openId, open];
}

export function TaskNewsroom() {
  const { session, isReady } = useSession();
  const [openId, open] = useOpenTask(Boolean(session));
  const [count, setCount] = useState(PAGE_TASKS);
  const { tasks, linked, isMissing, hasMore, error } = useTasks(session?.user.id, openId, count);
  const [filter, setFilter] = useState<TaskFilter>("all");

  if (!isReady) return <main className="dl-wrap tk-page"><p className="tk-quiet">Se deschide…</p></main>;
  if (!session) return <main className="dl-wrap tk-page"><SignIn /></main>;

  const story = tasks?.find((task) => task.id === openId) ?? (linked?.id === openId ? linked : undefined);
  return (
    <main className="dl-wrap tk-page">
      <header className="tk-mast">
        <h1>Taskuri</h1>
        <button type="button" className="tk-link" onClick={() => void tasksClient().auth.signOut({ scope: "local" })}>Ieși din cont</button>
      </header>
      {error && <p className="tk-error" role="status">{error}</p>}
      {story ? <TaskStory task={story} onBack={() => open(null)} /> : (
        <>
          {isMissing && <p className="tk-error" role="status">Taskul din link nu există sau nu e al acestui cont.</p>}
          <div className="tk-filters" role="group" aria-label="Arată">
            {FILTERS.map(({ id, label }) => (
              <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
          <TaskFeed tasks={tasks?.filter((task) => matchesFilter(task, filter)) ?? null} onOpen={open} />
          {hasMore && <button type="button" className="tk-link" onClick={() => setCount((shown) => shown + PAGE_TASKS)}>Arată taskuri mai vechi</button>}
        </>
      )}
    </main>
  );
}
