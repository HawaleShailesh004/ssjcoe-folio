import { getPlacements, getPlacementYears } from "@/lib/placements";
import { getDepartments } from "@/lib/stats";
import { PlacementsClient } from "@/components/placements/PlacementsClient";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placements",
  description: "Placement records and recruitment at SSJCOE.",
};

export default async function PlacementsPage() {
  const [placements, years, departments] = await Promise.all([
    getPlacements(),
    getPlacementYears(),
    getDepartments(),
  ]);

  return (
    <div className="container section">
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
        title="Placements"
        description="Campus recruitment records — companies, packages, and roles"
      />
      <PlacementsClient
        placements={placements}
        years={years}
        departments={departments}
      />
    </div>
  );
}
