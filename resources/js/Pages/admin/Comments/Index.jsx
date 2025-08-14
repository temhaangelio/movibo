import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import Confirm from "/ui/Confirm";
import {
    ChatCircle,
    Trash,
    Eye,
    User,
    MagnifyingGlass,
} from "@phosphor-icons/react";

const Index = ({ comments }) => {
    const { t } = useTranslation();
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredComments =
        comments.data?.filter((comment) => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                comment.user?.name?.toLowerCase().includes(searchLower) ||
                comment.content?.toLowerCase().includes(searchLower) ||
                comment.post?.id?.toString().includes(searchLower)
            );
        }) || [];

    const handleDelete = (commentId) => {
        setDeleteCommentId(commentId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteCommentId) {
            router.delete(`/panel/comments/${deleteCommentId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeleteCommentId(null);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Yorum Yönetimi" />

            <Card>
                <div className="p-6">
                    {/* Header with Search */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Yorum Yönetimi
                        </h2>
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Kullanıcı, yorum veya paylaşım ID ara..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Toplam: {filteredComments.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Yorum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Paylaşım
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredComments.map((comment) => (
                                    <tr key={comment.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {comment.content?.substring(
                                                    0,
                                                    100
                                                )}
                                                {comment.content?.length >
                                                    100 && "..."}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {comment.user?.name ||
                                                            "Bilinmeyen Kullanıcı"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                <Link
                                                    href={`/panel/posts/${comment.post?.id}`}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    Paylaşım #{comment.post?.id}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(
                                                comment.created_at
                                            ).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/panel/comments/${comment.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Görüntüle
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(comment.id)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <Trash className="w-4 h-4 mr-1" />
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* Pagination */}
            {comments.links && (
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Toplam {comments.total} yorumdan {comments.from}-
                            {comments.to} arası gösteriliyor
                        </div>
                        <div className="flex space-x-2">
                            {comments.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Yorumu Sil"
                message="Bu yorumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;
