import React from "react";

const Switch = ({
    checked,
    onChange,
    disabled = false,
    size = "md",
    className = "",
    ...props
}) => {
    const sizeClasses = {
        sm: "w-9 h-5",
        md: "w-11 h-6",
        lg: "w-14 h-7",
    };

    const switchClasses = {
        sm: "after:h-4 after:w-4 after:top-[2px] after:left-[2px]",
        md: "after:h-5 after:w-5 after:top-[2px] after:left-[2px]",
        lg: "after:h-6 after:w-6 after:top-[2px] after:left-[2px]",
    };

    return (
        <label
            className={`relative inline-flex items-center cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="sr-only peer"
                {...props}
            />
            <div
                className={`
                ${sizeClasses[size]} 
                bg-gray-200 
                peer-focus:outline-none 
                peer-focus:ring-4 
                peer-focus:ring-gray-300 
                dark:peer-focus:ring-gray-600 
                rounded-full 
                peer 
                dark:bg-gray-600 
                peer-checked:after:translate-x-full 
                peer-checked:after:border-white 
                after:content-[''] 
                after:absolute 
                after:bg-white 
                after:border-gray-300 
                after:border 
                after:rounded-full 
                after:transition-all 
                after:duration-200
                dark:border-gray-500 
                peer-checked:bg-black
                dark:peer-checked:bg-black
                dark:after:border-gray-500
                ${switchClasses[size]}
                ${disabled ? "cursor-not-allowed" : ""}
            `}
            ></div>
        </label>
    );
};

export default Switch;
