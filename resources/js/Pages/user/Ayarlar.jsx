import React, { useState, useEffect } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import TextInput from "/ui/TextInput";
import Buton from "/ui/Buton";
import Confirm from "/ui/Confirm";
import BottomSheet from "/ui/BottomSheet";
import Card from "/ui/Card";

import Dropdown from "/ui/Dropdown";
import Alert from "/ui/Alert";
import {
    SignOut,
    Trash,
    User,
    Bell,
    Eye,
    Translate,
    CaretDown,
    FileText,
    Question,
    ArrowRight,
} from "@phosphor-icons/react";

const Ayarlar = ({ auth }) => {
    const { t, i18n } = useTranslation();
    const user = auth.user;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
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
        language: localStorage.getItem("language") || "tr",
    });

    // User verisi değiştiğinde form verilerini güncelle
    useEffect(() => {
        setData({
            name: user.name,
            username: user.username || "",
            email: user.email,
            language: localStorage.getItem("language") || "tr",
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

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
        setData("language", language);

        // Dil değişikliğinin anında uygulanması için
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", profileData.name);
        formData.append("username", profileData.username);
        formData.append("email", profileData.email);
        formData.append("_method", "PATCH");

        fetch("/settings", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                Accept: "application/json",
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setIsProfileSheetOpen(false);
                    setAlert({
                        open: true,
                        type: "success",
                        message: data.message,
                    });
                }
            })
            .catch((error) => {
                console.error("Profil güncellenirken hata:", error);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Profil güncellenirken bir hata oluştu.",
                });
            });
    };

    const openProfileSheet = () => {
        setProfileData({
            name: user.name,
            username: user.username || "",
            email: user.email,
        });
        setIsProfileSheetOpen(true);
    };

    const handleDeleteAccount = () => {
        router.delete("/settings/delete-account", {
            onSuccess: () => {
                if (confirm("Hesabınız başarıyla silindi!")) {
                    router.visit("/");
                }
            },
            onError: (errors) => {
                console.error("Hesap silinirken hata:", errors);
            },
        });
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("settings")} />

            <Alert
                open={alert.open}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, open: false })}
            />

            <div className="pb-4 bg-gray-50 mt-4">
                <Card>
                    <div className="p-4 space-y-4">
                        <div
                            onClick={openProfileSheet}
                            className="flex items-center justify-between pb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center">
                                <User className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {t("profile_info")}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Profil bilgilerinizi düzenleyin
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <div className="flex items-center ">
                                <Translate className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {t("language")}
                                    </h3>
                                    <p className="text-sm text-gray-500">
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
                                    <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                                        <span className="text-sm text-gray-700">
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-50"
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

                        <Link
                            href="/terms"
                            className="flex items-center justify-between pb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {t("terms_of_service")}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Kullanım şartları
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </Link>

                        <Link
                            href="/support"
                            className="flex items-center justify-between pb-4  hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center">
                                <Question className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Destek
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Yardım alın
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="space-y-3">
                <Buton
                    type="button"
                    variant="danger"
                    onClick={async () => {
                        try {
                            const csrfMeta = document.querySelector(
                                'meta[name="csrf-token"]'
                            );
                            const csrfToken = csrfMeta
                                ? csrfMeta.getAttribute("content")
                                : "";

                            const response = await fetch("/logout", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-TOKEN": csrfToken,
                                },
                                credentials: "same-origin",
                            });

                            if (response.ok) {
                                window.location.href = "/";
                            } else {
                                console.error("Logout failed");
                            }
                        } catch (error) {
                            console.error("Logout error:", error);
                        }
                    }}
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

            <Confirm
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
                title={t("delete_account")}
                message={t("delete_account_confirm")}
                confirmText={t("delete_account")}
                cancelText={t("cancel")}
            />

            <BottomSheet
                isOpen={isProfileSheetOpen}
                onClose={() => setIsProfileSheetOpen(false)}
                title={t("profile_info")}
                maxHeight="max-h-[70vh]"
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
                    <p className="text-xs text-gray-500 -mt-2">
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
                    <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white py-2">
                        <Buton
                            type="button"
                            variant="secondary"
                            onClick={() => setIsProfileSheetOpen(false)}
                        >
                            {t("cancel")}
                        </Buton>
                        <Buton type="submit" disabled={profileProcessing}>
                            {profileProcessing ? t("saving") : t("save")}
                        </Buton>
                    </div>
                </form>
            </BottomSheet>
        </UserLayout>
    );
};

export default Ayarlar;
