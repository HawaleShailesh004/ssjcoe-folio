"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResearchCard } from "@/components/research/ResearchCard";
import type { ResearchPaper, Department } from "@/types";

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

      <div className="card p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search title, author, journal..."
          hasFilters={hasFilters}
          onClear={clear}
          resultCount={filtered.length}
          resultLabel={filtered.length === 1 ? "paper" : "papers"}
        >
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink text-ink-3"
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
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink text-ink-3"
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

      {filtered.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Try adjusting your filters."
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
        <div className="flex flex-col gap-4">
          {filtered.map((paper) => (
            <ResearchCard
              key={paper.id}
              paper={paper}
              department={departments.find((d) => d.id === paper.dept_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
