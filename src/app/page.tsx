import { getLandingStats, getTopPlacements, getDepartments } from "@/lib/stats";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TopPlacementsSection } from "@/components/landing/TopPlacementsSection";
import { DepartmentsSection } from "@/components/landing/DepartmentsSection";
import { RecruitersSection } from "@/components/landing/RecruitersSection";
import { CTASection } from "@/components/landing/CTASection";

// Always fetch fresh data so new placements show without rebuild
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, topPlacements, departments] = await Promise.all([
    getLandingStats(),
    getTopPlacements(),
    getDepartments(),
  ]);

  return (
    <>
      <HeroSection stats={stats} />
      <StatsSection stats={stats} />
      <TopPlacementsSection placements={topPlacements} />
      <DepartmentsSection departments={departments} />
      <RecruitersSection />
      <CTASection />
    </>
  );
}
