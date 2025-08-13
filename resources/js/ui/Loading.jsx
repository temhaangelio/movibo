import React from "react";

const Loading = ({
    size = "md",
    variant = "spinner",
    className = "",
    text = "Yükleniyor...",
    showText = false,
    ...props
}) => {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    };

    const textSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
    };

    const Spinner = () => (
        <div
            className={`animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-300 ${sizes[size]} ${className}`}
            {...props}
        />
    );

    const Dots = () => (
        <div className={`flex space-x-1 ${className}`} {...props}>
            <div
                className={`${sizes[size]} bg-gray-900 dark:bg-gray-300 rounded-full animate-bounce`}
                style={{ animationDelay: "0ms" }}
            />
            <div
                className={`${sizes[size]} bg-gray-900 dark:bg-gray-300 rounded-full animate-bounce`}
                style={{ animationDelay: "150ms" }}
            />
            <div
                className={`${sizes[size]} bg-gray-900 dark:bg-gray-300 rounded-full animate-bounce`}
                style={{ animationDelay: "300ms" }}
            />
        </div>
    );

    const Pulse = () => (
        <div
            className={`${sizes[size]} bg-gray-900 dark:bg-gray-300 rounded-full animate-pulse ${className}`}
            {...props}
        />
    );

    const variants = {
        spinner: Spinner,
        dots: Dots,
        pulse: Pulse,
    };

    const LoadingComponent = variants[variant];

    if (showText) {
        return (
            <div className="flex flex-col items-center justify-center space-y-2">
                <LoadingComponent />
                <p
                    className={`text-gray-600 dark:text-gray-400 ${textSizes[size]}`}
                >
                    {text}
                </p>
            </div>
        );
    }

    return <LoadingComponent />;
};

export default Loading;
