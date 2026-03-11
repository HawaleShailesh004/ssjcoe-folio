import { getFaculty } from "@/lib/faculty";
import { getDepartments } from "@/lib/stats";
import { FacultyClient } from "@/components/faculty/FacultyClient";
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

  return (
    <FacultyClient initialFaculty={faculty} departments={departments} />
  );
}
