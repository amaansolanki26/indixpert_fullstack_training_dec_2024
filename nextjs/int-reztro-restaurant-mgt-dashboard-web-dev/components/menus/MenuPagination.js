"use client";

import React from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export default function menuPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) return null;

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
    <div className="menu-pagination d-flex align-items-center gap-2">
      <Button
        size="sm"
        variant="light"
        className="pagination-btn rounded-3 border"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>

      {pages.map((page, index) => {
        if (page === "dots-left" || page === "dots-right") {
          return (
            <span key={`dots-${index}`} className="px-2 text-muted">
              ...
            </span>
          );
        }

        return (
          <Button
            key={`${page}-${index}`}
            size="sm"
            className="pagination-btn rounded-3 border"
            variant={currentPage === page ? "primary" : "light"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="light"
        className="pagination-btn rounded-3 border"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}