import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { topic, engine = "hyperframes", upload = false } = body;

  if (!topic) {
    return NextResponse.json({ ok: false, error: "topic is required" }, { status: 400 });
  }

  try {
    const cmd = [
      "cd packages/video-pipeline && python cli.py queue",
      `--topic "${topic.replace(/"/g, '\\"')}"`,
      `--engine ${engine}`,
      upload ? "--upload" : "",
    ].join(" ");

    const output = execSync(cmd, { encoding: "utf-8", timeout: 10000 });
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
