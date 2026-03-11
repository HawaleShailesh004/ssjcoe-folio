"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { FacultyCard } from "@/components/faculty/FacultyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import type { Faculty, Department } from "@/types";

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

  const clearFilters = () => {
    setSearch("");
    setDeptId("all");
    setDesig("all");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Faculty"
        description={`${initialFaculty.length} faculty members across all departments.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Faculty" }]}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setDeptId("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${deptId === "all" ? "bg-brand-black text-white border-brand-black" : "bg-white text-brand-muted border-brand-border hover:border-brand-slate"}`}
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${deptId === d.id ? "bg-brand-black text-white border-brand-black" : "bg-white text-brand-muted border-brand-border hover:border-brand-slate"}`}
            >
              {d.code} · {count}
            </button>
          );
        })}
      </div>

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or specialization..."
          hasActiveFilters={hasFilters}
          onClear={clearFilters}
          filters={
            <Select value={desig} onValueChange={setDesig}>
              <SelectTrigger className="w-52 h-9 text-sm">
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All designations</SelectItem>
                {designations.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No faculty found"
          icon={<Users className="w-6 h-6" />}
        />
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
