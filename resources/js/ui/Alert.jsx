import React from "react";

const Alert = ({ type = "error", message, onClose, open }) => {
    if (!open) return null;

    const alertClasses = {
        error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
        success:
            "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
        warning:
            "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
        info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`border rounded-lg p-4 shadow-lg ${alertClasses[type]}`}
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{message}</p>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="ml-4 text-current hover:opacity-70"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
