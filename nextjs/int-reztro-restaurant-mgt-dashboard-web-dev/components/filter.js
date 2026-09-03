"use client";
import { Button, ButtonGroup } from "react-bootstrap";

export default function FilterGroup({
  options = [],
  value,
  onChange,
  size = "sm",
  activeVariant = "primary",
  inactiveVariant = "info",
  className = "rounded-3 overflow-hidden shadow-sm",

  mode = "table",
}) {
  return (
    <ButtonGroup className={className}>
      {options.map((option) => {
        const isActive = value === option;

        return (
          <Button
            key={option}
            size={size}
            variant={isActive ? activeVariant : inactiveVariant}
            className={`px-3 border-0 ${
              isActive ? "text-white" : "text-secondary"
            } ${
              
              mode === "card" && !isActive ? "bg-white text-dark" : ""
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}