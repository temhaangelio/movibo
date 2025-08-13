import React from "react";

const Tab = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex w-full  border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 w-full transition-colors h-14 ${
                        activeTab === tab.id
                            ? "text-gray-900 dark:text-white font-bold border-b-4 border-gray-900 dark:border-gray-100"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tab;
