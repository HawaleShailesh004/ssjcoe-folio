import Link from "next/link";
import {
  GraduationCap,
  FlaskConical,
  Award,
  Calendar,
  Trophy,
  ArrowRight,
} from "lucide-react";

interface StatsSectionProps {
  stats: {
    totalPlacements: number;
    researchPapers: number;
    patents: number;
    events: number;
    sportsAchievements: number;
  };
}

const STAT_ITEMS = (stats: StatsSectionProps["stats"]) => [
  {
    icon: GraduationCap,
    value: stats.totalPlacements,
    label: "Students Placed",
    href: "/placements",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FlaskConical,
    value: stats.researchPapers,
    label: "Research Papers",
    href: "/research",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Award,
    value: stats.patents,
    label: "Patents Filed",
    href: "/patents",
    color: "text-brand-saffron",
    bg: "bg-amber-50",
  },
  {
    icon: Calendar,
    value: stats.events,
    label: "Events Conducted",
    href: "/events",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Trophy,
    value: stats.sportsAchievements,
    label: "Sports Achievements",
    href: "/sports",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="section-pad bg-white border-b border-brand-border">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-black">
              By the numbers
            </h2>
            <p className="text-brand-muted mt-1">
              Verified data across all departments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAT_ITEMS(stats).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="card-base p-5 hover:shadow-panel transition-shadow group"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="font-mono text-2xl font-bold text-brand-black mb-0.5">
                  {item.value}+
                </div>
                <div className="text-xs text-brand-muted">{item.label}</div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-saffron opacity-0 group-hover:opacity-100 transition-opacity">
                  View all <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
