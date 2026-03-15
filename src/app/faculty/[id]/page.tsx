import {
  getFacultyById,
  getFacultyPapers,
  getFacultyPatents,
} from "@/lib/faculty";
import { getDepartments } from "@/lib/stats";
import { normalizeImageUrl, IMAGES } from "@/lib/images";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Crown,
  Mail,
  BookOpen,
  Award,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const faculty = await getFacultyById(id);
  return {
    title: faculty?.name ?? "Faculty Profile",
  };
}

export default async function FacultyProfilePage({ params }: Props) {
  const { id } = await params;
  const [faculty, departments] = await Promise.all([
    getFacultyById(id),
    getDepartments(),
  ]);

  if (!faculty) notFound();

  const department = departments.find((d) => d.id === faculty.dept_id);

  const [papers, patents] = await Promise.all([
    getFacultyPapers(faculty.name),
    getFacultyPatents(faculty.name),
  ]);

  const specialization = Array.isArray(faculty.specialization)
    ? faculty.specialization
    : [];

  const photoSrc =
    department?.code === "IT" && faculty.is_hod
      ? IMAGES.faculty_ithod
      : (normalizeImageUrl(faculty.photo_url) ?? faculty.photo_url ?? "");

  return (
    <div className="container section">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Faculty", href: "/faculty" },
          { label: faculty.name },
        ]}
        title=""
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-ink-8 mx-auto mb-4">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-4 font-bold text-3xl">
                  {faculty.name.charAt(0)}
                </div>
              )}
              {faculty.is_hod && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-ink rounded-full flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="text-center mb-5">
              <h1 className="font-display font-normal text-ink text-xl mb-1">
                {faculty.name}
              </h1>
              {faculty.is_hod && (
                <span className="inline-block text-xs font-medium text-ink-2 bg-ink-8 border border-ink-7 px-2.5 py-0.5 rounded-full mb-2">
                  Head of Department
                </span>
              )}
              <p className="text-ink-4 text-sm">{faculty.designation}</p>
              {department && (
                <p className="text-sm font-medium text-ink mt-1">
                  {department.name}
                </p>
              )}
            </div>

            {faculty.email && (
              <a
                href={`mailto:${faculty.email}`}
                className="flex items-center gap-2.5 text-sm text-ink-4 hover:text-ink transition-colors mb-5"
              >
                <Mail className="w-4 h-4 shrink-0 text-ink-2" />
                <span className="truncate">{faculty.email}</span>
              </a>
            )}

            {faculty.education && (
              <div className="mb-5">
                <div className="label mb-2 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </div>
                <p className="text-sm text-ink-3">{faculty.education}</p>
              </div>
            )}

            {specialization.length > 0 && (
              <div>
                <div className="label mb-2">Specializations</div>
                <div className="flex flex-wrap gap-1.5">
                  {specialization.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-ink-9 text-ink-3 px-2.5 py-1 rounded border border-ink-7"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {faculty.bio && (
            <div className="card p-6">
              <h2 className="font-semibold text-ink mb-3">About</h2>
              <p className="text-ink-4 leading-relaxed text-sm">
                {faculty.bio}
              </p>
            </div>
          )}

          {papers.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-ink-2" />
                <h2 className="font-semibold text-ink">
                  Research Papers
                  <span className="ml-2 text-sm font-normal text-ink-4">
                    ({papers.length})
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {papers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-ink-7 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink leading-snug mb-1">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ink-4 flex-wrap">
                        <span className="italic">{p.journal}</span>
                        <span>·</span>
                        <span className="font-mono">{p.year}</span>
                        <span>·</span>
                        <span className="badge badge-idle">{p.category}</span>
                      </div>
                    </div>
                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-2 hover:text-ink hover:underline shrink-0"
                        aria-label="Open DOI"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {patents.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-ink-2" />
                <h2 className="font-semibold text-ink">
                  Patents
                  <span className="ml-2 text-sm font-normal text-ink-4">
                    ({patents.length})
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {patents.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-ink-7 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink mb-1">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ink-4 flex-wrap">
                        <span
                          className={
                            p.patent_status === "granted"
                              ? "badge badge-ok"
                              : p.patent_status === "published"
                                ? "badge badge-warn"
                                : "badge badge-idle"
                          }
                        >
                          {p.patent_status}
                        </span>
                        {p.year && (
                          <span className="font-mono">{p.year}</span>
                        )}
                        {p.patent_number && (
                          <span>· {p.patent_number}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {papers.length === 0 && patents.length === 0 && (
            <div className="card p-6 text-center text-ink-4 text-sm">
              No publications linked yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
