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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {message}
                </p>
                <div className="flex justify-between space-x-2">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
