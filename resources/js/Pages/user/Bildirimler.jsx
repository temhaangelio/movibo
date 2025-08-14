import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import TimeAgo from "/ui/TimeAgo";
import { Bell, Heart, UserPlus, ChatCircle } from "@phosphor-icons/react";

const Bildirimler = ({ auth }) => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Bildirimleri yükle
    const loadNotifications = async (pageNum = 1) => {
        try {
            const response = await fetch(`/api/notifications?page=${pageNum}`);
            const data = await response.json();

            if (pageNum === 1) {
                setNotifications(data.notifications.data);
            } else {
                setNotifications((prev) => [
                    ...prev,
                    ...data.notifications.data,
                ]);
            }

            setUnreadCount(data.unreadCount);
            setHasMore(data.notifications.next_page_url !== null);
            setPage(data.notifications.current_page);
        } catch (error) {
            console.error("Bildirimler yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    // Bildirimi okundu olarak işaretle
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                `/api/notifications/${notificationId}/read`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === notificationId
                            ? { ...notification, is_read: true }
                            : notification
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Bildirim işaretlenirken hata:", error);
        }
    };

    // Tüm bildirimleri okundu olarak işaretle
    const markAllAsRead = async () => {
        try {
            const response = await fetch("/api/notifications/read-all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        is_read: true,
                    }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Bildirimler işaretlenirken hata:", error);
        }
    };

    // Daha fazla bildirim yükle
    const loadMore = () => {
        if (hasMore && !loading) {
            loadNotifications(page + 1);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case "like":
                return "text-red-500";
            case "follow":
                return "text-blue-500";
            case "comment":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("notifications")} />
            <div className="px-4 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    {/* Bildirim Listesi */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading && notifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-gray-900 mx-auto"></div>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    {t(
                                        "loading_notifications",
                                        "Bildirimler yükleniyor..."
                                    )}
                                </p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <Bell className="w-12 h-12  mx-auto mb-4" />
                                <p>{t("no_notifications")}</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                        !notification.is_read
                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        !notification.is_read &&
                                        markAsRead(notification.id)
                                    }
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Kullanıcı Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {notification.from_user?.name?.charAt(
                                                        0
                                                    ) || "U"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bildirim İçeriği */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {notification.content}
                                                </p>
                                                {!notification.is_read && (
                                                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                                )}
                                            </div>
                                            <TimeAgo
                                                date={notification.created_at}
                                                className="text-xs mt-1"
                                            />
                                        </div>

                                        {/* Bildirim Türü İkonu */}
                                        <div className="flex-shrink-0">
                                            {notification.type === "like" && (
                                                <Heart
                                                    className={`w-5 h-5 ${getTypeColor(
                                                        notification.type
                                                    )}`}
                                                />
                                            )}
                                            {notification.type === "follow" && (
                                                <UserPlus
                                                    className={`w-5 h-5 ${getTypeColor(
                                                        notification.type
                                                    )}`}
                                                />
                                            )}
                                            {notification.type ===
                                                "comment" && (
                                                <ChatCircle
                                                    className={`w-5 h-5 ${getTypeColor(
                                                        notification.type
                                                    )}`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Daha Fazla Yükle */}
                    {hasMore && (
                        <div className="p-4 text-center">
                            <Buton
                                onClick={loadMore}
                                disabled={loading}
                                variant="secondary"
                                size="sm"
                            >
                                {loading ? "Yükleniyor..." : "Daha Fazla"}
                            </Buton>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default Bildirimler;
