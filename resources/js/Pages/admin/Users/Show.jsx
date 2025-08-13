import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Buton from "/ui/Buton";
import {
    User,
    Envelope,
    Calendar,
    MapPin,
    Globe,
    ArrowLeft,
    Eye,
    Heart,
    ChatCircle,
    Article,
} from "@phosphor-icons/react";

const Show = ({ user, userPosts, userStats }) => {
    return (
        <AdminLayout>
            <Head title={`${user.name} - Kullanıcı Detayı`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/panel/users"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Geri Dön</span>
                        </Link>
                    </div>
                </div>

                {/* User Profile Card */}
                <Card className="p-6">
                    <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {user.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Envelope className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <User className="w-4 h-4" />
                                        <span>@{user.username}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Kayıt:{" "}
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Article className="w-4 h-4" />
                                        <span>
                                            {userStats?.totalPosts || 0}{" "}
                                            paylaşım
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Heart className="w-4 h-4" />
                                        <span>
                                            {userStats?.totalLikes || 0} beğeni
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <ChatCircle className="w-4 h-4" />
                                        <span>
                                            {userStats?.totalComments || 0}{" "}
                                            yorum
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Link href={`/users/${user.username}`}>
                                <Buton variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Profili Görüntüle
                                </Buton>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Toplam Paylaşım
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {userStats?.totalPosts || 0}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <Article className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Toplam Beğeni
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {userStats?.totalLikes || 0}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Toplam Yorum
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {userStats?.totalComments || 0}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                                <ChatCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Posts */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Son Paylaşımlar
                        </h3>
                        <Link
                            href={`/users/${user.id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Tümünü Gör
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {userPosts?.length === 0 ? (
                            <div className="text-center py-8">
                                <Article className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Henüz paylaşım bulunmuyor.
                                </p>
                            </div>
                        ) : (
                            userPosts?.slice(0, 5).map((post) => (
                                <div
                                    key={post.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-white mb-2">
                                                {post.content?.substring(
                                                    0,
                                                    150
                                                )}
                                                {post.content?.length > 150 &&
                                                    "..."}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {new Date(
                                                            post.created_at
                                                        ).toLocaleDateString(
                                                            "tr-TR"
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Heart className="w-3 h-3" />
                                                    <span>
                                                        {post.likes_count || 0}{" "}
                                                        beğeni
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <ChatCircle className="w-3 h-3" />
                                                    <span>
                                                        {post.comments_count ||
                                                            0}{" "}
                                                        yorum
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Show;
