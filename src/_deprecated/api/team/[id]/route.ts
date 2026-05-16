/**
 * GET /api/team/:id
 * Returns a single team member with their piperclip team
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the team member
    const { data: member, error: memberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();

    if (memberError) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Get piperclip team for this member (if member is an agent)
    const { data: piperclipTeam, error: teamError } = await supabase
      .from("piperclip_teams")
      .select("*")
      .eq("agent_id", id)
      .order("created_at");

    if (teamError && teamError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine
      return NextResponse.json(
        { error: teamError.message },
        { status: 500 }
      );
    }

    // Calculate team statistics
    const totalTeamSize = piperclipTeam?.length || 0;
    const activeMembersCount = piperclipTeam?.filter(
      (m: any) => m.status === "active"
    ).length || 0;
    const totalTasks = piperclipTeam?.reduce(
      (sum: number, m: any) => sum + m.task_count,
      0
    ) || 0;

    return NextResponse.json({
      success: true,
      data: {
        member,
        piperclip_team: piperclipTeam || [],
        team_stats: {
          total_size: totalTeamSize,
          active_members: activeMembersCount,
          total_tasks: totalTasks,
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
