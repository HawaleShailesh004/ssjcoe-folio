"use client";

import { Search, X } from "lucide-react";

interface FilterBarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
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
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        {onSearchChange !== undefined && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-5" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="h-9 pl-9 pr-3 text-sm bg-white border border-ink-7 rounded focus:outline-none focus:border-ink w-64"
            />
          </div>
        )}

        {children}

        {hasFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-sm text-ink-4 hover:text-ink transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {resultCount !== undefined && (
        <p className="text-sm text-ink-4">
          <span className="font-mono font-semibold text-ink">
            {resultCount}
          </span>{" "}
          {resultLabel}
          {hasFilters && " matching filters"}
        </p>
      )}
    </div>
  );
}
