import { SectionLabel } from "@/components/danslab/atoms";

export const metadata = {
  title: "SemeClaw — Open-Source AI War Room",
  description:
    "Every task in your stack becomes a multi-agent meeting you can join, interrupt, and steer — until the orchestrator commits a final decision back to source.",
};

// ────────────────────────────────────────────
// Data — from seme-data.jsx
// ────────────────────────────────────────────
const SEMECLAW = {
  name: "SemeClaw",
  tagline: "Open-Source AI War Room",
  version: "v0.7.14",
  license: "MIT",
  live: "semeclaw.fly.dev",
  repo: "github.com/DansiDanutz/SemeClaw",
  status: "SHIPPED",
  pitch: "Every task in your stack becomes a multi-agent meeting you can join, interrupt, and steer — until the orchestrator commits a final decision back to the source.",
};

type MeetingAgent = { id: string; name: string; role: string; color: string; initials: string; job: string };
const MEETING_AGENTS: MeetingAgent[] = [
  { id: "semeclaw", name: "SemeClaw", role: "Orchestrator", color: "#e74c3c", initials: "SC", job: "Opens the room. Composes the agenda. On turn 3, decides — strict JSON, writes back to source." },
  { id: "research", name: "Research", role: "Reads the world", color: "#60a5fa", initials: "RS", job: "Brave → SearXNG → DuckDuckGo. Cites what matters. Zero-key fallback to DDG HTML." },
  { id: "writer", name: "Writer", role: "Turns context into copy", color: "#d4a017", initials: "WR", job: "Composes the task description. Holds tone. Writes the rationale for the audit log." },
  { id: "scraper", name: "Scraper", role: "Pulls structured data", color: "#22c55e", initials: "SP", job: "HTML + JSON + RSS. Extracts what the task needs to progress. Respects robots." },
  { id: "coder", name: "Coder", role: "Writes the patch", color: "#a78bfa", initials: "CD", job: "Drafts code diffs when the task is executable. Pope picks it up downstream." },
];

const AGENT_MAP = new Map(MEETING_AGENTS.map((a) => [a.id, a]));

const KPIS = [
  { n: "01", val: "6", unit: "lines", label: "per dialog", sub: "one per agent · one orchestrator" },
  { n: "02", val: "3", unit: "×", label: "intervention cap", sub: "turn 3 → orchestrator decides" },
  { n: "03", val: "0", unit: "keys", label: "zero-key mode", sub: "templates · DDG · edge-tts" },
  { n: "04", val: "100", unit: "", label: "task cap / tenant", sub: "oldest-archived-first GC" },
];

type Adapter = { id: string; name: string; protocol: string; icon: string; writeback: boolean; color: string; desc: string };
const ADAPTERS: Adapter[] = [
  { id: "paperclip", name: "Paperclip", protocol: "HTTP", icon: "📎", writeback: true, color: "#f59e0b", desc: "Dan's orchestration platform. PATCH back to /api/tasks/{id}." },
  { id: "moltica", name: "Moltica", protocol: "HTTP", icon: "🟪", writeback: true, color: "#a855f7", desc: "PATCH /v1/tasks/{id}. Per-tenant keys probed by semeclaw doctor." },
  { id: "github", name: "GitHub", protocol: "REST", icon: "🐙", writeback: false, color: "#c084fc", desc: "Issues → tasks. Read-only for now." },
  { id: "obsidian", name: "Obsidian", protocol: "local", icon: "◇", writeback: false, color: "#8b5cf6", desc: "Daily-note todos. File-watched." },
  { id: "local", name: "Local JSON", protocol: "fs", icon: "📁", writeback: true, color: "#94a3b8", desc: "Drop a .json in war_room/tasks/inbox/ — writeback rewrites in place." },
  { id: "telegram", name: "Telegram", protocol: "webhook", icon: "📨", writeback: false, color: "#0ea5e9", desc: "Comment on any task from a chat. /list · /comment · <id>: shorthand." },
];

type LoopStep = { phase: string; label: string; desc: string; side: "in" | "mid" | "user" | "out"; hot?: boolean };
const LOOP: LoopStep[] = [
  { phase: "SYNC",      label: "sync",                desc: "Adapters pull tasks. One source of truth, one tenant.", side: "in" },
  { phase: "DIALOG v1", label: "dialog v1",           desc: "6-line meeting composed. TTS on every line.",           side: "mid" },
  { phase: "TURN 1",    label: "comment + reply",     desc: "You drop a comment. Agents reply.",                     side: "user" },
  { phase: "TURN 2",    label: "comment + reply",     desc: "Second pass. Dialogue tightens.",                       side: "user" },
  { phase: "TURN 3",    label: "ORCHESTRATOR DECIDES",desc: "Strict JSON patch. No more turns.",                     side: "user", hot: true },
  { phase: "WRITEBACK", label: "patch → source",      desc: "PATCH to Paperclip / Moltica / rewrite local JSON.",    side: "out" },
  { phase: "DIALOG v2", label: "re-compose",          desc: "New dialog seeded by orchestrator brief. Loop again.",  side: "mid" },
];

type DialogLine = { who: string; kind: string; text: string };
const DIALOG = {
  task: { id: "task_2a81f", source: "paperclip", title: "Investigate latency spike — EU region, 11:32 UTC", status: "open → in_progress" },
  lines: [
    { who: "semeclaw", kind: "call",    text: "Opening meeting on task_2a81f. Latency spike, EU region, 11:32 UTC. Research, Scraper, Coder — 6-line dialog. Go." },
    { who: "research", kind: "report",  text: "Fastly status green. Statuspage shows regional p99 at 2100ms vs 180ms baseline. Only EU. Lasted 14 min. Similar pattern in R-141 (2026-03)." },
    { who: "scraper",  kind: "context", text: "Pulled the gateway logs. 8k req/s sustained to the Redis bridge — same threshold that cascaded in R-141. Zero 5xx before, 22% after." },
    { who: "writer",   kind: "draft",   text: "Root-cause hypothesis: Redis bridge saturates at ~8k rps with no circuit breaker. Recommend tightening rps cap + adding breaker." },
    { who: "coder",    kind: "patch",   text: "Patch ready in branch fix/redis-breaker. Adds tenacity retry + 5xx-on-breaker-open. 47 LOC, 2 tests." },
    { who: "semeclaw", kind: "propose", text: "Proposing patch 1 status: in_progress · assigned: coder · writer drafts the PR body. Awaiting your comment." },
  ] as DialogLine[],
  interventions: [
    {
      turn: 1,
      user: "Roll the breaker out behind a feature flag — I want to dark-launch it.",
      replies: [
        { who: "coder", kind: "confirm", text: "Flag added: `redis.breaker.enabled`, default off. Staging will flip it." },
        { who: "writer", kind: "answer", text: "Updated description to note the flag gate. Rationale captured." },
      ] as DialogLine[],
    },
    {
      turn: 2,
      user: "What's the rollback if the breaker itself misfires?",
      replies: [
        { who: "coder", kind: "answer", text: "Flip flag off — breaker becomes a pass-through. Mean recovery 30s. Runbook in docs/ops/redis-breaker.md." },
        { who: "research", kind: "flag", text: "Noting: R-141 also recommended a breaker. No action taken then. Raising to needs_review if not shipped this week." },
      ] as DialogLine[],
    },
    {
      turn: 3,
      user: "Ship it. Close the task when the PR merges — green CI required.",
      replies: [
        { who: "semeclaw", kind: "decide", text: "Decision: status → needs_review · assigned → [coder, reviewer] · gated on CI green + merge. Writeback to paperclip." },
      ] as DialogLine[],
      decision: {
        task_patch: {
          status: "needs_review",
          description: "Redis bridge saturation at 8k rps → cascading 5xx. Adding circuit breaker behind `redis.breaker.enabled` flag. Dark-launch in staging, feature-flag to prod. Rollback: flip flag off.",
          assigned_agents: ["coder", "reviewer"],
        },
        rationale: "User approved patch after two clarifying turns on feature flag + rollback. Ship gated on CI green + merge.",
      },
      writeback: { target: "paperclip", method: "PATCH", path: "/api/tasks/task_2a81f", ok: true, ms: 184 },
    },
  ],
};

type Surface = { id: string; k: string; name: string; glyph: string; blurb: string; snippet: string };
const SURFACES: Surface[] = [
  { id: "cli", k: "CLI", name: "semeclaw CLI", glyph: "▸", blurb: "Agent-native. Every command supports --json — no scraping prose.", snippet: `semeclaw tasks sync
semeclaw tasks list --json | jq '.count'
semeclaw tasks comment <id> "focus on EU only"
semeclaw tasks quota` },
  { id: "ui", k: "UI", name: "Tasks UI (/tasks)", glyph: "◈", blurb: "Single-page dashboard with per-line audio + intervention box. Live at semeclaw.fly.dev/tasks.", snippet: `# just go to the URL
https://semeclaw.fly.dev/tasks` },
  { id: "tg", k: "BOT", name: "Telegram bot", glyph: "✈", blurb: "Drive the intervention loop from a chat. Webhook auth via X-Telegram-Bot-Api-Secret-Token.", snippet: `/list
/comment task_2a81f "ship it"
task_2a81f: ship it       # shorthand` },
  { id: "embed", k: "EMBED", name: "<iframe> + <script>", glyph: "⎔", blurb: "Drop a meeting into any page. CORS + frame-ancestors locked per env.", snippet: `<iframe src="https://your-host/embed?meeting=task_2a81f"
  style="width:100%;height:720px;border:0"></iframe>` },
  { id: "http", k: "HTTP", name: "REST API", glyph: "⇄", blurb: "Full endpoint coverage. Bearer auth on writes, reads open so embeds work.", snippet: `POST /api/tasks
GET  /api/tasks/{id}/dialog
POST /api/tasks/{id}/intervene
GET  /api/tasks/quota` },
];

type Roadmap = { phase: string; label: string; status: "shipped" | "design" | "queued" };
const ROADMAP: Roadmap[] = [
  { phase: "A", label: "Tasks ingest + dialog v1", status: "shipped" },
  { phase: "B", label: "Intervention loop + orchestrator + writeback", status: "shipped" },
  { phase: "C", label: "Adapter discovery (/api/agents/adapters/{id}/agents)", status: "shipped" },
  { phase: "D", label: "Telegram bot + Tasks UI", status: "shipped" },
  { phase: "E", label: "Multi-tenant + Stripe billing", status: "design" },
  { phase: "F", label: "Voice cloning + per-agent TTS override", status: "queued" },
  { phase: "G", label: "PDF / SRT / MP4 exports", status: "queued" },
];

const KIND_COLORS: Record<string, string> = {
  call: "#e74c3c", context: "#22c55e", report: "#60a5fa", draft: "#d4a017",
  patch: "#a78bfa", propose: "#e74c3c", confirm: "#22c55e", answer: "#94a3b8",
  flag: "#f97316", decide: "#e74c3c", close: "#94a3b8",
};

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────
function AgentMono({ id, size = 32 }: { id: string; size?: number }) {
  const a = AGENT_MAP.get(id);
  const color = a?.color ?? "#999";
  const initials = a?.initials ?? id.slice(0, 2).toUpperCase();
  return (
    <div
      className="seme-line-mono"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        borderColor: `${color}66`,
        color,
        fontSize: size * 0.32,
      }}
    >
      {initials}
    </div>
  );
}

function DialogRow({ line }: { line: DialogLine }) {
  const a = AGENT_MAP.get(line.who);
  const kindColor = KIND_COLORS[line.kind] ?? "#999";
  return (
    <div className="seme-line">
      <AgentMono id={line.who} />
      <div className="seme-line-meta">
        <span className="seme-line-who" style={{ color: a?.color }}>{a?.name ?? line.who}</span>
        <span className="seme-line-kind" style={{ color: kindColor }}>{line.kind}</span>
      </div>
      <div className="seme-line-text">{line.text}</div>
    </div>
  );
}

// ────────────────────────────────────────────
// Page
// ────────────────────────────────────────────
export default function SemeClawPage() {
  return (
    <>
      <section className="seme-hero">
        <SectionLabel n={4} title="SEMECLAW // OPEN-SOURCE AI WAR ROOM" />
        <h1 className="dl-hero-title">
          The war room.
          <br />
          <span className="dl-title-accent">Six lines. Three turns. One decision.</span>
        </h1>
        <p className="seme-pitch">&ldquo;{SEMECLAW.pitch}&rdquo;</p>
        <div className="seme-meta-row">
          <span>STATUS · <b style={{ color: "var(--gold-hot)" }}>{SEMECLAW.status}</b></span>
          <span>VERSION · {SEMECLAW.version}</span>
          <span>LICENSE · {SEMECLAW.license}</span>
          <a href={`https://${SEMECLAW.live}`} target="_blank" rel="noreferrer noopener">↗ {SEMECLAW.live}</a>
          <a href={`https://${SEMECLAW.repo}`} target="_blank" rel="noreferrer noopener">↗ {SEMECLAW.repo}</a>
        </div>
      </section>

      <section className="seme-kpis">
        {KPIS.map((k) => (
          <div key={k.n} className="seme-kpi">
            <span className="seme-kpi-n">{k.n}</span>
            <div className="seme-kpi-val">{k.val}<span className="seme-kpi-unit">{k.unit}</span></div>
            <div className="seme-kpi-label">{k.label}</div>
            <div className="seme-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </section>

      <section className="seme-section">
        <SectionLabel n={1} title="THE INTERVENTION LOOP" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          Every meeting is the same loop. <span className="dl-h2-dim">You can steer it; you cannot bypass it.</span>
        </h2>
        <div className="seme-loop">
          {LOOP.map((s, i) => (
            <div key={i} className={`seme-loop-step ${s.hot ? "is-hot" : ""}`}>
              <span className="seme-loop-phase">{s.phase}</span>
              <span className="seme-loop-label">{s.label}<span className="seme-loop-side">{s.side}</span></span>
              <span className="seme-loop-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="seme-section">
        <SectionLabel n={2} title="THE FIVE MEETING AGENTS" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          Each one speaks once per dialog. <span className="dl-h2-dim">SemeClaw closes.</span>
        </h2>
        <div className="seme-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {MEETING_AGENTS.map((a) => (
            <article key={a.id} className="seme-card" style={{ ["--card-accent" as never]: a.color } as React.CSSProperties}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <AgentMono id={a.id} size={44} />
                <div>
                  <div className="dl-card-name" style={{ color: a.color }}>{a.name}</div>
                  <div className="dl-card-role">{a.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.55 }}>{a.job}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seme-section">
        <SectionLabel n={3} title="A REAL DIALOG · TASK_2A81F" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          One task, six lines, three turns, one decision <span className="dl-h2-dim">— end to end.</span>
        </h2>
        <div className="seme-dialog">
          <div className="seme-dialog-head">
            <span className="seme-dialog-title">{DIALOG.task.id} · {DIALOG.task.title}</span>
            <span className="seme-dialog-status">{DIALOG.task.status}</span>
          </div>
          {DIALOG.lines.map((l, i) => <DialogRow key={i} line={l} />)}

          {DIALOG.interventions.map((iv) => (
            <div key={iv.turn}>
              <div className="seme-turn-marker">TURN {iv.turn} · USER INTERVENTION</div>
              <div className="seme-user-msg">
                <div className="seme-user-msg-text">&ldquo;{iv.user}&rdquo;</div>
              </div>
              {iv.replies.map((r, i) => <DialogRow key={i} line={r} />)}
              {iv.decision && (
                <div className="seme-decision-block">
                  <div className="seme-decision-title">◉ ORCHESTRATOR DECISION · STRICT JSON</div>
                  <pre className="seme-decision-json">{JSON.stringify(iv.decision, null, 2)}</pre>
                  {iv.writeback && (
                    <div className="seme-decision-out">
                      <b>WRITEBACK</b>
                      <span>{iv.writeback.method} {iv.writeback.path}</span>
                      <span>→ {iv.writeback.target}</span>
                      <span>✓ {iv.writeback.ok ? "ok" : "failed"} · {iv.writeback.ms}ms</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="seme-section">
        <SectionLabel n={5} title="ADAPTERS · WHERE TASKS COME FROM" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          Six surfaces feed the room. <span className="dl-h2-dim">Three write back.</span>
        </h2>
        <div className="seme-adapters">
          {ADAPTERS.map((a) => (
            <div key={a.id} className="seme-adapter" style={{ ["--card-accent" as never]: a.color } as React.CSSProperties}>
              <div className="seme-adapter-head">
                <span className="seme-adapter-icon">{a.icon}</span>
                <span className="seme-adapter-name">{a.name}</span>
                <span className="seme-adapter-proto">{a.protocol}</span>
              </div>
              <div className="seme-adapter-desc">{a.desc}</div>
              <div className={`seme-adapter-wb ${a.writeback ? "" : "is-readonly"}`}>
                {a.writeback ? "↻ WRITEBACK · ENABLED" : "◌ READ-ONLY"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="seme-section">
        <SectionLabel n={6} title="SURFACES · HOW YOU DRIVE IT" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          Five entry points. <span className="dl-h2-dim">Same engine underneath.</span>
        </h2>
        <div className="seme-surfaces">
          {SURFACES.map((s) => (
            <article key={s.id} className="seme-surface">
              <div className="seme-surface-head">
                <span className="seme-surface-glyph">{s.glyph}</span>
                <span className="seme-surface-kind">{s.k}</span>
              </div>
              <div className="seme-surface-name">{s.name}</div>
              <p className="seme-surface-blurb">{s.blurb}</p>
              <pre className="seme-surface-snippet">{s.snippet}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="seme-section">
        <SectionLabel n={7} title="ROADMAP" />
        <h2 className="dl-h2" style={{ marginBottom: 24 }}>
          Four phases shipped. <span className="dl-h2-dim">Three more in flight.</span>
        </h2>
        <div className="seme-roadmap">
          {ROADMAP.map((r) => (
            <div key={r.phase} className="seme-roadmap-row">
              <span className="seme-roadmap-phase">{r.phase}.</span>
              <span className={`seme-roadmap-status is-${r.status}`}>{r.status.toUpperCase()}</span>
              <span className="seme-roadmap-label">{r.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
