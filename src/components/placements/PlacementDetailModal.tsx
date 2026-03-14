"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Briefcase, Calendar, Mail } from "lucide-react";
import type { Placement, Department } from "@/types";

export function PlacementDetailModal({
  placement: p,
  department,
  onClose,
}: {
  placement: Placement;
  department?: Department;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-normal">
            {p.student_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="p-4 bg-ink-9 rounded-lg text-center">
            <p className="label mb-1">Package</p>
            <p className="num-display text-3xl text-ink">₹{p.package_lpa} LPA</p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Briefcase, label: "Role", value: p.role },
              { icon: Briefcase, label: "Company", value: p.company },
              { icon: MapPin, label: "Location", value: p.location },
              { icon: Calendar, label: "Batch", value: p.year?.toString() },
              { icon: Mail, label: "Email", value: p.email },
            ]
              .filter((r) => r.value)
              .map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-ink-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-ink-4">{row.label}</p>
                      <p className="text-sm text-ink font-medium">
                        {row.value}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {department && (
            <div className="pt-3 border-t border-ink-7">
              <p className="text-xs text-ink-4">Department</p>
              <p className="text-sm font-medium text-ink mt-0.5">
                {department.name}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
