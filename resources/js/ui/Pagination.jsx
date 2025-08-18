import React from "react";
import { Link } from "@inertiajs/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const Pagination = ({ links, total, from, to, className = "" }) => {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className={`mt-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Toplam {total} kayıttan {from}-{to} arası gösteriliyor
                </div>
                <div className="flex space-x-2">
                    {links.map((link, index) => {
                        // Previous ve Next link'lerini ikonlarla değiştir
                        const isPrevious =
                            link.label.includes("Previous") ||
                            link.label.includes("Önceki");
                        const isNext =
                            link.label.includes("Next") ||
                            link.label.includes("Sonraki");

                        if (link.url) {
                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                    }`}
                                    title={
                                        isPrevious
                                            ? "Önceki"
                                            : isNext
                                            ? "Sonraki"
                                            : ""
                                    }
                                >
                                    {isPrevious ? (
                                        <CaretLeft className="w-4 h-4" />
                                    ) : isNext ? (
                                        <CaretRight className="w-4 h-4" />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        } else {
                            return (
                                <span
                                    key={index}
                                    className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                                    title={
                                        isPrevious
                                            ? "Önceki"
                                            : isNext
                                            ? "Sonraki"
                                            : ""
                                    }
                                >
                                    {isPrevious ? (
                                        <CaretLeft className="w-4 h-4" />
                                    ) : isNext ? (
                                        <CaretRight className="w-4 h-4" />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </span>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
