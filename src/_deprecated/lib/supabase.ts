/**
 * Supabase Client Configuration
 * Used for API routes and server-side operations
 */

import { createClient } from "@supabase/supabase-js";

let supabaseInstance: any = null;

/**
 * Get or create Supabase client for server-side operations
 * Uses service role key for admin access
 */
export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Get credentials from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
}

/**
 * Lazy-loaded Supabase client
 */
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    return getSupabase()[prop as string];
  },
});

/**
 * Type definitions for database tables
 */
export type Database = {
  public: {
    Tables: {
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          avatar_url: string | null;
          status: string;
          location: string | null;
          connected_devices: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          role: string;
          avatar_url?: string | null;
          status?: string;
          location?: string | null;
          connected_devices?: string[];
        };
        Update: {
          name?: string;
          role?: string;
          avatar_url?: string | null;
          status?: string;
          location?: string | null;
          connected_devices?: string[];
          updated_at?: string;
        };
      };
      piperclip_teams: {
        Row: {
          id: string;
          agent_id: string;
          member_name: string;
          role: string;
          task_count: number;
          status: string;
          focus_area: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          agent_id: string;
          member_name: string;
          role: string;
          task_count?: number;
          status?: string;
          focus_area?: string | null;
        };
        Update: {
          task_count?: number;
          status?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: string;
          owner_id: string | null;
          start_date: string | null;
          target_completion: string | null;
          repository_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          status?: string;
          owner_id?: string | null;
          start_date?: string | null;
          target_completion?: string | null;
          repository_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          task_id: string;
          title: string;
          status: string;
          assignee_id: string | null;
          priority: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          task_id: string;
          title: string;
          status?: string;
          assignee_id?: string | null;
          priority?: string;
        };
        Update: {
          status?: string;
          updated_at?: string;
        };
      };
      project_roadmap: {
        Row: {
          id: string;
          project_id: string;
          phase: string;
          description: string | null;
          status: string;
          completion_date: string | null;
          phase_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          phase: string;
          description?: string | null;
          status?: string;
          phase_order?: number;
        };
        Update: {
          status?: string;
          completion_date?: string | null;
        };
      };
      revenue_tracking: {
        Row: {
          id: string;
          source: string;
          amount: number;
          date: string;
          project_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          source: string;
          amount: number;
          date?: string;
          project_id?: string | null;
          notes?: string | null;
        };
      };
      system_connections: {
        Row: {
          id: string;
          service_name: string;
          status: string;
          last_sync: string | null;
          endpoint_url: string | null;
          health_check_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          service_name: string;
          status?: string;
          endpoint_url?: string | null;
          health_check_url?: string | null;
        };
        Update: {
          status?: string;
          last_sync?: string | null;
        };
      };
      real_time_metrics: {
        Row: {
          id: string;
          metric_name: string;
          value: number;
          timestamp: string;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          metric_name: string;
          value: number;
          timestamp?: string;
          metadata?: Record<string, any> | null;
        };
      };
    };
  };
};

/**
 * Helper function to get a team member by ID
 */
export async function getTeamMember(id: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch team member: ${error.message}`);
  return data;
}

/**
 * Helper function to get all team members
 */
export async function getAllTeamMembers() {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at");

  if (error) throw new Error(`Failed to fetch team members: ${error.message}`);
  return data;
}

/**
 * Helper function to get a project by ID with roadmap
 */
export async function getProjectWithDetails(id: string) {
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError) throw new Error(`Failed to fetch project: ${projectError.message}`);

  const { data: roadmap, error: roadmapError } = await supabase
    .from("project_roadmap")
    .select("*")
    .eq("project_id", id)
    .order("phase_order");

  if (roadmapError) throw new Error(`Failed to fetch roadmap: ${roadmapError.message}`);

  const { data: tasks, error: tasksError } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", id);

  if (tasksError) throw new Error(`Failed to fetch tasks: ${tasksError.message}`);

  const { data: revenue, error: revenueError } = await supabase
    .from("revenue_tracking")
    .select("*")
    .eq("project_id", id)
    .order("date", { ascending: false });

  if (revenueError) throw new Error(`Failed to fetch revenue: ${revenueError.message}`);

  return {
    ...project,
    roadmap,
    tasks,
    revenue,
  };
}

/**
 * Helper function to get revenue summary
 */
export async function getRevenueData() {
  const { data, error } = await supabase
    .from("revenue_tracking")
    .select("*, projects(name)")
    .order("date", { ascending: false })
    .limit(100);

  if (error) throw new Error(`Failed to fetch revenue: ${error.message}`);

  // Calculate monthly totals
  const monthlyTotals: { [key: string]: number } = {};
  const sourceBreakdown: { [key: string]: number } = {};

  (data || []).forEach((entry: any) => {
    const date = new Date(entry.date);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM

    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + Number(entry.amount);
    sourceBreakdown[entry.source] = (sourceBreakdown[entry.source] || 0) + Number(entry.amount);
  });

  return {
    all: data,
    monthly: monthlyTotals,
    bySource: sourceBreakdown,
  };
}

/**
 * Helper function to get system metrics
 */
export async function getSystemMetrics() {
  const { data, error } = await supabase
    .from("real_time_metrics")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) throw new Error(`Failed to fetch metrics: ${error.message}`);

  // Transform to key-value format
  const metricsMap: { [key: string]: any } = {};
  (data || []).forEach((metric: any) => {
    if (!metricsMap[metric.metric_name]) {
      metricsMap[metric.metric_name] = {
        value: metric.value,
        timestamp: metric.timestamp,
        metadata: metric.metadata,
      };
    }
  });

  return metricsMap;
}
