"use client";

import { useEffect } from "react";
import { X, MapPin, Calendar, Trophy } from "lucide-react";
import { getAchievementImage, normalizeImageUrl } from "@/lib/images";
import type { Achievement, Department } from "@/types";

interface Props {
  achievement: Achievement;
  department?: Department;
  onClose: () => void;
}

export function AchievementDetailModal({
  achievement: a,
  department,
  onClose,
}: Props) {
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const heroImage =
    normalizeImageUrl(a.image_url) || getAchievementImage(a.title);
  const venue = a.venue;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative h-full bg-white overflow-y-auto w-full max-w-md shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 border-b border-stone-200 flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold text-stone-800">
            Achievement details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video overflow-hidden relative bg-stone-100">
          <img
            src={heroImage}
            alt={a.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(26,20,16,0.6) 0%, transparent 50%)",
            }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span className="badge badge-saffron capitalize">
              {a.achievement_type}
            </span>
            <span className="badge badge-idle capitalize">
              {a.achievement_level}
            </span>
            {department && (
              <span className="text-xs font-mono font-semibold text-white/90 bg-stone-950/60 px-2 py-0.5 rounded">
                {department.code}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <h3 className="text-xl font-semibold text-stone-950">{a.title}</h3>
          <div className="flex items-center gap-2 text-saffron-dark font-medium">
            <Trophy className="w-4 h-4" />
            <span>{a.student_name}</span>
          </div>
          <p className="text-stone-700 font-medium">{a.award}</p>

          <div className="space-y-3 text-sm">
            {a.date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-500 uppercase tracking-wide text-xs font-medium">
                    Date
                  </p>
                  <p className="text-stone-800">
                    {new Date(a.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
            {a.year != null && (
              <div>
                <p className="text-stone-500 uppercase tracking-wide text-xs font-medium">
                  Year
                </p>
                <p className="text-stone-800">{a.year}</p>
              </div>
            )}
            {venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-500 uppercase tracking-wide text-xs font-medium">
                    Venue
                  </p>
                  <p className="text-stone-800">{venue}</p>
                </div>
              </div>
            )}
          </div>

          {a.description && (
            <div>
              <p className="text-stone-500 uppercase tracking-wide text-xs font-medium mb-1">
                Description
              </p>
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                {a.description}
              </p>
            </div>
          )}

          {department && (
            <div className="pt-3 border-t border-stone-100 rounded-xl p-4 bg-stone-50">
              <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-0.5">
                Department
              </p>
              <p className="font-mono font-semibold text-saffron text-sm">
                {department.code}
              </p>
              <p className="text-stone-600 text-sm">{department.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
