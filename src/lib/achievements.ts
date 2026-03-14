import { supabase } from "@/lib/supabase";
import type { Achievement } from "@/types";

export async function getAchievements(): Promise<Achievement[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("status", "approved")
    .order("year", { ascending: false });

  if (error) return [];
  return data ?? [];
}
