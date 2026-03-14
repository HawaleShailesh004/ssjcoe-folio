import { getLandingStats, getTopPlacements, getDepartments } from "@/lib/stats";
import { getAchievements } from "@/lib/achievements";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TopPlacementsSection } from "@/components/landing/TopPlacementsSection";
import { DepartmentsSection } from "@/components/landing/DepartmentsSection";
import { AchievementsStrip } from "@/components/landing/AchievementsStrip";
import { RecruitersSection } from "@/components/landing/RecruitersSection";
import { CTASection } from "@/components/landing/CTASection";

// Always fetch fresh data so new placements show without rebuild
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, topPlacements, departments, achievements] = await Promise.all([
    getLandingStats(),
    getTopPlacements(),
    getDepartments(),
    getAchievements().then((a) => a.slice(0, 8)),
  ]);

  return (
    <>
      <HeroSection stats={stats} />
      <StatsSection stats={stats} />
      <TopPlacementsSection placements={topPlacements} />
      <DepartmentsSection departments={departments} />
      <AchievementsStrip achievements={achievements} />
      <RecruitersSection />
      <CTASection />
    </>
  );
}
