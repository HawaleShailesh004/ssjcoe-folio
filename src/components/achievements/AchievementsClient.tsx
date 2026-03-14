"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import type {
  Achievement,
  Department,
  AchievementType,
  AchievementLevel,
} from "@/types";
import { cn } from "@/lib/utils";

const TYPES: { value: AchievementType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "academic", label: "Academic" },
];

const LEVELS: { value: AchievementLevel | "all"; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "institute", label: "Institute" },
  { value: "state", label: "State" },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
];

interface Props {
  initialAchievements: Achievement[];
  departments: Department[];
}

export function AchievementsClient({
  initialAchievements,
  departments,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<AchievementType | "all">("all");
  const [level, setLevel] = useState<AchievementLevel | "all">("all");
  const [deptId, setDeptId] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return initialAchievements.filter((a) => {
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.student_name.toLowerCase().includes(search.toLowerCase()) ||
        (a.sport?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        a.achievement_type.toLowerCase().includes(search.toLowerCase());

      const matchType = type === "all" || a.achievement_type === type;
      const matchLevel = level === "all" || a.achievement_level === level;
      const matchDept = deptId === "all" || a.dept_id === deptId;

      return matchSearch && matchType && matchLevel && matchDept;
    });
  }, [initialAchievements, search, type, level, deptId]);

  const hasFilters =
    search !== "" || type !== "all" || level !== "all" || deptId !== "all";

  const clear = () => {
    setSearch("");
    setType("all");
    setLevel("all");
    setDeptId("all");
  };

  return (
    <div className="container section">
      <PageHeader
        title="Achievements"
        description={`${initialAchievements.length} achievements by SSJCOE students — sports, technical, cultural and academic.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Achievements" }]}
        count={initialAchievements.length}
      />

      {mounted ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {TYPES.map((t) => {
              const count =
                t.value === "all"
                  ? initialAchievements.length
                  : initialAchievements.filter((a) => a.achievement_type === t.value).length;
              const active = type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "badge capitalize transition-all",
                    active ? "ring-2 ring-offset-1 ring-current" : "",
                    "badge-idle"
                  )}
                >
                  {t.label} · {count}
                </button>
              );
            })}
          </div>

          <div className="card p-4 mb-6">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              placeholder="Search student, type, sport, achievement..."
              hasFilters={hasFilters}
              onClear={clear}
              resultCount={filtered.length}
              resultLabel="achievements"
            >
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AchievementLevel | "all")}
                className="select"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
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
        </>
      ) : (
        <div className="mb-6 space-y-2" aria-hidden>
          <div className="h-9 w-48 rounded bg-stone-200" />
          <div className="card p-4 h-14" />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No achievements found"
          description={hasFilters ? "Try adjusting your filters." : undefined}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AchievementCard
              key={a.id}
              achievement={a}
              department={departments.find((d) => d.id === a.dept_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
