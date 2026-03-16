"use client";

import { useEffect, useRef } from "react";
import { IMAGES } from "@/lib/images";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  tag?: string;
  image?: string;
  ghostText?: string;
  crumbs?: Crumb[];
  stats?: { value: string; label: string }[];
}

export function PageHero({
  title,
  subtitle,
  tag,
  image = IMAGES.campus_ict,
  ghostText,
  crumbs,
  stats,
}: Props) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax: background moves slower than scroll (same as home HeroSection)
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY * 0.3;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-stone-950"
      style={{ minHeight: stats ? "400px" : "340px" }}
    >
      {/* Parallax background — full bleed, moves on scroll */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${image}')`,
          left: 0,
          right: 0,
          top: "-15%",
          bottom: "-15%",
          height: "130%",
          opacity: 0.22,
        }}
      />

      {/* Overlay — slightly lighter so background image shows through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(12,10,9,0.88) 0%, rgba(12,10,9,0.70) 100%)",
        }}
      />

      {/* Grain */}
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      {/* Saffron glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(232,130,12,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Ghost text — bottom right, bolder stroke */}
      {ghostText && (
        <div
          className="absolute right-0 bottom-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: "clamp(80px, 16vw, 200px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 800,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(232,130,12,0.14)",
            letterSpacing: "-0.04em",
          }}
        >
          {ghostText}
        </div>
      )}

      <div className="container relative z-10 py-16">
        {/* Breadcrumb */}
        {crumbs && (
          <nav className="flex items-center gap-2 mb-7">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="caption text-stone-700">/</span>
                )}
                {c.href ? (
                  <a
                    href={c.href}
                    className="caption text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {c.label}
                  </a>
                ) : (
                  <span className="caption text-stone-400">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Tag */}
        {tag && <p className="eyebrow mb-4">{tag}</p>}

        {/* Title */}
        <div
          style={{
            opacity: 0,
            animation: "fadeUp 0.7s 0.15s ease-out forwards",
          }}
        >
          <span className="block w-8 h-0.5 bg-saffron mb-5" />
          <h1
            className="font-display text-white mb-3"
            style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-stone-400 text-base max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Stats row */}
        {stats && (
          <div
            className="flex flex-wrap gap-8 mt-10 pt-10"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              opacity: 0,
              animation: "fadeUp 0.7s 0.35s ease-out forwards",
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="num text-2xl text-white">{s.value}</p>
                <p className="caption mt-0.5 text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
