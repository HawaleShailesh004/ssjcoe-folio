import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize = 12) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const reset = () => setPage(1);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, totalPages, paginated, reset };
}
