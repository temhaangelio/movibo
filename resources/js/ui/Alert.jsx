import React, { useState, useEffect } from "react";
import { CheckCircle, Warning, XCircle, Info } from "@phosphor-icons/react";

const Alert = ({ type = "error", message, onClose, open }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [open]);

    if (!open) return null;

    const alertClasses = {
        error: "bg-white border-gray-300 text-gray-900",
        success: "bg-white border-gray-300 text-gray-900",
        warning: "bg-white border-gray-300 text-gray-900",
        info: "bg-white border-gray-300 text-gray-900",
    };

    const alertIcons = {
        error: <XCircle className="w-16 h-16 text-black" />,
        success: <CheckCircle className="w-16 h-16 text-black" />,
        warning: <Warning className="w-16 h-16 text-black" />,
        info: <Info className="w-16 h-16 text-black" />,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div
                className={`border rounded-lg p-6 shadow-lg transform transition-all duration-300 ease-in-out max-w-sm w-full mx-4 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                } ${alertClasses[type]}`}
            >
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex-shrink-0">{alertIcons[type]}</div>
                    <div className="flex-1 mb-8">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(() => {
                                    onClose();
                                }, 300);
                            }}
                            className=" px-4 py-2 bg-black hover:bg-gray-800 w-full text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Tamam
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Alert;
