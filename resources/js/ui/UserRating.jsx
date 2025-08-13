import React, { useState } from "react";
import { Star } from "@phosphor-icons/react";

const UserRating = ({ value, onChange, label = "Puanınız" }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleRatingClick = (rating) => {
        onChange(rating);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-2xl transition-colors"
                    >
                        <Star
                            className={`w-8 h-8 ${
                                star <= (hoveredRating || value)
                                    ? "text-black fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                            }`}
                            weight={
                                star <= (hoveredRating || value)
                                    ? "fill"
                                    : "regular"
                            }
                        />
                    </button>
                ))}
                {value > 0 && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {value}/5
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserRating;
