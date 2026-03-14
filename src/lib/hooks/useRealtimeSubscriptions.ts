/**
 * Realtime Subscriptions Hook
 * Subscribes to Supabase realtime updates for live data
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create client-side Supabase instance
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Hook to subscribe to team members real-time updates
 */
export function useTeamMembersSubscription(onUpdate?: (data: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel("team_members_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);

  return { isSubscribed };
}

/**
 * Hook to subscribe to real-time metrics updates
 */
export function useMetricsSubscription(onUpdate?: (data: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel("metrics_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "real_time_metrics",
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload.new);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);

  return { isSubscribed };
}

/**
 * Hook to subscribe to project tasks updates
 */
export function useProjectTasksSubscription(
  projectId: string,
  onUpdate?: (data: any) => void
) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel(`project_${projectId}_tasks`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_tasks",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId, onUpdate]);

  return { isSubscribed };
}

/**
 * Hook to subscribe to revenue tracking updates
 */
export function useRevenueSubscription(onUpdate?: (data: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel("revenue_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "revenue_tracking",
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload.new);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);

  return { isSubscribed };
}

/**
 * Hook to subscribe to system connections updates
 */
export function useConnectionsSubscription(onUpdate?: (data: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel("connections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "system_connections",
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload);
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate]);

  return { isSubscribed };
}

/**
 * Hook to setup multiple subscriptions at once
 */
export function useRealtimeSubscriptions() {
  const teamMembersSubscription = useTeamMembersSubscription();
  const metricsSubscription = useMetricsSubscription();
  const revenueSubscription = useRevenueSubscription();
  const connectionsSubscription = useConnectionsSubscription();

  return {
    isConnected:
      teamMembersSubscription.isSubscribed &&
      metricsSubscription.isSubscribed &&
      revenueSubscription.isSubscribed &&
      connectionsSubscription.isSubscribed,
    subscriptions: {
      teamMembers: teamMembersSubscription,
      metrics: metricsSubscription,
      revenue: revenueSubscription,
      connections: connectionsSubscription,
    },
  };
}
