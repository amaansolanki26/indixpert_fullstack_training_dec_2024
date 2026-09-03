"use client";

import React from "react";
import { Form } from "react-bootstrap";

export default function showingPagination({
  totalItems,
  itemsPerPage,
  options = [6, 9, 12],
  onItemsPerPageChange,
}) {
  return (
    <>
    <div className="showing-pagination d-flex align-items-center gap-2 small text-muted">
      <span>Showing</span>

      <Form.Select
        size="sm"
        className="per-page-select shadow-none"
        value={itemsPerPage}
        onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
        >
        {options.map((option) => (
            <option value={option} key={option}>
            {option}
          </option>
        ))}
      </Form.Select>

      <span>out of {totalItems}</span>
    </div>

        </>
  );
}