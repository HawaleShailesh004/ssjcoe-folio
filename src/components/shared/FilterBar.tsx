"use client";

import { Search, X } from "lucide-react";

interface Props {
  search?: string;
  onSearchChange?: (v: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  onClear?: () => void;
  hasFilters?: boolean;
  resultCount?: number;
  resultLabel?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  placeholder = "Search...",
  children,
  onClear,
  hasFilters,
  resultCount,
  resultLabel = "results",
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5 items-center">
        {onSearchChange !== undefined && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="input pl-9 w-64"
            />
          </div>
        )}
        {children}
        {hasFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>
      {resultCount !== undefined && (
        <p className="text-sm text-stone-500">
          <span className="num text-sm text-stone-950">{resultCount}</span>{" "}
          {resultLabel}
          {hasFilters && " matching filters"}
        </p>
      )}
    </div>
  );
}
