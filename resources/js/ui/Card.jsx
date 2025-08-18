import React from "react";

const Card = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
