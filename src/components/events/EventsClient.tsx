"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { EventCard } from "@/components/events/EventCard";
import type { Event, Department, EventType } from "@/types";
import { cn } from "@/lib/utils";

const EVENT_TYPES: { value: EventType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "cultural", label: "Cultural" },
  { value: "sports", label: "Sports" },
  { value: "official", label: "Official" },
  { value: "workshop", label: "Workshop" },
];

interface Props {
  initialEvents: Event[];
  departments: Department[];
}

export function EventsClient({
  initialEvents,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EventType | "all">("all");
  const [deptId, setDeptId] = useState("all");
  const [year, setYear] = useState("all");

  const years = useMemo(
    () =>
      [...new Set(initialEvents.map((e) => Number(e.year)))].sort(
        (a, b) => b - a
      ),
    [initialEvents]
  );

  const filtered = useMemo(() => {
    return initialEvents.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());

      const matchType = type === "all" || e.type === type;
      const matchDept = deptId === "all" || e.dept_id === deptId;
      const matchYear = year === "all" || Number(e.year) === Number(year);

      return matchSearch && matchType && matchDept && matchYear;
    });
  }, [initialEvents, search, type, deptId, year]);

  const hasFilters =
    search !== "" ||
    type !== "all" ||
    deptId !== "all" ||
    year !== "all";

  const clear = () => {
    setSearch("");
    setType("all");
    setDeptId("all");
    setYear("all");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Events"
        description={`${initialEvents.length} events conducted across SSJCOE departments.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        count={initialEvents.length}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {EVENT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              type === t.value
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink-4 border-ink-7 hover:border-ink-6"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search events..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel="events"
        >
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink text-ink-3"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink text-ink-3"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code}
              </option>
            ))}
          </select>
        </FilterBar>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No events found"
          description={hasFilters ? "Try adjusting your filters." : undefined}
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={clear}
                className="text-sm text-ink-2 hover:text-ink hover:underline"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              department={departments.find((d) => d.id === event.dept_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
