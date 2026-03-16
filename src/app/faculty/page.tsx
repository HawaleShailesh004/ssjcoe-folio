import { getFaculty } from "@/lib/faculty";
import { getDepartments } from "@/lib/stats";
import { FacultyClient } from "@/components/faculty/FacultyClient";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Meet the faculty of SSJCOE across all departments.",
};

export default async function FacultyPage() {
  const [faculty, departments] = await Promise.all([
    getFaculty(),
    getDepartments(),
  ]);
  const phdCount = faculty.filter((f) =>
    f.designation.toLowerCase().includes("ph")
  ).length;
  const deptCount = new Set(faculty.map((f) => f.dept_id)).size;
  return (
    <>
      <PageHero
        title="Faculty"
        subtitle="Experienced faculty across 7 departments — PhD holders, industry practitioners, and researchers."
        ghostText="FACULTY"
        image={IMAGES.campus_admission}
        crumbs={[{ label: "Home", href: "/" }, { label: "Faculty" }]}
        stats={[
          { value: `${faculty.length}+`, label: "Faculty members" },
          { value: String(phdCount), label: "PhD holders" },
          { value: String(deptCount), label: "Departments" },
        ]}
      />
      <div className="container section">
        <FacultyClient initialFaculty={faculty} departments={departments} />
      </div>
    </>
  );
}
