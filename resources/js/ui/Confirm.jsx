import React from "react";

const Confirm = ({
    open,
    onClose,
    onConfirm,
    title = "Onayla",
    message = "Bu işlemi yapmak istediğinize emin misiniz?",
    confirmText = "Evet",
    cancelText = "Vazgeç",
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-black rounded-lg shadow-lg p-6 w-full max-w-xs text-white">
                <h3 className="text-lg font-semibold mb-2 text-white text-center">
                    {title}
                </h3>
                <p className="mb-4 text-white text-center">{message}</p>
                <div className="flex justify-between space-x-2">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 rounded bg-neutral-800 text-white font-semibold transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full px-4 py-2 rounded bg-neutral-800 text-white font-semibold transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
