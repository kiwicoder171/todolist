import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== "https://placeholder.supabase.co"
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export interface RealtimeSubscriptionOptions {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

/**
 * Subscribes to changes on a table if Supabase is configured; returns an unsubscribe function.
 */
export function subscribeToTable({
  table,
  onInsert,
  onUpdate,
  onDelete,
}: RealtimeSubscriptionOptions): () => void {
  if (!supabase) {
    return () => {};
  }

  const channelId = `public:${table}:${Math.random().toString(36).substring(2, 9)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table },
      (payload) => onInsert?.(payload.new)
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table },
      (payload) => onUpdate?.(payload.new)
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table },
      (payload) => onDelete?.(payload.old)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
