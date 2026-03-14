/**
 * GET /api/team
 * Returns all team members
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data: teamMembers, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Add task count summary for each team member
    const enrichedMembers = await Promise.all(
      (teamMembers || []).map(async (member: any) => {
        const { count } = await supabase
          .from("piperclip_teams")
          .select("*", { count: "exact", head: true })
          .eq("agent_id", member.id);

        return {
          ...member,
          team_size: count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedMembers,
      count: enrichedMembers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
