"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Quote,
  Users,
  BookOpen,
} from "lucide-react";
import type { ResearchPaper, Department } from "@/types";

export function ResearchCard({
  paper,
  department,
}: {
  paper: ResearchPaper;
  department?: Department;
}) {
  const [open, setOpen] = useState(false);
  const authors = Array.isArray(paper.authors) ? paper.authors : [];

  return (
    <div className="card group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-0 overflow-hidden">
      <div className="flex">
        <div className="w-1 bg-stone-200 group-hover:bg-saffron transition-colors duration-300 shrink-0" />

        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge badge-idle">{paper.category}</span>
                {department && (
                  <span className="font-mono text-xs text-stone-400">
                    {department.code}
                  </span>
                )}
                <span className="font-mono text-xs text-stone-400">
                  {paper.year}
                </span>
                {paper.citations > 0 && (
                  <span className="flex items-center gap-1 text-xs text-stone-400">
                    <Quote className="w-3 h-3" /> {paper.citations}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-stone-950 leading-snug mb-2 group-hover:text-saffron-dark transition-colors">
                {paper.title}
              </h3>

              <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-1">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{authors.map(String).join(", ")}</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-stone-400">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="italic">{paper.journal}</span>
              </div>

              {paper.abstract && (
                <div className="mt-3">
                  <p
                    className={`text-sm text-stone-500 leading-relaxed ${!open ? "clamp-2" : ""}`}
                  >
                    {paper.abstract}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1 text-xs text-saffron mt-1.5 hover:text-saffron-dark transition-colors"
                  >
                    {open ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> Read abstract
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-saffron hover:text-saffron-dark transition-colors font-medium"
                >
                  <ExternalLink className="w-3 h-3" /> DOI
                </a>
              )}
              {paper.pdf_url && (
                <a
                  href={paper.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-saffron hover:text-saffron-dark transition-colors font-medium"
                >
                  <FileText className="w-3 h-3" /> PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
