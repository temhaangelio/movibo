import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import ApplicationLogo from "/ui/Logo";
import {
    Gear,
    House,
    MagnifyingGlass,
    Plus,
    Bell,
    User,
    Sun,
    Moon,
    Shield,
    Question,
} from "@phosphor-icons/react";

const UserLayout = ({ children, auth }) => {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Auth prop'u yoksa usePage'den al
    const userAuth = auth || usePage().props.auth;
    const { url } = usePage();

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
            console.log("Tema durumu kontrol edildi:", isDarkMode);
        };

        checkTheme();

        // Tema değişikliklerini dinle
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Okunmamış bildirim sayısını al
    useEffect(() => {
        fetch("/api/notifications/unread-count")
            .then((response) => response.json())
            .then((data) => setUnreadCount(data.count))
            .catch((error) =>
                console.error("Bildirim sayısı alınamadı:", error)
            );
    }, []);

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem("theme") || "auto";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        console.log("Tema değiştiriliyor:", { currentTheme, newTheme });

        // Doğrudan DOM manipülasyonu
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", newTheme);
        setIsDark(newTheme === "dark");

        console.log("Tema değiştirildi:", newTheme);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Mobile Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/home" className="flex items-center">
                            <ApplicationLogo className="text-gray-900 text-2xl dark:text-white" />
                        </Link>
                        <div className="flex items-center space-x-2">
                            {userAuth?.user?.is_admin && (
                                <Link
                                    href="/panel"
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    title="Admin Panel"
                                >
                                    <Shield className="w-6 h-6" />
                                </Link>
                            )}
                            <Link
                                href="/settings"
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title={t("settings")}
                            >
                                <Gear className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24 px-4">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
                <div className="flex justify-around items-center py-2">
                    {/* Ana Sayfa */}
                    <Link
                        href="/home"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/home")
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <House
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/home") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Keşfet */}
                    <Link
                        href="/discover"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/discover")
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <MagnifyingGlass
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/discover") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Yeni Paylaşım */}
                    <Link
                        href="/create"
                        className="flex flex-col items-center py-2 px-3"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                                url.startsWith("/create")
                                    ? "bg-blue-600 dark:bg-blue-500"
                                    : "bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600"
                            } transition-colors`}
                        >
                            <Plus
                                className="w-6 h-6 text-white"
                                weight="bold"
                            />
                        </div>
                    </Link>

                    {/* Bildirimler */}
                    <Link
                        href="/notifications"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                            url.startsWith("/notifications")
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <div className="relative">
                            <Bell
                                className="w-6 h-6"
                                weight={
                                    url.startsWith("/notifications")
                                        ? "fill"
                                        : "regular"
                                }
                            />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* Profil */}
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/profile")
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <User
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/profile") ? "fill" : "regular"
                            }
                        />
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default UserLayout;
