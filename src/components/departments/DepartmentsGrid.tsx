import Link from "next/link";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { DEPT_IMAGES } from "@/lib/images";
import {
  GraduationCap,
  FlaskConical,
  Users,
  ArrowRight,
} from "lucide-react";
import type { Department } from "@/types";

interface Summary {
  placements: number;
  avgPackage: string;
  research: number;
  patents: number;
  events: number;
  achievements: number;
  faculty: number;
}

interface Props {
  summaries: { dept: Department; summary: Summary }[];
}

const DEPT_TAGLINE: Record<string, string> = {
  IT: "Software · AI · Web · Networking",
  CS: "Algorithms · Security · Systems · ML",
  MECH: "Design · Manufacturing · Thermal · CAD",
  ENTC: "5G · IoT · Signal Processing · VLSI",
  CHEM: "Process · Reaction · Mass Transfer · Environment",
  AIML: "Deep Learning · NLP · Computer Vision · Data",
  HUMS: "Mathematics · Physics · English · Management",
};

export function DepartmentsGrid({ summaries }: Props) {
  return (
    <div>
      {/* Page hero — dark, image background */}
      <section
        className="relative overflow-hidden bg-stone-950"
        style={{ minHeight: "320px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/campus/ICT.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-grain opacity-18 pointer-events-none" />

        <div
          className="absolute right-0 bottom-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: "clamp(100px, 18vw, 220px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            color: "transparent",
            WebkitTextStroke: "1px rgba(232,130,12,0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          DEPT
        </div>

        <div className="container relative z-10 py-20">
          <div
            style={{
              opacity: 0,
              animation: "fadeUp 0.7s 0.2s ease-out forwards",
            }}
          >
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h1
              className="font-display text-white mb-3"
              style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
            >
              Departments
            </h1>
            <p className="text-stone-400 text-base max-w-lg">
              {summaries.length} departments across engineering disciplines ·
              SSJCOE, Dombivli
            </p>
          </div>
        </div>
      </section>

      {/* Dept cards — image-first layout */}
      <section className="section bg-stone-50">
        <div className="container">
          <StaggerReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            stagger={70}
          >
            {summaries.map(({ dept, summary }) => {
              const img = DEPT_IMAGES[dept.code];
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.code.toLowerCase()}`}
                  className="group block rounded-xl overflow-hidden border border-stone-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ height: "200px" }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200" />
                    )}

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(12,10,9,0.85) 0%, rgba(12,10,9,0.2) 60%, transparent 100%)",
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="font-mono text-xs font-bold text-saffron tracking-wider mb-1">
                        {dept.code}
                        {dept.established_year != null && (
                          <span className="text-stone-500 font-normal ml-2">
                            Est. {dept.established_year}
                          </span>
                        )}
                      </p>
                      <h3 className="font-display text-white text-xl leading-tight">
                        {dept.name}
                      </h3>
                    </div>

                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="caption mb-5">
                      {DEPT_TAGLINE[dept.code] ??
                        "Engineering · Research · Innovation"}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        {
                          icon: GraduationCap,
                          value: summary.placements,
                          label: "Placed",
                        },
                        {
                          icon: Users,
                          value: summary.faculty,
                          label: "Faculty",
                        },
                        {
                          icon: FlaskConical,
                          value: summary.research,
                          label: "Papers",
                        },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <div className="w-7 h-7 rounded-lg bg-saffron-light border border-saffron/20 flex items-center justify-center mx-auto mb-1.5">
                            <s.icon className="w-3.5 h-3.5 text-saffron" />
                          </div>
                          <p className="num text-lg text-stone-950">
                            {s.value}
                          </p>
                          <p
                            className="caption"
                            style={{ fontSize: "10px" }}
                          >
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {Number(summary.avgPackage) > 0 && (
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <p className="caption">Avg. package</p>
                        <p className="num text-sm text-ok">
                          ₹{summary.avgPackage} LPA
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}
