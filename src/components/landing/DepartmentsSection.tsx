import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Department } from "@/types";

export function DepartmentsSection({
  departments,
}: {
  departments: Department[];
}) {
  return (
    <section className="section-pad bg-white border-y border-brand-border">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-black">Departments</h2>
            <p className="text-brand-muted mt-1">
              Explore achievements by department
            </p>
          </div>
          <Link
            href="/departments"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-saffron hover:underline"
          >
            All departments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.code.toLowerCase()}`}
              className="card-base p-5 hover:shadow-panel hover:border-brand-saffron/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center mb-3">
                <span className="font-mono text-brand-saffron font-bold text-xs">
                  {dept.code}
                </span>
              </div>
              <h3 className="font-semibold text-brand-black text-sm leading-snug mb-1">
                {dept.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-brand-muted mt-2 group-hover:text-brand-saffron transition-colors">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
