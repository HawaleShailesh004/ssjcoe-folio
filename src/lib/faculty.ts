import { supabase } from "@/lib/supabase";
import type { Faculty } from "@/types";

export async function getFaculty(): Promise<Faculty[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("faculty").select("*").order("is_hod", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getFacultyById(id: string): Promise<Faculty | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("faculty").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getFacultyPapers(name: string) {
  if (!supabase) return [];
  const { data } = await supabase.from("research_papers").select("id, title, journal, year, category, doi").eq("status", "approved").contains("authors", [name]);
  return data ?? [];
}

export async function getFacultyPatents(name: string) {
  if (!supabase) return [];
  const { data } = await supabase.from("patents").select("id, title, patent_status, year, patent_number").eq("status", "approved").contains("inventors", [name]);
  return data ?? [];
}
