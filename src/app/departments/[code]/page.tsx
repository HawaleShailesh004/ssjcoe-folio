import {
  getDepartmentByCode,
  getDeptSummary,
  getDeptStats,
} from "@/lib/departments";
import { getFaculty } from "@/lib/faculty";
import { getPlacements } from "@/lib/placements";
import { getResearchPapers } from "@/lib/research";
import { getDepartments } from "@/lib/stats";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { ResearchCard } from "@/components/research/ResearchCard";
import { DepartmentPlacementsGrid } from "@/components/departments/DepartmentPlacementsGrid";
import {
  GraduationCap,
  FlaskConical,
  Award,
  Calendar,
  Users,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { code } = await params;
  const dept = await getDepartmentByCode(code);
  return { title: dept?.name ?? "Department" };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { code } = await params;
  const dept = await getDepartmentByCode(code);
  if (!dept) notFound();

  const [summary, deptStats, allDepts] = await Promise.all([
    getDeptSummary(dept.id),
    getDeptStats(dept.id),
    getDepartments(),
  ]);

  const [faculty, placements, papers] = await Promise.all([
    getFaculty().then((f) => f.filter((f) => f.dept_id === dept.id)),
    getPlacements({ dept_id: dept.id }).then((p) => p.slice(0, 4)),
    getResearchPapers().then((r) =>
      r.filter((r) => r.dept_id === dept.id).slice(0, 3)
    ),
  ]);

  const hod = faculty.find((f) => f.is_hod);

  return (
    <div className="container-main section-pad">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: dept.code },
        ]}
        title={dept.name}
        description={`Department of ${dept.name} — SSJCOE`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {[
          {
            icon: GraduationCap,
            label: "Placed",
            value: summary.placements,
          },
          { icon: Users, label: "Faculty", value: summary.faculty },
          { icon: FlaskConical, label: "Papers", value: summary.research },
          { icon: Award, label: "Patents", value: summary.patents },
          { icon: Calendar, label: "Events", value: summary.events },
          { icon: Trophy, label: "Sports", value: summary.sports },
        ].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={<s.icon className="w-4 h-4" />}
            className="text-center"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {placements.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-brand-black text-lg">
                  Recent Placements
                </h2>
                <Link
                  href={`/placements?dept=${dept.id}`}
                  className="text-sm text-brand-saffron hover:underline"
                >
                  View all
                </Link>
              </div>
              <DepartmentPlacementsGrid
                placements={placements}
                department={dept}
              />
            </section>
          )}

          {papers.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-brand-black text-lg">
                  Recent Research
                </h2>
                <Link
                  href="/research"
                  className="text-sm text-brand-saffron hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {papers.map((p) => (
                  <ResearchCard
                    key={p.id}
                    paper={p}
                    department={dept}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {hod && (
            <div className="card-base p-5">
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">
                Head of Department
              </h3>
              <FacultyCard faculty={hod} department={dept} />
            </div>
          )}

          {deptStats && (
            <div className="card-base p-5">
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">
                Department Stats ({deptStats.year})
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Students", value: deptStats.student_count },
                  { label: "Faculty", value: deptStats.faculty_count },
                  { label: "Labs", value: deptStats.labs_count },
                  {
                    label: "Placement Rate",
                    value: `${deptStats.placement_rate}%`,
                  },
                  { label: "Graduates", value: deptStats.graduates_count },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-brand-muted">{s.label}</span>
                    <span className="font-mono font-semibold text-brand-black">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-base p-5">
            <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">
              Faculty ({faculty.length})
            </h3>
            <div className="flex flex-col gap-2">
              {faculty.map((f) => (
                <Link
                  key={f.id}
                  href={`/faculty/${f.id}`}
                  className="flex items-center gap-3 py-2 hover:bg-brand-bg rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center text-xs font-bold text-brand-muted overflow-hidden shrink-0">
                    {f.photo_url ? (
                      <img
                        src={f.photo_url}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      f.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-brand-muted truncate">
                      {f.designation}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
