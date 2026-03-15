import Link from "next/link";
import { ArrowRight, Phone, Mail, Handshake, GraduationCap, Trophy, Building2 } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { IMAGES } from "@/lib/images";

// These are real — from crawled MOUs and actual known placements
const STRENGTHS = [
  {
    icon:  GraduationCap,
    title: "Engineering across 7 disciplines",
    desc:  "IT, CS, Mechanical, ENTC, Chemical, AI/ML, and Humanities — diverse talent pool from one campus.",
  },
  {
    icon:  Trophy,
    title: "Nationally competitive students",
    desc:  "SIH Grand Final participants, IIT Bombay NEC Top-7 (4000+ colleges), AVISHKAR finalists.",
  },
  {
    icon:  Building2,
    title: "Thane-Dombivli industrial belt",
    desc:  "Located in one of Maharashtra's largest industrial zones — students trained with local industry context.",
  },
  {
    icon:  Handshake,
    title: "Active industry MOUs",
    desc:  "Formal partnerships with Godrej, L&T, CEMS, Republic Motors, Kilburn Engineering, and more.",
  },
];

export function RecruiterSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#1A1410" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: `url('${IMAGES.placement_top_2}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,20,16,0.98) 0%, rgba(26,20,16,0.90) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      {/* Saffron glow left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-10%",
          top: "50%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(232,130,12,0.07) 0%, transparent 70%)",
          transform: "translateY(-50%)",
        }}
      />

      <div className="container relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <RevealOnScroll>
            <p className="eyebrow mb-5">For Recruiters</p>
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h2
              className="font-display text-white mb-4"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Recruit from{" "}
              <em className="text-saffron not-italic italic">SSJCOE</em>
            </h2>

            <p className="text-stone-400 leading-relaxed mb-10 text-base">
              SSJCOE has been producing engineers since 1994. Our students
              are hands-on, industry-exposed, and increasingly competing at
              national level. We are actively expanding our placement
              partnerships and welcome companies of all sizes.
            </p>

            <StaggerReveal className="flex flex-col gap-5" stagger={70}>
              {STRENGTHS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "rgba(232,130,12,0.10)",
                        border: "1px solid rgba(232,130,12,0.2)",
                      }}
                    >
                      <Icon className="w-4 h-4 text-saffron" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-200 text-sm mb-0.5">
                        {s.title}
                      </p>
                      <p className="caption leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </StaggerReveal>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link href="/placements" className="btn btn-primary group">
                View placements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="btn border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white"
              >
                Contact placement cell
              </Link>
            </div>
          </RevealOnScroll>

          {/* Right — honest contact card */}
          <RevealOnScroll delay={150}>
            <div
              className="rounded-2xl p-8 border"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <p className="label text-stone-500 mb-6">
                Training & Placement Cell
              </p>

              {/* Honest quick facts — only what's real */}
              <div
                className="grid grid-cols-2 gap-4 mb-8 pb-8"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[
                  { num: "30+",  label: "Years established" },
                  { num: "7",    label: "Departments"        },
                  { num: "600+", label: "Students per batch" },
                  { num: "1994", label: "Founded"            },
                ].map((s) => (
                  <div key={s.label} className="text-center py-2">
                    <p className="num text-2xl text-white">{s.num}</p>
                    <p className="caption mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <a
                  href="mailto:placement@ssjcoe.edu.in"
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(232,130,12,0.10)",
                      border: "1px solid rgba(232,130,12,0.2)",
                    }}
                  >
                    <Mail className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="caption mb-0.5">Email</p>
                    <p className="text-stone-300 text-sm group-hover:text-saffron transition-colors font-medium">
                      placement@ssjcoe.edu.in
                    </p>
                  </div>
                </a>

                <a
                  href="tel:02512872560"
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(232,130,12,0.10)",
                      border: "1px solid rgba(232,130,12,0.2)",
                    }}
                  >
                    <Phone className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="caption mb-0.5">Phone</p>
                    <p className="text-stone-300 text-sm group-hover:text-saffron transition-colors font-medium">
                      0251-2872560 &nbsp;/&nbsp; +91 86928 83817
                    </p>
                  </div>
                </a>

                <div
                  className="pt-4 mt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p className="caption mb-2">
                    Campus location
                  </p>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Behind Venkatesh Petrol Pump, Sonarpada,<br />
                    Dombivli (E) — 421204
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
