import React from "react";

const Table = ({ children, className = "" }) => {
    return (
        <div className="overflow-x-auto overflow-y-visible relative" style={{ overflow: "visible" }}>
            <table
                className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
                style={{ overflow: "visible" }}
            >
                {children}
            </table>
        </div>
    );
};

const TableHead = ({ children, className = "" }) => {
    return (
        <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
            {children}
        </thead>
    );
};

const TableBody = ({ children, className = "" }) => {
    return (
        <tbody
            className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
        >
            {children}
        </tbody>
    );
};

const TableRow = ({ children, className = "", ...props }) => {
    return (
        <tr
            className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
};

const TableHeader = ({
    children,
    className = "",
    align = "left",
    ...props
}) => {
    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <th
            className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${alignClasses[align]} ${className}`}
            {...props}
        >
            {children}
        </th>
    );
};

const TableCell = ({ children, className = "", align = "left", ...props }) => {
    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <td
            className={`px-6 py-4 whitespace-nowrap text-sm ${alignClasses[align]} ${className}`}
            {...props}
        >
            {children}
        </td>
    );
};

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell };
