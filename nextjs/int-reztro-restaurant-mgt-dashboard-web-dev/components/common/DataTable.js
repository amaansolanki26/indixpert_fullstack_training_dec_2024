"use client";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Form, Table } from "react-bootstrap";
import TablePagination from "@/components/table_pagination";

export default function DataTable({
  data,
  columns,
  pageSize = 10,
  className = "",
}) {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`custom-table-wrapper ${className}`}>
      <div className="table-responsive">
        <Table className="custom-data-table align-middle mb-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={header.column.columnDef.meta?.className || ""}
                  >
                    {header.isPlaceholder ? null : header.column.id === "select" ? (
                      flexRender(header.column.columnDef.header, header.getContext())
                    ) : (
                      <button
                        type="button"
                        className="table-sort-btn"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        <span className="sort-icon">
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted()] || "↕"}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cell.column.columnDef.meta?.className || ""}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="table-footer d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="showing-box d-flex align-items-center gap-2">
          <span>Showing</span>

          <Form.Select
            size="sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>

          <span>out of {data.length}</span>
        </div>
        
        <TablePagination table={table} pagination={table.getState().pagination} />
      </div>
    </div>
  );
}