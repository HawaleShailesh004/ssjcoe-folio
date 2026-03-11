import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import type { Faculty, Department } from "@/types";

interface Props {
  faculty: Faculty;
  department?: Department;
}

export function FacultyCard({ faculty: f, department }: Props) {
  const specialization = Array.isArray(f.specialization) ? f.specialization : [];

  return (
    <Link href={`/faculty/${f.id}`}>
      <div className="card-base p-5 hover:shadow-panel hover:border-brand-saffron/20 transition-all group cursor-pointer h-full">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-border mx-auto mb-4">
          {f.photo_url ? (
            <img
              src={f.photo_url}
              alt={f.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted font-bold text-xl">
              {f.name.charAt(0)}
            </div>
          )}
          {f.is_hod && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-saffron rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <h3 className="font-semibold text-brand-black text-sm truncate">
              {f.name}
            </h3>
          </div>
          <p className="text-xs text-brand-muted mb-1">{f.designation}</p>
          {department && (
            <span className="inline-block text-xs text-brand-muted bg-brand-bg border border-brand-border px-2 py-0.5 rounded mb-3">
              {department.code}
            </span>
          )}

          {specialization.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {specialization.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="text-xs bg-brand-bg text-brand-muted px-2 py-0.5 rounded-full border border-brand-border"
                >
                  {s}
                </span>
              ))}
              {specialization.length > 2 && (
                <span className="text-xs text-brand-muted">
                  +{specialization.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-1 text-xs font-medium text-brand-saffron opacity-0 group-hover:opacity-100 transition-opacity">
            View profile <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
