"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  FlaskConical,
  Award,
  Calendar,
  Trophy,
} from "lucide-react";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { IMAGES } from "@/lib/images";

type Stats = {
  totalPlacements: number;
  researchPapers: number;
  patents: number;
  events: number;
  sportsAchievements?: number;
  achievementsCount?: number;
};

function getItems(stats: Stats) {
  const achievements = stats.sportsAchievements ?? stats.achievementsCount ?? 0;
  return [
    {
      label: "Placements",
      value: stats.totalPlacements,
      href: "/placements",
      icon: GraduationCap,
      ghost: "01",
    },
    {
      label: "Papers",
      value: stats.researchPapers,
      href: "/research",
      icon: FlaskConical,
      ghost: "02",
    },
    {
      label: "Patents",
      value: stats.patents,
      href: "/patents",
      icon: Award,
      ghost: "03",
    },
    {
      label: "Events",
      value: stats.events,
      href: "/events",
      icon: Calendar,
      ghost: "04",
    },
    {
      label: "Achievements",
      value: achievements,
      href: "/achievements",
      icon: Trophy,
      ghost: "05",
    },
  ];
}

export function StatsSection({ stats }: { stats: Stats }) {
  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Top saffron gradient rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #E8820C 30%, #E8820C 70%, transparent)",
        }}
      />

      {/* Subtle campus watermark */}
      <div
        className="absolute inset-0 opacity-[0.018] bg-cover bg-center"
        style={{
          backgroundImage: `url('${IMAGES.campus_about}')`,
          filter: "blur(6px)",
        }}
      />

      <div className="container relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="accent-rule" />
            <h2 className="font-display text-4xl">By the numbers</h2>
            <p className="text-sm text-stone-500 mt-2">
              Verified data · All departments · All years
            </p>
          </div>
          <p className="text-xs text-stone-400 pb-2 hidden md:block">
            SSJCOE · Dombivli, Maharashtra
          </p>
        </div>

        <StaggerReveal className="grid grid-cols-2 md:grid-cols-5" stagger={70}>
          {getItems(stats).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden border border-stone-200 bg-white hover:bg-stone-50 transition-all duration-300 hover:border-saffron/30 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Ghost number background */}
                <div
                  className="absolute -bottom-4 -right-2 font-mono font-bold text-stone-100 select-none pointer-events-none leading-none"
                  style={{ fontSize: "80px", letterSpacing: "-0.06em" }}
                >
                  {item.ghost}
                </div>

                {/* Saffron top border on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="relative z-10 p-6">
                  <div className="w-9 h-9 rounded-lg bg-saffron-light flex items-center justify-center mb-4 group-hover:bg-saffron group-hover:text-white transition-colors duration-300">
                    <Icon className="w-4 h-4 text-saffron group-hover:text-white transition-colors" />
                  </div>

                  <p className="num text-4xl mb-2">{item.value}+</p>

                  <div className="flex items-center justify-between">
                    <p className="label">{item.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-saffron group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
