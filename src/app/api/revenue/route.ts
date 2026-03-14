/**
 * GET /api/revenue
 * Returns revenue data with monthly summaries and source breakdown
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get all revenue tracking records
    const { data: revenue, error } = await supabase
      .from("revenue_tracking")
      .select("*, projects(name)")
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Calculate monthly totals
    const monthlyTotals: { [key: string]: number } = {};
    const sourceBreakdown: { [key: string]: number } = {};
    const projectBreakdown: { [key: string]: number } = {};

    (revenue || []).forEach((entry: any) => {
      const amount = Number(entry.amount);

      // Monthly totals
      const date = new Date(entry.date);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;

      // Source breakdown
      sourceBreakdown[entry.source] =
        (sourceBreakdown[entry.source] || 0) + amount;

      // Project breakdown
      if (entry.projects) {
        projectBreakdown[entry.projects.name] =
          (projectBreakdown[entry.projects.name] || 0) + amount;
      }
    });

    // Calculate yearly totals
    const yearlyTotals: { [key: string]: number } = {};
    Object.entries(monthlyTotals).forEach(([month, total]) => {
      const year = month.split("-")[0];
      yearlyTotals[year] = (yearlyTotals[year] || 0) + (total as number);
    });

    // Calculate total
    const totalRevenue = (revenue || []).reduce(
      (sum: number, r: any) => sum + Number(r.amount),
      0
    );

    // Get current month data
    const now = new Date();
    const currentMonthKey = now.toISOString().slice(0, 7);
    const currentMonthRevenue = monthlyTotals[currentMonthKey] || 0;

    // Get previous month data for comparison
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = prevMonth.toISOString().slice(0, 7);
    const prevMonthRevenue = monthlyTotals[prevMonthKey] || 0;

    const monthlyGrowth =
      prevMonthRevenue > 0
        ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        all_transactions: revenue || [],
        summary: {
          total_revenue: totalRevenue,
          current_month: currentMonthRevenue,
          previous_month: prevMonthRevenue,
          monthly_growth_percent: Math.round(monthlyGrowth * 100) / 100,
          source_breakdown: sourceBreakdown,
          project_breakdown: projectBreakdown,
        },
        monthly_totals: monthlyTotals,
        yearly_totals: yearlyTotals,
        transaction_count: revenue?.length || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
