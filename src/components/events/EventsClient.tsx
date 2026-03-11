"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { EventCard } from "@/components/events/EventCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setDeptId("all");
    setYear("all");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Events"
        description={`${initialEvents.length} events conducted across SSJCOE departments.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {EVENT_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              type === t.value
                ? "bg-brand-black text-white border-brand-black"
                : "bg-white text-brand-muted border-brand-border hover:border-brand-slate"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search events..."
          hasActiveFilters={hasFilters}
          onClear={clearFilters}
          filters={
            <div className="flex flex-wrap gap-2">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={deptId} onValueChange={setDeptId}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No events found"
          icon={<Calendar className="w-6 h-6" />}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
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
