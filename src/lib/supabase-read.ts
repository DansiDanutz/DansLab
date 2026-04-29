import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type SupabaseStatus =
  | { ok: true; client: SupabaseClient }
  | { ok: false; reason: "missing_env" };

export function getReadClient(): SupabaseStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, reason: "missing_env" };
  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return { ok: true, client };
}
