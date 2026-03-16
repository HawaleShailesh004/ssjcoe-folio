import { getResearchPapers } from "@/lib/research";
import { getDepartments } from "@/lib/stats";
import { ResearchClient } from "@/components/research/ResearchClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Published research papers from SSJCOE faculty and students.",
};

export default async function ResearchPage() {
  const [papers, departments] = await Promise.all([
    getResearchPapers(),
    getDepartments(),
  ]);

  const totalCitations = papers.reduce((s, p) => s + (p.citations ?? 0), 0);
  const yearsActive = new Set(papers.map((p) => p.year)).size;

  return (
    <>
      <PageHero
        title="Research"
        subtitle="Published papers, journal articles, and conference proceedings from SSJCOE faculty and students."
        ghostText="RESEARCH"
        image={IMAGES.campus_ai}
        crumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
        stats={[
          { value: `${papers.length}+`, label: "Papers published" },
          { value: String(yearsActive), label: "Years active" },
          { value: String(totalCitations), label: "Total citations" },
        ]}
      />
      <div className="container section">
        <ResearchClient papers={papers} departments={departments} />
      </div>
    </>
  );
}
