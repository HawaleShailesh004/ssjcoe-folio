"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResearchCard } from "@/components/research/ResearchCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
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

      const matchYear =
        year === "all" || Number(p.year) === Number(year);
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

  const clearFilters = () => {
    setSearch("");
    setYear("all");
    setCategory("all");
    setDeptId("all");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Research Papers"
        description={`${initialPapers.length} published papers from SSJCOE faculty and students.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
      />

      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { label: "Total Papers", value: initialPapers.length },
          { label: "Categories", value: categories.length },
          { label: "Departments", value: departments.length },
        ].map((s) => (
          <div
            key={s.label}
            className="card-base px-5 py-3 flex items-center gap-3"
          >
            <span className="font-mono text-xl font-bold text-brand-black">
              {s.value}
            </span>
            <span className="text-sm text-brand-muted">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search title, author, journal..."
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

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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
            </div>
          }
        />
        <div className="mt-3 pt-3 border-t border-brand-border">
          <p className="text-sm text-brand-muted">
            <span className="font-semibold text-brand-black font-mono">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "paper" : "papers"}
            {hasFilters && " matching filters"}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No papers found"
          description="Try adjusting your filters."
          icon={<FlaskConical className="w-6 h-6" />}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
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
