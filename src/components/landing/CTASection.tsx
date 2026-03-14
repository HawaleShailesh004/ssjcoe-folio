"use client";

import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { IMAGES } from "@/lib/images";

export function CTASection() {
  return (
    <ParallaxImage
      src={IMAGES.college_front}
      speed={0.2}
      height="auto"
      overlay="linear-gradient(135deg, rgba(26,20,16,0.97) 0%, rgba(26,20,16,0.90) 60%, rgba(26,20,16,0.95) 100%)"
    >
      <div className="container w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h2
              className="font-display text-white leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
            >
              Looking to hire from{" "}
              <em className="text-saffron italic">SSJCOE?</em>
            </h2>
            <p className="text-stone-400 leading-relaxed mb-8 max-w-md">
              Connect with our placement cell. Browse 40+ verified placement
              records and reach the team directly. Our graduates work at Godrej,
              L&T, Infosys, Capgemini, and many more.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/placements"
                className="btn btn-primary group"
              >
                Browse placements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="btn border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact us
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="bg-stone-900/70 backdrop-blur-sm border border-stone-800 rounded-2xl p-8">
              <p className="label text-stone-500 mb-6">Placement Cell</p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 mb-0.5">Email</p>
                    <a
                      href="mailto:placement@ssjcoe.edu.in"
                      className="text-stone-300 text-sm hover:text-saffron transition-colors"
                    >
                      placement@ssjcoe.edu.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 mb-0.5">Phone</p>
                    <a
                      href="tel:02512872560"
                      className="text-stone-300 text-sm hover:text-saffron transition-colors"
                    >
                      0251-2872560
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Behind Venkatesh Petrol Pump, Sonarpada,
                    <br />
                    Dombivli (E), Dist. Thane — 421204
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </ParallaxImage>
  );
}
