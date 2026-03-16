"use client";

import { useEffect } from "react";
import { X, Quote, Users, BookOpen, ExternalLink, FileText } from "lucide-react";
import type { ResearchPaper, Department } from "@/types";

interface Props {
  paper: ResearchPaper;
  department?: Department;
  onClose: () => void;
}

export function ResearchDetailModal({ paper: p, department, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ background: "rgba(12,10,9,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative h-full bg-white overflow-y-auto"
        style={{ width: "min(520px, 100vw)" }}
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

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {p.category && <span className="badge badge-idle">{p.category}</span>}
            {department && <span className="font-mono text-xs text-stone-400">{department.code}</span>}
            <span className="font-mono text-xs text-stone-400">{p.year}</span>
          </div>

          <h2 className="font-display text-xl text-stone-950 leading-snug pr-8">
            {p.title}
          </h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Citation callout */}
          {p.citations > 0 && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "#FFF7ED", border: "1px solid rgba(232,130,12,0.2)" }}
            >
              <Quote className="w-5 h-5 text-saffron shrink-0" />
              <div>
                <p className="font-mono font-bold text-saffron-dark text-lg leading-none">
                  {p.citations}
                </p>
                <p className="text-xs text-saffron-dark/70 mt-0.5">Citations</p>
              </div>
            </div>
          )}

          {/* Authors */}
          <div>
            <p className="label mb-3">Authors</p>
            <div className="flex flex-wrap gap-2">
              {(p.authors ?? []).map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 rounded-lg text-sm text-stone-700 border border-stone-200 bg-stone-50 flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 text-stone-400" />
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Journal + year */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4"
              style={{ background: "#FAFAF9", border: "1px solid #E7E5E4" }}
            >
              <p className="label mb-1.5">Journal</p>
              <p className="text-sm text-stone-800 leading-snug italic">
                {p.journal}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: "#FAFAF9", border: "1px solid #E7E5E4" }}
            >
              <p className="label mb-1.5">Published</p>
              <p className="num text-xl text-stone-950">{p.year}</p>
            </div>
          </div>

          {/* Abstract */}
          {p.abstract && (
            <div>
              <p className="label mb-3">Abstract</p>
              <p className="text-sm text-stone-600 leading-relaxed">{p.abstract}</p>
            </div>
          )}

          {/* Links */}
          {(p.doi || p.pdf_url) && (
            <div className="flex flex-col gap-2">
              <p className="label">Links</p>
              {p.doi && (
                <a
                  href={`https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-stone-200 hover:border-saffron/40 hover:bg-saffron-light transition-all group text-sm text-stone-700 hover:text-stone-950"
                >
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-saffron transition-colors" />
                  View on DOI — {p.doi}
                </a>
              )}
              {p.pdf_url && (
                <a
                  href={p.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-stone-200 hover:border-saffron/40 hover:bg-saffron-light transition-all group text-sm text-stone-700 hover:text-stone-950"
                >
                  <FileText className="w-4 h-4 text-stone-400 group-hover:text-saffron transition-colors" />
                  Download PDF
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
