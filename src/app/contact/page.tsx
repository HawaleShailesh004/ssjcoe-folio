import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { StaggerReveal } from "@/components/shared/StaggerReveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact SSJCOE placement cell, faculty, and administration.",
};

const CONTACTS = [
  {
    role:    "Placement Cell",
    name:    "Training & Placement Officer",
    email:   "placement@ssjcoe.edu.in",
    phone:   "0251-2872560",
    phone2:  "+91 86928 83817",
    note:    "For campus recruitment drives, internship tie-ups, and placement queries.",
    primary: true,
  },
  {
    role:    "Principal's Office",
    name:    "Dr. Uttara Gogate",
    email:   "principal@ssjcoe.edu.in",
    phone:   "0251-2872560",
    note:    "For institutional collaborations, MOUs, and research partnerships.",
    primary: false,
  },
  {
    role:    "General Enquiries",
    name:    "Office",
    email:   "office@shivajiraojondhalecoe.org",
    phone:   "+91 95949 62025",
    note:    "For admissions, general information, and other queries.",
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-stone-950"
        style={{ minHeight: "300px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${IMAGES.campus_admission}')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(12,10,9,0.97) 0%, rgba(12,10,9,0.85) 100%)" }}
        />
        <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

        <div className="container relative z-10 py-20">
          <div style={{ opacity: 0, animation: "fadeUp 0.7s 0.2s ease-out forwards" }}>
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h1
              className="font-display text-white mb-3"
              style={{ fontSize: "clamp(40px, 6vw, 64px)" }}
            >
              Contact us
            </h1>
            <p className="text-stone-400 text-base max-w-lg">
              Reach the SSJCOE placement cell, principal&apos;s office, or general administration.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section bg-stone-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact cards */}
            <div className="lg:col-span-2">
              <RevealOnScroll>
                <div className="mb-10">
                  <span className="accent-rule" />
                  <h2 className="font-display text-3xl text-stone-950">Get in touch</h2>
                  <p className="subtext mt-2">
                    Contact the right team directly for faster response
                  </p>
                </div>
              </RevealOnScroll>

              <StaggerReveal className="flex flex-col gap-4" stagger={80}>
                {CONTACTS.map((c) => (
                  <div
                    key={c.role}
                    className={`card overflow-hidden ${c.primary ? "" : ""}`}
                  >
                    {c.primary && (
                      <div className="h-1 bg-gradient-to-r from-saffron via-saffron/50 to-transparent" />
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className={`label mb-1 ${c.primary ? "text-saffron" : ""}`}>
                            {c.role}
                          </p>
                          <h3 className="font-semibold text-stone-950 text-lg">
                            {c.name}
                          </h3>
                          <p className="caption mt-1">{c.note}</p>
                        </div>
                        {c.primary && (
                          <span className="badge badge-saffron flex-shrink-0">
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={`mailto:${c.email}`}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-stone-200 hover:border-saffron/40 hover:bg-saffron-light transition-all group"
                        >
                          <Mail className="w-4 h-4 text-stone-400 group-hover:text-saffron transition-colors" />
                          <span className="text-sm text-stone-700 group-hover:text-stone-950 transition-colors">
                            {c.email}
                          </span>
                        </a>

                        <a
                          href={`tel:${c.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-stone-200 hover:border-saffron/40 hover:bg-saffron-light transition-all group"
                        >
                          <Phone className="w-4 h-4 text-stone-400 group-hover:text-saffron transition-colors" />
                          <span className="text-sm text-stone-700 group-hover:text-stone-950 transition-colors">
                            {c.phone}
                          </span>
                        </a>

                        {c.phone2 && (
                          <a
                            href={`tel:${c.phone2.replace(/\s/g, "")}`}
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-stone-200 hover:border-saffron/40 hover:bg-saffron-light transition-all group"
                          >
                            <Phone className="w-4 h-4 text-stone-400 group-hover:text-saffron transition-colors" />
                            <span className="text-sm text-stone-700 group-hover:text-stone-950 transition-colors">
                              {c.phone2}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggerReveal>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-5">
              <RevealOnScroll delay={100}>
                {/* Address */}
                <div className="card p-6 mb-5">
                  <p className="label mb-5">Address</p>
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#FFF7ED", border: "1px solid rgba(232,130,12,0.2)" }}
                    >
                      <MapPin className="w-4 h-4 text-saffron" />
                    </div>
                    <div>
                      <p className="text-stone-800 text-sm font-medium leading-relaxed">
                        Behind Venkatesh Petrol Pump,<br />
                        Sonarpada, Dombivli (E),<br />
                        Dist. Thane, Maharashtra — 421204
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/k4Dav8fkgZ2QU2eu9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-saffron hover:text-saffron-dark transition-colors mt-4"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Google Maps
                  </a>
                </div>

                {/* Office hours */}
                <div className="card p-6 mb-5">
                  <p className="label mb-5">Office Hours</p>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#FFF7ED", border: "1px solid rgba(232,130,12,0.2)" }}
                    >
                      <Clock className="w-4 h-4 text-saffron" />
                    </div>
                    <div className="space-y-2">
                      {[
                        { day: "Monday – Friday", time: "9:00 AM – 5:30 PM" },
                        { day: "Saturday",         time: "9:00 AM – 1:00 PM" },
                        { day: "Sunday",           time: "Closed" },
                      ].map((h) => (
                        <div key={h.day} className="flex items-center justify-between gap-6">
                          <p className="caption">{h.day}</p>
                          <p className="text-sm text-stone-800 font-medium">{h.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick link to official site */}
                <div
                  className="rounded-xl p-5 border"
                  style={{ background: "#FAFAF9", borderColor: "#E7E5E4" }}
                >
                  <p className="caption mb-2">Official website</p>
                  <a
                    href="https://shivajiraojondhalecoe.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-saffron hover:text-saffron-dark transition-colors font-medium"
                  >
                    shivajiraojondhalecoe.org
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="caption mt-2">
                    For admissions, results, notices, and official academic information
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
