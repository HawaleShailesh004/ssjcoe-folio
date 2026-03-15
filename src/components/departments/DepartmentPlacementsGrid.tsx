"use client";

import { PlacementCard } from "@/components/placements/PlacementCard";
import { StaggerReveal } from "@/components/shared/StaggerReveal";
import type { Placement, Department } from "@/types";

interface Props {
  placements: Placement[];
  department: Department;
  /** Optional grid class; default: grid-cols-1 sm:grid-cols-2 */
  className?: string;
  stagger?: number;
}

export function DepartmentPlacementsGrid({
  placements,
  department,
  className = "grid grid-cols-1 sm:grid-cols-2 gap-3",
  stagger = 50,
}: Props) {
  return (
    <StaggerReveal className={className} stagger={stagger}>
      {placements.map((p) => (
        <PlacementCard
          key={p.id}
          placement={p}
          view="grid"
          department={department}
          onClick={() => {}}
        />
      ))}
    </StaggerReveal>
  );
}
