import { useEffect, useRef, useState } from "react";
import { clock, dayLabel, duration, fileSize, statusLabel, type Task, type TaskEvent, type TaskFile } from "@/lib/tasks/model";
import { fileLink, loadEvents } from "@/lib/tasks/store";
import { StatusMark } from "./TaskFeed";

const RENEW_MS = 60_000;

function Film({ file }: { file: TaskFile }) {
  const [src, setSrc] = useState("");
  const [signedAt, setSignedAt] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    let isLive = true;
    fileLink(file.path).then(
      (link) => { if (isLive) { setSrc(link); setError(""); } },
      () => { if (isLive) setError("Videoul nu se deschide acum."); },
    );
    return () => { isLive = false; };
  }, [file.path, signedAt]);
  // The link has run out on a page left open: ask for a new one, at most once a minute.
  const renew = () => {
    if (Date.now() - signedAt > RENEW_MS) setSignedAt(Date.now());
    else setError("Videoul nu se deschide acum.");
  };
  if (error) return <p className="tk-error" role="status">{error}</p>;
  return src ? <video className="tk-film" src={src} controls playsInline preload="metadata" onError={renew} aria-label={file.name} /> : <p className="tk-quiet">Se deschide videoul…</p>;
}

function Attachment({ file }: { file: TaskFile }) {
  const [error, setError] = useState("");
  const save = async () => {
    try {
      window.location.assign(await fileLink(file.path, file.name));
      setError("");
    } catch {
      setError("Fișierul nu se descarcă acum.");
    }
  };
  return (
    <li>
      <button type="button" className="tk-file" onClick={() => void save()}>
        <strong>{file.name}</strong><span>{fileSize(file.size)} · descarcă</span>
      </button>
      {error && <p className="tk-error" role="status">{error}</p>}
    </li>
  );
}

function Timeline({ task }: { task: Task }) {
  const [events, setEvents] = useState<TaskEvent[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let isLive = true;
    loadEvents(task.id).then(
      (next) => { if (isLive) { setEvents(next); setError(false); } },
      () => { if (isLive) setError(true); },
    );
    return () => { isLive = false; };
  }, [task.id, task.updatedAt]);
  if (error) return <p className="tk-error" role="status">Istoricul nu se citește acum.</p>;
  if (!events) return <p className="tk-quiet">Se încarcă istoricul…</p>;
  return (
    <ol className="tk-events">
      {events.map((event) => (
        <li key={event.id}>
          <time dateTime={event.at}>{clock(event.at)}</time>
          <p><strong>{event.who || statusLabel(event.status)}</strong> {event.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function TaskStory({ task, onBack }: { task: Task; onBack: () => void }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => title.current?.focus(), [task.id]);
  const films = task.files.filter((file) => file.kind === "video");
  const skillFiles = task.files.filter((file) => file.kind === "skill");
  const others = task.files.filter((file) => file.kind === "file");
  return (
    <article className="tk-story">
      <button type="button" className="tk-link" onClick={onBack}>← Toate taskurile</button>
      <p className="tk-dateline">{dayLabel(task.openedAt, new Date())}, {clock(task.openedAt)} · {task.source === "semeos" ? "SemeOS" : "Claude"}</p>
      <h2 ref={title} tabIndex={-1}>{task.title}</h2>
      <p className="tk-confirm">
        <StatusMark task={task} />
        {task.finishedAt && <span>la {clock(task.finishedAt)}, după {duration(task.openedAt, task.finishedAt)}</span>}
      </p>
      {films.map((file) => <Film key={file.path} file={file} />)}
      {task.result && <section><h3>Rezultat</h3><p className="tk-body">{task.result}</p></section>}
      {(task.skillName || skillFiles.length > 0) && (
        <section>
          <h3>Skill</h3>
          {task.skillName && <p className="tk-body">{task.skillName}{task.isSkillNew ? " (nou, făcut la acest task)" : " (chemat din baza de skilluri)"}</p>}
          <ul className="tk-files">{skillFiles.map((file) => <Attachment key={file.path} file={file} />)}</ul>
        </section>
      )}
      {others.length > 0 && <section><h3>Fișiere</h3><ul className="tk-files">{others.map((file) => <Attachment key={file.path} file={file} />)}</ul></section>}
      {task.request && <section><h3>Ce ai cerut</h3><p className="tk-body">{task.request}</p></section>}
      <section><h3>Cum a mers</h3><Timeline key={task.id} task={task} /></section>
    </article>
  );
}
