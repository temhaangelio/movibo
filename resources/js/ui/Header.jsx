import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

const Header = ({
    title,
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Ara...",
    searchWidth = "w-full",
    children,
    className = "",
}) => {
    return (
        <div className={`flex items-center justify-between mb-6 ${className}`}>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={onSearchChange}
                        className={`pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${searchWidth}`}
                    />
                </div>
                {children}
            </div>
        </div>
    );
};

export default Header;
