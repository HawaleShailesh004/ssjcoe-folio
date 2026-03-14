import { MapPin, Briefcase } from "lucide-react";
import type { Placement, Department } from "@/types";

interface Props {
  placement: Placement;
  view: "grid" | "list";
  department?: Department;
  onClick: () => void;
}

export function PlacementCard({
  placement: p,
  department: _department,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
      className="card card-hover p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-full bg-ink-8 flex items-center justify-center text-ink-4 font-semibold text-sm overflow-hidden shrink-0">
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
        <span className="font-mono text-sm font-semibold text-ink">
          ₹{p.package_lpa} LPA
        </span>
      </div>

      <p className="font-medium text-ink text-sm mb-0.5 truncate">
        {p.student_name}
      </p>
      <p className="text-ink-2 text-sm font-medium mb-3">{p.company}</p>

      <div className="space-y-1 pt-3 border-t border-ink-7">
        <div className="flex items-center gap-1.5 text-xs text-ink-4">
          <Briefcase className="w-3 h-3 shrink-0" />
          <span className="truncate">{p.role}</span>
        </div>
        {p.location && (
          <div className="flex items-center gap-1.5 text-xs text-ink-4">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{p.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
