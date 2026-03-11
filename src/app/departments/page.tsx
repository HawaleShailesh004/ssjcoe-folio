import { getDepartments } from "@/lib/stats";
import { getDeptSummary } from "@/lib/departments";
import { DepartmentsGrid } from "@/components/departments/DepartmentsGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore all departments at SSJCOE.",
};

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  const summaries = await Promise.all(
    departments.map(async (d) => ({
      dept: d,
      summary: await getDeptSummary(d.id),
    }))
  );

  return <DepartmentsGrid summaries={summaries} />;
}
