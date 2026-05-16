/**
 * GET /api/metrics
 * Returns real-time system metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get latest metrics
    const { data: metrics, error } = await supabase
      .from("real_time_metrics")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Transform to key-value format with only latest values
    const metricsMap: { [key: string]: any } = {};
    const allMetrics: any[] = [];

    (metrics || []).forEach((metric: any) => {
      allMetrics.push({
        id: metric.id,
        metric_name: metric.metric_name,
        value: metric.value,
        timestamp: metric.timestamp,
        metadata: metric.metadata,
      });

      // Keep only the first (latest) entry for each metric
      if (!metricsMap[metric.metric_name]) {
        metricsMap[metric.metric_name] = {
          value: metric.value,
          timestamp: metric.timestamp,
          metadata: metric.metadata,
        };
      }
    });

    // Get task statistics
    const { data: tasks } = await supabase
      .from("project_tasks")
      .select("status");

    const taskStats = {
      total: tasks?.length || 0,
      todo: tasks?.filter((t: any) => t.status === "todo").length || 0,
      in_progress:
        tasks?.filter((t: any) => t.status === "in_progress").length || 0,
      completed:
        tasks?.filter((t: any) => t.status === "completed").length || 0,
      blocked: tasks?.filter((t: any) => t.status === "blocked").length || 0,
    };

    // Get team statistics
    const { count: totalTeamMembers } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true });

    const { data: teamStatus } = await supabase
      .from("team_members")
      .select("status");

    const teamStats = {
      total: totalTeamMembers || 0,
      online: teamStatus?.filter((t: any) => t.status === "online").length || 0,
      offline:
        teamStatus?.filter((t: any) => t.status === "offline").length || 0,
      away: teamStatus?.filter((t: any) => t.status === "away").length || 0,
      busy: teamStatus?.filter((t: any) => t.status === "busy").length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        metrics: metricsMap,
        task_statistics: taskStats,
        team_statistics: teamStats,
        all_metric_history: allMetrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
