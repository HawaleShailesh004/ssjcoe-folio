import { getLandingStats, getTopPlacements, getDepartments } from "@/lib/stats";
import { getAchievements } from "@/lib/achievements";
import { getUpcomingEvents } from "@/lib/events";
import { HeroSection } from "@/components/landing/HeroSection";
import { RecruiterSection } from "@/components/landing/RecruiterSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { UpcomingEventsSection } from "@/components/landing/UpcomingEventsSection";
import { TopPlacementsSection } from "@/components/landing/TopPlacementsSection";
import { DepartmentsSection } from "@/components/landing/DepartmentsSection";
import { AchievementsStrip } from "@/components/landing/AchievementsStrip";
import { StudentProjectsSection } from "@/components/landing/StudentProjectsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { RecruitersSection } from "@/components/landing/RecruitersSection";
import { VisionMissionSection } from "@/components/shared/VisionMissionSection";
import { CTASection } from "@/components/landing/CTASection";
import { IMAGES } from "@/lib/images";

// Always fetch fresh data so new placements show without rebuild
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, topPlacements, departments, achievements, upcomingEvents] =
    await Promise.all([
      getLandingStats(),
      getTopPlacements(),
      getDepartments(),
      getAchievements().then((a) => a.slice(0, 8)),
      getUpcomingEvents(5),
    ]);

  return (
    <>
      <HeroSection stats={stats} />
      <RecruiterSection />
      <StatsSection stats={stats} />
      <UpcomingEventsSection events={upcomingEvents} />
      <TopPlacementsSection placements={topPlacements} />
      <DepartmentsSection departments={departments} />
      <AchievementsStrip achievements={achievements} />
      <StudentProjectsSection />
      <TestimonialsSection />
      <RecruitersSection />
      <VisionMissionSection
        vision="To be recognized as a premier institution of engineering education that produces globally competent professionals capable of meeting technological challenges and contributing to societal development."
        mission="To impart quality technical education through innovative teaching-learning processes, fostering research and innovation, and developing professionals with technical competence, ethical values, and social responsibility."
        values="Excellence in education, integrity in actions, innovation in approach, inclusivity in opportunities, and responsibility towards society and environment."
        variant="college"
        bgImage={IMAGES.campus_about}
      />
      <CTASection />
    </>
  );
}
