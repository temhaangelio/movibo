import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import ApplicationLogo from "/ui/Logo";
import BottomSheet from "/ui/BottomSheet";
import FilmEkle from "../components/FilmEkle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
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
    const [isEkleSheetOpen, setIsEkleSheetOpen] = useState(false);

    // Auth prop'u yoksa usePage'den al
    const userAuth = auth || usePage().props.auth;
    const { url } = usePage();

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
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

        // Doğrudan DOM manipülasyonu
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", newTheme);
        setIsDark(newTheme === "dark");
    };

    return (
        <div className="min-h-screen h-screen max-w-md mx-auto bg-gray-100 flex flex-col">
            {/* Mobile Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/home" className="flex items-center">
                            <ApplicationLogo className="text-gray-900 text-2xl" />
                        </Link>
                        <div className="flex items-center space-x-2">
                            {userAuth?.user?.is_admin && (
                                <Link
                                    href="/panel"
                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Admin Panel"
                                >
                                    <Shield className="w-6 h-6" />
                                </Link>
                            )}
                            <Link
                                href="/notifications"
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
                                title="Bildirimler"
                            >
                                <div className="relative">
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <Link
                                href="/settings"
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                title={t("settings")}
                            >
                                <Gear className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-28 px-4">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-10 left-0 max-w-sm mx-auto right-0 bg-black z-50 shadow-lg pb-safe rounded-full">
                <div className="flex justify-around  items-center py-1">
                    {/* Ana Sayfa */}
                    <Link
                        href="/home"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/home")
                                ? "text-white"
                                : "text-white hover:text-gray-900"
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
                                ? "text-white"
                                : "text-white hover:text-gray-900"
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
                    <button
                        onClick={() => setIsEkleSheetOpen(true)}
                        className="flex flex-col items-center py-2 px-3"
                    >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                            <Plus
                                className="w-6 h-6 text-white"
                                weight="bold"
                            />
                        </div>
                    </button>

                    {/* Rastgele */}
                    <Link
                        href="/rastgele"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/rastgele")
                                ? "text-white"
                                : "text-white hover:text-gray-900"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={faDice}
                            className={`w-6 h-6 ${
                                url.startsWith("/rastgele")
                                    ? "text-white"
                                    : "text-white"
                            }`}
                        />
                    </Link>

                    {/* Profil */}
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/profile")
                                ? "text-white"
                                : "text-white hover:text-gray-900"
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

            {/* Film Ekleme BottomSheet */}
            <BottomSheet
                isOpen={isEkleSheetOpen}
                onClose={() => setIsEkleSheetOpen(false)}
                title="Film Ekle"
            >
                <FilmEkle
                    onMovieSelect={(movie) => {
                        // Film paylaşımı yapıldıktan sonra BottomSheet'i kapat
                        setIsEkleSheetOpen(false);
                    }}
                />
            </BottomSheet>
        </div>
    );
};

export default UserLayout;
