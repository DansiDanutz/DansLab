/**
 * GET /api/connections
 * Returns all system connections/integrations
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get all connections
    const { data: connections, error } = await supabase
      .from("system_connections")
      .select("*")
      .order("service_name");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Count connections by status
    const statusBreakdown: { [key: string]: number } = {
      connected: 0,
      disconnected: 0,
      error: 0,
      unknown: 0,
    };

    (connections || []).forEach((conn: any) => {
      statusBreakdown[conn.status]++;
    });

    // Enrich connections with health check info
    const enrichedConnections = (connections || []).map((conn: any) => ({
      ...conn,
      health_status: conn.status,
      last_sync_ago: conn.last_sync
        ? getTimeAgoString(new Date(conn.last_sync))
        : "Never",
    }));

    // Get health overview
    const healthOverview = {
      total_connections: enrichedConnections.length,
      healthy: statusBreakdown.connected,
      unhealthy: statusBreakdown.disconnected + statusBreakdown.error,
      unknown: statusBreakdown.unknown,
      overall_health_percent: Math.round(
        (statusBreakdown.connected / enrichedConnections.length) * 100
      ),
    };

    return NextResponse.json({
      success: true,
      data: enrichedConnections,
      health: {
        overview: healthOverview,
        status_breakdown: statusBreakdown,
      },
      count: enrichedConnections.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get human-readable time ago string
 */
function getTimeAgoString(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}
