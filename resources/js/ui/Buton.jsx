import React from "react";

const Buton = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
        secondary:
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success:
            "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        ghost: "text-gray-700 focus:outline-none focus:ring-0 focus:ring-offset-0",
    };

    const sizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-md",
        xl: "px-8 py-4 text-lg",
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Buton;
