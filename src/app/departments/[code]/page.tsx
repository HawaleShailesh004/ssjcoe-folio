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
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { ResearchCard } from "@/components/research/ResearchCard";
import { DepartmentPlacementsGrid } from "@/components/departments/DepartmentPlacementsGrid";
import { DEPT_IMAGES, normalizeImageUrl } from "@/lib/images";
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
    <div className="container section">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: dept.code },
        ]}
        title={dept.name}
        description={`Department of ${dept.name} — SSJCOE`}
      />

      {DEPT_IMAGES[dept.code] && (
        <div
          className="relative rounded-lg overflow-hidden mb-10"
          style={{ height: "220px" }}
        >
          <img
            src={DEPT_IMAGES[dept.code]}
            alt={dept.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.3) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <p className="font-mono text-saffron font-bold text-sm mb-1">
                {dept.code}
              </p>
              <h2 className="font-display text-3xl text-white">{dept.name}</h2>
              <p className="text-stone-400 text-sm mt-1">
                Department of {dept.name} · SSJCOE
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-stone-200 border border-stone-200 rounded-lg overflow-hidden mb-10">
        {[
          { label: "Placed", value: summary.placements },
          { label: "Faculty", value: summary.faculty },
          { label: "Papers", value: summary.research },
          { label: "Patents", value: summary.patents },
          { label: "Events", value: summary.events },
          { label: "Achievements", value: summary.achievements },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 text-center">
            <p className="label mb-3">{s.label}</p>
            <p className="num text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {placements.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-stone-950 text-lg">
                  Recent Placements
                </h2>
                <Link
                  href={`/placements?dept=${dept.id}`}
                  className="text-sm text-saffron hover:text-saffron-dark hover:underline"
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
                <h2 className="font-bold text-stone-950 text-lg">
                  Recent Research
                </h2>
                <Link
                  href="/research"
                  className="text-sm text-saffron hover:text-saffron-dark hover:underline"
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
            <div className="card p-5">
              <h3 className="label mb-4">
                Head of Department
              </h3>
              <FacultyCard faculty={hod} department={dept} />
            </div>
          )}

          {deptStats && (
            <div className="card p-5">
              <h3 className="label mb-4">
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
                    <span className="text-stone-500">{s.label}</span>
                    <span className="font-mono font-semibold text-stone-950">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="label mb-4">
              Faculty ({faculty.length})
            </h3>
            <div className="flex flex-col gap-2">
              {faculty.map((f) => (
                <Link
                  key={f.id}
                  href={`/faculty/${f.id}`}
                  className="flex items-center gap-3 py-2 hover:bg-stone-100 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 overflow-hidden shrink-0">
                    {(() => {
                      const photoSrc = normalizeImageUrl(f.photo_url) ?? f.photo_url ?? "";
                      return photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        f.name.charAt(0)
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-950 truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
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
