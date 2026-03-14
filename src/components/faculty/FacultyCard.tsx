"use client";

import Link from "next/link";
import { Crown, Mail, ArrowRight } from "lucide-react";
import { normalizeImageUrl } from "@/lib/images";
import type { Faculty, Department } from "@/types";

export function FacultyCard({
  faculty: f,
  department,
}: {
  faculty: Faculty;
  department?: Department;
}) {
  const photoSrc = normalizeImageUrl(f.photo_url) ?? f.photo_url ?? "";
  const specialization = Array.isArray(f.specialization) ? f.specialization : [];

  return (
    <Link href={`/faculty/${f.id}`}>
      <div className="card card-hover group overflow-hidden relative">
        {f.is_hod && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-saffron" />
        )}

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden group-hover:border-saffron/40 transition-colors">
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <span className="font-display text-2xl text-stone-400">
                      {f.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {f.is_hod && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-saffron rounded-full flex items-center justify-center border-2 border-white">
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-950 text-sm leading-tight mb-0.5 group-hover:text-saffron-dark transition-colors">
                {f.name}
              </p>
              <p className="text-xs text-stone-500">{f.designation}</p>
              {department && (
                <p className="font-mono text-xs text-saffron mt-0.5">
                  {department.code}
                </p>
              )}
            </div>
          </div>

          {specialization.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {specialization.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="text-xs bg-stone-50 text-stone-500 border border-stone-200 px-2 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
              {specialization.length > 2 && (
                <span className="text-xs text-stone-400">
                  +{specialization.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            {f.email && (
              <div className="flex items-center gap-1 text-xs text-stone-400">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-28">
                  {f.email.split("@")[0]}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-saffron opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
              Profile{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
