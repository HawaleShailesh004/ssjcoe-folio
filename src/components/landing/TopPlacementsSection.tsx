import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import type { Placement } from "@/types";

export function TopPlacementsSection({
  placements,
}: {
  placements: Placement[];
}) {
  if (!placements.length) return null;

  return (
    <section className="section-pad bg-brand-bg">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-black">
              Recent highlights
            </h2>
            <p className="text-brand-muted mt-1">
              Top placements across departments
            </p>
          </div>
          <Link
            href="/placements"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-saffron hover:underline"
          >
            View all placements <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {placements.map((p) => (
            <div
              key={p.id}
              className="card-base p-5 hover:shadow-panel transition-shadow"
            >
              {/* Package badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-border/50 overflow-hidden flex items-center justify-center text-brand-muted text-sm font-bold">
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={p.student_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    p.student_name.charAt(0)
                  )}
                </div>
                <span className="font-mono text-sm font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                  ₹{p.package_lpa} LPA
                </span>
              </div>

              <h3 className="font-semibold text-brand-black text-sm mb-0.5 truncate">
                {p.student_name}
              </h3>
              <p className="text-brand-saffron font-medium text-sm mb-3">
                {p.company}
              </p>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate">{p.role}</span>
                </div>
                {p.location && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3 h-3" />
                    <span>{p.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/placements"
            className="text-sm font-medium text-brand-saffron hover:underline inline-flex items-center gap-1"
          >
            View all placements <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
