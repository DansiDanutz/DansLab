import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    healthy: true,
    engines: {
      HyperFrames: true,
      ComfyUI: true,
      Remotion: false,
      Kokoro: true,
      BytePlusArk: true,
      Perplexity: true,
    },
    lastRun: "2026-05-16T02:15:00Z",
    queueLength: 0,
    version: "2.0.0",
  });
}
