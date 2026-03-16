"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Award,
  ChevronDown,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

function Counter({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            setVal(Math.round((1 - Math.pow(1 - p, 4)) * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
}

export function HeroSection({
  stats,
}: {
  stats: {
    totalPlacements: number;
    avgPackage: string;
    researchPapers: number;
    patents: number;
  };
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax scroll: background moves slower than scroll (lag effect)
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY * 0.3;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    handleScroll(); // set correct position on mount (e.g. if page already scrolled)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-stone-950"
      style={{ minHeight: "108vh" }}
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${IMAGES.campus_ict}')`,
          left: 0,
          right: 0,
          top: "-15%",
          bottom: "-15%",
          height: "130%",
        }}
      />

      {/* Layered overlays — slightly lighter */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,20,16,0.90) 0%, rgba(26,20,16,0.78) 50%, rgba(26,20,16,0.86) 100%)",
        }}
      />

      {/* Grain texture */}
      <div className="absolute inset-0 bg-grain opacity-50 mix-blend-overlay pointer-events-none" />

      {/* Saffron radial glow — top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          right: "-10%",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(232,130,12,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Bottom saffron fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,20,16,1) 0%, transparent 100%)",
        }}
      />

      <div
        className="container relative z-10"
        style={{
          minHeight: "108vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="py-32 max-w-5xl">
          {/* College identity — logo (includes title) */}
          <div
            className="mb-12"
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.2s ease-out forwards",
            }}
          >
            <img
              src={IMAGES.logo}
              alt="SSJCOE"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain object-left opacity-90"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Main headline */}
          <div
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.4s ease-out forwards",
            }}
          >
            <span className="block w-8 h-0.5 bg-saffron mb-6" />
            <h1
              className="font-display text-white leading-[0.92]"
              style={{ fontSize: "clamp(56px, 9vw, 120px)" }}
            >
              A record of
              <br />
              <em className="text-saffron italic">excellence.</em>
            </h1>
          </div>

          <p
            className="text-base text-stone-400 max-w-lg leading-relaxed mt-8 mb-10"
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.6s ease-out forwards",
            }}
          >
            Every placement secured, paper published, patent filed — tracked,
            verified, and made public.{" "}
            <span className="text-stone-200 font-medium">This is SSJCOE.</span>
          </p>

          <div
            className="flex flex-wrap gap-3"
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.75s ease-out forwards",
            }}
          >
            <Link href="/placements" className="btn btn-primary group">
              View placements
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/departments"
              className="btn border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white"
            >
              Explore departments
            </Link>
          </div>

          {/* Floating stat callouts */}
          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px border border-stone-800 rounded-xl overflow-hidden"
            style={{
              opacity: 0,
              animation: "fadeUp 0.8s 0.9s ease-out forwards",
            }}
          >
            {[
              {
                label: "Students placed",
                value: stats.totalPlacements,
                suffix: "+",
                icon: GraduationCap,
              },
              {
                label: "Avg. package",
                value: parseFloat(stats.avgPackage),
                suffix: " LPA",
                icon: Award,
              },
              {
                label: "Research papers",
                value: stats.researchPapers,
                suffix: "+",
                icon: BookOpen,
              },
              {
                label: "Patents filed",
                value: stats.patents,
                suffix: "+",
                icon: Award,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-stone-900/60 backdrop-blur-sm px-6 py-7 hover:bg-stone-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-3.5 h-3.5 text-saffron opacity-80" />
                    <p className="label text-stone-500">{s.label}</p>
                  </div>
                  <p className="num text-4xl text-white">
                    <Counter to={s.value} />
                    {s.suffix}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{
          opacity: 0,
          animation: "fadeIn 1s 1.5s ease-out forwards",
        }}
      >
        <p className="text-xs text-stone-600 tracking-widest uppercase">
          Scroll
        </p>
        <ChevronDown className="w-4 h-4 text-stone-600 animate-bounce" />
      </div>

      {/* Diagonal bottom clip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-stone-50 pointer-events-none"
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        }}
      />
    </section>
  );
}
