import { MapPin, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Placement, Department } from "@/types";

interface Props {
  placement: Placement;
  view: "grid" | "list";
  department?: Department;
  onClick: () => void;
}

export function PlacementCard({
  placement: p,
  view,
  department,
  onClick,
}: Props) {
  if (view === "list") {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        className="card-base p-4 flex items-center gap-4 hover:shadow-panel transition-shadow cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full bg-brand-border flex items-center justify-center text-brand-muted font-bold text-sm flex-shrink-0 overflow-hidden">
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-brand-black text-sm truncate">
              {p.student_name}
            </span>
            {department && (
              <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded flex-shrink-0">
                {department.code}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-muted flex-wrap">
            <span className="text-brand-saffron font-medium">{p.company}</span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {p.role}
            </span>
            {p.location && (
              <span className="hidden items-center gap-1 sm:flex">
                <MapPin className="w-3 h-3" /> {p.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-sm font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            ₹{p.package_lpa} LPA
          </span>
          <span className="text-xs text-brand-muted hidden sm:block">
            {p.year}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="card-base p-5 hover:shadow-panel transition-all cursor-pointer group hover:border-brand-saffron/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-full bg-brand-border flex items-center justify-center text-brand-muted font-bold overflow-hidden">
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
        <span className="font-mono text-sm font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
          ₹{p.package_lpa} LPA
        </span>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-semibold text-brand-black text-sm truncate">
          {p.student_name}
        </h3>
        {department && (
          <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded flex-shrink-0">
            {department.code}
          </span>
        )}
      </div>

      <p className="text-brand-saffron font-semibold text-sm mb-3">
        {p.company}
      </p>

      <div className="flex flex-col gap-1.5 border-t border-brand-border pt-3">
        <div className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Briefcase className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{p.role}</span>
        </div>
        {p.location && (
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{p.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>Batch {p.year}</span>
        </div>
      </div>
    </div>
  );
}
