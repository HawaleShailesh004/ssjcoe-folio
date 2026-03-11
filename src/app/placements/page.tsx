import { getPlacements, getPlacementYears, getPlacementStats } from "@/lib/placements";
import { getDepartments } from "@/lib/stats";
import { PlacementsClient } from "@/components/placements/PlacementsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placements",
  description:
    "Browse verified placement records from SSJCOE across all departments.",
};

export default async function PlacementsPage() {
  const [placements, years, stats, departments] = await Promise.all([
    getPlacements(),
    getPlacementYears(),
    getPlacementStats(),
    getDepartments(),
  ]);

  return (
    <PlacementsClient
      initialPlacements={placements}
      years={years}
      stats={stats}
      departments={departments}
    />
  );
}
