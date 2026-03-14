"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Counter({
  to,
  duration = 1200,
}: {
  to: number;
  duration?: number;
}) {
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
            setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
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
  return (
    <section className="bg-ink text-white">
      <div className="container">
        <div className="py-28 md:py-36 max-w-3xl">
          <p className="label text-ink-5 mb-6 tracking-widest">
            SSJCOE · Dombivli · Est. 1983
          </p>

          <h1 className="font-display text-6xl md:text-7xl text-white leading-[1.0] mb-8 text-balance">
            A record of
            <br />
            <em className="not-italic text-white">excellence.</em>
          </h1>

          <p className="text-base text-ink-5 max-w-lg leading-relaxed mb-10">
            Every placement secured, paper published, and patent filed —
            tracked, verified, and made public. This is what SSJCOE produces.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/placements"
              className="inline-flex items-center h-10 px-5 bg-white text-ink text-sm font-medium rounded hover:bg-ink-8 transition-colors"
            >
              View placements
            </Link>
            <Link
              href="/departments"
              className="inline-flex items-center h-10 px-5 border border-ink-2 text-ink-5 text-sm font-medium rounded hover:border-ink-4 hover:text-white transition-colors"
            >
              Explore departments
            </Link>
          </div>
        </div>

        <div className="border-t border-ink-2 grid grid-cols-2 md:grid-cols-4">
          {[
            {
              label: "Students placed",
              value: stats.totalPlacements,
              suffix: "+",
            },
            {
              label: "Avg. package",
              value: parseFloat(stats.avgPackage),
              suffix: " LPA",
            },
            {
              label: "Research papers",
              value: stats.researchPapers,
              suffix: "+",
            },
            {
              label: "Patents filed",
              value: stats.patents,
              suffix: "+",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`py-8 px-6 ${i < 3 ? "md:border-r border-ink-2" : ""} ${i >= 2 ? "border-t md:border-t-0 border-ink-2" : ""}`}
            >
              <p className="label text-ink-5 mb-2">{s.label}</p>
              <p className="num-display text-4xl text-white">
                <Counter to={s.value} />
                {s.suffix}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
