"use client";

import { useState } from "react";
import {
  ExternalLink,
  FileText,
  Users,
  BookOpen,
  Quote,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResearchPaper, Department } from "@/types";

interface Props {
  paper: ResearchPaper;
  department?: Department;
}

export function ResearchCard({ paper, department }: Props) {
  const [expanded, setExpanded] = useState(false);
  const authors = Array.isArray(paper.authors) ? paper.authors : [];

  return (
    <div className="card-base p-6 hover:shadow-panel transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full">
              {paper.category}
            </span>
            {department && (
              <span className="text-xs text-brand-muted bg-brand-bg border border-brand-border px-2 py-0.5 rounded">
                {department.code}
              </span>
            )}
            <span className="text-xs text-brand-muted font-mono">
              {paper.year}
            </span>
            {paper.citations > 0 && (
              <span className="flex items-center gap-1 text-xs text-brand-muted">
                <Quote className="w-3 h-3" /> {paper.citations} citations
              </span>
            )}
          </div>

          <h3 className="font-semibold text-brand-black text-base leading-snug mb-2">
            {paper.title}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-brand-muted mb-2">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{authors.map(String).join(", ")}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-brand-muted">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="italic">{paper.journal}</span>
          </div>

          {paper.abstract && (
            <div className="mt-3">
              <p
                className={`text-sm text-brand-muted leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
              >
                {paper.abstract}
              </p>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-brand-saffron mt-1 hover:underline"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Read more
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
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
              >
                <ExternalLink className="w-3 h-3" /> DOI
              </Button>
            </a>
          )}
          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
              >
                <FileText className="w-3 h-3" /> PDF
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
