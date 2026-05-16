/**
 * GET /api/projects
 * Returns all projects with summary statistics
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at");

    if (projectsError) {
      return NextResponse.json(
        { error: projectsError.message },
        { status: 500 }
      );
    }

    // Enrich each project with stats
    const enrichedProjects = await Promise.all(
      (projects || []).map(async (project: any) => {
        // Get task count
        const { count: taskCount } = await supabase
          .from("project_tasks")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.id);

        // Get revenue total
        const { data: revenue } = await supabase
          .from("revenue_tracking")
          .select("amount")
          .eq("project_id", project.id);

        const totalRevenue = revenue?.reduce(
          (sum: number, r: any) => sum + Number(r.amount),
          0
        ) || 0;

        // Get task status breakdown
        const { data: tasks } = await supabase
          .from("project_tasks")
          .select("status")
          .eq("project_id", project.id);

        const statusBreakdown = {
          todo: tasks?.filter((t: any) => t.status === "todo").length || 0,
          in_progress:
            tasks?.filter((t: any) => t.status === "in_progress").length || 0,
          completed:
            tasks?.filter((t: any) => t.status === "completed").length || 0,
          blocked: tasks?.filter((t: any) => t.status === "blocked").length || 0,
        };

        return {
          ...project,
          task_count: taskCount || 0,
          total_revenue: totalRevenue,
          task_status_breakdown: statusBreakdown,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedProjects,
      count: enrichedProjects.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
