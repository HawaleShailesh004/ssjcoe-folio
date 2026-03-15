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

export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  if (!supabase) return [];
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}
