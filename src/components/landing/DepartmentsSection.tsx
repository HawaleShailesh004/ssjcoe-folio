import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Department } from "@/types";

export function DepartmentsSection({
  departments,
}: {
  departments: Department[];
}) {
  return (
    <section className="section bg-white border-y border-ink-7">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="accent-line" />
            <h2 className="text-3xl">Departments</h2>
          </div>
          <Link
            href="/departments"
            className="hidden sm:flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
          >
            All departments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {departments.map((d) => (
            <Link
              key={d.id}
              href={`/departments/${d.code.toLowerCase()}`}
              className="card card-hover p-5 group"
            >
              <p className="font-mono font-semibold text-ink-2 text-sm mb-1">
                {d.code}
              </p>
              <p className="text-sm font-medium text-ink leading-snug mb-3">
                {d.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-ink-5 group-hover:text-ink transition-colors">
                Explore <ArrowRight className="w-3 h-3" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
