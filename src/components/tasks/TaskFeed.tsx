import { byDay, clock, duration, hasVideo, statusLabel, taskPath, type Task } from "@/lib/tasks/model";

export function StatusMark({ task }: { task: Task }) {
  return <span className={`tk-status is-${task.status}`}>{statusLabel(task.status)}</span>;
}

type Open = (id: string, isWatching?: boolean) => void;

function Card({ task, isLead, onOpen }: { task: Task; isLead: boolean; onOpen: Open }) {
  return (
    <li className={isLead ? "tk-card is-lead" : "tk-card"}>
      <time dateTime={task.openedAt}>{clock(task.openedAt)}</time>
      <div>
        <StatusMark task={task} />
        <h3>
          <a href={taskPath(task.id)} onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onOpen(task.id);
          }}>{task.title}</a>
        </h3>
        {(task.result || task.request) && <p className="tk-dek">{task.result || task.request}</p>}
        <p className="tk-meta">
          <span>{task.source === "semeos" ? "SemeOS" : "Claude"}</span>
          {task.finishedAt && <span>{duration(task.openedAt, task.finishedAt)}</span>}
          {task.skillName && <span>Skill: {task.skillName}</span>}
        </p>
        {hasVideo(task) && <button type="button" className="tk-watch" aria-label={`Vezi videoul: ${task.title}`} onClick={() => onOpen(task.id, true)}><span aria-hidden="true">▶</span> Vezi videoul</button>}
      </div>
    </li>
  );
}

export function TaskFeed({ tasks, onOpen }: { tasks: Task[] | null; onOpen: Open }) {
  if (!tasks) return <p className="tk-quiet">Se încarcă taskurile…</p>;
  if (!tasks.length) return <p className="tk-quiet">Niciun task aici încă.</p>;
  return (
    <>
      {byDay(tasks, new Date()).map((day, at) => (
        <section key={day.tasks[0].id} className="tk-day">
          <h2>{day.label}</h2>
          <ol>{day.tasks.map((task, index) => <Card key={task.id} task={task} isLead={at === 0 && index === 0} onOpen={onOpen} />)}</ol>
        </section>
      ))}
    </>
  );
}
