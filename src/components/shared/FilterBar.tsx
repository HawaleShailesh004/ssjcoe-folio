"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onClear,
  hasActiveFilters,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 items-start sm:items-center",
        className
      )}
    >
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 bg-white border-brand-border"
          />
        </div>
      )}

      {filters && (
        <div className="flex flex-wrap gap-2 items-center">{filters}</div>
      )}

      {hasActiveFilters && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-brand-muted hover:text-brand-black gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
