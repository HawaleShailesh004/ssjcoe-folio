"use client";

import { useState, useMemo, useRef } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import type { Faculty, Department } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  initialFaculty: Faculty[];
  departments: Department[];
}

export function FacultyClient({
  initialFaculty,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [deptId, setDeptId] = useState("all");
  const [desig, setDesig] = useState("all");

  const designations = useMemo(
    () => [...new Set(initialFaculty.map((f) => f.designation))].sort(),
    [initialFaculty]
  );

  const filtered = useMemo(() => {
    return initialFaculty.filter((f) => {
      const specialization = Array.isArray(f.specialization)
        ? f.specialization
        : [];
      const matchSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        specialization.some((s) =>
          String(s).toLowerCase().includes(search.toLowerCase())
        );

      const matchDept = deptId === "all" || f.dept_id === deptId;
      const matchDesig = desig === "all" || f.designation === desig;

      return matchSearch && matchDept && matchDesig;
    });
  }, [initialFaculty, search, deptId, desig]);

  const hasFilters =
    search !== "" || deptId !== "all" || desig !== "all";

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => (b.is_hod ? 1 : 0) - (a.is_hod ? 1 : 0)),
    [filtered]
  );

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    sorted,
    16
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (v: string) => {
    setSearch(v);
    reset();
  };
  const handleDept = (v: string) => {
    setDeptId(v);
    reset();
  };
  const handleDesig = (v: string) => {
    setDesig(v);
    reset();
  };

  const clear = () => {
    setSearch("");
    setDeptId("all");
    setDesig("all");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleDept("all")}
          className={cn(
            "badge transition-all",
            deptId === "all" ? "ring-2 ring-offset-1 ring-current" : "",
            "badge-idle"
          )}
        >
          All · {initialFaculty.length}
        </button>
        {departments.map((d) => {
          const count = initialFaculty.filter((f) => f.dept_id === d.id).length;
          if (!count) return null;
          const active = deptId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => handleDept(d.id)}
              className={cn(
                "badge transition-all",
                active ? "ring-2 ring-offset-1 ring-current" : "",
                "badge-idle"
              )}
            >
              {d.code} · {count}
            </button>
          );
        })}
      </div>

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearch}
          placeholder="Search by name or specialization..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={sorted.length}
          resultLabel={sorted.length === 1 ? "faculty" : "faculty"}
        >
          <select
            value={desig}
            onChange={(e) => setDesig(e.target.value)}
            className="select"
          >
            <option value="all">All designations</option>
            {designations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FilterBar>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="No faculty found" />
      ) : (
        <div ref={resultsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((f) => (
              <FacultyCard
                key={f.id}
                faculty={f}
                department={departments.find((d) => d.id === f.dept_id)}
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
            totalItems={sorted.length}
            pageSize={16}
          />
        </div>
      )}
    </>
  );
}
