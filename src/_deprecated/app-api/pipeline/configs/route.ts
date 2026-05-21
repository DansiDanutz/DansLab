import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    configs: [
      { name: "sources", path: "config/sources.yaml", type: "yaml" },
      { name: "model_routing", path: "config/model_routing.yaml", type: "yaml" },
      { name: "prompts", path: "config/prompts.yaml", type: "yaml" },
      { name: "channels", path: "config/channels.yaml", type: "yaml" },
      { name: "comfyui_workflow", path: "config/comfyui_workflow.json", type: "json" },
      { name: "manual_topics", path: "config/manual_topics.yaml", type: "yaml" },
    ],
  });
}
