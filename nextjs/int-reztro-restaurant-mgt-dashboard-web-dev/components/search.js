"use client";
import { Form, FormControl } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <Form className={`d-flex ${className}`}>
      <div className="position-relative w-100">
        <Search
          size={16}
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
        />

        <FormControl
          type="search"
          placeholder={placeholder}
          className="ps-5 border-0 rounded-3 bg-info w-100"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Form>
  );
}