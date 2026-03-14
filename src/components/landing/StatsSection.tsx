import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StatsSection({
  stats,
}: {
  stats: {
    totalPlacements: number;
    researchPapers: number;
    patents: number;
    events: number;
    achievementsCount: number;
  };
}) {
  const items = [
    { label: "Placements", value: stats.totalPlacements, href: "/placements" },
    { label: "Papers", value: stats.researchPapers, href: "/research" },
    { label: "Patents", value: stats.patents, href: "/patents" },
    { label: "Events", value: stats.events, href: "/events" },
    {
      label: "Achievements",
      value: stats.achievementsCount,
      href: "/achievements",
    },
  ];

  return (
    <section className="section bg-white border-b border-ink-7">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="accent-line" />
            <h2 className="text-3xl">By the numbers</h2>
          </div>
          <p className="text-sm text-ink-4 pb-1">All departments · All years</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-ink-7 border border-ink-7 rounded-lg overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group p-6 bg-white hover:bg-ink-9 transition-colors"
            >
              <p className="num-display text-4xl mb-2">{item.value}+</p>
              <div className="flex items-center justify-between">
                <p className="label">{item.label}</p>
                <ArrowRight className="w-3.5 h-3.5 text-ink-6 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
