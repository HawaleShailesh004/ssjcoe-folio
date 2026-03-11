import { supabase } from "@/lib/supabase";
import type { Department, DeptStats } from "@/types";

const DEFAULT_SUMMARY = { placements: 0, avgPackage: "0", research: 0, patents: 0, events: 0, sports: 0, faculty: 0 };

export async function getDepartmentByCode(code: string): Promise<Department | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("departments").select("*").eq("code", code.toUpperCase()).single();
  if (error) return null;
  return data;
}

export async function getDeptStats(dept_id: string): Promise<DeptStats | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("dept_stats").select("*").eq("dept_id", dept_id).order("year", { ascending: false }).limit(1).single();
  return data ?? null;
}

export async function getDeptSummary(dept_id: string) {
  if (!supabase) return DEFAULT_SUMMARY;
  const [placements, research, patents, events, sports, faculty] = await Promise.all([
    supabase.from("placements").select("id, package_lpa", { count: "exact" }).eq("dept_id", dept_id).eq("status", "approved"),
    supabase.from("research_papers").select("id", { count: "exact" }).eq("dept_id", dept_id).eq("status", "approved"),
    supabase.from("patents").select("id", { count: "exact" }).eq("dept_id", dept_id).eq("status", "approved"),
    supabase.from("events").select("id", { count: "exact" }).eq("dept_id", dept_id).eq("status", "approved"),
    supabase.from("sports_achievements").select("id", { count: "exact" }).eq("dept_id", dept_id).eq("status", "approved"),
    supabase.from("faculty").select("id", { count: "exact" }).eq("dept_id", dept_id),
  ]);
  const packages = placements.data?.map((p) => Number(p.package_lpa) || 0) ?? [];
  const avgPkg = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : "0";
  return { placements: placements.count ?? 0, avgPackage: avgPkg, research: research.count ?? 0, patents: patents.count ?? 0, events: events.count ?? 0, sports: sports.count ?? 0, faculty: faculty.count ?? 0 };
}
