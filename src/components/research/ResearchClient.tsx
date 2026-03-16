"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X, Quote, Users, BookOpen } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { ResearchDetailModal } from "./ResearchDetailModal";
import { IMAGES } from "@/lib/images";
import type { ResearchPaper, Department } from "@/types";

interface Props {
  papers: ResearchPaper[];
  departments: Department[];
}

export function ResearchClient({ papers, departments }: Props) {
  const [search,   setSearch]   = useState("");
  const [deptId,   setDeptId]   = useState("");
  const [year,     setYear]     = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<ResearchPaper | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() =>
    [...new Set(papers.map((p) => p.category).filter(Boolean))].sort(),
    [papers]
  );

  const years = useMemo(() =>
    [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a),
    [papers]
  );

  const filtered = useMemo(() =>
    papers.filter((p) => {
      const q = search.toLowerCase();
      if (search && ![p.title, p.journal, ...(p.authors ?? [])].some(
        (f) => String(f ?? "").toLowerCase().includes(q)
      )) return false;
      if (deptId && p.dept_id !== deptId) return false;
      if (year && String(p.year) !== year) return false;
      if (category && p.category !== category) return false;
      return true;
    }),
    [papers, search, deptId, year, category]
  );

  const { page, setPage, totalPages, paginated, reset } = usePagination(filtered, 10);
  const dept = (id: string) => departments.find((d) => d.id === id);
  const hasFilters = search || deptId || year || category;

  const clearAll = () => { setSearch(""); setDeptId(""); setYear(""); setCategory(""); reset(); };

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
                  className="caption text-saffron hover:text-saffron-dark flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <p className="caption">{filtered.length} of {papers.length} papers</p>
          </div>

          <div className="p-5 space-y-6">
            <div>
              <p className="caption mb-2 font-medium text-stone-600">Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); reset(); }}
                  placeholder="Title, author, journal…"
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
              <p className="caption mb-2 font-medium text-stone-600">Year</p>
              <select
                value={year}
                onChange={(e) => { setYear(e.target.value); reset(); }}
                className="select w-full"
                style={{ height: "36px", fontSize: "13px" }}
              >
                <option value="">All years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <p className="caption mb-2 font-medium text-stone-600">Category</p>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); reset(); }}
                className="select w-full"
                style={{ height: "36px", fontSize: "13px" }}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 bg-stone-50">
          <div className="sticky top-14 z-20 bg-white border-b border-stone-200 px-6 py-3">
            <p className="caption">
              <span className="font-semibold text-stone-700">{filtered.length}</span> papers
            </p>
          </div>

          <div className="p-6" ref={resultsRef}>
            {filtered.length === 0 ? (
              <div className="text-center py-24 relative overflow-hidden rounded-2xl bg-stone-50 border border-stone-200">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-[0.05]"
                  style={{ backgroundImage: `url('${IMAGES.campus_ai}')` }}
                />
                <p className="font-display text-3xl text-stone-300 mb-3 relative z-10">No results</p>
                <p className="caption relative z-10">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paginated.map((paper) => (
                  <ResearchRow
                    key={paper.id}
                    paper={paper}
                    department={dept(paper.dept_id)}
                    isSelected={selected?.id === paper.id}
                    onClick={() => setSelected(paper)}
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
              pageSize={10}
            />
          </div>
        </div>
      </div>

      {selected && (
        <ResearchDetailModal
          paper={selected}
          department={dept(selected.dept_id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

/* ── Research row — scan optimised ──────────────────────────────────── */
function ResearchRow({
  paper: p,
  department,
  isSelected,
  onClick,
}: {
  paper: ResearchPaper;
  department?: Department;
  isSelected: boolean;
  onClick: () => void;
}) {
  const authors = p.authors ?? [];
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

      <div className="px-5 py-4 pl-6">
        {/* Top row — category + dept + year */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {p.category && (
            <span className="badge badge-idle">{p.category}</span>
          )}
          {department && (
            <span className="font-mono text-xs text-stone-400">{department.code}</span>
          )}
          <span className="font-mono text-xs text-stone-400">{p.year}</span>
          {p.citations > 0 && (
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Quote className="w-3 h-3" /> {p.citations} citations
            </span>
          )}
        </div>

        {/* Title — the most important thing */}
        <h3 className="font-semibold text-stone-950 text-sm leading-snug mb-2 group-hover:text-saffron-dark transition-colors">
          {p.title}
        </h3>

        {/* Authors + journal on one line */}
        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 shrink-0" />
            {authors.slice(0, 2).join(", ")}{authors.length > 2 ? ` +${authors.length - 2}` : ""}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="flex items-center gap-1 italic">
            <BookOpen className="w-3 h-3 shrink-0" />
            {p.journal}
          </span>
        </div>
      </div>
    </div>
  );
}
