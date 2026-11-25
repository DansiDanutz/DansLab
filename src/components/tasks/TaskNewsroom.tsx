"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { matchesFilter, taskPath, type Task, type TaskFilter } from "@/lib/tasks/model";
import { loadTasks, tasksClient } from "@/lib/tasks/store";
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

/** The list, kept fresh while the page is visible. */
function useTasks(userId: string | undefined): { tasks: Task[] | null; error: string } {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setTasks(null);
    if (!userId) return;
    let isLive = true;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const next = await loadTasks();
        if (!isLive) return;
        setTasks(next);
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
  }, [userId]);
  return { tasks, error };
}

function useOpenTask(): [string | null, (id: string | null) => void] {
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setOpenId(openFromUrl());
    const asked = takeAskedTask();
    if (asked && !openFromUrl()) window.history.replaceState(null, "", taskPath(asked));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const open = useCallback((id: string | null) => {
    window.history.pushState(null, "", id ? taskPath(id) : "/tasks");
    setOpenId(id);
    window.scrollTo({ top: 0 });
  }, []);
  return [openId, open];
}

export function TaskNewsroom() {
  const { session, isReady } = useSession();
  const { tasks, error } = useTasks(session?.user.id);
  const [openId, open] = useOpenTask();
  const [filter, setFilter] = useState<TaskFilter>("all");

  if (!isReady) return <main className="dl-wrap tk-page"><p className="tk-quiet">Se deschide…</p></main>;
  if (!session) return <main className="dl-wrap tk-page"><SignIn /></main>;

  const story = tasks?.find((task) => task.id === openId);
  return (
    <main className="dl-wrap tk-page">
      <header className="tk-mast">
        <h1>Taskuri</h1>
        <button type="button" className="tk-link" onClick={() => void tasksClient().auth.signOut({ scope: "local" })}>Ieși din cont</button>
      </header>
      {error && <p className="tk-error" role="status">{error}</p>}
      {story ? <TaskStory task={story} onBack={() => open(null)} /> : (
        <>
          {openId && tasks && <p className="tk-error" role="status">Taskul din link nu există sau nu e al acestui cont.</p>}
          <div className="tk-filters" role="group" aria-label="Arată">
            {FILTERS.map(({ id, label }) => (
              <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
          <TaskFeed tasks={tasks?.filter((task) => matchesFilter(task, filter)) ?? null} onOpen={open} />
        </>
      )}
    </main>
  );
}
