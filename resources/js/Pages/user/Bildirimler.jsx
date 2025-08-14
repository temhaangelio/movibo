import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";
import Pagination from "/ui/Pagination";
import TimeAgo from "/ui/TimeAgo";
import {
    Bell,
    Check,
    CheckCircle,
    Trash,
    User,
    Heart,
    ChatCircle,
    Plus,
    Question,
} from "@phosphor-icons/react";

const Bildirimler = ({
    notifications = { data: [], links: [], total: 0, from: 0, to: 0 },
}) => {
    const { t } = useTranslation();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Okunmamış bildirim sayısını al
        fetch("/api/notifications/unread-count")
            .then((response) => response.json())
            .then((data) => setUnreadCount(data.count))
            .catch((error) =>
                console.error("Bildirim sayısı alınamadı:", error)
            );
    }, []);

    const markAsRead = (notificationId) => {
        fetch(`/api/notifications/${notificationId}/mark-read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Sayfayı yenile
                    router.reload();
                }
            })
            .catch((error) => console.error("Bildirim işaretlenemedi:", error));
    };

    const markAllAsRead = () => {
        fetch("/api/notifications/mark-all-read", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Sayfayı yenile
                    router.reload();
                }
            })
            .catch((error) =>
                console.error("Bildirimler işaretlenemedi:", error)
            );
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "follow":
                return <User className="w-5 h-5 text-blue-500" />;
            case "like":
                return <Heart className="w-5 h-5 text-red-500" />;
            case "comment":
                return <ChatCircle className="w-5 h-5 text-green-500" />;
            case "post":
                return <Plus className="w-5 h-5 text-purple-500" />;
            case "support":
                return <Question className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationLink = (notification) => {
        switch (notification.type) {
            case "support":
                return "/support";
            case "follow":
                return `/profile/${notification.from_user_id}`;
            case "like":
            case "comment":
                return `/post/${notification.data?.post_id}`;
            default:
                return "#";
        }
    };

    return (
        <UserLayout>
            <Head title="Bildirimler" />

            <div className="w-full mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Bildirimler
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Tüm bildirimlerinizi buradan takip edebilirsiniz
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Buton
                            onClick={markAllAsRead}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Tümünü Okundu İşaretle</span>
                        </Buton>
                    )}
                </div>

                <Card className="p-6">
                    {notifications.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Henüz bildiriminiz yok!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Yeni aktiviteler olduğunda burada görünecek.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.data?.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                                        notification.is_read
                                            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                                    }`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                {notification.from_user && (
                                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-semibold">
                                                            {notification.from_user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {notification.content}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <TimeAgo
                                                            date={
                                                                notification.created_at
                                                            }
                                                        />
                                                        {!notification.is_read && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                Yeni
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                                        title="Okundu olarak işaretle"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {getNotificationLink(
                                                    notification
                                                ) !== "#" && (
                                                    <Link
                                                        href={getNotificationLink(
                                                            notification
                                                        )}
                                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                                        title="Görüntüle"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.links && (
                        <div className="mt-6">
                            <Pagination
                                links={notifications.links}
                                total={notifications.total || 0}
                                from={notifications.from || 0}
                                to={notifications.to || 0}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </UserLayout>
    );
};

export default Bildirimler;
