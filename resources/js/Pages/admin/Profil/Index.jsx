import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "/Layouts/AdminLayout";
import Card from "/ui/Card";
import Buton from "/ui/Buton";
import TextInput from "/ui/TextInput";
import InputLabel from "/ui/InputLabel";
import InputError from "/ui/InputError";
import {
    User,
    Envelope,
    Calendar,
    Shield,
    Camera,
    CheckCircle,
    Warning,
    Eye,
    EyeSlash,
    SignOut,
} from "@phosphor-icons/react";

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

    const {
        data: photoData,
        setData: setPhotoData,
        post: postPhoto,
        errors: photoErrors,
        processing: photoProcessing,
    } = useForm({
        photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        patch("/panel/profile");
    };

    const updatePhoto = (e) => {
        e.preventDefault();
        postPhoto("/panel/profile/photo", {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoData("photo", null);
            },
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoData("photo", file);
        }
    };

    return (
        <AdminLayout>
            <Head title="Profil - Admin Panel" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Profil Ayarları
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Hesap bilgilerinizi güncelleyin ve güvenlik ayarlarınızı
                        yönetin
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Photo */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {auth.user.profile_photo_url ? (
                                            <img
                                                src={
                                                    auth.user.profile_photo_url
                                                }
                                                alt={auth.user.name}
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-3xl">
                                                {auth.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                </div>

                                {photoData.photo && (
                                    <div className="mt-4">
                                        <Buton
                                            onClick={updatePhoto}
                                            disabled={photoProcessing}
                                            className="w-full"
                                        >
                                            {photoProcessing
                                                ? "Yükleniyor..."
                                                : "Fotoğrafı Güncelle"}
                                        </Buton>
                                    </div>
                                )}

                                {photoErrors.photo && (
                                    <InputError
                                        message={photoErrors.photo}
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Profile Information */}
                    <div className="lg:col-span-2">
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
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
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
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
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
                                                    value={
                                                        data.current_password
                                                    }
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
                                                message={
                                                    errors.current_password
                                                }
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
                                        <span>
                                            Profil başarıyla güncellendi!
                                        </span>
                                    </div>
                                )}
                            </form>
                        </Card>
                    </div>
                </div>

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
