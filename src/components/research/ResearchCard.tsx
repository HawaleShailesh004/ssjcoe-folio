"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
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
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge badge-idle">{paper.category}</span>
            {department && (
              <span className="font-mono text-xs text-ink-5">
                {department.code}
              </span>
            )}
            <span className="font-mono text-xs text-ink-5">{paper.year}</span>
            {paper.citations > 0 && (
              <span className="text-xs text-ink-5">
                {paper.citations} citations
              </span>
            )}
          </div>

          <h3 className="text-base font-medium text-ink leading-snug mb-2">
            {paper.title}
          </h3>

          <p className="text-sm text-ink-4 mb-1">
            {authors.map(String).join(", ")}
          </p>

          <p className="text-sm text-ink-5 italic">{paper.journal}</p>

          {paper.abstract && (
            <div className="mt-3">
              <p
                className={`text-sm text-ink-4 leading-relaxed ${!open ? "clamp-2" : ""}`}
              >
                {paper.abstract}
              </p>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-xs text-ink-2 mt-1.5 hover:text-ink transition-colors"
              >
                {open ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Less
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
              className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> DOI
            </a>
          )}
          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink transition-colors"
            >
              <FileText className="w-3 h-3" /> PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
