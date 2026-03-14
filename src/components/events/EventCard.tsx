import { MapPin, Users, Calendar } from "lucide-react";
import type { Event, Department } from "@/types";

export function EventCard({
  event: e,
  department,
}: {
  event: Event;
  department?: Department;
}) {
  const images = Array.isArray(e.images) ? e.images : [];

  return (
    <div className="card card-hover overflow-hidden">
      {images[0] ? (
        <div className="aspect-video overflow-hidden bg-ink-8">
          <img
            src={images[0]}
            alt={e.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-ink-8 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-ink-6" />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge badge-idle capitalize">{e.type}</span>
          {e.is_official && (
            <span className="text-xs text-ink-2 font-medium">Official</span>
          )}
          {department && (
            <span className="font-mono text-xs text-ink-5">
              {department.code}
            </span>
          )}
        </div>

        <h3 className="text-base font-medium text-ink leading-snug clamp-2 mb-2">
          {e.title}
        </h3>

        {e.description && (
          <p className="text-sm text-ink-4 clamp-2 mb-3">{e.description}</p>
        )}

        <div className="space-y-1.5 pt-3 border-t border-ink-7 text-xs text-ink-4">
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
