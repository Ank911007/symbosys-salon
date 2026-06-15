import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Generates an array of page numbers and "..." for ellipsis.
 */
const usePagination = ({ totalPages, currentPage, siblingCount = 1 }) => {
  return useMemo(() => {
    // Total pages numbers to show including current, siblings, first, last, and up to 2 ellipses.
    // e.g., 1 ... 4 [5] 6 ... 10  -> count is 7
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If total pages is less than the page numbers we want to show, return the range [1..totalPages]
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate left and right sibling indices
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots to show
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    // Case 3: No right dots to show, but left dots to show
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      return [firstPageIndex, '...', ...rightRange];
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
  }, [totalPages, currentPage, siblingCount]);
};

/**
 * Production-ready Pagination component.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  siblingCount = 1
}) {
  const paginationRange = usePagination({ currentPage, totalPages, siblingCount });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e8f5ea] text-[#2d5a34] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      {/* Page Numbers */}
      <ul className="flex items-center gap-1 sm:gap-1.5">
        <AnimatePresence mode="popLayout">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === '...') {
              return (
                <motion.li
                  key={`ellipsis-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-[#7aaa84]"
                  aria-hidden="true"
                >
                  <MoreHorizontal size={16} />
                </motion.li>
              );
            }

            const isCurrentPage = pageNumber === currentPage;

            return (
              <motion.li
                key={`page-${pageNumber}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => onPageChange(pageNumber)}
                  aria-current={isCurrentPage ? 'page' : undefined}
                  aria-label={`Go to page ${pageNumber}`}
                  className={`
                    relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-syne text-sm font-bold transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2
                    ${isCurrentPage 
                      ? 'bg-[#4a9e5c] text-white shadow-md hover:bg-[#3d8a4f]' 
                      : 'bg-transparent text-[#2d5a34] hover:bg-[#e8f5ea] border border-transparent hover:border-[#b8d9bc]'
                    }
                  `}
                >
                  {pageNumber}
                  
                  {/* Subtle active indicator for premium feel */}
                  {isCurrentPage && (
                    <motion.div
                      layoutId="activePageIndicator"
                      className="absolute inset-0 rounded-full border border-[#4a9e5c]"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e8f5ea] text-[#2d5a34] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </nav>
  );
}
