"use client";

import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function RatingStars({
  rating,
  showEmpty = true,
  size = 13,
  className = "",
}) {
  const numericRating = Number(rating);
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = showEmpty ? 5 - fullStars - (hasHalfStar ? 1 : 0) : 0;

  return (
    <span className={`rating-stars ${className}`}>
      {Array.from({ length: fullStars }).map((_, index) => (
        <FaStar
          key={`full-${index}`}
          size={size}
          color="#ffc400"
          className="star-icon"
        />
      ))}

      {hasHalfStar && (
        <FaStarHalfAlt size={size} color="#ffc400" className="star-icon" />
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          size={size}
          color="#e5e5e5"
          className="star-icon"
        />
      ))}
    </span>
  );
}