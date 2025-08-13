import React from "react";
import { Sun, Moon } from "@phosphor-icons/react";

const ThemeToggle = ({ currentTheme, onThemeChange, className = "" }) => {
    const isDark = currentTheme === "dark";

    const handleToggle = () => {
        onThemeChange(isDark ? "light" : "dark");
    };

    return (
        <div className={`ThemeToggle flex items-center relative ${className}`}>
            <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 ${
                    isDark ? "bg-gray-600" : "bg-gray-200"
                }`}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        isDark ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
            <div className="absolute inset-0 flex items-center w-full justify-center pointer-events-none">
                <div className="relative w-full h-full">
                    {isDark ? (
                        <Moon
                            className={`absolute left-1 top-1 w-4 h-4 ${
                                isDark ? "text-white" : "text-gray-400"
                            }`}
                        />
                    ) : (
                        <Sun
                            className={`absolute right-1 top-1 w-4 h-4 ${
                                isDark ? "text-gray-400" : "text-yellow-500"
                            }`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
