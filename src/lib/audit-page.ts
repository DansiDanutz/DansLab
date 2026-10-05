import { AUDIT_TEMPLATE } from "@/internal/audit-html";

export type AuditVerdict = "go" | "due" | "none";

export interface AuditProject {
  readonly name: string;
  readonly path: string;
  readonly verdict: AuditVerdict;
  readonly date?: string;
  readonly findings?: Readonly<Record<"c" | "h" | "m" | "l", number>>;
  readonly reportUrl?: string;
}

export interface AuditData {
  readonly updated: string;
  readonly projects: readonly AuditProject[];
}

export const EMPTY_AUDIT_DATA: AuditData = { updated: "—", projects: [] };

const VERDICTS: readonly AuditVerdict[] = ["go", "due", "none"];
const SEVERITIES = ["c", "h", "m", "l"] as const;
const VERDICT_LABEL: Record<AuditVerdict, string> = {
  go: "GO",
  due: "Recommended",
  none: "Not audited",
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;

function parseProject(raw: unknown): AuditProject | null {
  if (!isRecord(raw)) return null;
  const { name, path, verdict, date, findings, reportUrl } = raw;
  if (typeof name !== "string" || !name || typeof path !== "string") return null;
  if (!VERDICTS.includes(verdict as AuditVerdict)) return null;

  const parsedFindings =
    isRecord(findings) && SEVERITIES.every((k) => isCount(findings[k]))
      ? {
          c: findings.c as number,
          h: findings.h as number,
          m: findings.m as number,
          l: findings.l as number,
        }
      : undefined;
  // Only https report links are ever rendered.
  const safeUrl =
    typeof reportUrl === "string" && /^https:\/\//i.test(reportUrl) ? reportUrl : undefined;

  return {
    name,
    path,
    verdict: verdict as AuditVerdict,
    ...(typeof date === "string" && date ? { date } : {}),
    ...(parsedFindings ? { findings: parsedFindings } : {}),
    ...(safeUrl ? { reportUrl: safeUrl } : {}),
  };
}

/** Parses the private AUDIT_DATA JSON; returns null when missing or invalid. */
export function parseAuditData(raw: string | undefined): AuditData | null {
  if (!raw) return null;
  try {
    const json: unknown = JSON.parse(raw);
    if (!isRecord(json) || !Array.isArray(json.projects)) return null;
    const projects = json.projects.map(parseProject);
    if (projects.some((p) => p === null)) return null;
    return {
      updated: typeof json.updated === "string" ? json.updated : "—",
      projects: projects as AuditProject[],
    };
  } catch {
    return null;
  }
}

function renderRow(p: AuditProject): string {
  const audited = Boolean(p.date);
  const chips = p.findings
    ? SEVERITIES.map((k) => `<span class="chip ${k}">${p.findings![k]}${k.toUpperCase()}</span>`).join("")
    : "";
  const date = audited
    ? `<td class="date">${escapeHtml(p.date as string)}</td>`
    : '<td class="date muted">—</td>';
  const found = chips
    ? `<td><div class="chips">${chips}</div></td>`
    : '<td class="muted">not yet audited</td>';
  const report = p.reportUrl
    ? `<td><a class="report" href="${escapeHtml(p.reportUrl)}" rel="noopener noreferrer">View report ↗</a></td>`
    : '<td class="muted">—</td>';
  return (
    `<tr${audited ? ' class="audited"' : ""}>` +
    `<td><span class="proj">${escapeHtml(p.name)}</span><span class="path">${escapeHtml(p.path)}</span></td>` +
    `${date}${found}<td><span class="verdict ${p.verdict}">${VERDICT_LABEL[p.verdict]}</span></td>${report}</tr>`
  );
}

export function renderStats(projects: readonly AuditProject[]): string {
  const audited = projects.filter((p) => p.date).length;
  const goCount = projects.filter((p) => p.verdict === "go").length;
  const fixed = projects.reduce(
    (sum, p) => sum + (p.findings ? p.findings.c + p.findings.h + p.findings.m + p.findings.l : 0),
    0,
  );
  const tile = (n: number, label: string, id?: string, base = false) =>
    `<div><span class="n"${id ? ` id="${id}"` : ""}${base ? ` data-base="${n}"` : ""}>${n}</span><span class="l">${label}</span></div>`;
  return [
    tile(projects.length, "Projects tracked", "stat-tracked", true),
    tile(audited, "Audited"),
    tile(goCount, "Production-GO"),
    tile(projects.length - audited, "Not yet audited", "stat-notaudited", true),
    tile(fixed, "Findings fixed (fleet)"),
  ].join("\n");
}

/** Renders the dashboard from the template plus private data; fails closed to an empty table. */
export function renderAuditPage(raw: string | undefined): string {
  const data = parseAuditData(raw) ?? EMPTY_AUDIT_DATA;
  const rows =
    data.projects.length > 0
      ? data.projects.map(renderRow).join("\n    ")
      : '<tr><td colspan="5" class="muted">No audit data configured (set AUDIT_DATA).</td></tr>';
  return AUDIT_TEMPLATE.replace("{{STATS}}", () => renderStats(data.projects))
    .replace("{{ROWS}}", () => rows)
    .replace("{{UPDATED}}", () => escapeHtml(data.updated));
}
