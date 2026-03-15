"use client";

import { Eye, Target, Heart } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";

interface Props {
  vision: string;
  mission: string;
  values?: string;
  variant?: "college" | "department";
  bgImage?: string;
}

export function VisionMissionSection({
  vision,
  mission,
  values,
  variant = "department",
  bgImage,
}: Props) {
  const items: { icon: typeof Eye; label: string; text: string }[] = [
    { icon: Eye, label: "Vision", text: vision },
    { icon: Target, label: "Mission", text: mission },
    ...(values ? [{ icon: Heart as typeof Eye, label: "Values", text: values }] : []),
  ];

  if (variant === "college") {
    return (
      <section className="section bg-stone-950 relative overflow-hidden">
        {bgImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url('${bgImage}')` }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,20,16,0.98) 0%, rgba(26,20,16,0.90) 100%)",
              }}
            />
          </>
        )}

        <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

        <div className="container relative z-10">
          <RevealOnScroll>
            <div className="mb-16 text-center">
              <span className="block w-8 h-0.5 bg-saffron mx-auto mb-6" />
              <h2 className="font-display text-4xl text-white mb-3">
                Our guiding principles
              </h2>
              <p className="subtext text-stone-500 max-w-xl mx-auto">
                The foundation on which SSJCOE has built 30 years of engineering
                excellence
              </p>
            </div>
          </RevealOnScroll>

          <StaggerReveal
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            stagger={100}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="relative bg-stone-900/60 backdrop-blur-sm border border-stone-800 rounded-xl p-8 hover:border-stone-700 transition-colors group"
                >
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-saffron/50 to-transparent" />
                  <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-saffron" />
                  </div>
                  <p className="label text-stone-500 mb-3">{item.label}</p>
                  <p className="text-stone-300 leading-relaxed text-base">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </StaggerReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white border-y border-stone-100">
      <div className="container">
        <RevealOnScroll>
          <div className="mb-12">
            <span className="accent-rule" />
            <h2 className="font-display text-3xl text-stone-950 mb-2">
              Vision & Mission
            </h2>
            <p className="subtext">
              The principles guiding our academic and research objectives
            </p>
          </div>
        </RevealOnScroll>

        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          stagger={80}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group relative rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    item.label === "Vision"
                      ? "bg-saffron"
                      : "bg-stone-300 group-hover:bg-stone-400"
                  } transition-colors`}
                />
                <div className="pl-8 pr-6 py-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        item.label === "Vision"
                          ? "bg-saffron-light border border-saffron/20"
                          : "bg-stone-100 border border-stone-200"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          item.label === "Vision"
                            ? "text-saffron"
                            : "text-stone-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`label ${
                        item.label === "Vision"
                          ? "text-saffron"
                          : "text-stone-400"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                  <p className="text-stone-700 leading-relaxed text-base">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
