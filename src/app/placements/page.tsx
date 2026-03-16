import { getPlacements } from "@/lib/placements";
import { getDepartments } from "@/lib/stats";
import { PlacementsClient } from "@/components/placements/PlacementsClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placements",
  description: "Placement records and recruitment at SSJCOE.",
};

export default async function PlacementsPage() {
  const [placements, departments] = await Promise.all([
    getPlacements(),
    getDepartments(),
  ]);

  const avgPackage =
    placements.length > 0
      ? (
          placements.reduce((sum, p) => sum + p.package_lpa, 0) /
          placements.length
        ).toFixed(1)
      : "0";
  const topPackage =
    placements.length > 0
      ? Math.max(...placements.map((p) => p.package_lpa))
      : 0;
  const companies = new Set(placements.map((p) => p.company)).size;

  return (
    <>
      <PageHero
        title="Placements"
        subtitle="Campus placements across all departments — verified, real, updated."
        ghostText="HIRE"
        image={IMAGES.placement_ceremony}
        crumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
        stats={[
          { value: `${placements.length}+`, label: "Total placements" },
          { value: `₹${avgPackage}`, label: "Avg. package" },
          { value: String(topPackage), label: "Highest LPA" },
          { value: String(companies), label: "Companies" },
        ]}
      />
      <div className="container section">
        <PlacementsClient placements={placements} departments={departments} />
      </div>
    </>
  );
}
