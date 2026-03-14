/**
 * GET /api/projects/:id
 * Returns project details with roadmap, tasks, and revenue
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get roadmap phases
    const { data: roadmap, error: roadmapError } = await supabase
      .from("project_roadmap")
      .select("*")
      .eq("project_id", id)
      .order("phase_order");

    if (roadmapError && roadmapError.code !== "PGRST116") {
      return NextResponse.json(
        { error: roadmapError.message },
        { status: 500 }
      );
    }

    // Get tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("project_tasks")
      .select("*, team_members(name)")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    if (tasksError && tasksError.code !== "PGRST116") {
      return NextResponse.json(
        { error: tasksError.message },
        { status: 500 }
      );
    }

    // Get revenue tracking
    const { data: revenue, error: revenueError } = await supabase
      .from("revenue_tracking")
      .select("*")
      .eq("project_id", id)
      .order("date", { ascending: false });

    if (revenueError && revenueError.code !== "PGRST116") {
      return NextResponse.json(
        { error: revenueError.message },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const totalRevenue = (revenue || []).reduce(
      (sum: number, r: any) => sum + Number(r.amount),
      0
    );

    const taskStatusBreakdown = {
      total: tasks?.length || 0,
      todo: tasks?.filter((t: any) => t.status === "todo").length || 0,
      in_progress:
        tasks?.filter((t: any) => t.status === "in_progress").length || 0,
      completed:
        tasks?.filter((t: any) => t.status === "completed").length || 0,
      blocked: tasks?.filter((t: any) => t.status === "blocked").length || 0,
    };

    const completionPercentage = taskStatusBreakdown.total > 0
      ? Math.round((taskStatusBreakdown.completed / taskStatusBreakdown.total) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        project,
        roadmap: roadmap || [],
        tasks: tasks || [],
        revenue: revenue || [],
        summary: {
          total_revenue: totalRevenue,
          task_statistics: taskStatusBreakdown,
          completion_percentage: completionPercentage,
          phase_count: roadmap?.length || 0,
          completed_phases: roadmap?.filter((p: any) => p.status === "completed")
            .length || 0,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
