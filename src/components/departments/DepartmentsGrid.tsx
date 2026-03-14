import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { ArrowRight } from "lucide-react";
import type { Department } from "@/types";

interface Summary {
  placements: number;
  avgPackage: string;
  research: number;
  patents: number;
  events: number;
  achievements: number;
  faculty: number;
}

export function DepartmentsGrid({
  summaries,
}: {
  summaries: { dept: Department; summary: Summary }[];
}) {
  return (
    <div className="container section">
      <PageHeader
        title="Departments"
        description="Explore achievements and records by department."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departments" }]}
        count={summaries.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map(({ dept, summary }) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.code.toLowerCase()}`}
            className="card card-hover p-6 group"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-mono font-semibold text-ink-2 text-sm mb-1">
                  {dept.code}
                </p>
                <h3 className="text-base font-medium text-ink leading-snug">
                  {dept.name}
                </h3>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-6 group-hover:text-ink group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-px bg-ink-7 border border-ink-7 rounded overflow-hidden text-sm">
              {[
                { label: "Placed", value: summary.placements },
                { label: "Faculty", value: summary.faculty },
                { label: "Papers", value: summary.research },
                { label: "Patents", value: summary.patents },
              ].map((s) => (
                <div key={s.label} className="bg-ink-9 px-3 py-2.5">
                  <p className="font-mono font-semibold text-ink">{s.value}</p>
                  <p className="text-xs text-ink-5 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {Number(summary.avgPackage) > 0 && (
              <div className="mt-4 pt-4 border-t border-ink-7 flex items-center justify-between">
                <p className="text-xs text-ink-4">Avg. package</p>
                <p className="font-mono text-sm font-semibold text-ink">
                  ₹{summary.avgPackage} LPA
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
