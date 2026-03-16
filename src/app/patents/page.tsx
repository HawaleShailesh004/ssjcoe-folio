import { getPatents } from "@/lib/patents";
import { getDepartments } from "@/lib/stats";
import { PatentsClient } from "@/components/patents/PatentsClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patents",
  description: "Patents filed and granted by SSJCOE faculty and students.",
};

export default async function PatentsPage() {
  const [patents, departments] = await Promise.all([
    getPatents(),
    getDepartments(),
  ]);

  const granted = patents.filter((p) => p.patent_status === "granted").length;
  const published = patents.filter((p) => p.patent_status === "published").length;
  const filed = patents.filter((p) => p.patent_status === "filed").length;

  return (
    <>
      <PageHero
        title="Patents"
        subtitle="Intellectual property filed and granted by SSJCOE researchers and faculty."
        ghostText="IP"
        image={IMAGES.lab_computer}
        crumbs={[{ label: "Home", href: "/" }, { label: "Patents" }]}
        stats={[
          { value: String(patents.length), label: "Total patents" },
          { value: String(granted), label: "Granted" },
          { value: String(published), label: "Published" },
          { value: String(filed), label: "Filed" },
        ]}
      />
      <div className="container section">
        <PatentsClient patents={patents} departments={departments} />
      </div>
    </>
  );
}
