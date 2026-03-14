"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Cpu, Medal } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getAchievementImage, normalizeImageUrl } from "@/lib/images";
import type { Achievement } from "@/types";

interface Props {
  achievements: Achievement[];
}

const TYPE_ICON: Record<string, typeof Cpu> = {
  technical: Cpu,
  sports: Trophy,
  cultural: Medal,
  academic: Medal,
};
const LEVEL_COLOR: Record<string, string> = {
  international: "text-red-600 bg-red-50 border-red-200",
  national: "text-amber-700 bg-amber-50 border-amber-200",
  state: "text-blue-700 bg-blue-50 border-blue-200",
  institute: "text-stone-600 bg-stone-100 border-stone-200",
};

export function AchievementsStrip({ achievements }: Props) {
  if (!achievements.length) return null;

  const doubled = [...achievements, ...achievements];

  return (
    <section
      className="py-16 overflow-hidden relative"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
      }}
    >
      <div className="container mb-10">
        <RevealOnScroll>
          <div className="flex items-end justify-between">
            <div>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl">Achievements</h2>
              <p className="text-sm text-stone-500 mt-2">
                What SSJCOE students win
              </p>
            </div>
            <Link
              href="/achievements"
              className="hidden sm:flex items-center gap-1.5 text-sm text-saffron hover:text-saffron-dark transition-colors group"
            >
              All achievements
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #FAF7F2, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #FAF7F2, transparent)",
          }}
        />

        <div className="marquee-track" style={{ gap: "16px" }}>
          {doubled.map((a, i) => {
            const Icon = TYPE_ICON[a.achievement_type] ?? Trophy;
            const heroImg =
              normalizeImageUrl(a.image_url) || getAchievementImage(a.title);
            return (
              <div
                key={`${a.id}-${i}`}
                className="shrink-0 w-72 rounded-xl overflow-hidden border border-stone-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={heroImg}
                    alt={a.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(26,20,16,0.6) 0%, transparent 50%)",
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`badge capitalize ${LEVEL_COLOR[a.achievement_level] ?? "badge badge-idle"}`}
                    >
                      {a.achievement_level}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-saffron/90 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-stone-950 leading-snug clamp-2 mb-1">
                    {a.title}
                  </p>
                  <p className="text-xs text-saffron-dark font-medium">
                    {a.student_name}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 truncate">
                    {a.award}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
