import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import Buton from "/ui/Buton";
import Card from "/ui/Card";

import TimeAgo from "/ui/TimeAgo";
import { Bell, CheckCircle, Trash } from "@phosphor-icons/react";

const Bildirimler = ({
    auth,
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

        // Sayfa yüklendiğinde tüm bildirimleri okundu olarak işaretle
        markAllAsRead();
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

    const getNotificationLink = (notification) => {
        switch (notification.type) {
            case "support":
                return "/support";
            case "follow":
                return `/users/${
                    notification.from_user?.username ||
                    notification.from_user_id
                }`;
            case "like":
            case "comment":
                return `/post/${notification.data?.post_id}`;
            default:
                return "#";
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Bildirimler" />

            <div className="w-full mx-auto pt-4">
                <Card className="p-6">
                    {notifications.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Henüz bildiriminiz yok!
                            </h3>
                            <p className="text-gray-500">
                                Yeni aktiviteler olduğunda burada görünecek.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.data?.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        const link =
                                            getNotificationLink(notification);
                                        if (link !== "#") {
                                            window.location.href = link;
                                        }
                                    }}
                                    className={`flex items-start border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 transition-colors cursor-pointer hover:bg-gray-50 ${
                                        notification.is_read
                                            ? "bg-white border-gray-200"
                                            : "bg-white border-gray-200"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    <p className="text-sm text-gray-900">
                                                        {notification.content}
                                                    </p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <TimeAgo
                                                            date={
                                                                notification.created_at
                                                            }
                                                        />
                                                        {!notification.is_read && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Yeni
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </UserLayout>
    );
};

export default Bildirimler;
