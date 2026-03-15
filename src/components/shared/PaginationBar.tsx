"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: Props) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const start =
    pageSize != null ? (page - 1) * pageSize + 1 : null;
  const end =
    pageSize != null && totalItems != null
      ? Math.min(page * pageSize, totalItems)
      : null;

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      {totalItems != null && start != null && end != null && (
        <p className="caption">
          Showing{" "}
          <span className="font-semibold text-stone-700">
            {start}–{end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-stone-700">{totalItems}</span>
        </p>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={
                page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"
              }
              aria-disabled={page <= 1}
            />
          </PaginationItem>

          {getPages().map((p, i) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(p as number);
                  }}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer"
              }
              aria-disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
