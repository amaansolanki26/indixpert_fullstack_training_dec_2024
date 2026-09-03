"use client";

import React from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export default function CardPagination({
    pageIndex,
    pageSize,
    total,
    onPageChange,
}) {
    const totalPages = Math.ceil(total / pageSize);

    const goToPage = (index) => {
        if (index < 0 || index >= totalPages) return;
        onPageChange(index);
    };

    // ---------------------------
    // SIMPLE: 1 2 3 ... last
    // ---------------------------
    let pages = [];

    if (totalPages <= 4) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        const current = pageIndex + 1;

        // always show first page
        pages = [1];

        // left dots
        if (current > 3) {
            pages.push("dots-left");
        }

        // middle window (dynamic shift)
        const start = Math.max(2, current - 1);
        const end = Math.min(totalPages - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // right dots
        if (current < totalPages - 2) {
            pages.push("dots-right");
        }

        // always show last page
        pages.push(totalPages);
    }

    return (
        <div className="d-flex align-items-center gap-2">

            {/* PREV */}
            <Button
                size="sm"
                variant="light"
                className="rounded-3 px-3 py-2 border"
                onClick={() => goToPage(pageIndex - 1)}
                disabled={pageIndex === 0}
            >
                <ChevronLeft />
            </Button>

            {/* PAGES */}
            {pages.map((p, i) => {
                if (p === "dots-left" || p === "dots-right") {
                    return (
                        <span key={i} className="px-2 text-muted">
                            ...
                        </span>
                    );
                }

                const isActive = pageIndex === p - 1;

                return (
                    <Button
                        key={i}
                        size="sm"
                        variant={isActive ? "primary" : "light"}
                        className={`rounded-3 px-3 py-2 border ${isActive ? "text-white" : "text-dark"
                            }`}
                        onClick={() => goToPage(p - 1)}
                    >
                        {p}
                    </Button>
                );
            })}

            {/* NEXT */}
            <Button
                size="sm"
                variant="light"
                className="rounded-3 px-3 py-2 border"
                onClick={() => goToPage(pageIndex + 1)}
                disabled={pageIndex >= totalPages - 1}
            >
                <ChevronRight />
            </Button>

        </div>
    );
}