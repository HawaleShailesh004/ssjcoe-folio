"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
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

  const clear = () => {
    setSearch("");
    setDeptId("all");
    setDesig("all");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Faculty"
        description={`${initialFaculty.length} faculty members across all departments.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Faculty" }]}
        count={initialFaculty.length}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setDeptId("all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
            deptId === "all"
              ? "bg-ink text-white border-ink"
              : "bg-white text-ink-4 border-ink-7 hover:border-ink-6"
          )}
        >
          All · {initialFaculty.length}
        </button>
        {departments.map((d) => {
          const count = initialFaculty.filter((f) => f.dept_id === d.id).length;
          if (!count) return null;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDeptId(d.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                deptId === d.id
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink-4 border-ink-7 hover:border-ink-6"
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
          onSearchChange={setSearch}
          placeholder="Search by name or specialization..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={sorted.length}
          resultLabel={sorted.length === 1 ? "faculty" : "faculty"}
        >
          <select
            value={desig}
            onChange={(e) => setDesig(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink text-ink-3"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              department={departments.find((d) => d.id === f.dept_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
