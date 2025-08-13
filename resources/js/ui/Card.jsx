import React from "react";

const Card = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
