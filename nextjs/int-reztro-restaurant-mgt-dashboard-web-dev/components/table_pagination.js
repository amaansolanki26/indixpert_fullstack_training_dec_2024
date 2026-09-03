"use client";

import React from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export default function TablePagination({ table, pagination }) {
  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex + 1;

  let pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages = [1];

    if (currentPage > 3) {
      pages.push("dots-left");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("dots-right");
    }

    pages.push(totalPages);
  }

  return (
    <div className="d-flex align-items-center gap-2">

      <Button
        size="sm"
        variant="light"
        className="rounded-3 px-3 py-2 border"
        onClick={() =>
          table.setPageIndex(Math.max(pagination.pageIndex - 1, 0))
        }
        disabled={pagination.pageIndex === 0}
      >
        <ChevronLeft/>
      </Button>

      {pages.map((page, index) => {
        if (page === "dots-left" || page === "dots-right") {
          return (
            <span key={`dots-${index}`} className="px-2 text-muted">
              ...
            </span>
          );
        }

        const pageIndex = page - 1;

        return (
          <Button
            key={`${page}-${index}`}
            size="sm"
            className={`rounded-3 px-3 py-2 border ${
              pagination.pageIndex === pageIndex
                ? "text-white"
                : "text-dark"
            }`}
            variant={
              pagination.pageIndex === pageIndex
                ? "primary"
                : "light"
            }
            onClick={() => table.setPageIndex(pageIndex)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="light"
        className="rounded-3 px-3 py-2 border"
        onClick={() =>
          table.setPageIndex(
            Math.min(pagination.pageIndex + 1, totalPages - 1)
          )
        }
        disabled={pagination.pageIndex >= totalPages - 1}
      >
        <ChevronRight/>
      </Button>

    </div>
  );
}