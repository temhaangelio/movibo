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
} from "@phosphor-icons/react";

const UserLayout = ({ children, auth }) => {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);

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
        <div className="min-h-screen mx-auto bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Top Header - Tüm ekran boyutlarında görünür */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ApplicationLogo className="text-gray-900 text-3xl dark:text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Ayarlar */}
                            <Link
                                href="/settings"
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title={t("settings")}
                            >
                                <Gear className="w-7 h-7" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">{children}</main>

            {/* Bottom Navigation Bar - Tüm ekran boyutlarında görünür */}
            <nav className="fixed  bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-around">
                    {/* Ana Sayfa */}
                    <Link
                        href="/home"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <House
                            className={`w-8 h-8 mb-1 ${
                                url.startsWith("/home") ? "" : ""
                            }`}
                            weight={
                                url.startsWith("/home") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Keşfet */}
                    <Link
                        href="/discover"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <MagnifyingGlass
                            className={`w-8 h-8 mr-2 ${
                                url.startsWith("/discover") ? "" : ""
                            }`}
                            weight={
                                url.startsWith("/discover") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Yeni Paylaşım */}
                    <Link
                        href="/create"
                        className="flex flex-col items-center py-3 px-4 text-gray-600 dark:text-gray-400"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                                url.startsWith("/create")
                                    ? "bg-black dark:bg-white"
                                    : "bg-gray-900 dark:bg-gray-700"
                            }`}
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
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Bell
                            className={`w-8 h-8 mr-2 ${
                                url.startsWith("/notifications") ? "" : ""
                            }`}
                            weight={
                                url.startsWith("/notifications")
                                    ? "fill"
                                    : "regular"
                            }
                        />
                    </Link>

                    {/* Profil */}
                    <Link
                        href="/profile"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <User
                            className={`w-8 h-8 mr-2 ${
                                url.startsWith("/profile") ? "" : ""
                            }`}
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
