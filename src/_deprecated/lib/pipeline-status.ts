import { spawn, execSync } from "child_process";

/**
 * Pipeline status — single source of truth.
 *
 * Used by:
 *   - GET /api/pipeline/status  (HTTP surface, bearer-auth gated)
 *   - src/app/page.tsx          (Server Component dashboard, server-internal)
 *
 * Server Components import this directly and skip the HTTP roundtrip + auth
 * dance — the auth gate exists to protect the public network surface, not
 * the in-process call from our own Server Components.
 */

export interface EngineHealth {
  name: string;
  healthy: boolean;
}

export interface QueueHealth {
  healthy: boolean;
  queued: number;
  processing: number;
  dead_letter: number;
  total_jobs: number;
}

export interface PipelineStatus {
  healthy: boolean;
  engines: EngineHealth[];
  queue: QueueHealth;
  lastRun: string;
  version: string;
}

const PIPELINE_VERSION = "2.0.0";
const PIPELINE_CWD = "packages/video-pipeline";

function runPython(args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", args, {
      cwd: PIPELINE_CWD,
      timeout: timeoutMs,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `python exit ${code}`));
    });
    proc.on("error", (err) => reject(err));
  });
}

async function checkHttpEngine(url: string, timeoutMs = 2000): Promise<boolean> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    return resp.ok;
  } catch {
    return false;
  }
}

function checkCliEngine(cmd: string): boolean {
  try {
    execSync(cmd, { stdio: "ignore", timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

const QUEUE_HEALTH_SCRIPT = `
import sys, json
sys.path.insert(0, '.')
try:
    from core.queue import PipelineQueue
    q = PipelineQueue()
    h = q.health_check()
    if not isinstance(h, dict):
        h = {}
    print(json.dumps({
        "queued": int(h.get("queued", 0)),
        "processing": int(h.get("processing", 0)),
        "dead_letter": int(h.get("dead_letter", 0)),
        "total_jobs": int(h.get("total_jobs", 0)),
    }))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
`;

const EMPTY_QUEUE: QueueHealth = {
  healthy: false,
  queued: 0,
  processing: 0,
  dead_letter: 0,
  total_jobs: 0,
};

async function fetchQueueHealth(): Promise<QueueHealth> {
  try {
    const raw = await runPython(["-c", QUEUE_HEALTH_SCRIPT], 5000);
    const parsed: unknown = JSON.parse(raw.trim());
    if (typeof parsed !== "object" || parsed === null || "error" in parsed) {
      return EMPTY_QUEUE;
    }
    const p = parsed as Partial<QueueHealth>;
    return {
      healthy: true,
      queued: typeof p.queued === "number" ? p.queued : 0,
      processing: typeof p.processing === "number" ? p.processing : 0,
      dead_letter: typeof p.dead_letter === "number" ? p.dead_letter : 0,
      total_jobs: typeof p.total_jobs === "number" ? p.total_jobs : 0,
    };
  } catch {
    return EMPTY_QUEUE;
  }
}

/**
 * Probe every engine + the queue. Returns a stable shape even if some
 * probes fail. Caller decides how to surface partial outages.
 */
export async function getPipelineStatus(): Promise<PipelineStatus> {
  // Run all probes in parallel — the previous implementation ran them serially.
  const [
    hyperFrames,
    comfyUI,
    remotion,
    ollama,
    queue,
  ] = await Promise.all([
    Promise.resolve(checkCliEngine("npx hyperframes --version")),
    checkHttpEngine("http://127.0.0.1:8000/system_stats"),
    Promise.resolve(checkCliEngine("npx remotion --version")),
    checkHttpEngine("http://127.0.0.1:11434/api/tags"),
    fetchQueueHealth(),
  ]);

  const engines: EngineHealth[] = [
    { name: "HyperFrames", healthy: hyperFrames },
    { name: "ComfyUI", healthy: comfyUI },
    { name: "Remotion", healthy: remotion },
    { name: "Ollama", healthy: ollama },
  ];

  return {
    healthy: engines.some((e) => e.healthy) && queue.healthy,
    engines,
    queue,
    lastRun: new Date().toISOString(),
    version: PIPELINE_VERSION,
  };
}
