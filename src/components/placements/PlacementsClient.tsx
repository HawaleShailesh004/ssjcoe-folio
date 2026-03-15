"use client";

import { useMemo, useRef, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { FilterBar } from "@/components/shared/FilterBar";
import { PlacementCard } from "@/components/placements/PlacementCard";
import type { Placement, Department } from "@/types";
import { normalizeImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

interface Props {
  placements: Placement[];
  years: number[];
  departments: Department[];
}

export function PlacementsClient({
  placements,
  years,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [deptId, setDeptId] = useState("");
  const [minPkg, setMinPkg] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const resultsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return placements.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.student_name?.toLowerCase().includes(q) &&
          !p.company?.toLowerCase().includes(q) &&
          !p.role?.toLowerCase().includes(q)
        )
          return false;
      }
      if (year && p.year !== Number(year)) return false;
      if (deptId && p.dept_id !== deptId) return false;
      if (minPkg && (p.package_lpa ?? 0) < Number(minPkg)) return false;
      return true;
    });
  }, [placements, search, year, deptId, minPkg]);

  const PAGE_SIZE = view === "list" ? 20 : 12;
  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    PAGE_SIZE
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    reset();
  };
  const handleYearChange = (val: string) => {
    setYear(val);
    reset();
  };
  const handleDeptChange = (val: string) => {
    setDeptId(val);
    reset();
  };
  const handlePkgChange = (val: string) => {
    setMinPkg(val);
    reset();
  };

  const hasFilters =
    search !== "" || year !== "" || deptId !== "" || minPkg !== "";

  const clear = () => {
    setSearch("");
    setYear("");
    setDeptId("");
    setMinPkg("");
  };

  return (
    <div>
      {/* Year pills — same pattern as Achievements */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleYearChange("")}
          className={cn(
            "badge transition-all",
            year === "" ? "ring-2 ring-offset-1 ring-current" : "",
            "badge-idle"
          )}
        >
          All · {placements.length}
        </button>
        {years.map((y) => {
          const count = placements.filter((p) => p.year === y).length;
          if (!count) return null;
          const active = year === String(y);
          return (
            <button
              key={y}
              type="button"
              onClick={() => handleYearChange(String(y))}
              className={cn(
                "badge transition-all",
                active ? "ring-2 ring-offset-1 ring-current" : "",
                "badge-idle"
              )}
            >
              {y} · {count}
            </button>
          );
        })}
      </div>

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          placeholder="Search name, company, role..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel={filtered.length === 1 ? "placement" : "placements"}
        >
          <select
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="select max-w-[120px]"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={deptId}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="select max-w-[140px]"
          >
            <option value="">All depts</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code}
              </option>
            ))}
          </select>
          <select
            value={minPkg}
            onChange={(e) => handlePkgChange(e.target.value)}
            className="select max-w-[120px]"
          >
            <option value="">Min LPA</option>
            {[3, 5, 8, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                ≥{n} LPA
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                setView("grid");
                reset();
              }}
              className={`btn ${view === "grid" ? "btn-primary" : "btn-outline"}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => {
                setView("list");
                reset();
              }}
              className={`btn ${view === "list" ? "btn-primary" : "btn-outline"}`}
            >
              List
            </button>
          </div>
        </FilterBar>
      </div>

      <div ref={resultsRef}>
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((p) => {
              const dept = departments.find((d) => d.id === p.dept_id);
              return (
                <PlacementCard
                  key={p.id}
                  placement={{
                    ...p,
                    photo_url: normalizeImageUrl(p.photo_url) ?? p.photo_url,
                  }}
                  view="grid"
                  department={dept}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginated.map((p) => {
              const dept = departments.find((d) => d.id === p.dept_id);
              return (
                <PlacementCard
                  key={p.id}
                  placement={{
                    ...p,
                    photo_url: normalizeImageUrl(p.photo_url) ?? p.photo_url,
                  }}
                  view="list"
                  department={dept}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        )}

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
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
