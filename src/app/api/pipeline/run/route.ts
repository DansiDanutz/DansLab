import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { topic, engine = "hyperframes" } = body;

  return NextResponse.json({
    ok: true,
    jobId: `job-${Date.now()}`,
    topic: topic || "auto-generated",
    engine,
    status: "queued",
    message: "Pipeline run queued. Monitor /studio for progress.",
  });
}
