import React from "react";
import { Heart } from "lucide-react";

function FavoriteToggleButton({ isFavorite, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent parent navigation click
        onClick();
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`absolute top-3 right-3 z-30 p-1 rounded-full transition-colors duration-200 ${
        isFavorite ? "text-red-500 fill-current" : "text-white hover:text-red-500"
      }`}
    >
      <Heart size={24} className={isFavorite ? "fill-current" : ""} />
    </button>
  );
}

export default FavoriteToggleButton;
