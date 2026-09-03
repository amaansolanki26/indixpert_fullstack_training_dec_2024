"use client";

export default function PageSizeSelector({
  table,
  pageSize,
  total,
  options = [5, 10, 20],
  label = "Showing",
}) {
  return (
    <div className="d-flex align-items-center gap-2 text-muted">
      {label}

      <select
        className="form-select rounded-3 form-select-sm w-auto"
        value={pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
          table.setPageIndex(0);
        }}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      out of {total}
    </div>
  );
}