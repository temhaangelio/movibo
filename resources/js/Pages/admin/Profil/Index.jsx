import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Buton from "/ui/Buton";
import TextInput from "/ui/TextInput";
import InputLabel from "/ui/InputLabel";
import InputError from "/ui/InputError";

import { CheckCircle, Eye, EyeSlash, SignOut } from "@phosphor-icons/react";

const Index = ({ auth }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

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
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                                        className="mt-1 block w-full bg-gray-100"
                                        value={
                                            auth.user.username ||
                                            "Kullanıcı adı yok"
                                        }
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kullanıcı adı değiştirilemez
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white"></div>
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
                                <div className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Profil başarıyla güncellendi!</span>
                                </div>
                            )}
                        </form>
                    </Card>
                </div>

                {/* Logout Section */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Hesap İşlemleri
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <SignOut className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">
                                        Çıkış Yap
                                    </p>
                                    <p className="text-xs text-red-600">
                                        Hesabınızdan güvenli bir şekilde çıkış
                                        yapın
                                    </p>
                                </div>
                            </div>
                            <Buton
                                onClick={() => router.post("/logout")}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
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
