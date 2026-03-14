"use client";

import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { RECRUITER_LOGOS } from "@/lib/images";

export function RecruitersSection() {
  const doubled = [...RECRUITER_LOGOS, ...RECRUITER_LOGOS];

  return (
    <section className="section bg-stone-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(232,130,12,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 mb-12">
        <RevealOnScroll>
          <div className="text-center">
            <span className="block w-8 h-0.5 bg-saffron mx-auto mb-5" />
            <h2 className="font-display text-3xl text-white mb-2">
              Our recruiters
            </h2>
            <p className="text-sm text-stone-500">
              Companies that consistently hire SSJCOE talent
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #1A1410, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #1A1410, transparent)",
          }}
        />

        <div className="marquee-track" style={{ gap: "24px" }}>
          {doubled.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="shrink-0 flex items-center justify-center bg-stone-900/80 border border-stone-800 rounded-lg hover:border-stone-600 transition-colors"
              style={{ width: "130px", height: "60px" }}
              title={r.name}
            >
              <img
                src={r.logo}
                alt={r.name}
                className="max-h-9 max-w-24 object-contain filter grayscale brightness-200 opacity-40 hover:opacity-80 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = "none";
                  if (t.parentElement) {
                    t.parentElement.innerHTML = `<span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.4)">${r.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mt-6 text-center">
        <p className="text-xs text-stone-700">
          + many more companies hire from SSJCOE every year
        </p>
      </div>
    </section>
  );
}
