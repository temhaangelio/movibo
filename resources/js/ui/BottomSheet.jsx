import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";

const BottomSheet = ({ isOpen, onClose, title, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
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
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-[9998] ${
                    isVisible ? "bg-opacity-50" : "bg-opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center">
                <div
                    className={`bg-white rounded-t-xl shadow-lg w-full max-w-md mx-4 transform transition-all duration-300 ease-out ${
                        isVisible ? "translate-y-0" : "translate-y-full"
                    }`}
                    style={{
                        height: "80vh",
                        maxHeight: "600px",
                    }}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full" />
                    </div>

                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="overflow-y-auto h-full"
                        style={{
                            paddingBottom: "100px",
                        }}
                    >
                        <div className="p-3">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
