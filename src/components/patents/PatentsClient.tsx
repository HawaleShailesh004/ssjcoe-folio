"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PatentCard } from "@/components/patents/PatentCard";
import type { Patent, Department, PatentStatus } from "@/types";

interface Props {
  initialPatents: Patent[];
  departments: Department[];
}

export function PatentsClient({
  initialPatents,
  departments,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PatentStatus | "all">("all");
  const [deptId, setDeptId] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return initialPatents.filter((p) => {
      const inventors = Array.isArray(p.inventors) ? p.inventors : [];
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        inventors.some((i) =>
          String(i).toLowerCase().includes(search.toLowerCase())
        );

      const matchStatus = status === "all" || p.patent_status === status;
      const matchDept = deptId === "all" || p.dept_id === deptId;

      return matchSearch && matchStatus && matchDept;
    });
  }, [initialPatents, search, status, deptId]);

  const hasFilters =
    search !== "" || status !== "all" || deptId !== "all";

  const clear = () => {
    setSearch("");
    setStatus("all");
    setDeptId("all");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Patents"
        description={`${initialPatents.length} patents filed by SSJCOE faculty and students.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Patents" }]}
        count={initialPatents.length}
      />

      {/* Defer filter UI to avoid hydration mismatch from extensions (e.g. fdprocessedid on inputs/buttons) */}
      {mounted ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {(["filed", "published", "granted"] as const).map((s) => {
              const count = initialPatents.filter(
                (p) => p.patent_status === s
              ).length;
              const active = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(active ? "all" : s)}
                  className={`badge capitalize transition-all ${active ? "ring-2 ring-offset-1 ring-current" : ""} ${
                    s === "filed"
                      ? "badge-idle"
                      : s === "published"
                        ? "badge-warn"
                        : "badge-ok"
                  }`}
                >
                  {s} · {count}
                </button>
              );
            })}
          </div>

          <div className="card p-4 mb-6">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              placeholder="Search patent title or inventor..."
              hasFilters={hasFilters}
              onClear={clear}
              resultCount={filtered.length}
              resultLabel="patents"
            >
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
        </>
      ) : (
        <div className="mb-6 space-y-2" aria-hidden>
          <div className="h-9 w-48 rounded bg-ink-8" />
          <div className="card p-4 h-14" />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No patents found"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((patent) => (
            <PatentCard
              key={patent.id}
              patent={patent}
              department={departments.find((d) => d.id === patent.dept_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
