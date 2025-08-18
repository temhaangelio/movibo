import React, { useState } from "react";
import { Star } from "@phosphor-icons/react";

const UserRating = ({ value, onChange, label = "Puanınız" }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleRatingClick = (rating) => {
        onChange(rating);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="text-xl transition-colors"
                    >
                        <Star
                            className={`w-6 h-6 ${
                                star <= (hoveredRating || value)
                                    ? "text-black fill-current"
                                    : "text-gray-300"
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
                    <span className="ml-2 text-sm text-gray-600">
                        {value}/5
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserRating;
