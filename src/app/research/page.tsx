import {
  getResearchPapers,
  getResearchCategories,
  getResearchYears,
} from "@/lib/research";
import { getDepartments } from "@/lib/stats";
import { ResearchClient } from "@/components/research/ResearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Published research papers from SSJCOE faculty and students.",
};

export default async function ResearchPage() {
  const [papers, categories, years, departments] = await Promise.all([
    getResearchPapers(),
    getResearchCategories(),
    getResearchYears(),
    getDepartments(),
  ]);

  return (
    <ResearchClient
      initialPapers={papers}
      categories={categories}
      years={years}
      departments={departments}
    />
  );
}
