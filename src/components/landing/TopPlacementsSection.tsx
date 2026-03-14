"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { IMAGES, normalizeImageUrl } from "@/lib/images";
import type { Placement } from "@/types";

export function TopPlacementsSection({
  placements,
}: {
  placements: Placement[];
}) {
  if (!placements.length) return null;

  return (
    <section
      className="section relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FAF7F2 0%, #FFFFFF 100%)",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left — sticky header + placement photo */}
          <div className="lg:col-span-2">
            <RevealOnScroll>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl mb-4">
                Recent
                <br />
                highlights
              </h2>
              <p className="text-sm text-stone-500 mb-8">
                Top placements across departments · 2024 batch
              </p>
            </RevealOnScroll>

            {/* Placement ceremony photo with overlay text */}
            <RevealOnScroll delay={150}>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ height: "260px" }}
              >
                <img
                  src={IMAGES.placement_ceremony}
                  alt="SSJCOE Placement Ceremony"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,20,16,0.85) 0%, rgba(26,20,16,0.2) 60%)",
                  }}
                />

                {/* Floating stat on image */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-stone-400 mb-1">
                        Placement season
                      </p>
                      <p className="font-display text-2xl text-white">
                        2024 batch
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="num text-3xl text-saffron">92%</p>
                      <p className="text-xs text-stone-400">IT Dept rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <Link
                href="/placements"
                className="inline-flex items-center gap-2 mt-6 text-sm text-saffron hover:text-saffron-dark transition-colors group"
              >
                View all placements
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealOnScroll>
          </div>

          {/* Right — placement cards */}
          <div className="lg:col-span-3">
            <StaggerReveal className="flex flex-col gap-3" stagger={60}>
              {placements.map((p) => {
                const photoSrc =
                  normalizeImageUrl(p.photo_url) ?? p.photo_url ?? "";
                return (
                  <div
                    key={p.id}
                    className="group card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-semibold text-sm overflow-hidden shrink-0 border border-stone-200">
                        {photoSrc ? (
                          <img
                            src={photoSrc}
                            alt={p.student_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-display text-lg">
                            {p.student_name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-stone-950 text-sm truncate">
                            {p.student_name}
                          </p>
                          <span className="num text-sm text-ok-DEFAULT font-semibold shrink-0">
                            ₹{p.package_lpa} LPA
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-saffron-dark text-xs font-medium">
                            {p.company}
                          </span>
                          <span className="text-stone-400 text-xs flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {p.role}
                          </span>
                          {p.location && (
                            <span className="text-stone-400 text-xs flex items-center gap-1 hidden sm:flex">
                              <MapPin className="w-3 h-3" /> {p.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
