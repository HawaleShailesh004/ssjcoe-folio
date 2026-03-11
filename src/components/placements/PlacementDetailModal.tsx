"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Briefcase, Calendar, Building2, Mail } from "lucide-react";
import type { Placement, Department } from "@/types";

interface Props {
  placement: Placement;
  department?: Department;
  onClose: () => void;
}

export function PlacementDetailModal({
  placement: p,
  department,
  onClose,
}: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Placement Detail
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-border flex items-center justify-center text-brand-muted font-bold text-xl overflow-hidden flex-shrink-0">
              {p.photo_url ? (
                <img
                  src={p.photo_url}
                  alt={p.student_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                p.student_name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-bold text-brand-black text-lg">
                {p.student_name}
              </h3>
              <p className="text-brand-saffron font-semibold">{p.company}</p>
              {department && (
                <span className="text-xs text-brand-muted">
                  {department.name}
                </span>
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <p className="text-xs text-green-700 font-medium mb-1">Package</p>
            <p className="font-mono text-3xl font-bold text-green-800">
              ₹{p.package_lpa} LPA
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Briefcase, label: "Role", value: p.role },
              { icon: Building2, label: "Company", value: p.company },
              { icon: MapPin, label: "Location", value: p.location },
              {
                icon: Calendar,
                label: "Batch",
                value: p.year?.toString(),
              },
              { icon: Mail, label: "Email", value: p.email },
            ]
              .filter((item) => item.value)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-muted" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-muted">{item.label}</p>
                      <p className="text-sm font-medium text-brand-black">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
