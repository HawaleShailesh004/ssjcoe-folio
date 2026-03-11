"use client";

import { PlacementCard } from "@/components/placements/PlacementCard";
import type { Placement, Department } from "@/types";

interface Props {
  placements: Placement[];
  department: Department;
}

export function DepartmentPlacementsGrid({
  placements,
  department,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {placements.map((p) => (
        <PlacementCard
          key={p.id}
          placement={p}
          view="grid"
          department={department}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
