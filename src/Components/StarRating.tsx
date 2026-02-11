import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: string | number | undefined;
  size?: string;       // Tailwind text size class, e.g. "text-sm", "text-lg"
  showValue?: boolean; // Whether to show the numeric value
  valueClass?: string; // Extra classes for the numeric value span
}

/**
 * Renders 5 stars colored according to the rating value (filled = yellow, empty = gray).
 * Supports whole-star granularity (floor of the rating).
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = "text-sm",
  showValue = true,
  valueClass = "text-xs font-medium ml-1",
}) => {
  const numRating =
    typeof rating === "string" ? parseFloat(rating) : rating || 0;
  const safeRating = isNaN(numRating) ? 0 : numRating;
  const filledStars = Math.floor(Math.min(Math.max(safeRating, 0), 5));
  const formattedRating = safeRating.toFixed(1);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`${size} ${i < filledStars ? "text-yellow-500" : "text-gray-500"}`}
        />
      ))}
      {showValue && <span className={valueClass}>{formattedRating}</span>}
    </div>
  );
};

export default StarRating;
