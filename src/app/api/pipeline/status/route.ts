import { NextResponse } from "next/server";
import { execSync } from "child_process";

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
    // Check HyperFrames
    execSync("npx hyperframes --version", { stdio: "ignore" });
    engines.HyperFrames = true;
  } catch {}

  try {
    // Check ComfyUI
    const resp = await fetch("http://127.0.0.1:8000/system_stats", { method: "GET", signal: AbortSignal.timeout(2000) });
    engines.ComfyUI = resp.ok;
  } catch {}

  try {
    // Check Remotion
    execSync("npx remotion --version", { stdio: "ignore" });
    engines.Remotion = true;
  } catch {}

  try {
    // Check Ollama
    const resp = await fetch("http://127.0.0.1:11434/api/tags", { signal: AbortSignal.timeout(2000) });
    engines.Ollama = resp.ok;
  } catch {}

  try {
    // Check Redis queue via Python CLI
    const out = execSync(
      `cd packages/video-pipeline && python -c "
import sys
sys.path.insert(0, '.')
from core.queue import PipelineQueue
q = PipelineQueue()
print(q.health_check())
"`,
      { encoding: "utf-8", timeout: 5000 }
    );
    queueHealth = eval(out.trim()); // safe: controlled Python output
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
