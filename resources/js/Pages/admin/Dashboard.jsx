import React from "react";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import {
    Users,
    Article,
    ChatCircle,
    Eye,
    Heart,
    Calendar,
} from "@phosphor-icons/react";

const Dashboard = ({ stats, recentUsers, recentPosts, recentComments }) => {
    const { t } = useTranslation();

    const summaryCards = [
        {
            title: "Toplam Kullanıcı",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "bg-purple-100 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400",
            iconColor: "text-purple-600 dark:text-purple-400",
        },
        {
            title: "Toplam Paylaşım",
            value: stats?.totalPosts || 0,
            icon: Article,
            color: "bg-gray-100 dark:bg-gray-800",
            textColor: "text-gray-600 dark:text-gray-400",
            iconColor: "text-gray-600 dark:text-gray-400",
        },
        {
            title: "Toplam Beğeni",
            value: stats?.totalLikes || 0,
            icon: Heart,
            color: "bg-red-100 dark:bg-red-900/20",
            textColor: "text-red-600 dark:text-red-400",
            iconColor: "text-red-600 dark:text-red-400",
        },
        {
            title: "Toplam Yorum",
            value: stats?.totalComments || 0,
            icon: ChatCircle,
            color: "bg-pink-100 dark:bg-pink-900/20",
            textColor: "text-pink-600 dark:text-pink-400",
            iconColor: "text-pink-600 dark:text-pink-400",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {summaryCards.map((card, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                        {card.value.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${card.color}`}>
                                    <card.icon
                                        className={`w-6 h-6 ${card.iconColor}`}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Recent Activities */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Son Aktiviteler
                        </h2>
                        <Link
                            href="/panel"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Tümünü Gör
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {/* Yeni Kullanıcı Kayıtları */}
                        {recentUsers?.slice(0, 3).map((user) => (
                            <div
                                key={`user-${user.id}`}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-medium">
                                            {user.name}
                                        </span>{" "}
                                        sisteme kayıt oldu
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        @{user.username} •{" "}
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Yeni Paylaşımlar */}
                        {recentPosts?.slice(0, 3).map((post) => (
                            <div
                                key={`post-${post.id}`}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <Article className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-medium">
                                            {post.user?.name}
                                        </span>{" "}
                                        yeni bir paylaşım yaptı
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {post.content?.substring(0, 50)}... •{" "}
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Yeni Yorumlar */}
                        {recentComments?.slice(0, 3).map((comment) => (
                            <div
                                key={`comment-${comment.id}`}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                                    <ChatCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-medium">
                                            {comment.user?.name}
                                        </span>{" "}
                                        bir paylaşıma yorum yaptı
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {comment.content?.substring(0, 50)}... •{" "}
                                        {new Date(
                                            comment.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Beğeni Aktiviteleri */}
                        {recentPosts?.slice(0, 2).map((post) => (
                            <div
                                key={`like-${post.id}`}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-medium">
                                            {post.user?.name}
                                        </span>{" "}
                                        paylaşımı {post.likes_count || 0} beğeni
                                        aldı
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {post.content?.substring(0, 50)}... •{" "}
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
