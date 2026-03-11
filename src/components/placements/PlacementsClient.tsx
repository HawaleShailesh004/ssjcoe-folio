"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlacementCard } from "@/components/placements/PlacementCard";
import { PlacementTrendChart } from "@/components/placements/PlacementTrendChart";
import { PlacementDetailModal } from "@/components/placements/PlacementDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, GraduationCap, TrendingUp, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Placement, Department } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  initialPlacements: Placement[];
  years: number[];
  stats: {
    avg: number;
    highest: number;
    companies: number;
    yearlyTrend: { year: number; count: number; avg: number; highest: number }[];
  };
  departments: Department[];
}

export function PlacementsClient({
  initialPlacements,
  years,
  stats,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string>("all");
  const [deptId, setDeptId] = useState<string>("all");
  const [minPkg, setMinPkg] = useState<string>("0");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Placement | null>(null);

  const filtered = useMemo(() => {
    return initialPlacements.filter((p) => {
      const pkg = Number(p.package_lpa) || 0;
      const matchSearch =
        !search ||
        p.student_name.toLowerCase().includes(search.toLowerCase()) ||
        p.company.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase());

      const matchYear = year === "all" || Number(p.year) === Number(year);
      const matchDept = deptId === "all" || p.dept_id === deptId;
      const matchPkg = pkg >= Number(minPkg);

      return matchSearch && matchYear && matchDept && matchPkg;
    });
  }, [initialPlacements, search, year, deptId, minPkg]);

  const hasFilters =
    search !== "" || year !== "all" || deptId !== "all" || minPkg !== "0";

  const clearFilters = () => {
    setSearch("");
    setYear("all");
    setDeptId("all");
    setMinPkg("0");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Placements"
        description="Verified placement records from SSJCOE across all departments."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Placed"
          value={initialPlacements.length}
          unit="students"
          icon={<GraduationCap className="w-5 h-5" />}
        />
        <StatCard
          label="Avg Package"
          value={stats.avg}
          unit="LPA"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Highest Package"
          value={stats.highest}
          unit="LPA"
          icon={<Award className="w-5 h-5" />}
        />
        <StatCard
          label="Companies"
          value={stats.companies}
          unit="unique"
          icon={<Building2 className="w-5 h-5" />}
        />
      </div>

      {stats.yearlyTrend.length > 1 && (
        <div className="card-base p-6 mb-8">
          <h3 className="font-semibold text-brand-black mb-4">
            Placement trend
          </h3>
          <PlacementTrendChart data={stats.yearlyTrend} />
        </div>
      )}

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search student, company, role..."
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

              <Select value={minPkg} onValueChange={setMinPkg}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="Min package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any package</SelectItem>
                  <SelectItem value="3">3+ LPA</SelectItem>
                  <SelectItem value="5">5+ LPA</SelectItem>
                  <SelectItem value="8">8+ LPA</SelectItem>
                  <SelectItem value="12">12+ LPA</SelectItem>
                  <SelectItem value="20">20+ LPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
          <p className="text-sm text-brand-muted">
            <span className="font-semibold text-brand-black font-mono">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "result" : "results"}
            {hasFilters && " matching filters"}
          </p>
          <div className="flex items-center gap-1 bg-brand-bg rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("grid")}
              className={cn(
                "h-7 w-7 p-0",
                view === "grid" && "bg-white shadow-sm text-brand-black"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("list")}
              className={cn(
                "h-7 w-7 p-0",
                view === "list" && "bg-white shadow-sm text-brand-black"
              )}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No placements found"
          description={
            hasFilters
              ? "No placements match your current filters. Try adjusting them."
              : "No approved placements yet."
          }
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {filtered.map((p) => (
            <PlacementCard
              key={p.id}
              placement={p}
              view={view}
              department={departments.find((d) => d.id === p.dept_id)}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      )}

      {selected && (
        <PlacementDetailModal
          placement={selected}
          department={departments.find((d) => d.id === selected.dept_id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
