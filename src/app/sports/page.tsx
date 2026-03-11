import { getSportsAchievements } from "@/lib/sports";
import { getDepartments } from "@/lib/stats";
import { SportsClient } from "@/components/sports/SportsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports & Achievements",
  description: "Sports and cultural achievements by SSJCOE students.",
};

export default async function SportsPage() {
  const [achievements, departments] = await Promise.all([
    getSportsAchievements(),
    getDepartments(),
  ]);
  return (
    <SportsClient
      initialAchievements={achievements}
      departments={departments}
    />
  );
}
