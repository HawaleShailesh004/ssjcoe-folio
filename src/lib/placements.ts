import { supabase } from "@/lib/supabase";
import type { Placement } from "@/types";

export interface PlacementFilters {
  search?: string;
  year?: number;
  dept_id?: string;
  min_package?: number;
  max_package?: number;
}

export async function getPlacements(
  filters: PlacementFilters = {}
): Promise<Placement[]> {
  if (!supabase) return [];

  let query = supabase
    .from("placements")
    .select("*")
    .eq("status", "approved")
    .order("package_lpa", { ascending: false });

  if (filters.year) query = query.eq("year", filters.year);
  if (filters.dept_id) query = query.eq("dept_id", filters.dept_id);
  if (filters.min_package)
    query = query.gte("package_lpa", filters.min_package);
  if (filters.max_package)
    query = query.lte("package_lpa", filters.max_package);

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getPlacementYears(): Promise<number[]> {
  if (!supabase) return [];

  const { data } = await supabase
    .from("placements")
    .select("year")
    .eq("status", "approved")
    .order("year", { ascending: false });

  const years = [...new Set(data?.map((d) => Number(d.year)) ?? [])];
  return years;
}

export async function getPlacementStats() {
  if (!supabase)
    return {
      avg: 0,
      highest: 0,
      companies: 0,
      yearlyTrend: [] as { year: number; count: number; avg: number; highest: number }[],
    };

  const { data } = await supabase
    .from("placements")
    .select("package_lpa, year, company")
    .eq("status", "approved");

  if (!data?.length)
    return { avg: 0, highest: 0, companies: 0, yearlyTrend: [] };

  const packages = data.map((d) => Number(d.package_lpa) || 0);
  const avg = packages.reduce((a, b) => a + b, 0) / packages.length;
  const highest = Math.max(...packages);
  const companies = new Set(data.map((d) => d.company)).size;

  const byYear: Record<number, number[]> = {};
  data.forEach(({ year, package_lpa }) => {
    const y = Number(year);
    const pkg = Number(package_lpa) || 0;
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(pkg);
  });

  const yearlyTrend = Object.entries(byYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, pkgs]) => ({
      year: Number(year),
      count: pkgs.length,
      avg: Number((pkgs.reduce((a, b) => a + b, 0) / pkgs.length).toFixed(1)),
      highest: Math.max(...pkgs),
    }));

  return {
    avg: Number(avg.toFixed(1)),
    highest: Number(highest.toFixed(1)),
    companies,
    yearlyTrend,
  };
}
