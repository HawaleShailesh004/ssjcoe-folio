"use client";

import { useState } from "react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Quote, ArrowLeft, ArrowRight, MapPin, Briefcase } from "lucide-react";
import { IMAGES } from "@/lib/images";

const ALUMNI = [
  {
    name:    "Shubham Sharma",
    batch:   "EXTC · 2016",
    role:    "Cybersecurity Consultant",
    company: "Capgemini",
    location:"Sydney, Australia",
    photo:   IMAGES.alumni_shubham,
    quote:   "The college always emphasized on research, innovations and industry partnerships, which prepared us well for the industry. I got a chance to work with real-time projects which helped me build my practical skills. My strong fundamentals from SSJCOE allowed me to adapt quickly and confidently into cybersecurity.",
    short:   "Strong fundamentals from SSJCOE let me adapt confidently into cybersecurity at Capgemini, Australia.",
  },
  {
    name:    "Amay Shinde",
    batch:   "Mechanical · 2021",
    role:    "Supply Chain Management",
    company: "Deepak Fertilizers · Piramal Pharma",
    location:"Canada",
    photo:   IMAGES.alumni_amay,
    quote:   "My time at Jondhale College was truly transformative — not just academically, but personally. The entire faculty went above and beyond to support my passion for gymnastics while I pursued international championships. This nurturing environment played a crucial role in shaping who I am today.",
    short:   "Faculty supported my international gymnastics career without compromising my academics. Truly transformative.",
  },
  {
    name:    "Rushank Karekar",
    batch:   "IT · 2019",
    role:    "Software Engineer",
    company: "Industry",
    location:"Mumbai",
    photo:   IMAGES.alumni_rushank,
    quote:   "I have really enjoyed my time in Jondhale College with all the faculty who are very nice and helpful. They are quite knowledgeable and open — always ready to address doubts and quite flexible in terms of teaching. I would definitely recommend joining Jondhale College for your engineering degree.",
    short:   "Faculty are knowledgeable, approachable, and flexible. I would definitely recommend Jondhale College.",
  },
  {
    name:    "Isha Badachikar",
    batch:   "IT · 2010",
    role:    "Senior Manager",
    company: "Management Consulting",
    location:"Mumbai",
    photo:   IMAGES.alumni_isha,
    quote:   "I believe that a strong foundation is really essential to have a great career. And I had my very good foundation in Shivajirao Jondhale College of Engineering, Dombivli. The education I received here set the groundwork for everything I have achieved in my professional life.",
    short:   "SSJCOE gave me the strong foundation that my entire career is built on. I totally recommend it.",
  },
  {
    name:    "Aamir Rajaram Chavan",
    batch:   "Mechanical · 2023",
    role:    "Mechanical Engineer",
    company: "Connector Industries Pvt. Ltd.",
    location:"Thane",
    photo:   IMAGES.alumni_aamir,
    quote:   "I got chosen for the job through campus placement — I actually received my offer letter before the end of college. The faculty are experienced in design, production, and HVAC. Despite COVID, the college immediately managed seminars and workshops to ensure industrial exposure for our batch.",
    short:   "Got my offer letter before college ended. Faculty ensured industrial exposure even through COVID.",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const current = ALUMNI[active];

  return (
    <section className="section bg-white border-y border-stone-200 overflow-hidden">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl text-stone-950">
                Alumni stories
              </h2>
              <p className="subtext mt-2">
                What SSJCOE graduates say about their journey
              </p>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActive((a) => (a - 1 + ALUMNI.length) % ALUMNI.length)}
                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-saffron hover:text-saffron transition-colors"
                aria-label="Previous"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActive((a) => (a + 1) % ALUMNI.length)}
                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-saffron hover:text-saffron transition-colors"
                aria-label="Next"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Left — avatar stack + selector */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {ALUMNI.map((a, i) => (
              <button
                key={a.name}
                onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                  i === active
                    ? "border-saffron/40 bg-saffron-light shadow-sm"
                    : "border-stone-100 hover:border-stone-200 hover:bg-stone-50"
                }`}
              >
                {/* Photo */}
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === active ? "border-saffron" : "border-stone-200"
                  }`}
                >
                  <img
                    src={a.photo}
                    alt={a.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = "none";
                      if (t.parentElement) {
                        t.parentElement.innerHTML = `<div style="width:100%;height:100%;background:#F5F5F4;display:flex;align-items:center;justify-content:center;font-family:serif;font-size:18px;color:#A8A29E">${a.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`font-semibold text-sm truncate ${
                    i === active ? "text-stone-950" : "text-stone-700"
                  }`}>
                    {a.name}
                  </p>
                  <p className="caption truncate">{a.role} · {a.company}</p>
                </div>

                {/* Active indicator */}
                {i === active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Right — featured quote */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
              style={{ background: "#1A1410" }}
            >
              {/* Saffron glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(232,130,12,0.08) 0%, transparent 70%)",
                  transform: "translate(30%, -30%)",
                }}
              />

              {/* Quote mark */}
              <Quote
                className="w-10 h-10 text-saffron opacity-30 mb-6"
                strokeWidth={1.5}
              />

              {/* Quote text */}
              <p
                className="font-display text-white leading-relaxed mb-8"
                style={{ fontSize: "clamp(16px, 2.5vw, 20px)" }}
              >
                &quot;{current.quote}&quot;
              </p>

              {/* Person details */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-saffron/40">
                  <img
                    src={current.photo}
                    alt={current.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = "none";
                      if (t.parentElement) {
                        t.parentElement.innerHTML = `<div style="width:100%;height:100%;background:#292524;display:flex;align-items:center;justify-content:center;font-family:serif;font-size:20px;color:#78716C">${current.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                </div>

                <div>
                  <p className="font-semibold text-white">{current.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="caption text-stone-400">{current.batch}</span>
                    <span className="w-px h-3 bg-stone-700" />
                    <span className="flex items-center gap-1 caption text-stone-400">
                      <Briefcase className="w-3 h-3" />
                      {current.company}
                    </span>
                    <span className="w-px h-3 bg-stone-700" />
                    <span className="flex items-center gap-1 caption text-stone-400">
                      <MapPin className="w-3 h-3" />
                      {current.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 mt-8">
                {ALUMNI.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === active
                        ? "w-6 h-1.5 bg-saffron"
                        : "w-1.5 h-1.5 bg-stone-700 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
