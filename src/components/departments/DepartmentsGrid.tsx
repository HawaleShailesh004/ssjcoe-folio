import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  GraduationCap,
  FlaskConical,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";
import type { Department } from "@/types";

interface Summary {
  placements: number;
  avgPackage: string;
  research: number;
  patents: number;
  events: number;
  sports: number;
  faculty: number;
}

interface Props {
  summaries: { dept: Department; summary: Summary }[];
}

export function DepartmentsGrid({ summaries }: Props) {
  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Departments"
        description="Explore achievements and records across all SSJCOE departments."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departments" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries.map(({ dept, summary }) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.code.toLowerCase()}`}
            className="card-base p-6 hover:shadow-panel hover:border-brand-saffron/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-black flex items-center justify-center mb-3">
                  <span className="font-mono font-bold text-brand-saffron text-sm">
                    {dept.code}
                  </span>
                </div>
                <h3 className="font-bold text-brand-black leading-snug">
                  {dept.name}
                </h3>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-saffron group-hover:translate-x-1 transition-all mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: GraduationCap,
                  label: "Placed",
                  value: summary.placements,
                },
                { icon: Users, label: "Faculty", value: summary.faculty },
                {
                  icon: FlaskConical,
                  label: "Papers",
                  value: summary.research,
                },
                { icon: Award, label: "Patents", value: summary.patents },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-brand-bg rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1">
                      <Icon className="w-3 h-3" />
                      <span>{stat.label}</span>
                    </div>
                    <span className="font-mono font-bold text-brand-black text-lg">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {Number(summary.avgPackage) > 0 && (
              <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="text-xs text-brand-muted">
                  Avg. Package
                </span>
                <span className="font-mono font-bold text-green-700 text-sm">
                  ₹{summary.avgPackage} LPA
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
