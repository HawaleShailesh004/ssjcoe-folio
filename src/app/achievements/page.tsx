import { getAchievements } from "@/lib/achievements";
import { getDepartments } from "@/lib/stats";
import { AchievementsClient } from "@/components/achievements/AchievementsClient";
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
  return (
    <AchievementsClient
      initialAchievements={achievements}
      departments={departments}
    />
  );
}
