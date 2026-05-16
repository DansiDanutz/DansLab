import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { execSync } from "child_process";

function runPython(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", args, {
      cwd: "packages/video-pipeline",
      timeout: 5000,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d; });
    proc.stderr.on("data", (d) => { stderr += d; });
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `Exit code ${code}`));
    });
  });
}

export async function GET() {
  let queueHealth: any = { healthy: false, queued: 0, processing: 0 };
  let engines: Record<string, boolean> = {
    HyperFrames: false,
    ComfyUI: false,
    Remotion: false,
    Kokoro: false,
    BytePlusArk: false,
    Perplexity: false,
    Revideo: false,
    Ollama: false,
  };

  try {
    execSync("npx hyperframes --version", { stdio: "ignore", timeout: 3000 });
    engines.HyperFrames = true;
  } catch {}

  try {
    const resp = await fetch("http://127.0.0.1:8000/system_stats", { method: "GET", signal: AbortSignal.timeout(2000) });
    engines.ComfyUI = resp.ok;
  } catch {}

  try {
    execSync("npx remotion --version", { stdio: "ignore", timeout: 3000 });
    engines.Remotion = true;
  } catch {}

  try {
    const resp = await fetch("http://127.0.0.1:11434/api/tags", { signal: AbortSignal.timeout(2000) });
    engines.Ollama = resp.ok;
  } catch {}

  try {
    const out = await runPython(["-c", `
import sys
sys.path.insert(0, '.')
from core.queue import PipelineQueue
import json
q = PipelineQueue()
print(json.dumps(q.health_check()))
`]);
    queueHealth = JSON.parse(out.trim());
    queueHealth.healthy = true;
  } catch {
    queueHealth = { healthy: false, queued: 0, processing: 0, dead_letter: 0, total_jobs: 0 };
  }

  return NextResponse.json({
    healthy: Object.values(engines).some(Boolean) && queueHealth.healthy,
    engines,
    queue: queueHealth,
    lastRun: new Date().toISOString(),
    version: "2.0.0",
  });
}
