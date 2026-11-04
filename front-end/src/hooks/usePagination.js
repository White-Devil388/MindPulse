import { useState, useMemo, useCallback } from 'react';

/**
 * usePagination
 * Manages item slicing, total page calculation, and navigation
 */
export function usePagination(items = [], initialPageSize = 10, initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure currentPage stays within valid bounds when items change
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, safeCurrentPage, pageSize]);

  const goToPage = useCallback(
    (pageNumber) => {
      const page = Math.min(Math.max(1, pageNumber), totalPages);
      setCurrentPage(page);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(safeCurrentPage + 1);
  }, [goToPage, safeCurrentPage]);

  const prevPage = useCallback(() => {
    goToPage(safeCurrentPage - 1);
  }, [goToPage, safeCurrentPage]);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    pageSize,
    totalItems,
    paginatedItems,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: safeCurrentPage < totalPages,
    hasPrevPage: safeCurrentPage > 1,
  };
}

