"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { DEPT_IMAGES } from "@/lib/images";
import type { Department } from "@/types";

export function DepartmentsSection({
  departments,
}: {
  departments: Department[];
}) {
  return (
    <section className="section bg-white border-y border-stone-200 relative overflow-hidden">
      {/* Ghost "DEPT" text */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontSize: "clamp(120px, 20vw, 220px)",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: "1px rgba(228,179,140,0.12)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        DEPT
      </div>

      <div className="container relative z-10">
        <div className="flex items-end justify-between mb-12">
          <RevealOnScroll>
            <div>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl">Departments</h2>
              <p className="text-sm text-stone-500 mt-2">
                {departments.length} departments · 17-acre campus · Dombivli
              </p>
            </div>
          </RevealOnScroll>
          <Link
            href="/departments"
            className="hidden sm:flex items-center gap-1.5 text-sm text-saffron hover:text-saffron-dark transition-colors group"
          >
            All departments
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <StaggerReveal
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2"
          stagger={50}
        >
          {departments.map((d) => {
            const deptImg = DEPT_IMAGES[d.code];
            return (
              <Link
                key={d.id}
                href={`/departments/${d.code.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg border border-stone-200 hover:border-saffron/40 transition-all duration-400 hover:shadow-lg hover:-translate-y-1"
                style={{ minHeight: "180px" }}
              >
                {deptImg && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${deptImg}')` }}
                  />
                )}

                {!deptImg && (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
                )}

                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.82) 100%)",
                  }}
                />

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(232,130,12,0.15) 0%, rgba(26,20,16,0.55) 100%)",
                  }}
                />

                <div
                  className="relative z-10 p-4 flex flex-col h-full"
                  style={{ minHeight: "180px" }}
                >
                  <p className="font-mono font-bold text-saffron text-xs mb-1.5 tracking-wider group-hover:text-saffron transition-colors">
                    {d.code}
                  </p>
                  <p className="text-xs font-semibold text-stone-800 group-hover:text-white leading-tight flex-1 transition-colors duration-300">
                    {d.name}
                  </p>
                  <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-stone-400 group-hover:text-saffron transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                    </span>
                    <ArrowRight className="w-3 h-3 -translate-x-2 group-hover:translate-x-0 transition-transform" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
