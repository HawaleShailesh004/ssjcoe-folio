import Link from "next/link";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { Event } from "@/types";

interface Props {
  events: Event[];
}

const TYPE_COLOR: Record<string, string> = {
  technical: "badge-saffron",
  cultural: "badge-idle",
  sports: "badge-idle",
  official: "badge-idle",
  workshop: "badge-saffron",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

export function UpcomingEventsSection({ events }: Props) {
  const upcoming = events
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (!upcoming.length) return null;

  return (
    <section className="section bg-white border-y border-stone-200">
      <div className="container">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="accent-rule" />
              <h2 className="font-display text-4xl">Upcoming events</h2>
              <p className="text-sm text-stone-500 mt-2">
                What&apos;s happening at SSJCOE
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1.5 text-sm text-saffron hover:text-saffron-dark transition-colors group"
            >
              All events
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col divide-y divide-stone-100">
          {upcoming.map((event, i) => {
            const { day, month, year } = formatDate(event.date);
            return (
              <RevealOnScroll key={event.id} delay={i * 60}>
                <div className="group py-5 flex items-start gap-6 hover:bg-stone-50 -mx-4 px-4 rounded-lg transition-colors cursor-default">
                  {/* Date block */}
                  <div className="shrink-0 w-14 text-center">
                    <p className="num text-2xl text-stone-950 leading-none">
                      {day}
                    </p>
                    <p className="text-xs text-saffron font-semibold tracking-wider mt-0.5">
                      {month}
                    </p>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">
                      {year}
                    </p>
                  </div>

                  {/* Vertical line */}
                  <div className="w-px self-stretch bg-stone-200 group-hover:bg-saffron transition-colors duration-300 shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`badge capitalize ${TYPE_COLOR[event.type] ?? "badge-idle"}`}
                      >
                        {event.type}
                      </span>
                      {event.is_official && (
                        <span className="badge badge-saffron">Official</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-stone-950 text-sm leading-snug mb-1.5 group-hover:text-saffron-dark transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                      {event.participants != null && event.participants > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.participants}{" "}
                          participants expected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow on hover */}
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-saffron opacity-0 group-hover:opacity-100 transition-all shrink-0 self-center" />
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
