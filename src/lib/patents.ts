import { supabase } from "@/lib/supabase";
import type { Patent } from "@/types";

export async function getPatents(): Promise<Patent[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("patents")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}
