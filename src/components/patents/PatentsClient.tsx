"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PatentCard } from "@/components/patents/PatentCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import type { Patent, Department, PatentStatus } from "@/types";

interface Props {
  initialPatents: Patent[];
  departments: Department[];
}

export function PatentsClient({
  initialPatents,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PatentStatus | "all">("all");
  const [deptId, setDeptId] = useState("all");

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

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setDeptId("all");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Patents"
        description={`${initialPatents.length} patents filed by SSJCOE faculty and students.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Patents" }]}
      />

      <div className="flex flex-wrap gap-3 mb-8">
        {(["filed", "published", "granted"] as const).map((s) => {
          const count = initialPatents.filter(
            (p) => p.patent_status === s
          ).length;
          const colors = {
            filed: "bg-blue-50 text-blue-700 border-blue-200",
            published: "bg-amber-50 text-amber-700 border-amber-200",
            granted: "bg-green-50 text-green-700 border-green-200",
          };
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(status === s ? "all" : s)}
              className={`border px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${colors[s]} ${status === s ? "ring-2 ring-offset-1 ring-current" : ""}`}
            >
              {s} · {count}
            </button>
          );
        })}
      </div>

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search patent title or inventor..."
          hasActiveFilters={hasFilters}
          onClear={clearFilters}
          filters={
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
          }
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No patents found"
          icon={<Award className="w-6 h-6" />}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
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
