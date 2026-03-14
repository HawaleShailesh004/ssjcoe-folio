import { MapPin, Calendar, Trophy } from "lucide-react";
import type { Achievement, Department } from "@/types";

const LEVEL_BADGE: Record<string, string> = {
  institute: "badge badge-idle",
  state: "badge badge-idle",
  national: "badge badge-idle",
  international: "badge badge-idle",
};

export function AchievementCard({
  achievement: a,
  department,
}: {
  achievement: Achievement;
  department?: Department;
}) {
  return (
    <div className="card card-hover overflow-hidden">
      {a.image_url ? (
        <div className="aspect-video overflow-hidden bg-ink-8">
          <img
            src={a.image_url}
            alt={a.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-ink-8 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-ink-6" />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={LEVEL_BADGE[a.achievement_level] ?? "badge badge-idle"}
          >
            {a.achievement_level}
          </span>
          <span className="badge badge-idle capitalize">{a.achievement_type}</span>
          {a.sport && (
            <span className="badge badge-idle">{a.sport}</span>
          )}
          {department && (
            <span className="font-mono text-xs text-ink-5">
              {department.code}
            </span>
          )}
        </div>

        <h3 className="text-base font-medium text-ink leading-snug mb-1">
          {a.title}
        </h3>
        <p className="text-sm text-ink-2 font-medium mb-2">{a.student_name}</p>
        <p className="text-sm text-ink-4 clamp-2 mb-3">{a.award}</p>

        <div className="space-y-1.5 pt-3 border-t border-ink-7 text-xs text-ink-4">
          {a.venue && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{a.venue}</span>
            </div>
          )}
          {a.date && (
            <div className="flex items-center gap-1.5">
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
