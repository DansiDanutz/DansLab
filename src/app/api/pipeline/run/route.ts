import { NextResponse } from "next/server";
import { spawn } from "child_process";

function runPython(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python", args, {
      cwd: "packages/video-pipeline",
      timeout: 10000,
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { topic, engine = "hyperframes", upload = false } = body;

  if (!topic || typeof topic !== "string" || topic.length > 500) {
    return NextResponse.json({ ok: false, error: "topic is required (max 500 chars)" }, { status: 400 });
  }

  const allowedEngines = ["hyperframes", "revideo", "remotion"];
  if (!allowedEngines.includes(engine)) {
    return NextResponse.json({ ok: false, error: "invalid engine" }, { status: 400 });
  }

  try {
    const args = ["cli.py", "queue", "--topic", topic, "--engine", engine];
    if (upload) args.push("--upload");

    const output = await runPython(args);
    const match = output.match(/Queued job (\S+)/);
    const jobId = match ? match[1] : "unknown";

    return NextResponse.json({
      ok: true,
      jobId,
      topic,
      engine,
      status: "queued",
      message: output.trim(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Failed to queue job" },
      { status: 500 }
    );
  }
}
