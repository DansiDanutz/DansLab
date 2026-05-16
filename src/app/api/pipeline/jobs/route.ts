import { NextResponse } from "next/server";
import { spawn } from "child_process";

function runPythonScript(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", ["-c", script], {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get("status");
  const rawLimit = searchParams.get("limit") || "20";

  const allowedStatuses = ["pending", "running", "completed", "failed", "retrying", "cancelled"];
  const status = rawStatus && allowedStatuses.includes(rawStatus) ? rawStatus : null;

  const limitNum = parseInt(rawLimit, 10);
  const limit = Number.isNaN(limitNum) || limitNum < 1 || limitNum > 100 ? 20 : limitNum;

  const script = `
import sys, json
sys.path.insert(0, '.')
from core.queue import PipelineQueue
q = PipelineQueue()
jobs = q.list_jobs(status=${status ? `"${status}"` : "None"}, limit=${limit})
print(json.dumps([j.to_dict() for j in jobs], default=str))
`;

  try {
    const output = await runPythonScript(script);
    const jobs = JSON.parse(output.trim());
    return NextResponse.json({ ok: true, jobs });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Failed to list jobs" },
      { status: 500 }
    );
  }
}
