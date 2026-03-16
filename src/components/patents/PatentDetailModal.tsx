"use client";

import { useEffect } from "react";
import { X, Users, Hash, Calendar, FileText } from "lucide-react";
import type { Patent, Department } from "@/types";

const STATUS_STYLES: Record<
  string,
  { className: string; label: string; bg: string; border: string; text: string }
> = {
  granted: {
    className: "badge-ok",
    label: "Patent Granted",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    text: "#15622A",
  },
  published: {
    className: "badge-saffron",
    label: "Published",
    bg: "#FDF0E0",
    border: "#F4A84A",
    text: "#1A1410",
  },
  filed: {
    className: "badge-idle",
    label: "Filed",
    bg: "#F2EDE8",
    border: "#D4CEC9",
    text: "#5C5248",
  },
};

interface Props {
  patent: Patent;
  department?: Department;
  onClose: () => void;
}

export function PatentDetailModal({ patent: p, department, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const s = STATUS_STYLES[p.patent_status] ?? STATUS_STYLES.filed;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ background: "rgba(12,10,9,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative h-full bg-white overflow-y-auto"
        style={{ width: "min(480px, 100vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-stone-200 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-3">
            <span className={`badge capitalize ${s.className}`}>
              {s.label}
            </span>
          </div>
          <h2 className="font-display text-xl text-stone-950 leading-snug pr-8">
            {p.title}
          </h2>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Patent number callout */}
          {p.patent_number && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <Hash className="w-5 h-5 shrink-0" style={{ color: s.text }} />
              <div>
                <p className="label mb-0.5" style={{ color: s.text }}>Patent number</p>
                <p className="font-mono font-bold text-base" style={{ color: s.text }}>
                  {p.patent_number}
                </p>
              </div>
            </div>
          )}

          {/* Inventors */}
          <div>
            <p className="label mb-3">Inventors</p>
            <div className="flex flex-wrap gap-2">
              {(p.inventors ?? []).map((inv) => (
                <span
                  key={inv}
                  className="px-3 py-1.5 rounded-lg text-sm text-stone-700 border border-stone-200 bg-stone-50 flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 text-stone-400" />
                  {inv}
                </span>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar,  label: "Year filed",   value: p.year != null ? String(p.year) : "—" },
              { icon: FileText,  label: "Department",   value: department?.code ?? "—" },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-xl p-4"
                style={{ background: "#FAFAF9", border: "1px solid #E7E5E4" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <row.icon className="w-3.5 h-3.5 text-stone-400" />
                  <p className="label">{row.label}</p>
                </div>
                <p className="font-semibold text-stone-950 text-sm">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {p.description && (
            <div>
              <p className="label mb-3">Description</p>
              <p className="text-sm text-stone-600 leading-relaxed">{p.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
