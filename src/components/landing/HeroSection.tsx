"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({
  target,
  duration = 1500,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface HeroProps {
  stats: {
    totalPlacements: number;
    avgPackage: string;
    highestPackage: string;
    researchPapers: number;
  };
}

export function HeroSection({ stats }: HeroProps) {
  return (
    <section className="relative bg-brand-black overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Saffron glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="container-main section-pad relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-saffron animate-pulse" />
            <span className="text-xs font-medium text-white/70 tracking-wide">
              SSJCOE · Dombivli
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6">
            A record of
            <br />
            <span className="text-brand-saffron">excellence.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
            Every placement secured, every paper published, every patent filed —
            tracked, verified, and showcased. This is what SSJCOE produces.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/placements">
              <Button
                size="lg"
                className="bg-brand-saffron hover:bg-brand-saffron/90 text-white font-semibold gap-2 h-12 px-6"
              >
                View Placements
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/departments">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-12 px-6 bg-transparent"
              >
                Explore Departments
              </Button>
            </Link>
          </div>
        </div>

        {/* Live counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-16 border-t border-white/10">
          {[
            {
              label: "Students Placed",
              value: stats.totalPlacements,
              suffix: "+",
            },
            {
              label: "Avg Package",
              value: parseFloat(stats.avgPackage),
              suffix: " LPA",
            },
            {
              label: "Research Papers",
              value: stats.researchPapers,
              suffix: "+",
            },
            {
              label: "Highest Package",
              value: parseFloat(stats.highestPackage),
              suffix: " LPA",
            },
          ].map((item) => (
            <div key={item.label} className="text-center lg:text-left">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white mb-1">
                <AnimatedCounter
                  target={item.value}
                  suffix={item.suffix}
                />
              </div>
              <div className="text-sm text-white/40">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
