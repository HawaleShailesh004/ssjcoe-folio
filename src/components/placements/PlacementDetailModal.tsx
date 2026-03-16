"use client";

import { useEffect } from "react";
import { X, MapPin, Briefcase, GraduationCap, Building2, Calendar } from "lucide-react";
import type { Placement, Department } from "@/types";

interface Props {
  placement: Placement;
  department?: Department;
  onClose: () => void;
}

export function PlacementDetailModal({ placement: p, department, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ background: "rgba(12,10,9,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative h-full bg-white overflow-y-auto"
        style={{ width: "min(420px, 100vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-stone-200 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-stone-200 text-stone-400 hover:text-stone-700 hover:border-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden mb-4">
            {p.photo_url ? (
              <img src={p.photo_url} alt={p.student_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-2xl text-stone-400">{p.student_name.charAt(0)}</span>
              </div>
            )}
          </div>

          <h2 className="font-display text-2xl text-stone-950 mb-0.5">{p.student_name}</h2>
          <p className="text-sm font-semibold text-saffron-dark">{p.role}</p>
          <p className="text-sm text-stone-500">{p.company}</p>
        </div>

        {/* Package callout */}
        <div className="mx-6 mt-6 rounded-xl p-5 text-center border border-ok-border bg-ok-bg">
          <p
            className="font-mono font-bold text-ok mb-0.5"
            style={{ fontSize: "32px", letterSpacing: "-0.04em" }}
          >
            ₹{p.package_lpa} LPA
          </p>
          <p className="text-xs text-ok font-medium">
            Annual package · {p.year} batch
          </p>
        </div>

        {/* Details */}
        <div className="px-6 py-6 space-y-4">
          {[
            { icon: Building2,     label: "Company",         value: p.company },
            { icon: Briefcase,     label: "Role",            value: p.role },
            { icon: GraduationCap, label: "Department",      value: department?.name ?? "—" },
            { icon: Calendar,      label: "Batch year",      value: String(p.year) },
            { icon: MapPin,        label: "Location",        value: p.location || "—" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "#FFF7ED", border: "1px solid rgba(232,130,12,0.15)" }}
              >
                <row.icon className="w-3.5 h-3.5 text-saffron" />
              </div>
              <div>
                <p className="label mb-0.5">{row.label}</p>
                <p className="text-sm text-stone-800 font-medium">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dept badge at bottom */}
        {department && (
          <div className="px-6 pb-8">
            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "#FAFAF9", border: "1px solid #E7E5E4" }}
            >
              <div>
                <p className="label mb-0.5">Department</p>
                <p className="font-mono font-bold text-saffron text-sm">{department.code}</p>
              </div>
              <p className="text-sm text-stone-500">{department.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
