"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  className,
}: PaginationProps & { className?: string }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center gap-2 mt-4", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronLeftIcon className="size-5" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 px-3 py-2 text-sm border rounded-md ${
                currentPage === pageNum
                  ? "bg-neutral-700 text-white border-neutral-700"
                  : "border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
};
