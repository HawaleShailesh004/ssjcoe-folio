"use client";

import { useState, useMemo, useRef } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
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

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    9
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (v: string) => {
    setSearch(v);
    reset();
  };
  const handleType = (t: EventType | "all") => {
    setType(t);
    reset();
  };
  const handleYear = (v: string) => {
    setYear(v);
    reset();
  };
  const handleDept = (v: string) => {
    setDeptId(v);
    reset();
  };

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
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {EVENT_TYPES.map((t) => {
          const count =
            t.value === "all"
              ? initialEvents.length
              : initialEvents.filter((e) => e.type === t.value).length;
          const active = type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => handleType(t.value)}
              className={cn(
                "badge capitalize transition-all",
                active ? "ring-2 ring-offset-1 ring-current" : "",
                "badge-idle"
              )}
            >
              {t.label} · {count}
            </button>
          );
        })}
      </div>

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearch}
          placeholder="Search events..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel="events"
        >
          <select
            value={year}
            onChange={(e) => handleYear(e.target.value)}
            className="select"
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
            onChange={(e) => handleDept(e.target.value)}
            className="select"
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
                className="text-sm text-saffron hover:text-saffron-dark hover:underline"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div ref={resultsRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                department={departments.find((d) => d.id === event.dept_id)}
              />
            ))}
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              resultsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            totalItems={filtered.length}
            pageSize={9}
          />
        </div>
      )}
    </>
  );
}
