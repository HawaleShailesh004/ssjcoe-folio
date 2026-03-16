"use client";

import { useEffect, useRef } from "react";

/** Parallax background layer for hero sections — moves at 0.3× scroll speed. Use inside a relative overflow-hidden section. */
export function ParallaxHeroBg({
  image,
  opacity = 0.3,
}: {
  image: string;
  opacity?: number;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={bgRef}
      className="absolute inset-0 bg-cover bg-center will-change-transform pointer-events-none"
      style={{
        backgroundImage: `url('${image}')`,
        left: 0,
        right: 0,
        top: "-15%",
        bottom: "-15%",
        height: "130%",
        opacity,
      }}
    />
  );
}
