import { MapPin, Users, Calendar, Star } from "lucide-react";
import { getEventImage, normalizeImageUrl } from "@/lib/images";
import type { Event, Department } from "@/types";

const TYPE_BADGE: Record<string, string> = {
  technical: "badge-saffron",
  cultural: "badge-idle",
  sports: "badge-idle",
  official: "badge-idle",
  workshop: "badge-saffron",
};

export function EventCard({
  event: e,
  department,
}: {
  event: Event;
  department?: Department;
}) {
  const heroImage = normalizeImageUrl(e.images?.[0]) || getEventImage(e.title);

  return (
    <div className="card card-hover overflow-hidden group">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={heroImage}
          alt={e.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,20,16,0.6) 0%, transparent 60%)",
          }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`badge ${TYPE_BADGE[e.type] ?? "badge-idle"} capitalize`}
          >
            {e.type}
          </span>
          {e.is_official && (
            <span className="badge badge-saffron flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" /> Official
            </span>
          )}
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
        <h3 className="text-base font-medium text-stone-950 leading-snug clamp-2 mb-2">
          {e.title}
        </h3>

        {e.description && (
          <p className="text-sm text-stone-500 clamp-2 mb-3">{e.description}</p>
        )}

        <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>
              {new Date(e.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{e.location}</span>
          </div>
          {e.participants != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 shrink-0" />
              <span>{e.participants} participants</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
