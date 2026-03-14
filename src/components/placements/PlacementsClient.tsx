"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlacementCard } from "@/components/placements/PlacementCard";
import { PlacementTrendChart } from "@/components/placements/PlacementTrendChart";
import { PlacementDetailModal } from "@/components/placements/PlacementDetailModal";
import { LayoutGrid, List } from "lucide-react";
import type { Placement, Department } from "@/types";

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
  const [year, setYear] = useState("all");
  const [deptId, setDeptId] = useState("all");
  const [minPkg, setMinPkg] = useState("0");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selected, setSelected] = useState<Placement | null>(null);

  const filtered = useMemo(
    () =>
      initialPlacements.filter((p) => {
        const q = search.toLowerCase();
        return (
          (!search ||
            p.student_name.toLowerCase().includes(q) ||
            p.company.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q)) &&
          (year === "all" || Number(p.year) === Number(year)) &&
          (deptId === "all" || p.dept_id === deptId) &&
          Number(p.package_lpa) >= Number(minPkg)
        );
      }),
    [initialPlacements, search, year, deptId, minPkg]
  );

  const hasFilters =
    search !== "" || year !== "all" || deptId !== "all" || minPkg !== "0";

  const clear = () => {
    setSearch("");
    setYear("all");
    setDeptId("all");
    setMinPkg("0");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Placements"
        description="Verified placement records across all departments."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
        count={initialPlacements.length}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 border border-stone-200 rounded-lg overflow-hidden mb-12">
        {[
          { label: "Total placed", value: initialPlacements.length },
          { label: "Avg. package", value: stats.avg, unit: "LPA" },
          { label: "Highest package", value: stats.highest, unit: "LPA" },
          { label: "Companies", value: stats.companies },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6">
            <p className="label mb-3">{s.label}</p>
            <p className="num text-4xl">
              {s.value}
              {s.unit && (
                <span className="text-base font-sans font-normal text-stone-500 ml-1.5">
                  {s.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {stats.yearlyTrend.length > 1 && (
        <div className="card p-6 mb-10">
          <p className="label mb-6">Placement trend</p>
          <PlacementTrendChart data={stats.yearlyTrend} />
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search student, company, role..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel="placements"
        >
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:border-saffron text-stone-800"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:border-saffron text-stone-800"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code}
              </option>
            ))}
          </select>

          <select
            value={minPkg}
            onChange={(e) => setMinPkg(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:border-saffron text-stone-800"
          >
            <option value="0">Any package</option>
            <option value="3">3+ LPA</option>
            <option value="5">5+ LPA</option>
            <option value="8">8+ LPA</option>
            <option value="12">12+ LPA</option>
          </select>
        </FilterBar>

        <div className="flex items-center border border-stone-200 rounded overflow-hidden self-start">
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === v
                  ? "bg-stone-950 text-white"
                  : "bg-white text-stone-600 hover:text-stone-950"
              }`}
            >
              {v === "list" ? (
                <List className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No placements found"
          description={
            hasFilters
              ? "Try adjusting your filters."
              : "No approved placements yet."
          }
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={clear}
                className="text-sm text-saffron hover:text-saffron-dark hover:underline"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : view === "list" ? (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Role</th>
                <th>Dept</th>
                <th>Year</th>
                <th className="text-right">Package</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer"
                >
                  <td className="font-medium text-stone-950">{p.student_name}</td>
                  <td className="text-saffron-dark font-medium">{p.company}</td>
                  <td className="text-stone-600">{p.role}</td>
                  <td className="text-stone-500 font-mono text-xs">
                    {departments.find((d) => d.id === p.dept_id)?.code ?? "—"}
                  </td>
                  <td className="text-stone-600 font-mono">{p.year}</td>
                  <td className="text-right font-mono font-semibold text-stone-950">
                    ₹{p.package_lpa} LPA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PlacementCard
              key={p.id}
              placement={p}
              view="grid"
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
