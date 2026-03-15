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
import Link from "next/link";
import {
  GraduationCap,
  Users,
  FlaskConical,
  Award,
  Calendar,
  Trophy,
  ArrowRight,
  Building2,
} from "lucide-react";
import { DEPT_IMAGES, IMAGES, normalizeImageUrl } from "@/lib/images";
import { VisionMissionSection } from "@/components/shared/VisionMissionSection";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import { DepartmentPlacementsGrid } from "@/components/departments/DepartmentPlacementsGrid";
import { ResearchCard } from "@/components/research/ResearchCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    getPlacements({ dept_id: dept.id }).then((p) => p.slice(0, 6)),
    getResearchPapers().then((r) =>
      r.filter((r) => r.dept_id === dept.id).slice(0, 3)
    ),
  ]);

  const hod = faculty.find((f) => f.is_hod);
  const deptImg = DEPT_IMAGES[dept.code];

  const hodPhotoSrc =
    hod && dept.code === "IT" && hod.is_hod
      ? IMAGES.faculty_ithod
      : hod
        ? (normalizeImageUrl(hod.photo_url) ?? hod.photo_url ?? "")
        : "";

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-stone-950"
        style={{ minHeight: "480px" }}
      >
        {deptImg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url('${deptImg}')` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,20,16,0.72) 0%, rgba(26,20,16,0.48) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

        <div
          className="absolute right-0 bottom-0 select-none pointer-events-none"
          style={{
            fontSize: "clamp(120px, 20vw, 240px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            color: "transparent",
            WebkitTextStroke: "1px rgba(232,130,12,0.08)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {dept.code}
        </div>

        <div className="container relative z-10 py-20">
          <nav className="flex items-center gap-2 mb-8">
            <Link
              href="/"
              className="caption text-stone-500 hover:text-stone-300 transition-colors"
            >
              Home
            </Link>
            <span className="caption text-stone-700">/</span>
            <Link
              href="/departments"
              className="caption text-stone-500 hover:text-stone-300 transition-colors"
            >
              Departments
            </Link>
            <span className="caption text-stone-700">/</span>
            <span className="caption text-stone-300">{dept.code}</span>
          </nav>

          <div
            className="flex items-center gap-3 mb-4"
            style={{
              opacity: 0,
              animation: "fadeUp 0.7s 0.1s ease-out forwards",
            }}
          >
            <span className="font-mono text-sm font-bold text-saffron tracking-wider">
              {dept.code}
            </span>
            {dept.established_year != null && (
              <>
                <span className="w-px h-4 bg-stone-700" />
                <span className="caption text-stone-500">
                  Est. {dept.established_year}
                </span>
              </>
            )}
          </div>

          <h1
            className="font-display text-white mb-4"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              opacity: 0,
              animation: "fadeUp 0.7s 0.25s ease-out forwards",
            }}
          >
            {dept.name}
          </h1>

          {dept.intro && (
            <p
              className="text-stone-400 max-w-2xl leading-relaxed text-base"
              style={{
                opacity: 0,
                animation: "fadeUp 0.7s 0.4s ease-out forwards",
              }}
            >
              {dept.intro}
            </p>
          )}
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-stone-200">
        <div className="container">
          <StaggerReveal
            className="grid grid-cols-3 md:grid-cols-6 divide-x divide-stone-100"
            stagger={50}
          >
            {[
              {
                icon: GraduationCap,
                label: "Placed",
                value: summary.placements,
                href: `/placements?dept=${dept.id}`,
              },
              {
                icon: Users,
                label: "Faculty",
                value: summary.faculty,
                href: "#faculty",
              },
              {
                icon: FlaskConical,
                label: "Papers",
                value: summary.research,
                href: "/research",
              },
              {
                icon: Award,
                label: "Patents",
                value: summary.patents,
                href: "/patents",
              },
              {
                icon: Calendar,
                label: "Events",
                value: summary.events,
                href: "/events",
              },
              {
                icon: Trophy,
                label: "Achievements",
                value: summary.achievements,
                href: "/achievements",
              },
            ].map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group flex flex-col items-center py-7 px-4 hover:bg-stone-50 transition-colors text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-saffron-light border border-saffron/20 flex items-center justify-center mb-3 group-hover:bg-saffron group-hover:border-saffron transition-colors">
                  <s.icon className="w-4 h-4 text-saffron group-hover:text-white transition-colors" />
                </div>
                <p className="num text-2xl text-stone-950 mb-0.5">{s.value}</p>
                <p className="caption text-stone-400">{s.label}</p>
              </Link>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Vision / Mission */}
      {(dept.vision ?? dept.mission) && (
        <VisionMissionSection
          vision={dept.vision ?? ""}
          mission={dept.mission ?? ""}
          variant="department"
        />
      )}

      {/* HOD Message + Dept Stats */}
      {(hod ?? deptStats) && (
        <section className="section bg-stone-50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {hod && (
                <RevealOnScroll className="lg:col-span-3">
                  <div className="card overflow-hidden h-full">
                    <div className="h-1 bg-gradient-to-r from-saffron via-saffron/50 to-transparent" />
                    <div className="p-8">
                      <p className="label text-saffron mb-6">
                        Message from HOD
                      </p>
                      <div className="flex items-start gap-5 mb-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          {hodPhotoSrc ? (
                            <img
                              src={hodPhotoSrc}
                              alt={hod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                              <span className="font-display text-3xl text-stone-400">
                                {hod.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-950 text-lg mb-0.5">
                            {hod.name}
                          </h3>
                          <p className="caption text-stone-500 mb-1">
                            {hod.designation}
                          </p>
                          <p className="caption text-stone-400">
                            {dept.name}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <span
                          className="absolute -top-2 -left-1 font-display text-6xl text-saffron/20 leading-none select-none"
                          aria-hidden
                        >
                          &ldquo;
                        </span>
                        <p className="text-stone-600 leading-relaxed pl-5 text-base">
                          {hod.bio
                            ? hod.bio.slice(0, 320) +
                              (hod.bio.length > 320 ? "…" : "")
                            : `Welcome to the Department of ${dept.name}. We are committed to delivering quality education and achieving excellence through the systematic efforts of our faculty and students.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              )}

              {deptStats && (
                <RevealOnScroll
                  delay={100}
                  className="lg:col-span-2 flex flex-col gap-4"
                >
                  <div className="card p-6">
                    <p className="label text-stone-400 mb-5">
                      Department stats · {deptStats.year}
                    </p>
                    <div className="space-y-4">
                      {[
                        {
                          icon: Users,
                          label: "Students enrolled",
                          value: deptStats.student_count,
                          suffix: "",
                        },
                        {
                          icon: GraduationCap,
                          label: "Faculty members",
                          value: deptStats.faculty_count,
                          suffix: "",
                        },
                        {
                          icon: Building2,
                          label: "Laboratories",
                          value: deptStats.labs_count,
                          suffix: "",
                        },
                        {
                          icon: Trophy,
                          label: "Placement rate",
                          value: deptStats.placement_rate,
                          suffix: "%",
                        },
                        {
                          icon: Award,
                          label: "Graduates (batch)",
                          value: deptStats.graduates_count,
                          suffix: "",
                        },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-saffron-light border border-saffron/20 flex items-center justify-center shrink-0">
                            <s.icon className="w-3.5 h-3.5 text-saffron" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="caption text-stone-500">
                                {s.label}
                              </p>
                              <p className="num text-base text-stone-950">
                                {s.value}
                                {s.suffix}
                              </p>
                            </div>
                            {s.label === "Placement rate" && (
                              <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-saffron rounded-full"
                                  style={{
                                    width: `${Math.min(Number(s.value), 100)}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {Number(summary.avgPackage) > 0 && (
                    <div
                      className="rounded-xl p-6 relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #1A1410 0%, #2C2218 100%)",
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 w-32 h-32 opacity-5"
                        style={{
                          background:
                            "radial-gradient(circle, #E8820C, transparent)",
                          transform: "translate(30%, -30%)",
                        }}
                      />
                      <p className="label text-stone-500 mb-2">
                        Avg. package
                      </p>
                      <p className="num text-4xl text-white mb-1">
                        ₹{summary.avgPackage}
                        <span className="text-lg font-sans font-normal text-stone-400 ml-1.5">
                          LPA
                        </span>
                      </p>
                      <p className="caption text-stone-500">
                        2024 batch · All companies
                      </p>
                    </div>
                  )}
                </RevealOnScroll>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Faculty */}
      {faculty.length > 0 && (
        <section id="faculty" className="section bg-white">
          <div className="container">
            <RevealOnScroll>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="accent-rule" />
                  <h2 className="font-display text-3xl text-stone-950">
                    Faculty
                  </h2>
                  <p className="subtext mt-2">
                    {faculty.length} faculty members
                  </p>
                </div>
              </div>
            </RevealOnScroll>
            <StaggerReveal
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              stagger={50}
            >
              {faculty.map((f) => (
                <FacultyCard key={f.id} faculty={f} department={dept} />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* Recent Placements */}
      {placements.length > 0 && (
        <section className="section bg-stone-50">
          <div className="container">
            <RevealOnScroll>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="accent-rule" />
                  <h2 className="font-display text-3xl text-stone-950">
                    Recent placements
                  </h2>
                  <p className="subtext mt-2">
                    Campus placements from {dept.name}
                  </p>
                </div>
                <Link
                  href={`/placements?dept=${dept.id}`}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-saffron hover:text-saffron-dark transition-colors group"
                >
                  All placements
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </RevealOnScroll>
            <DepartmentPlacementsGrid
              placements={placements}
              department={dept}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              stagger={50}
            />
          </div>
        </section>
      )}

      {/* Research Papers */}
      {papers.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <RevealOnScroll>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="accent-rule" />
                  <h2 className="font-display text-3xl text-stone-950">
                    Research
                  </h2>
                  <p className="subtext mt-2">
                    Published papers from {dept.name}
                  </p>
                </div>
                <Link
                  href="/research"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-saffron hover:text-saffron-dark transition-colors group"
                >
                  All papers
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </RevealOnScroll>
            <StaggerReveal className="flex flex-col gap-4" stagger={60}>
              {papers.map((p) => (
                <ResearchCard
                  key={p.id}
                  paper={p}
                  department={dept}
                />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* Other Departments */}
      <section className="section bg-stone-50 border-t border-stone-200">
        <div className="container">
          <RevealOnScroll>
            <div className="mb-10">
              <span className="accent-rule" />
              <h2 className="font-display text-2xl text-stone-950">
                Other departments
              </h2>
            </div>
          </RevealOnScroll>
          <StaggerReveal className="flex flex-wrap gap-3" stagger={40}>
            {allDepts
              .filter((d) => d.code !== dept.code)
              .map((d) => (
                <Link
                  key={d.id}
                  href={`/departments/${d.code.toLowerCase()}`}
                  className="card px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center gap-3"
                >
                  <span className="font-mono text-xs font-bold text-saffron">
                    {d.code}
                  </span>
                  <span className="text-sm text-stone-600 group-hover:text-stone-950 transition-colors">
                    {d.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-saffron group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
          </StaggerReveal>
        </div>
      </section>
    </>
  );
}
