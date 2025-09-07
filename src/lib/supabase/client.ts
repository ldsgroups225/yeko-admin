import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { env } from "@/lib/utils/env";

export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Keep SupabaseClient type export if needed elsewhere
export type SupabaseClient = ReturnType<typeof createClient>;
