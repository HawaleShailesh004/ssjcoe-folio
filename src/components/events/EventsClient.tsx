"use client";

import { useMemo, useRef, useState } from "react";
import { Search, X, Calendar, Clock } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { EventCard } from "@/components/events/EventCard";
import type { Event, Department } from "@/types";

interface Props {
  initialEvents: Event[];
  departments: Department[];
}

const TYPE_OPTIONS = ["technical", "cultural", "sports", "official", "workshop"];

export function EventsClient({ initialEvents: events, departments }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const hasUpcoming = events.some((e) => e.date >= today);
  const [tab, setTab] = useState<"upcoming" | "past">(
    hasUpcoming ? "upcoming" : "past",
  );
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [deptId, setDeptId] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => e.date >= today)
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
    [events, today],
  );

  const past = useMemo(
    () =>
      events
        .filter((e) => e.date < today)
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [events, today],
  );

  const pool = tab === "upcoming" ? upcoming : past;

  const filtered = useMemo(
    () =>
      pool.filter((e) => {
        if (
          search &&
          !e.title.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        if (type && e.type !== type) return false;
        if (deptId && e.dept_id !== deptId) return false;
        return true;
      }),
    [pool, search, type, deptId],
  );

  const {
    page,
    setPage,
    totalPages,
    paginated,
    reset,
  } = usePagination(filtered, 9);

  const hasFilters = search || type || deptId;
  const dept = (id: string) => departments.find((d) => d.id === id);

  const resetFilters = () => {
    setSearch("");
    setType("");
    setDeptId("");
    reset();
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 border-r border-stone-200 bg-white sticky top-14"
        style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}
      >
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center justify-between mb-1">
            <p className="label">Filters</p>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="caption text-saffron hover:text-saffron-dark flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <p className="caption">
            {filtered.length} of {pool.length} events
          </p>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="caption mb-2 font-medium text-stone-600">
              Search
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  reset();
                }}
                placeholder="Event name…"
                className="input w-full pl-9"
                style={{ height: "36px", fontSize: "13px" }}
              />
            </div>
          </div>

          <div>
            <p className="caption mb-2 font-medium text-stone-600">
              Type
            </p>
            <div className="flex flex-col gap-1.5">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(type === t ? "" : t);
                    reset();
                  }}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${
                    type === t
                      ? "bg-saffron-light border-saffron/40 text-saffron-dark"
                      : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="caption mb-2 font-medium text-stone-600">
              Department
            </p>
            <select
              value={deptId}
              onChange={(e) => {
                setDeptId(e.target.value);
                reset();
              }}
              className="select w-full"
              style={{ height: "36px", fontSize: "13px" }}
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 bg-stone-50">
        <div className="sticky top-14 z-20 bg-white border-b border-stone-200">
          <div className="px-6 flex items-center justify-between">
            <div className="flex">
              <button
                onClick={() => {
                  setTab("upcoming");
                  reset();
                }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === "upcoming"
                    ? "border-saffron text-saffron"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Upcoming
                {upcoming.length > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-mono text-xs ${
                      tab === "upcoming"
                        ? "bg-saffron-light text-saffron-dark"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {upcoming.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setTab("past");
                  reset();
                }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === "past"
                    ? "border-saffron text-saffron"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Past events
                <span
                  className={`px-1.5 py-0.5 rounded-full font-mono text-xs ${
                    tab === "past"
                      ? "bg-saffron-light text-saffron-dark"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {past.length}
                </span>
              </button>
            </div>

            <p className="caption hidden sm:block">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="p-6" ref={resultsRef}>
          {tab === "upcoming" &&
            (filtered.length === 0 ? (
              <div className="text-center py-24">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "#F5F5F4",
                    border: "1px solid #E7E5E4",
                  }}
                >
                  <Calendar className="w-7 h-7 text-stone-300" />
                </div>
                <p className="font-display text-2xl text-stone-300 mb-2">
                  No upcoming events
                </p>
                <p className="caption">
                  Check back soon or browse past events
                </p>
                <button
                  onClick={() => setTab("past")}
                  className="mt-4 btn btn-outline text-sm"
                >
                  Browse past events
                </button>
              </div>
            ) : (
              <div className="max-w-2xl">
                <div className="flex flex-col">
                  {filtered.map((event, i) => {
                    const d = new Date(event.date);
                    const day = d.toLocaleDateString("en-IN", {
                      day: "2-digit",
                    });
                    const mon = d
                      .toLocaleDateString("en-IN", {
                        month: "short",
                      })
                      .toUpperCase();
                    const yr = d.getFullYear();
                    const daysUntil = Math.ceil(
                      (new Date(event.date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    );

                    return (
                      <div
                        key={event.id}
                        className="group flex items-start gap-6 py-5 border-b border-stone-100 last:border-0 hover:bg-white -mx-2 px-2 rounded-xl transition-colors cursor-default"
                      >
                        <div
                          className="shrink-0 w-14 text-center rounded-xl py-2 border"
                          style={{
                            background:
                              i === 0 ? "#FFF7ED" : "white",
                            borderColor:
                              i === 0
                                ? "rgba(232,130,12,0.3)"
                                : "#E7E5E4",
                          }}
                        >
                          <p
                            className="num text-2xl leading-none"
                            style={{
                              color:
                                i === 0 ? "#E8820C" : "#0C0A09",
                            }}
                          >
                            {day}
                          </p>
                          <p
                            className="font-mono font-semibold mt-0.5"
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.06em",
                              color:
                                i === 0 ? "#E8820C" : "#78716C",
                            }}
                          >
                            {mon}
                          </p>
                          <p
                            className="caption"
                            style={{ fontSize: "10px" }}
                          >
                            {yr}
                          </p>
                        </div>

                        <div
                          className="w-px self-stretch mt-2 shrink-0 group-hover:bg-saffron transition-colors duration-300"
                          style={{ background: "#E7E5E4" }}
                        />

                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className={`badge capitalize ${
                                event.type === "technical" ||
                                event.type === "workshop"
                                  ? "badge-saffron"
                                  : "badge-idle"
                              }`}
                            >
                              {event.type}
                            </span>
                            {event.is_official && (
                              <span className="badge badge-idle">
                                Official
                              </span>
                            )}
                            {daysUntil <= 7 && daysUntil >= 0 && (
                              <span className="badge badge-saffron">
                                {daysUntil === 0
                                  ? "Today"
                                  : `In ${daysUntil}d`}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-stone-950 text-sm leading-snug mb-1.5 group-hover:text-saffron-dark transition-colors">
                            {event.title}
                          </h3>
                          <p className="caption">{event.location}</p>
                          {event.participants && (
                            <p className="caption mt-0.5">
                              ~{event.participants} participants
                              expected
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {tab === "past" &&
            (filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl text-stone-300 mb-2">
                  No results
                </p>
                <p className="caption mb-4">
                  Try adjusting your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-outline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    department={dept(event.dept_id)}
                  />
                ))}
              </div>
            ))}

          {tab === "past" && (
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
          )}
        </div>
      </div>
    </div>
  );
}
