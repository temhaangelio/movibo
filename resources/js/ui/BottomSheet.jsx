import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";

const BottomSheet = ({
    isOpen,
    onClose,
    title,
    children,
    maxHeight = "max-h-[80vh]",
    minHeight = "min-h-[200px]",
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Animasyon süresi kadar bekle
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Kısa bir gecikme ile animasyonu başlat
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isVisible ? "bg-opacity-50" : "bg-opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
                <div
                    className={`bg-white dark:bg-gray-800 rounded-t-xl shadow-lg ${maxHeight} ${minHeight} max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ease-out ${
                        isVisible ? "translate-y-0" : "translate-y-full"
                    }`}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>

                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 pb-24">
                        <div className="p-4">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
