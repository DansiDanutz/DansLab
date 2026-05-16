import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const limit = searchParams.get("limit") || "20";

  try {
    const cmd = [
      "cd packages/video-pipeline && python -c ",
      `"import sys; sys.path.insert(0, '.'); `,
      `from core.queue import PipelineQueue; `,
      `import json; `,
      `q = PipelineQueue(); `,
      `jobs = q.list_jobs(status=${status ? `"${status}"` : "None"}, limit=${limit}); `,
      `print(json.dumps([j.to_dict() for j in jobs], default=str))"`,
    ].join("");

    const output = execSync(cmd, { encoding: "utf-8", timeout: 5000 });
    const jobs = JSON.parse(output.trim());

    return NextResponse.json({ ok: true, jobs });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Failed to list jobs" },
      { status: 500 }
    );
  }
}
