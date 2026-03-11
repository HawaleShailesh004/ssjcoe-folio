import { supabase } from "@/lib/supabase";
import type { SportsAchievement } from "@/types";

export async function getSportsAchievements(): Promise<SportsAchievement[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("sports_achievements")
    .select("*")
    .eq("status", "approved")
    .order("year", { ascending: false });

  if (error) return [];
  return data ?? [];
}
