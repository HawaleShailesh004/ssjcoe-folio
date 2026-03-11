import { supabase } from "@/lib/supabase";
import type { Event } from "@/types";

export async function getEvents(): Promise<Event[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("date", { ascending: false });

  if (error) return [];
  return data ?? [];
}
