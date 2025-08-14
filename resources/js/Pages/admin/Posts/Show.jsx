import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import { ArrowLeft, User, Calendar, Heart, ChatCircle, Trash, Eye } from "@phosphor-icons/react";

const Show = ({ post }) => {
    return (
        <AdminLayout>
            <Head title={`Post Detayı - ${post.media_title || 'Paylaşım'}`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/panel/posts"
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Geri Dön</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Post Content */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {post.user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        @{post.user.username}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                {new Date(post.created_at).toLocaleDateString("tr-TR")}
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-6">
                            <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
                                {post.content}
                            </p>
                        </div>

                        {/* Media Info */}
                        {post.media_title && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {post.media_title}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {post.media_type && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Tür:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white capitalize">
                                                {post.media_type}
                                            </span>
                                        </div>
                                    )}
                                    {post.media_genre && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Tür:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {post.media_genre}
                                            </span>
                                        </div>
                                    )}
                                    {post.media_rating && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Puan:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {post.media_rating}/10
                                            </span>
                                        </div>
                                    )}
                                    {post.user_rating && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Kullanıcı Puanı:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {post.user_rating}/10
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {post.media_description && (
                                    <div className="mt-3">
                                        <span className="text-gray-500 dark:text-gray-400">Açıklama:</span>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {post.media_description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Post Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{post.likes_count || 0} beğeni</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <ChatCircle className="w-4 h-4" />
                                    <span>{post.comments_count || 0} yorum</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Comments */}
                    {post.comments && post.comments.length > 0 && (
                        <Card className="p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Yorumlar ({post.comments.length})
                            </h3>
                            <div className="space-y-4">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {comment.user.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        @{comment.user.username}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {comment.content}
                                                </p>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    {new Date(comment.created_at).toLocaleString("tr-TR")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* User Info */}
                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Kullanıcı Bilgileri
                        </h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xl">
                                    {post.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {post.user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    @{post.user.username}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    {post.user.email}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Kayıt: {new Date(post.user.created_at).toLocaleDateString("tr-TR")}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                <span>Durum: {post.user.is_admin ? 'Admin' : 'Kullanıcı'}</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Link
                                href={`/panel/users/${post.user.id}`}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Kullanıcıyı Görüntüle
                            </Link>
                            <Link
                                href={`/panel/users/${post.user.id}/activities`}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Aktiviteleri Görüntüle
                            </Link>
                        </div>
                    </Card>

                    {/* Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            İşlemler
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    if (confirm('Bu paylaşımı silmek istediğinize emin misiniz?')) {
                                        // Delete post logic
                                    }
                                }}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Trash className="w-4 h-4 mr-2" />
                                Paylaşımı Sil
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;
