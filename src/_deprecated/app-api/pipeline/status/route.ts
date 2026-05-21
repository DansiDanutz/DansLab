import { NextResponse } from "next/server";
import { getPipelineStatus } from "@/lib/pipeline-status";

/**
 * GET /api/pipeline/status
 *
 * Returns engine + queue health. Bearer-token auth is enforced by
 * src/middleware.ts on the /api/pipeline/* matcher.
 *
 * The actual probing logic lives in @/lib/pipeline-status so Server
 * Components (e.g. the dashboard) can call it directly without an
 * HTTP round-trip against ourselves.
 */
export async function GET() {
  const status = await getPipelineStatus();
  return NextResponse.json(status);
}
