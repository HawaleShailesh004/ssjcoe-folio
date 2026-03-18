"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { AchievementDetailModal } from "@/components/achievements/AchievementDetailModal";
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
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

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

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    9
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (v: string) => {
    setSearch(v);
    reset();
  };
  const handleType = (t: AchievementType | "all") => {
    setType(t);
    reset();
  };
  const handleLevel = (v: AchievementLevel | "all") => {
    setLevel(v);
    reset();
  };
  const handleDept = (v: string) => {
    setDeptId(v);
    reset();
  };

  const hasFilters =
    search !== "" || type !== "all" || level !== "all" || deptId !== "all";

  const clear = () => {
    setSearch("");
    setType("all");
    setLevel("all");
    setDeptId("all");
  };

  return (
    <>
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
                  onClick={() => handleType(t.value)}
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
              onSearchChange={handleSearch}
              placeholder="Search student, type, sport, achievement..."
              hasFilters={hasFilters}
              onClear={clear}
              resultCount={filtered.length}
              resultLabel="achievements"
            >
              <select
                value={level}
                onChange={(e) => handleLevel(e.target.value as AchievementLevel | "all")}
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
        <div ref={resultsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((a) => (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAchievement(a)}
                onKeyDown={(ev) => ev.key === "Enter" && setSelectedAchievement(a)}
                className="cursor-pointer"
              >
                <AchievementCard
                  achievement={a}
                  department={departments.find((d) => d.id === a.dept_id)}
                />
              </div>
            ))}
          </div>
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
            pageSize={9}
          />
        </div>
      )}

      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          department={departments.find((d) => d.id === selectedAchievement.dept_id)}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
}
