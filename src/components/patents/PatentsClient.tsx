"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { PatentDetailModal } from "./PatentDetailModal";
import type { Patent, Department } from "@/types";

interface Props {
  patents: Patent[];
  departments: Department[];
}

const STATUS_STYLES: Record<string, string> = {
  granted:   "badge-ok",
  published: "badge-saffron",
  filed:     "badge-idle",
};

export function PatentsClient({ patents, departments }: Props) {
  const [search,  setSearch]  = useState("");
  const [deptId,  setDeptId]  = useState("");
  const [status,  setStatus]  = useState("");
  const [selected, setSelected] = useState<Patent | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() =>
    patents.filter((p) => {
      const inv = (p.inventors ?? []).map((i) => String(i).toLowerCase());
      if (search && ![p.title, ...inv].some(
        (f) => f?.toLowerCase().includes(search.toLowerCase())
      )) return false;
      if (deptId && p.dept_id !== deptId) return false;
      if (status && p.patent_status !== status) return false;
      return true;
    }),
    [patents, search, deptId, status]
  );

  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered, 12);
  const dept = (id: string) => departments.find((d) => d.id === id);
  const hasFilters = search || deptId || status;

  const clearAll = () => { setSearch(""); setDeptId(""); setStatus(""); reset(); };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 shrink-0 self-start border-r border-stone-200 bg-white sticky top-14 z-10"
          style={{ height: "calc(100vh - 3.5rem)", overflowY: "auto" }}
        >
          <div className="p-5 border-b border-stone-100">
            <div className="flex items-center justify-between mb-1">
              <p className="label">Filters</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="caption text-saffron flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <p className="caption">{filtered.length} of {patents.length} patents</p>
          </div>

          <div className="p-5 space-y-6">
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); reset(); }}
                  placeholder="Title or inventor…"
                  className="input w-full pl-9"
                  style={{ height: "36px", fontSize: "13px" }}
                />
              </div>
            </div>

            <div>
              <p className="caption mb-2 font-medium text-stone-600">Department</p>
              <select
                value={deptId}
                onChange={(e) => { setDeptId(e.target.value); reset(); }}
                className="select w-full"
                style={{ height: "36px", fontSize: "13px" }}
              >
                <option value="">All departments</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}
              </select>
            </div>

            <div>
              <p className="caption mb-2 font-medium text-stone-600">Status</p>
              <div className="flex flex-col gap-1.5">
                {["granted", "published", "filed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setStatus(status === s ? "" : s); reset(); }}
                    className={`badge text-left capitalize ${
                      status === s
                        ? STATUS_STYLES[s]
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 bg-stone-50">
          <div className="sticky top-14 z-20 bg-white border-b border-stone-200 px-6 py-3">
            <p className="caption">
              <span className="font-semibold text-stone-700">{filtered.length}</span> patents
            </p>
          </div>

          <div className="p-6" ref={resultsRef}>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-3xl text-stone-300 mb-3">No results</p>
                <p className="caption">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paginated.map((patent) => (
                  <PatentRow
                    key={patent.id}
                    patent={patent}
                    department={dept(patent.dept_id)}
                    isSelected={selected?.id === patent.id}
                    onClick={() => setSelected(patent)}
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
              pageSize={12}
            />
          </div>
        </div>
      </div>

      {selected && (
        <PatentDetailModal
          patent={selected}
          department={dept(selected.dept_id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function PatentRow({
  patent: p,
  department,
  isSelected,
  onClick,
}: {
  patent: Patent;
  department?: Department;
  isSelected: boolean;
  onClick: () => void;
}) {
  const inventors = p.inventors ?? [];
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group relative bg-white rounded-xl border cursor-pointer
        transition-all duration-150 overflow-hidden
        ${isSelected
          ? "border-saffron/50 shadow-sm"
          : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
        }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 bg-saffron transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="px-5 py-4 pl-6 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`badge capitalize ${STATUS_STYLES[p.patent_status] ?? "badge-idle"}`}>
              {p.patent_status}
            </span>
            {department && (
              <span className="font-mono text-xs text-stone-400">{department.code}</span>
            )}
            <span className="font-mono text-xs text-stone-400">{p.year ?? "—"}</span>
          </div>
          <h3 className="font-semibold text-stone-950 text-sm leading-snug group-hover:text-saffron-dark transition-colors mb-1.5">
            {p.title}
          </h3>
          <p className="text-xs text-stone-500">
            {inventors.slice(0, 3).join(", ")}{inventors.length > 3 ? ` +${inventors.length - 3}` : ""}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-xs text-stone-400">{p.patent_number ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
