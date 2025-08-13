import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import TextInput from "/ui/TextInput";
import Buton from "/ui/Buton";
import Confirm from "/ui/Confirm";
import Modal from "/ui/Modal";
import Card from "/ui/Card";
import ThemeToggle from "/ui/ThemeToggle";
import Switch from "/ui/Switch";
import Dropdown from "/ui/Dropdown";
import {
    SignOut,
    Trash,
    User,
    Bell,
    Eye,
    Palette,
    Translate,
    CaretDown,
} from "@phosphor-icons/react";

const Ayarlar = ({ auth }) => {
    const { t, i18n } = useTranslation();
    const user = auth.user;
    const [currentTheme, setCurrentTheme] = useState("auto");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        setCurrentTheme(localStorage.getItem("theme") || "auto");

        // Mevcut dili kontrol et ve güncelle
        const currentLanguage = localStorage.getItem("language") || "tr";
        if (i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
        }
    }, []);

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        username: user.username || "",
        email: user.email,
        theme: localStorage.getItem("theme") || "auto",
        language: localStorage.getItem("language") || "tr",
        notification_preferences: {
            follow_notifications:
                user.notification_preferences?.follow_notifications ?? true,
            like_notifications:
                user.notification_preferences?.like_notifications ?? true,
            comment_notifications:
                user.notification_preferences?.comment_notifications ?? true,
            email_notifications:
                user.notification_preferences?.email_notifications ?? false,
        },
        privacy_settings: {
            profile_visibility:
                user.privacy_settings?.profile_visibility ?? "public",
            show_email: user.privacy_settings?.show_email ?? false,
            allow_follow_requests:
                user.privacy_settings?.allow_follow_requests ?? true,
        },
    });

    // User verisi değiştiğinde form verilerini güncelle
    useEffect(() => {
        setData({
            name: user.name,
            username: user.username || "",
            email: user.email,
            theme: localStorage.getItem("theme") || "auto",
            language: localStorage.getItem("language") || "tr",
            notification_preferences: {
                follow_notifications:
                    user.notification_preferences?.follow_notifications ?? true,
                like_notifications:
                    user.notification_preferences?.like_notifications ?? true,
                comment_notifications:
                    user.notification_preferences?.comment_notifications ??
                    true,
                email_notifications:
                    user.notification_preferences?.email_notifications ?? false,
            },
            privacy_settings: {
                profile_visibility:
                    user.privacy_settings?.profile_visibility ?? "public",
                show_email: user.privacy_settings?.show_email ?? false,
                allow_follow_requests:
                    user.privacy_settings?.allow_follow_requests ?? true,
            },
        });
    }, [user, setData]);

    // Dil değişikliğini takip et
    useEffect(() => {
        const currentLanguage = localStorage.getItem("language") || "tr";
        if (data.language !== currentLanguage) {
            setData("language", currentLanguage);
        }
    }, [data.language, setData]);

    const {
        data: profileData,
        setData: setProfileData,
        patch: patchProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: user.name,
        username: user.username || "",
        email: user.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Artık gerekli değil çünkü otomatik kaydetme var
    };

    const handleNotificationChange = (key, value) => {
        setData("notification_preferences", {
            ...data.notification_preferences,
            [key]: value,
        });

        // Sadece bildirim ayarlarını gönder
        router.patch(
            "/settings/notifications",
            {
                notification_preferences: {
                    ...data.notification_preferences,
                    [key]: value,
                },
            },
            {
                onSuccess: () => {
                    console.log("Bildirim ayarları güncellendi");
                },
                onError: (errors) => {
                    console.error(
                        "Bildirim ayarları güncellenirken hata:",
                        errors
                    );
                },
            }
        );
    };

    const handlePrivacyChange = (key, value) => {
        setData("privacy_settings", {
            ...data.privacy_settings,
            [key]: value,
        });

        // Sadece gizlilik ayarlarını gönder
        router.patch("/settings/privacy", {
            privacy_settings: {
                ...data.privacy_settings,
                [key]: value,
            },
        });
    };

    const handleThemeChange = (theme) => {
        window.setTheme(theme);
        setCurrentTheme(theme);
        setData("theme", theme);

        // Tema değişikliğinin anında uygulanması için
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
        setData("language", language);

        // Dil değişikliğinin anında uygulanması için
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleDeleteAccount = () => {
        router.delete("/settings/delete-account", {
            onSuccess: () => {
                alert("Hesabınız başarıyla silindi!");
                router.visit("/");
            },
            onError: (errors) => {
                console.error("Hesap silinirken hata:", errors);
            },
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        patchProfile("/settings", {
            onSuccess: () => {
                setIsProfileModalOpen(false);
                alert("Profil bilgileri başarıyla güncellendi!");
            },
            onError: (errors) => {
                console.error("Profil güncellenirken hata:", errors);
            },
        });
    };

    const openProfileModal = () => {
        setProfileData({
            name: user.name,
            username: user.username || "",
            email: user.email,
        });
        setIsProfileModalOpen(true);
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("settings")} />

            <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900">
                <Card>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("profile_info")}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("edit_profile_info")}
                                    </p>
                                </div>
                            </div>
                            <Buton
                                onClick={openProfileModal}
                                variant="primary"
                                size="sm"
                            >
                                {t("edit")}
                            </Buton>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("notifications_settings")}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("notification_types")}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={
                                    data.notification_preferences
                                        .follow_notifications &&
                                    data.notification_preferences
                                        .like_notifications &&
                                    data.notification_preferences
                                        .comment_notifications
                                }
                                onChange={(e) => {
                                    const isChecked = e.target.checked;

                                    // Tüm bildirim ayarlarını aynı anda güncelle
                                    setData("notification_preferences", {
                                        ...data.notification_preferences,
                                        follow_notifications: isChecked,
                                        like_notifications: isChecked,
                                        comment_notifications: isChecked,
                                    });

                                    // Sadece bildirim ayarlarını gönder
                                    router.patch("/settings/notifications", {
                                        notification_preferences: {
                                            ...data.notification_preferences,
                                            follow_notifications: isChecked,
                                            like_notifications: isChecked,
                                            comment_notifications: isChecked,
                                        },
                                    });
                                }}
                                size="md"
                            />
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("profile_visibility")}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {data.privacy_settings
                                            .profile_visibility === "public"
                                            ? t("public_profile")
                                            : t("private_profile")}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={
                                    data.privacy_settings.profile_visibility ===
                                    "private"
                                }
                                onChange={(e) =>
                                    handlePrivacyChange(
                                        "profile_visibility",
                                        e.target.checked ? "private" : "public"
                                    )
                                }
                                size="md"
                            />
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <Palette className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("theme")}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {currentTheme === "light"
                                            ? t("light_theme")
                                            : currentTheme === "dark"
                                            ? t("dark_theme")
                                            : t("system_theme")}
                                    </p>
                                </div>
                            </div>
                            <ThemeToggle
                                currentTheme={currentTheme}
                                onThemeChange={handleThemeChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Translate className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t("language")}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {data.language === "tr"
                                            ? "Türkçe"
                                            : data.language === "en"
                                            ? "English"
                                            : data.language === "fr"
                                            ? "Français"
                                            : data.language === "es"
                                            ? "Español"
                                            : data.language === "it"
                                            ? "Italiano"
                                            : data.language === "ar"
                                            ? "العربية"
                                            : data.language === "ru"
                                            ? "Русский"
                                            : data.language === "de"
                                            ? "Deutsch"
                                            : "Türkçe"}
                                    </p>
                                </div>
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {data.language === "tr"
                                                ? "TR"
                                                : data.language === "en"
                                                ? "EN"
                                                : data.language === "fr"
                                                ? "FR"
                                                : data.language === "es"
                                                ? "ES"
                                                : data.language === "it"
                                                ? "IT"
                                                : data.language === "ar"
                                                ? "AR"
                                                : data.language === "ru"
                                                ? "RU"
                                                : data.language === "de"
                                                ? "DE"
                                                : "TR"}
                                        </span>
                                        <CaretDown className="w-4 h-4 text-gray-500" />
                                    </div>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="py-1">
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("tr")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "tr"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇹🇷 Türkçe</span>
                                                {data.language === "tr" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("en")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "en"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇺🇸 English</span>
                                                {data.language === "en" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("fr")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "fr"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇫🇷 Français</span>
                                                {data.language === "fr" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("es")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "es"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇪🇸 Español</span>
                                                {data.language === "es" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("it")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "it"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇮🇹 Italiano</span>
                                                {data.language === "it" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("ar")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "ar"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇸🇦 العربية</span>
                                                {data.language === "ar" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("ru")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "ru"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇷🇺 Русский</span>
                                                {data.language === "ru" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleLanguageChange("de")
                                            }
                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                data.language === "de"
                                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>🇩🇪 Deutsch</span>
                                                {data.language === "de" && (
                                                    <span className="text-blue-600">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="px-4 pb-6">
                <Card>
                    <div className="p-6 space-y-3">
                        <Buton
                            type="button"
                            variant="danger"
                            onClick={() => router.post("/logout")}
                            className="w-full"
                        >
                            {t("logout")}
                        </Buton>
                        <Buton
                            variant="danger"
                            onClick={() => setIsConfirmOpen(true)}
                            className="w-full"
                        >
                            {t("delete_account")}
                        </Buton>
                    </div>
                </Card>
            </div>

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
                title={t("delete_account")}
                message={t("delete_account_confirm")}
                confirmText={t("delete_account")}
                cancelText={t("cancel")}
            />

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title={t("profile_info")}
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <TextInput
                        label={t("name")}
                        value={profileData.name}
                        onChange={(e) => setProfileData("name", e.target.value)}
                        error={profileErrors.name}
                    />
                    <TextInput
                        label={t("username")}
                        value={profileData.username}
                        onChange={(e) =>
                            setProfileData("username", e.target.value)
                        }
                        error={profileErrors.username}
                        disabled={true}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                        {t("username_cannot_change")}
                    </p>
                    <TextInput
                        label={t("email")}
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                            setProfileData("email", e.target.value)
                        }
                        error={profileErrors.email}
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Buton
                            type="button"
                            variant="secondary"
                            onClick={() => setIsProfileModalOpen(false)}
                        >
                            {t("cancel")}
                        </Buton>
                        <Buton type="submit" disabled={profileProcessing}>
                            {profileProcessing ? t("saving") : t("save")}
                        </Buton>
                    </div>
                </form>
            </Modal>
        </UserLayout>
    );
};

export default Ayarlar;
