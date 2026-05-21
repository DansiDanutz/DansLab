import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync(
      "cd packages/video-pipeline && python cli.py metrics",
      { encoding: "utf-8", timeout: 5000 }
    );
    return new Response(output, {
      headers: { "Content-Type": "text/plain; version=0.0.4" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Metrics unavailable" },
      { status: 500 }
    );
  }
}
