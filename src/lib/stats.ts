import { supabase } from "@/lib/supabase";

const DEFAULT_STATS = {
  totalPlacements: 0,
  avgPackage: "0",
  highestPackage: "0",
  researchPapers: 0,
  patents: 0,
  events: 0,
  achievementsCount: 0,
};

export async function getLandingStats() {
  if (!supabase) return DEFAULT_STATS;

  const [placements, research, patents, events, achievements] = await Promise.all([
    supabase
      .from("placements")
      .select("id, package_lpa", { count: "exact" })
      .eq("status", "approved"),
    supabase
      .from("research_papers")
      .select("id", { count: "exact" })
      .eq("status", "approved"),
    supabase
      .from("patents")
      .select("id", { count: "exact" })
      .eq("status", "approved"),
    supabase
      .from("events")
      .select("id", { count: "exact" })
      .eq("status", "approved"),
    supabase
      .from("achievements")
      .select("id", { count: "exact" })
      .eq("status", "approved"),
  ]);

  const packages =
    placements.data?.map((p) => Number(p.package_lpa) || 0) ?? [];
  const avgPackage =
    packages.length > 0
      ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1)
      : "0";
  const highestPackage =
    packages.length > 0 ? Math.max(...packages).toFixed(1) : "0";

  return {
    totalPlacements: placements.count ?? 0,
    avgPackage,
    highestPackage,
    researchPapers: research.count ?? 0,
    patents: patents.count ?? 0,
    events: events.count ?? 0,
    achievementsCount: achievements.count ?? 0,
  };
}

export async function getFeaturedContent() {
  if (!supabase) return [];
  const { data } = await supabase
    .from("featured_content")
    .select("*")
    .order("order_position", { ascending: true })
    .limit(6);
  return data ?? [];
}

export async function getTopPlacements() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("placements")
    .select("*")
    .eq("status", "approved")
    .order("package_lpa", { ascending: false })
    .limit(4);
  if (error) return [];
  return data ?? [];
}

export async function getDepartments() {
  if (!supabase) return [];
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("is_active", true);
  return data ?? [];
}
