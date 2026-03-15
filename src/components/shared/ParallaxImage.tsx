"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  speed?: number;
  height?: string;
  overlay?: string;
  children?: React.ReactNode;
}

export function ParallaxImage({
  src,
  className = "",
  speed = 0.25,
  height = "80vh",
  overlay = "linear-gradient(135deg, rgba(26,20,16,0.92) 0%, rgba(26,20,16,0.75) 100%)",
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null); // track the CONTAINER
  const bgRef = useRef<HTMLDivElement>(null); // move the BG

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) return;

    const handleScroll = () => {
      // Use container rect — recalculated every event, always fresh
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      // How far the section center is from the viewport center
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowH / 2;
      const offset = (sectionCenter - viewportCenter) * speed;

      bg.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    handleScroll(); // correct position on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height, ...(height === "auto" ? { minHeight: "60vh" } : {}) }}
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${src}')`,
          inset: "-25% 0", // extra height top and bottom to avoid gaps during movement
          height: "150%",
          top: "-25%",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: overlay }} />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full flex items-center">{children}</div>
      )}
    </div>
  );
}
