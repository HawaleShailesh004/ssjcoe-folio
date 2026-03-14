import {
  MapPin,
  Calendar,
  Trophy,
  Cpu,
  Music,
  BookOpen,
} from "lucide-react";
import { getAchievementImage, normalizeImageUrl } from "@/lib/images";
import type { Achievement, Department } from "@/types";

const LEVEL_BADGE: Record<string, string> = {
  institute: "badge badge-idle",
  state: "badge badge-idle",
  national: "badge badge-warn",
  international: "badge badge-fail",
};

const TYPE_ICON: Record<string, typeof Trophy> = {
  sports: Trophy,
  technical: Cpu,
  cultural: Music,
  academic: BookOpen,
};

const TYPE_LABEL: Record<string, string> = {
  sports: "Sports",
  technical: "Technical",
  cultural: "Cultural",
  academic: "Academic",
};

export function AchievementCard({
  achievement: a,
  department,
}: {
  achievement: Achievement;
  department?: Department;
}) {
  const heroImage = normalizeImageUrl(a.image_url) || getAchievementImage(a.title);
  const TypeIcon = TYPE_ICON[a.achievement_type] ?? Trophy;

  return (
    <div className="card card-hover overflow-hidden group">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={heroImage}
          alt={a.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,20,16,0.65) 0%, transparent 55%)",
          }}
        />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="badge badge-saffron flex items-center gap-1">
            <TypeIcon className="w-2.5 h-2.5" />
            {TYPE_LABEL[a.achievement_type]}
          </span>
          <span
            className={LEVEL_BADGE[a.achievement_level] ?? "badge badge-idle"}
          >
            {a.achievement_level}
          </span>
        </div>

        {department && (
          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-mono font-semibold text-white/80 bg-stone-950/50 px-2 py-0.5 rounded">
              {department.code}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-stone-950 leading-snug mb-1">
          {a.title}
        </h3>
        <p className="text-sm text-saffron-dark font-medium mb-2">
          {a.student_name}
        </p>
        <p className="text-sm text-stone-500 clamp-2 mb-3">{a.award}</p>

        <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-400">
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
