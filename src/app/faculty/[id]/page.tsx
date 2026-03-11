import {
  getFacultyById,
  getFacultyPapers,
  getFacultyPatents,
} from "@/lib/faculty";
import { getDepartments } from "@/lib/stats";
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

  return (
    <div className="container-main section-pad">
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
          <div className="card-base p-6 sticky top-24">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-brand-border mx-auto mb-4">
              {faculty.photo_url ? (
                <img
                  src={faculty.photo_url}
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-muted font-bold text-3xl">
                  {faculty.name.charAt(0)}
                </div>
              )}
              {faculty.is_hod && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-saffron rounded-full flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="text-center mb-5">
              <h1 className="font-bold text-brand-black text-xl mb-1">
                {faculty.name}
              </h1>
              {faculty.is_hod && (
                <span className="inline-block text-xs font-medium text-brand-saffron bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full mb-2">
                  Head of Department
                </span>
              )}
              <p className="text-brand-muted text-sm">{faculty.designation}</p>
              {department && (
                <p className="text-sm font-medium text-brand-black mt-1">
                  {department.name}
                </p>
              )}
            </div>

            {faculty.email && (
              <a
                href={`mailto:${faculty.email}`}
                className="flex items-center gap-2.5 text-sm text-brand-muted hover:text-brand-black transition-colors mb-5"
              >
                <Mail className="w-4 h-4 shrink-0 text-brand-saffron" />
                <span className="truncate">{faculty.email}</span>
              </a>
            )}

            {faculty.education && (
              <div className="mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </div>
                <p className="text-sm text-brand-slate">{faculty.education}</p>
              </div>
            )}

            {specialization.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  Specializations
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {specialization.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-brand-bg text-brand-slate px-2.5 py-1 rounded-full border border-brand-border"
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
            <div className="card-base p-6">
              <h2 className="font-semibold text-brand-black mb-3">About</h2>
              <p className="text-brand-muted leading-relaxed text-sm">
                {faculty.bio}
              </p>
            </div>
          )}

          {papers.length > 0 && (
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-brand-saffron" />
                <h2 className="font-semibold text-brand-black">
                  Research Papers
                  <span className="ml-2 text-sm font-normal text-brand-muted">
                    ({papers.length})
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {papers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-brand-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-black leading-snug mb-1">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-brand-muted flex-wrap">
                        <span className="italic">{p.journal}</span>
                        <span>·</span>
                        <span className="font-mono">{p.year}</span>
                        <span>·</span>
                        <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-saffron hover:underline shrink-0"
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
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-brand-saffron" />
                <h2 className="font-semibold text-brand-black">
                  Patents
                  <span className="ml-2 text-sm font-normal text-brand-muted">
                    ({patents.length})
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {patents.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-brand-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-black mb-1">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-brand-muted flex-wrap">
                        <span
                          className={`px-1.5 py-0.5 rounded capitalize border ${p.patent_status === "granted" ? "bg-green-50 text-green-700 border-green-200" : p.patent_status === "published" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
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
            <div className="card-base p-6 text-center text-brand-muted text-sm">
              No publications linked yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
