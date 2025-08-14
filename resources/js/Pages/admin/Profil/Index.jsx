import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Buton from "/ui/Buton";
import TextInput from "/ui/TextInput";
import InputLabel from "/ui/InputLabel";
import InputError from "/ui/InputError";
import ThemeToggle from "/ui/ThemeToggle";
import {
    User,
    Envelope,
    Calendar,
    Shield,
    CheckCircle,
    Warning,
    Eye,
    EyeSlash,
    SignOut,
    Moon,
    Sun,
} from "@phosphor-icons/react";

const Index = ({ auth }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("auto");

    useEffect(() => {
        setCurrentTheme(localStorage.getItem("theme") || "auto");
    }, []);

    const handleThemeChange = (theme) => {
        window.setTheme(theme);
        setCurrentTheme(theme);

        // Tema değişikliğinin anında uygulanması için
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch("/panel/profile");
    };

    return (
        <AdminLayout>
            <Head title="Profil - Admin Panel" />

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="w-full">
                    <Card className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Profil Bilgileri
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Ad Soyad"
                                        />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                            autoComplete="name"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="E-posta"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                            autoComplete="username"
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="username"
                                        value="Kullanıcı Adı"
                                    />
                                    <TextInput
                                        id="username"
                                        type="text"
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-800"
                                        value={
                                            auth.user.username ||
                                            "Kullanıcı adı yok"
                                        }
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Kullanıcı adı değiştirilemez
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Şifre Değiştir
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="current_password"
                                            value="Mevcut Şifre"
                                        />
                                        <div className="relative">
                                            <TextInput
                                                id="current_password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="mt-1 block w-full pr-10"
                                                value={data.current_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "current_password",
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeSlash className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError
                                            message={errors.current_password}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Yeni Şifre"
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id="password"
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="mt-1 block w-full pr-10"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                >
                                                    {showNewPassword ? (
                                                        <EyeSlash className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError
                                                message={errors.password}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Yeni Şifre (Tekrar)"
                                            />
                                            <TextInput
                                                id="password_confirmation"
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="mt-1 block w-full"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="new-password"
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <Buton
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center space-x-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Güncelleniyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Profili Güncelle</span>
                                        </>
                                    )}
                                </Buton>
                            </div>

                            {recentlySuccessful && (
                                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Profil başarıyla güncellendi!</span>
                                </div>
                            )}
                        </form>
                    </Card>
                </div>

                {/* Theme Settings */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Görünüm Ayarları
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Tema Değiştir
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Açık veya koyu tema arasında geçiş yapın
                                    </p>
                                </div>
                            </div>
                            <ThemeToggle
                                currentTheme={currentTheme}
                                onThemeChange={handleThemeChange}
                            />
                        </div>
                    </div>
                </Card>

                {/* Logout Section */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Hesap İşlemleri
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <SignOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <div>
                                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                                        Çıkış Yap
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-500">
                                        Hesabınızdan güvenli bir şekilde çıkış
                                        yapın
                                    </p>
                                </div>
                            </div>
                            <Buton
                                onClick={() => router.post("/logout")}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-white"
                            >
                                <SignOut className="w-4 h-4 mr-2" />
                                Çıkış Yap
                            </Buton>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Index;
