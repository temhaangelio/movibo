import React from "react";

const TextInput = ({
    type = "text",
    label,
    error,
    className = "",
    disabled = false,
    isFocused,
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                disabled={disabled}
                className={`
                    w-full px-3 py-2 border rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${error ? "border-red-300" : "border-gray-300"}
                    ${error ? "focus:ring-red-500 focus:border-red-500" : ""}
                    ${
                        disabled
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : ""
                    }
                    dark:bg-gray-700 dark:text-white dark:border-gray-600
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default TextInput;
