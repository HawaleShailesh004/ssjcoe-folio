import type { Metadata } from "next";
import { IMAGES } from "@/lib/images";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import { SafeImage } from "@/components/shared/SafeImage";
import { VisionMissionSection } from "@/components/shared/VisionMissionSection";
import Link from "next/link";
import { ArrowRight, Award, Users, BookOpen, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About SSJCOE",
  description: "Learn about Shivajirao S. Jondhale College of Engineering — established 1994, NAAC accredited, affiliated to Mumbai University.",
};

const MILESTONES = [
  { year: "1994", title: "Inception", desc: "College established with Computer, Mechanical, and Chemical Engineering with intake of 180 students." },
  { year: "1998", title: "Mechanical dept", desc: "Department of Mechanical Engineering established, expanding engineering education offerings." },
  { year: "1999", title: "IT Department", desc: "Department of Information Technology established, responding to growing demand for IT professionals." },
  { year: "2014", title: "NAAC Accreditation", desc: "Awarded Grade B by NAAC, recognising quality standards in technical education." },
  { year: "2020", title: "Industry MOUs", desc: "Established MOUs with 15+ industries for research, internships, and curriculum development." },
  { year: "2021", title: "AI/ML Department", desc: "New Department of Artificial Intelligence & Machine Learning established with intake of 30." },
  { year: "2023", title: "Silver Jubilee", desc: "Celebrated 25+ years of excellence in engineering education with academic and cultural events." },
];

const ACCREDITATIONS = [
  { name: "AICTE Approved",   logo: "/images/campus/aicte.webp",   href: "https://www.aicte-india.org" },
  { name: "Mumbai University", logo: "/images/campus/mu.webp",      href: "https://mu.ac.in" },
  { name: "NAAC Grade B",     logo: "/images/campus/Grade-B.png",  href: "#" },
  { name: "DTE Maharashtra",  logo: "/images/campus/dte.webp",     href: "https://dte.maharashtra.gov.in" },
];

const LEADERSHIP = [
  {
    name:  "Mr. Sagar Shivajirao Jondhale",
    role:  "Honorable President",
    photo: IMAGES.president,
    note:  "Managing Trustee & Director of Jondhale Educational Group, overseeing 27 institutions since 1960.",
  },
  {
    name:  "Dr. Uttara Gogate",
    role:  "Principal",
    photo: IMAGES.principal,
    note:  "Leading SSJCOE with a focus on high-quality education, research, and developing bright professionals.",
  },
  {
    name:  "Mr. Devendra Jondhale",
    role:  "Secretary",
    photo: IMAGES.trustee,
    note:  "Committed to nurturing aspiring engineers with knowledge, skills, and practical industry exposure.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-stone-950"
        style={{ minHeight: "400px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${IMAGES.campus_about}')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(12,10,9,0.95) 0%, rgba(12,10,9,0.80) 100%)" }}
        />
        <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

        {/* Ghost text */}
        <div
          className="absolute right-0 bottom-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: "clamp(80px, 14vw, 180px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            color: "transparent",
            WebkitTextStroke: "1px rgba(232,130,12,0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          1994
        </div>

        <div className="container relative z-10 py-24">
          <div style={{ opacity: 0, animation: "fadeUp 0.7s 0.2s ease-out forwards" }}>
            <p className="eyebrow mb-5">Est. 1994 · Dombivli, Maharashtra</p>
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h1
              className="font-display text-white mb-5"
              style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
            >
              Shaping engineers<br />
              <em className="text-saffron not-italic italic">since 1994.</em>
            </h1>
            <p className="text-stone-400 max-w-xl leading-relaxed text-base">
              Shivajirao S. Jondhale College of Engineering — established by
              the Samarth Samaj with a vision to provide quality technical
              education to students in the Dombivli region and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick facts strip ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="container">
          <StaggerReveal
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-100"
            stagger={50}
          >
            {[
              { icon: Building2, value: "30+",   label: "Years of excellence"  },
              { icon: Users,     value: "17",    label: "Acre campus"          },
              { icon: Award,     value: "4000+", label: "Alumni network"       },
              { icon: BookOpen,  value: "7",     label: "Engineering depts"    },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-8 px-6 text-center group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "#FFF7ED", border: "1px solid rgba(232,130,12,0.2)" }}
                >
                  <s.icon className="w-4 h-4 text-saffron" />
                </div>
                <p className="num text-3xl text-stone-950 mb-0.5">{s.value}</p>
                <p className="caption">{s.label}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── About body ──────────────────────────────────────────────────── */}
      <section className="section bg-stone-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl text-stone-950 mb-6">
                About the institution
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Shivajirao S. Jondhale College of Engineering (SSJCOE) was
                  established in 1994 by the Samarth Samaj with a vision to provide
                  quality technical education to students in the Dombivli region and
                  beyond.
                </p>
                <p>
                  Spread across 17 acres of lush green campus, SSJCOE offers
                  state-of-the-art infrastructure with well-equipped laboratories,
                  modern classrooms, a central library, and excellent sports facilities.
                </p>
                <p>
                  The college is approved by AICTE New Delhi, recognised by DTE
                  Government of Maharashtra, and affiliated to Mumbai University.
                  Our NAAC accreditation stands as a testament to our commitment
                  to quality education.
                </p>
                <p>
                  With a focus on holistic development, we nurture innovation,
                  research, and entrepreneurship among our students, preparing
                  them to meet the challenges of the dynamic engineering landscape.
                </p>
              </div>

              <Link
                href="/departments"
                className="inline-flex items-center gap-2 mt-8 text-sm text-saffron hover:text-saffron-dark transition-colors group font-medium"
              >
                Explore all departments
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealOnScroll>

            {/* Campus image */}
            <RevealOnScroll delay={150}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: "380px" }}>
                <img
                  src={IMAGES.campus_about}
                  alt="SSJCOE Campus"
                  className="w-full h-full object-cover"
                />
                {/* Floating stat card */}
                <div
                  className="absolute bottom-5 left-5 right-5 rounded-xl p-5"
                  style={{
                    background: "rgba(12,10,9,0.82)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="caption mb-1">NAAC Accredited</p>
                      <p className="font-display text-white text-lg">Grade B · 2019</p>
                    </div>
                    <div className="text-right">
                      <p className="caption mb-1">Affiliated to</p>
                      <p className="font-display text-white text-lg">Mumbai University</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── Accreditations ──────────────────────────────────────────────── */}
      <section className="section bg-white border-y border-stone-200">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="block w-8 h-0.5 bg-saffron mx-auto mb-5" />
              <h2 className="font-display text-3xl text-stone-950 mb-2">
                Accreditations & affiliations
              </h2>
              <p className="subtext">
                Recognised by India&apos;s foremost educational bodies
              </p>
            </div>
          </RevealOnScroll>

          <StaggerReveal
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            stagger={60}
          >
            {ACCREDITATIONS.map((a) => (
              <a
                key={a.name}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover p-6 flex flex-col items-center gap-4 text-center group"
              >
                <div className="h-12 flex items-center justify-center">
                  <SafeImage
                    src={a.logo}
                    alt={a.name}
                    className="max-h-12 max-w-24 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    hideOnError
                  />
                </div>
                <p className="text-sm font-medium text-stone-700 group-hover:text-stone-950 transition-colors">
                  {a.name}
                </p>
              </a>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Vision / Mission ─────────────────────────────────────────────── */}
      <VisionMissionSection
        vision="To be recognized as a premier institution of engineering education that produces globally competent professionals capable of meeting technological challenges and contributing to societal development."
        mission="To impart quality technical education through innovative teaching-learning processes, fostering research and innovation, and developing professionals with technical competence, ethical values, and social responsibility."
        values="Excellence in education, integrity in actions, innovation in approach, inclusivity in opportunities, and responsibility towards society and environment."
        variant="college"
        bgImage={IMAGES.campus_ict}
      />

      {/* ── Leadership ───────────────────────────────────────────────────── */}
      <section className="section bg-stone-50">
        <div className="container">
          <RevealOnScroll>
            <div className="mb-12">
              <span className="accent-rule" />
              <h2 className="font-display text-4xl text-stone-950 mb-2">
                Leadership
              </h2>
              <p className="subtext">
                Visionary leaders guiding the institution towards excellence
              </p>
            </div>
          </RevealOnScroll>

          <StaggerReveal
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            stagger={80}
          >
            {LEADERSHIP.map((l) => (
              <div key={l.name} className="card overflow-hidden group hover:shadow-md transition-all duration-200">
                {/* Top saffron accent */}
                <div className="h-0.5 bg-gradient-to-r from-saffron via-saffron/50 to-transparent" />

                <div className="p-6">
                  {/* Photo */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 mb-5 border border-stone-200">
                    <SafeImage
                      src={l.photo}
                      alt={l.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackLetter={l.name.charAt(0)}
                    />
                  </div>

                  <p className="label text-saffron mb-1">{l.role}</p>
                  <h3 className="font-semibold text-stone-950 text-base mb-3 leading-snug">
                    {l.name}
                  </h3>
                  <p className="caption leading-relaxed">{l.note}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Milestones ──────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-stone-200">
        <div className="container">
          <RevealOnScroll>
            <div className="mb-12">
              <span className="accent-rule" />
              <h2 className="font-display text-4xl text-stone-950 mb-2">
                Our journey
              </h2>
              <p className="subtext">Milestones in our path of academic excellence</p>
            </div>
          </RevealOnScroll>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-16 top-0 bottom-0 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, #E8820C, #E7E5E4)" }}
            />

            <StaggerReveal className="flex flex-col gap-0" stagger={60}>
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className="relative flex items-start gap-8 pb-10 last:pb-0"
                >
                  {/* Year — desktop */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 w-32">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 z-10"
                      style={{
                        background: i === 0 ? "#E8820C" : "white",
                        borderColor: i === 0 ? "#E8820C" : "#E7E5E4",
                      }}
                    >
                      {i === 0 ? (
                        <Award className="w-4 h-4 text-white" />
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: "#E8820C" }}
                        />
                      )}
                    </div>
                    <p
                      className="num text-sm mt-2"
                      style={{ color: i === 0 ? "#E8820C" : "#78716C" }}
                    >
                      {m.year}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    {/* Year — mobile */}
                    <p
                      className="md:hidden font-mono text-xs font-bold text-saffron mb-1"
                    >
                      {m.year}
                    </p>
                    <h3 className="font-semibold text-stone-950 mb-1">{m.title}</h3>
                    <p className="caption leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>
    </>
  );
}
