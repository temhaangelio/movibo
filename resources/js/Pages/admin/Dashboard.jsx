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
                    </div>
                    <div>
                        {/* Tüm aktiviteleri birleştir ve tarihe göre sırala */}
                        {(() => {
                            const allActivities = [
                                // Kullanıcı kayıtları
                                ...(recentUsers?.slice(0, 3).map((user) => ({
                                    id: `user-${user.id}`,
                                    type: "user",
                                    user: user,
                                    content: `${user.name} sisteme kayıt oldu`,
                                    created_at: user.created_at,
                                    icon: Users,
                                    bgColor: "bg-blue-600",
                                    link: `/panel/users/${user.id}`,
                                })) || []),

                                // Paylaşımlar
                                ...(recentPosts?.slice(0, 3).map((post) => ({
                                    id: `post-${post.id}`,
                                    type: "post",
                                    user: post.user,
                                    content: `${post.user?.name} yeni bir paylaşım yaptı`,
                                    description:
                                        post.content?.substring(0, 50) + "...",
                                    created_at: post.created_at,
                                    icon: Article,
                                    bgColor: "bg-green-600",
                                    link: `/panel/posts/${post.id}`,
                                })) || []),

                                // Yorumlar
                                ...(recentComments
                                    ?.slice(0, 3)
                                    .map((comment) => ({
                                        id: `comment-${comment.id}`,
                                        type: "comment",
                                        user: comment.user,
                                        content: `${comment.user?.name} bir paylaşıma yorum yaptı`,
                                        description:
                                            comment.content?.substring(0, 50) +
                                            "...",
                                        created_at: comment.created_at,
                                        icon: ChatCircle,
                                        bgColor: "bg-pink-600",
                                        link: `/panel/comments/${comment.id}`,
                                    })) || []),

                                // Beğeniler
                                ...(recentPosts?.slice(0, 2).map((post) => ({
                                    id: `like-${post.id}`,
                                    type: "like",
                                    user: post.user,
                                    content: `${post.user?.name} paylaşımı ${
                                        post.likes_count || 0
                                    } beğeni aldı`,
                                    description:
                                        post.content?.substring(0, 50) + "...",
                                    created_at: post.created_at,
                                    icon: Heart,
                                    bgColor: "bg-red-600",
                                    link: `/panel/posts/${post.id}`,
                                })) || []),
                            ];

                            // Tarihe göre sırala (en yeni önce)
                            const sortedActivities = allActivities
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at) -
                                        new Date(a.created_at)
                                )
                                .slice(0, 8); // En son 8 aktiviteyi göster

                            return sortedActivities.map((activity) => (
                                <Link
                                    key={activity.id}
                                    href={activity.link}
                                    className="flex items-center space-x-4 p-3 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700"
                                >
                                    <div
                                        className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}
                                    >
                                        <activity.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {activity.content}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.description && (
                                                <>{activity.description} • </>
                                            )}
                                            {new Date(
                                                activity.created_at
                                            ).toLocaleDateString("tr-TR")}
                                        </p>
                                    </div>
                                </Link>
                            ));
                        })()}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
