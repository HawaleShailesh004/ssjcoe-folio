import { supabase } from "@/lib/supabase";
import type { ResearchPaper } from "@/types";

export async function getResearchPapers(): Promise<ResearchPaper[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("research_papers")
    .select("*")
    .eq("status", "approved")
    .order("year", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getResearchCategories(): Promise<string[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("research_papers")
    .select("category")
    .eq("status", "approved");

  return [...new Set(data?.map((d) => String(d.category ?? "")).filter(Boolean) ?? [])];
}

export async function getResearchYears(): Promise<number[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("research_papers")
    .select("year")
    .eq("status", "approved")
    .order("year", { ascending: false });

  return [...new Set(data?.map((d) => Number(d.year)) ?? [])];
}
