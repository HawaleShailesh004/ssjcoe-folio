import { MapPin, Users, Calendar, Star } from "lucide-react";
import type { Event, Department } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  technical: "bg-blue-50 text-blue-700 border-blue-200",
  cultural: "bg-pink-50 text-pink-700 border-pink-200",
  sports: "bg-green-50 text-green-700 border-green-200",
  official: "bg-purple-50 text-purple-700 border-purple-200",
  workshop: "bg-amber-50 text-amber-700 border-amber-200",
};

interface Props {
  event: Event;
  department?: Department;
}

export function EventCard({ event: e, department }: Props) {
  const images = Array.isArray(e.images) ? e.images : [];

  return (
    <div className="card-base overflow-hidden hover:shadow-panel transition-shadow">
      {images[0] ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={images[0]}
            alt={e.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-brand-bg to-brand-border flex items-center justify-center">
          <Calendar className="w-8 h-8 text-brand-border" />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs font-medium border px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[e.type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
          >
            {e.type}
          </span>
          {e.is_official && (
            <span className="flex items-center gap-1 text-xs font-medium text-brand-saffron">
              <Star className="w-3 h-3 fill-brand-saffron" /> Official
            </span>
          )}
          {department && (
            <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-2 py-0.5 rounded">
              {department.code}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-brand-black mb-2 leading-snug line-clamp-2">
          {e.title}
        </h3>

        {e.description && (
          <p className="text-sm text-brand-muted line-clamp-2 mb-3">
            {e.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5 pt-3 border-t border-brand-border">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>
              {new Date(e.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{e.location}</span>
          </div>
          {e.participants != null && (
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <Users className="w-3 h-3 shrink-0" />
              <span>{e.participants} participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
