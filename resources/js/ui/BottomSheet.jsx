import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";

const BottomSheet = ({ isOpen, onClose, title, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setStartY(clientY);
        setCurrentY(clientY);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startY;
        if (deltaY > 0) {
            setCurrentY(clientY);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const deltaY = currentY - startY;
        if (deltaY > 100) {
            handleClose();
        } else {
            setCurrentY(startY);
        }
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

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e) => {
                handleTouchMove(e);
            };

            const handleMouseUp = () => {
                handleTouchEnd();
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, startY, currentY]);

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
            <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center text-white">
                <div
                    className={`bg-black rounded-t-xl shadow-lg w-full max-w-md mx-4 transform transition-all duration-300 ease-out ${
                        isVisible ? "translate-y-0" : "translate-y-full"
                    }`}
                    style={{
                        height: "80vh",
                        maxHeight: "600px",
                        transform: isDragging
                            ? `translateY(${currentY - startY}px)`
                            : "",
                    }}
                >
                    {/* Handle */}
                    <div
                        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                    >
                        <div className="w-12 h-1 bg-neutral-700 rounded-full" />
                    </div>

                    {/* Content */}
                    <div
                        className="overflow-y-auto h-full bg-black"
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
