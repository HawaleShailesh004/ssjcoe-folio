import { MapPin, Calendar, Trophy } from "lucide-react";
import type { SportsAchievement, Department } from "@/types";

const LEVEL_CONFIG = {
  institute: {
    label: "Institute",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
  state: {
    label: "State",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  national: {
    label: "National",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  international: {
    label: "International",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

interface Props {
  achievement: SportsAchievement;
  department?: Department;
}

export function AchievementCard({ achievement: a, department }: Props) {
  const levelCfg = LEVEL_CONFIG[a.achievement_level];

  return (
    <div className="card-base overflow-hidden hover:shadow-panel transition-shadow">
      {a.image_url ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={a.image_url}
            alt={a.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-amber-300" />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs font-medium border px-2.5 py-0.5 rounded-full ${levelCfg.className}`}
          >
            {levelCfg.label}
          </span>
          <span className="text-xs font-medium text-brand-saffron bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
            {a.sport}
          </span>
          {department && (
            <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-2 py-0.5 rounded">
              {department.code}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-brand-black mb-1 leading-snug">
          {a.title}
        </h3>

        <p className="text-sm font-medium text-brand-saffron mb-2">
          {a.student_name}
        </p>

        <p className="text-sm text-brand-muted mb-3 line-clamp-2">{a.award}</p>

        <div className="flex flex-col gap-1.5 pt-3 border-t border-brand-border">
          {a.venue && (
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{a.venue}</span>
            </div>
          )}
          {a.date && (
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>
                {new Date(a.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
