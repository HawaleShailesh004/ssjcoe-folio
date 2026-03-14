import Link from "next/link";
import { Crown } from "lucide-react";
import type { Faculty, Department } from "@/types";

export function FacultyCard({
  faculty: f,
  department,
}: {
  faculty: Faculty;
  department?: Department;
}) {
  const specialization = Array.isArray(f.specialization) ? f.specialization : [];

  return (
    <Link href={`/faculty/${f.id}`}>
      <div className="card card-hover p-5 group h-full">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-ink-8 mb-4">
          {f.photo_url ? (
            <img
              src={f.photo_url}
              alt={f.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-4 font-semibold">
              {f.name.charAt(0)}
            </div>
          )}
          {f.is_hod && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <p className="text-sm font-medium text-ink mb-0.5 truncate">{f.name}</p>
        <p className="text-xs text-ink-4 mb-1">{f.designation}</p>

        {department && (
          <p className="font-mono text-xs text-ink-2 mb-3">{department.code}</p>
        )}

        {specialization.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {specialization.slice(0, 2).map((s) => (
              <span
                key={s}
                className="text-xs text-ink-5 bg-ink-9 border border-ink-7 px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
            {specialization.length > 2 && (
              <span className="text-xs text-ink-5">
                +{specialization.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
