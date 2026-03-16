"use client";

import { useState, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, LayoutList, LayoutGrid, X } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { PlacementDetailModal } from "./PlacementDetailModal";
import { normalizeImageUrl } from "@/lib/images";
import type { Placement, Department } from "@/types";

interface Props {
  placements: Placement[];
  departments: Department[];
}

const PKG_RANGES = [
  { label: "All",    min: 0,  max: Infinity },
  { label: "3–5",   min: 3,  max: 5        },
  { label: "5–8",   min: 5,  max: 8        },
  { label: "8–12",  min: 8,  max: 12       },
  { label: "12+",   min: 12, max: Infinity },
];

export function PlacementsClient({ placements, departments }: Props) {
  const [search,   setSearch]   = useState("");
  const [deptId,   setDeptId]   = useState("");
  const [year,     setYear]     = useState("");
  const [pkgRange, setPkgRange] = useState(0);
  const [view,     setView]     = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<Placement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() =>
    [...new Set(placements.map((p) => p.year))].sort((a, b) => b - a),
    [placements]
  );

  const filtered = useMemo(() => {
    const range = PKG_RANGES[pkgRange];
    const pkg = (p: Placement) => p.package_lpa ?? 0;
    return placements.filter((p) => {
      if (search && ![p.student_name, p.company, p.role].some(
        (f) => f?.toLowerCase().includes(search.toLowerCase())
      )) return false;
      if (deptId && p.dept_id !== deptId) return false;
      if (year && String(p.year) !== year) return false;
      if (pkg(p) < range.min || pkg(p) > range.max) return false;
      return true;
    });
  }, [placements, search, deptId, year, pkgRange]);

  const PAGE_SIZE = view === "list" ? 15 : 12;
  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered, PAGE_SIZE);

  const resetAll = () => { setSearch(""); setDeptId(""); setYear(""); setPkgRange(0); reset(); };
  const hasFilters = search || deptId || year || pkgRange !== 0;

  const dept = (id: string) => departments.find((d) => d.id === id);

  return (
    <>
      <div className="flex min-h-screen">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-64 shrink-0 self-start border-r border-stone-200 bg-white sticky top-14 z-10"
          style={{ height: "calc(100vh - 3.5rem)", overflowY: "auto" }}
        >
          <div className="p-5 border-b border-stone-100">
            <div className="flex items-center justify-between mb-1">
              <p className="label">Filters</p>
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="caption text-saffron hover:text-saffron-dark transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <p className="caption">{filtered.length} of {placements.length} results</p>
          </div>

          <div className="p-5 space-y-6">
            {/* Search */}
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); reset(); }}
                  placeholder="Name, company, role…"
                  className="input w-full pl-9"
                  style={{ height: "36px", fontSize: "13px" }}
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Department</p>
              <select
                value={deptId}
                onChange={(e) => { setDeptId(e.target.value); reset(); }}
                className="select w-full"
                style={{ height: "36px", fontSize: "13px" }}
              >
                <option value="">All departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Batch year</p>
              <select
                value={year}
                onChange={(e) => { setYear(e.target.value); reset(); }}
                className="select w-full"
                style={{ height: "36px", fontSize: "13px" }}
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Package range */}
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Package range</p>
              <div className="flex flex-wrap gap-1.5">
                {PKG_RANGES.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => { setPkgRange(i); reset(); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      pkgRange === i
                        ? "bg-saffron-light border-saffron/40 text-saffron-dark"
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {r.label === "All" ? r.label : `${r.label} LPA`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ───────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 bg-stone-50">

          {/* Toolbar */}
          <div className="sticky top-14 z-20 bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between gap-4">
            <p className="caption">
              Showing{" "}
              <span className="font-semibold text-stone-700">
                {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>
              {" "}of{" "}
              <span className="font-semibold text-stone-700">{filtered.length}</span>
              {" "}placements
            </p>

            {/* Mobile filter button */}
            <button className="lg:hidden flex items-center gap-2 btn btn-outline h-8 px-3 text-xs" type="button">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* View toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => { setView("list"); reset(); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  view === "list"
                    ? "bg-saffron-light border-saffron/30 text-saffron"
                    : "border-stone-200 text-stone-400 hover:border-stone-300"
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setView("grid"); reset(); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  view === "grid"
                    ? "bg-saffron-light border-saffron/30 text-saffron"
                    : "border-stone-200 text-stone-400 hover:border-stone-300"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6" ref={resultsRef}>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-3xl text-stone-300 mb-3">No results</p>
                <p className="caption mb-4">Try adjusting your filters</p>
                <button type="button" onClick={resetAll} className="btn btn-outline">Clear filters</button>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-2">
                {paginated.map((p) => (
                  <PlacementRow
                    key={p.id}
                    placement={p}
                    department={dept(p.dept_id)}
                    isSelected={selected?.id === p.id}
                    onClick={() => setSelected(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {paginated.map((p) => (
                  <PlacementGridCard
                    key={p.id}
                    placement={p}
                    department={dept(p.dept_id)}
                    onClick={() => setSelected(p)}
                  />
                ))}
              </div>
            )}

            <PaginationBar
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <PlacementDetailModal
          placement={selected}
          department={dept(selected.dept_id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

/* ── List row ─────────────────────────────────────────────────────────── */
function PlacementRow({
  placement: p,
  department,
  isSelected,
  onClick,
}: {
  placement: Placement;
  department?: Department;
  isSelected: boolean;
  onClick: () => void;
}) {
  const photoUrl = normalizeImageUrl(p.photo_url) ?? p.photo_url;
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group relative flex items-center gap-4 px-5 py-4 rounded-xl border bg-white cursor-pointer
        transition-all duration-150 overflow-hidden
        ${isSelected
          ? "border-saffron/50 shadow-sm"
          : "border-stone-200 hover:border-stone-300 hover:shadow-sm hover:-translate-y-px"
        }`}
    >
      {/* Left accent */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 bg-saffron transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center">
        {photoUrl ? (
          <img src={photoUrl} alt={p.student_name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-lg text-stone-400">{p.student_name.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-950 text-sm truncate">{p.student_name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs font-semibold text-saffron-dark">{p.company}</span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="text-xs text-stone-500 truncate">{p.role}</span>
          {department && (
            <>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span
                className="font-mono px-1.5 py-px rounded text-stone-500"
                style={{ fontSize: "10px", background: "#F5F5F4", border: "1px solid #E7E5E4" }}
              >
                {department.code}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <p
          className="font-mono font-semibold"
          style={{ fontSize: "15px", color: "#15803D" }}
        >
          ₹{p.package_lpa} LPA
        </p>
        <p className="font-mono" style={{ fontSize: "11px", color: "#A8A29E" }}>{p.year}</p>
      </div>
    </div>
  );
}

/* ── Grid card ────────────────────────────────────────────────────────── */
function PlacementGridCard({
  placement: p,
  department,
  onClick,
}: {
  placement: Placement;
  department?: Department;
  onClick: () => void;
}) {
  const photoUrl = normalizeImageUrl(p.photo_url) ?? p.photo_url;
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="card group cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt={p.student_name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-xl text-stone-400">{p.student_name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-950 text-sm truncate">{p.student_name}</p>
          <p className="text-xs font-semibold text-saffron-dark mt-0.5">{p.company}</p>
        </div>
      </div>

      <p className="text-xs text-stone-500 mb-4 truncate">{p.role}</p>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          {department && (
            <span
              className="font-mono px-1.5 py-px rounded text-stone-500"
              style={{ fontSize: "10px", background: "#F5F5F4", border: "1px solid #E7E5E4" }}
            >
              {department.code}
            </span>
          )}
          <span className="font-mono" style={{ fontSize: "11px", color: "#A8A29E" }}>{p.year}</span>
        </div>
        <p
          className="font-mono font-semibold"
          style={{ fontSize: "14px", color: "#15803D" }}
        >
          ₹{p.package_lpa} LPA
        </p>
      </div>
    </div>
  );
}
