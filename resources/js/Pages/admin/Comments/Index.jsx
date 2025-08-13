import React from "react";
import { Head, Link } from "@inertiajs/react";
import Buton from "/ui/Buton";

const CommentsIndex = ({ auth, comments }) => {
    return (
        <>
            <Head title="Yorum Yönetimi" />

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
                                    Yorum Yönetimi
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {comments.total} yorum
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
                    {/* Yorumlar Tablosu */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Yorum
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kullanıcı
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Paylaşım
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
                                    {comments.data &&
                                    comments.data.length > 0 ? (
                                        comments.data.map((comment) => (
                                            <tr
                                                key={comment.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="max-w-md">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {comment.content
                                                                .length > 100
                                                                ? comment.content.substring(
                                                                      0,
                                                                      100
                                                                  ) + "..."
                                                                : comment.content}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 text-xs font-medium">
                                                                {comment.user?.name?.charAt(
                                                                    0
                                                                ) || "U"}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    comment.user
                                                                        ?.name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        <Link
                                                            href={`/admin/posts/${comment.post?.id}`}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            {comment.post
                                                                ?.title ||
                                                                "Silinmiş Paylaşım"}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(
                                                            comment.created_at
                                                        ).toLocaleDateString(
                                                            "tr-TR"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/admin/comments/${comment.id}`}
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
                                                                        "Bu yorumu silmek istediğinizden emin misiniz?"
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
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                Henüz yorum yok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {comments.links && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {comments.prev_page_url && (
                                            <Link
                                                href={comments.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Önceki
                                            </Link>
                                        )}
                                        {comments.next_page_url && (
                                            <Link
                                                href={comments.next_page_url}
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
                                                    {comments.from}
                                                </span>{" "}
                                                -{" "}
                                                <span className="font-medium">
                                                    {comments.to}
                                                </span>{" "}
                                                arası, toplam{" "}
                                                <span className="font-medium">
                                                    {comments.total}
                                                </span>{" "}
                                                yorum
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {comments.links.map(
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

export default CommentsIndex;
