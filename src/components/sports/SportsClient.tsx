"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { AchievementCard } from "@/components/sports/AchievementCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import type {
  SportsAchievement,
  Department,
  AchievementLevel,
} from "@/types";
import { cn } from "@/lib/utils";

const LEVELS: {
  value: AchievementLevel | "all";
  label: string;
  color: string;
}[] = [
  { value: "all", label: "All", color: "" },
  {
    value: "institute",
    label: "Institute",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
  {
    value: "state",
    label: "State",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "national",
    label: "National",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "international",
    label: "International",
    color: "bg-red-50 text-red-700 border-red-200",
  },
];

interface Props {
  initialAchievements: SportsAchievement[];
  departments: Department[];
}

export function SportsClient({
  initialAchievements,
  departments,
}: Props) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<AchievementLevel | "all">("all");
  const [deptId, setDeptId] = useState("all");

  const filtered = useMemo(() => {
    return initialAchievements.filter((a) => {
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.student_name.toLowerCase().includes(search.toLowerCase()) ||
        a.sport.toLowerCase().includes(search.toLowerCase());

      const matchLevel = level === "all" || a.achievement_level === level;
      const matchDept = deptId === "all" || a.dept_id === deptId;

      return matchSearch && matchLevel && matchDept;
    });
  }, [initialAchievements, search, level, deptId]);

  const hasFilters =
    search !== "" || level !== "all" || deptId !== "all";

  const clearFilters = () => {
    setSearch("");
    setLevel("all");
    setDeptId("all");
  };

  return (
    <div className="container-main section-pad">
      <PageHeader
        title="Sports & Achievements"
        description={`${initialAchievements.length} achievements by SSJCOE students.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sports" }]}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            type="button"
            onClick={() => setLevel(l.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              level === l.value
                ? "bg-brand-black text-white border-brand-black"
                : l.value === "all"
                  ? "bg-white text-brand-muted border-brand-border hover:border-brand-slate"
                  : `${l.color} hover:opacity-80`
            )}
          >
            {l.label}
            {l.value !== "all" && (
              <span className="ml-1.5 font-mono text-xs opacity-70">
                {
                  initialAchievements.filter(
                    (a) => a.achievement_level === l.value
                  ).length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card-base p-4 mb-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search student, sport, achievement..."
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
          title="No achievements found"
          icon={<Trophy className="w-6 h-6" />}
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
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
