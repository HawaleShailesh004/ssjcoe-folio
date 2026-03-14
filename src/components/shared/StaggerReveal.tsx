"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number; // ms between each child
  threshold?: number;
}

export function StaggerReveal({
  children,
  className = "",
  stagger = 80,
  threshold = 0.1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = Array.from(container.children) as HTMLElement[];

    items.forEach((item, i) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms`;
    });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item) => {
            item.style.opacity = "1";
            item.style.transform = "none";
          });
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(container);
    return () => obs.disconnect();
  }, [stagger, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
