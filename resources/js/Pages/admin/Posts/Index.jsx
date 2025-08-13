import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import Confirm from "/ui/Confirm";
import {
    Article,
    Trash,
    Eye,
    User,
    MagnifyingGlass,
    Heart,
    ChatCircle,
} from "@phosphor-icons/react";

const Index = ({ posts }) => {
    const { t } = useTranslation();
    const [deletePostId, setDeletePostId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (postId) => {
        setDeletePostId(postId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletePostId) {
            router.delete(`/panel/posts/${deletePostId}`, {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setDeletePostId(null);
                },
            });
        }
    };

    const filteredPosts =
        posts.data?.filter(
            (post) =>
                post.content
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                post.user?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        ) || [];

    return (
        <AdminLayout>
            <Head title="Paylaşım Yönetimi" />

            <Card className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                        <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Paylaşım ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Paylaşım
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Kullanıcı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Beğeni
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Yorum
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPosts.map((post) => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                            {post.content?.substring(0, 100)}
                                            {post.content?.length > 100 &&
                                                "..."}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {post.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {post.user?.name ||
                                                        "Bilinmeyen Kullanıcı"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Heart className="w-4 h-4 text-red-500 mr-1" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {post.likes_count || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <ChatCircle className="w-4 h-4 text-blue-500 mr-1" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {post.comments_count || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/panel/posts/${post.id}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Görüntüle
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(post.id)
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

                {/* Pagination */}
                {posts.links && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Toplam {posts.total} paylaşımdan {posts.from}-
                                {posts.to} arası gösteriliyor
                            </div>
                            <div className="flex space-x-2">
                                {posts.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
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
            </Card>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Paylaşımı Sil"
                message="Bu paylaşımı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </AdminLayout>
    );
};

export default Index;
