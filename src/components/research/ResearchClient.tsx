"use client";

import { useState, useMemo, useRef } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResearchCard } from "@/components/research/ResearchCard";
import type { ResearchPaper, Department } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  initialPapers: ResearchPaper[];
  categories: string[];
  years: number[];
  departments: Department[];
}

export function ResearchClient({
  initialPapers,
  categories,
  years,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all");
  const [deptId, setDeptId] = useState("all");

  const filtered = useMemo(() => {
    return initialPapers.filter((p) => {
      const authors = Array.isArray(p.authors) ? p.authors : [];
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        authors.some((a) =>
          String(a).toLowerCase().includes(search.toLowerCase())
        ) ||
        p.journal.toLowerCase().includes(search.toLowerCase());

      const matchYear = year === "all" || Number(p.year) === Number(year);
      const matchCategory = category === "all" || p.category === category;
      const matchDept = deptId === "all" || p.dept_id === deptId;

      return matchSearch && matchYear && matchCategory && matchDept;
    });
  }, [initialPapers, search, year, category, deptId]);

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    10
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (v: string) => {
    setSearch(v);
    reset();
  };
  const handleYear = (v: string) => {
    setYear(v);
    reset();
  };
  const handleCategory = (v: string) => {
    setCategory(v);
    reset();
  };
  const handleDept = (v: string) => {
    setDeptId(v);
    reset();
  };

  const hasFilters =
    search !== "" ||
    year !== "all" ||
    category !== "all" ||
    deptId !== "all";

  const clear = () => {
    setSearch("");
    setYear("all");
    setCategory("all");
    setDeptId("all");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Research Papers"
        description={`${initialPapers.length} published papers from SSJCOE faculty and students.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
        count={initialPapers.length}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleCategory("all")}
          className={cn(
            "badge transition-all",
            category === "all" ? "ring-2 ring-offset-1 ring-current" : "",
            "badge-idle"
          )}
        >
          All · {initialPapers.length}
        </button>
        {categories.map((c) => {
          const count = initialPapers.filter((p) => p.category === c).length;
          if (!count) return null;
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => handleCategory(c)}
              className={cn(
                "badge transition-all",
                active ? "ring-2 ring-offset-1 ring-current" : "",
                "badge-idle"
              )}
            >
              {c} · {count}
            </button>
          );
        })}
      </div>

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearch}
          placeholder="Search title, author, journal..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel={filtered.length === 1 ? "paper" : "papers"}
        >
          <select
            value={year}
            onChange={(e) => handleYear(e.target.value)}
            className="select"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
            className="select"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={deptId}
            onChange={(e) => handleDept(e.target.value)}
            className="select"
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

      {filtered.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Try adjusting your filters."
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
      ) : (
        <div ref={resultsRef} className="flex flex-col gap-4">
          {paginated.map((paper) => (
            <ResearchCard
              key={paper.id}
              paper={paper}
              department={departments.find((d) => d.id === paper.dept_id)}
            />
          ))}
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
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
}
