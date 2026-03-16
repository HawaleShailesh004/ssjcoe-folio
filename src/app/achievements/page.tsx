import { getAchievements } from "@/lib/achievements";
import { getDepartments } from "@/lib/stats";
import { AchievementsClient } from "@/components/achievements/AchievementsClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Sports, technical, cultural and academic achievements by SSJCOE students.",
};

export default async function AchievementsPage() {
  const [achievements, departments] = await Promise.all([
    getAchievements(),
    getDepartments(),
  ]);
  const national = achievements.filter(
    (a) => a.achievement_level === "national"
  ).length;
  const international = achievements.filter(
    (a) => a.achievement_level === "international"
  ).length;
  return (
    <>
      <PageHero
        title="Achievements"
        subtitle="National hackathon wins, sports medals, academic awards — what SSJCOE students accomplish."
        ghostText="WIN"
        image={IMAGES.achievement_sih_grand_final}
        crumbs={[{ label: "Home", href: "/" }, { label: "Achievements" }]}
        stats={[
          { value: `${achievements.length}+`, label: "Achievements" },
          { value: String(national), label: "National level" },
          { value: String(international), label: "International" },
        ]}
      />
      <div className="container section">
        <AchievementsClient
          initialAchievements={achievements}
          departments={departments}
        />
      </div>
    </>
  );
}
