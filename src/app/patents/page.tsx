import { getPatents } from "@/lib/patents";
import { getDepartments } from "@/lib/stats";
import { PatentsClient } from "@/components/patents/PatentsClient";
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

  return (
    <PatentsClient initialPatents={patents} departments={departments} />
  );
}
