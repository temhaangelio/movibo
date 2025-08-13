import React from "react";
import { Head, Link } from "@inertiajs/react";
import Buton from "/ui/Buton";

const PostsIndex = ({ auth, posts }) => {
    return (
        <>
            <Head title="Paylaşım Yönetimi" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/admin"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    ← Geri
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Paylaşım Yönetimi
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {posts.total} paylaşım
                                </span>
                                <Link
                                    href="/"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Siteye Dön
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Paylaşımlar Tablosu */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Paylaşım
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kullanıcı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Medya
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Yorumlar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Beğeniler
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tarih
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.data && posts.data.length > 0 ? (
                                        posts.data.map((post) => (
                                            <tr
                                                key={post.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {post.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {post.content.substring(
                                                                0,
                                                                50
                                                            )}
                                                            ...
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 text-xs font-medium">
                                                                {post.user?.name?.charAt(
                                                                    0
                                                                ) || "U"}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    post.user
                                                                        ?.name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                post.media_type ===
                                                                "movie"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            }`}
                                                        >
                                                            {post.media_type ===
                                                            "movie"
                                                                ? "Film"
                                                                : "Kitap"}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {post.media_title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {post.comments_count ||
                                                            0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {post.likes_count || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(
                                                            post.created_at
                                                        ).toLocaleDateString(
                                                            "tr-TR"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/admin/posts/${post.id}`}
                                                        >
                                                            <Buton
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Görüntüle
                                                            </Buton>
                                                        </Link>
                                                        <Buton
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        "Bu paylaşımı silmek istediğinizden emin misiniz?"
                                                                    )
                                                                ) {
                                                                    // Silme işlemi
                                                                }
                                                            }}
                                                        >
                                                            Sil
                                                        </Buton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                Henüz paylaşım yok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {posts.links && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {posts.prev_page_url && (
                                            <Link
                                                href={posts.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Önceki
                                            </Link>
                                        )}
                                        {posts.next_page_url && (
                                            <Link
                                                href={posts.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Sonraki
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium">
                                                    {posts.from}
                                                </span>{" "}
                                                -{" "}
                                                <span className="font-medium">
                                                    {posts.to}
                                                </span>{" "}
                                                arası, toplam{" "}
                                                <span className="font-medium">
                                                    {posts.total}
                                                </span>{" "}
                                                paylaşım
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {posts.links.map(
                                                    (link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                link.active
                                                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostsIndex;
