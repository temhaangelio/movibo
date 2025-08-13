import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import PostCard from "@/components/PostCard";
import Alert from "/ui/Alert";

import { Camera, User } from "@phosphor-icons/react";

const Profil = ({ auth, user, posts }) => {
    const { t } = useTranslation();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentUser, setCurrentUser] = useState(user);

    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        type: "success",
        message: "",
    });

    // Takip durumunu kontrol et
    useEffect(() => {
        if (auth.user && currentUser && auth.user.id !== currentUser.id) {
            fetch(`/users/${currentUser.id}/follow/check`)
                .then((res) => res.json())
                .then((data) => {
                    setIsFollowing(data.isFollowing);
                    setFollowersCount(data.followersCount);
                    setFollowingCount(data.followingCount);
                });
        } else if (auth.user && auth.user.id === currentUser.id) {
            // Kendi profilinde takip sayılarını al
            setFollowersCount(currentUser.followers_count || 0);
            setFollowingCount(currentUser.following_count || 0);
        }
    }, [auth.user, currentUser]);

    const handleFollow = async () => {
        if (!auth.user || !currentUser || auth.user.id === currentUser.id)
            return;

        try {
            const response = await fetch(`/users/${currentUser.id}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            const data = await response.json();

            if (data.success) {
                setIsFollowing(data.isFollowing);
                setFollowersCount(data.followersCount);
                setFollowingCount(data.followingCount);
            }
        } catch (error) {
            console.error("Follow error:", error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("profile_photo", selectedFile);

            const response = await fetch("/profile/photo", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUploading(false);
                setSelectedFile(null);
                setPreviewUrl(null);

                // Kullanıcı state'ini güncelle
                if (data.profile_photo) {
                    setCurrentUser((prev) => ({
                        ...prev,
                        profile_photo: data.profile_photo,
                    }));
                }

                // Başarı mesajını göster
                setAlert({
                    open: true,
                    type: "success",
                    message: "Profil fotoğrafı başarıyla güncellendi!",
                });
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            setUploading(false);
            setAlert({
                open: true,
                type: "error",
                message:
                    "Fotoğraf yüklenirken bir hata oluştu: " + error.message,
            });
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("profile")} />

            <Alert
                open={alert.open}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, open: false })}
            />

            <div className="px-4 py-6">
                {/* Profil Bilgileri ve Paylaşımlar */}
                <div className="grid grid-cols-1 gap-0">
                    {/* Profil Bilgileri - Sol Taraf */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                            {/* Profil Fotoğrafı */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <div className="relative">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profil önizleme"
                                                className="w-24 h-24 rounded-full object-cover mx-auto"
                                            />
                                        ) : currentUser.profile_photo ? (
                                            <img
                                                src={`/storage/${currentUser.profile_photo}`}
                                                alt="Profil fotoğrafı"
                                                className="w-24 h-24 rounded-full object-cover mx-auto"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto">
                                                <User className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                                            </div>
                                        )}

                                        {auth.user &&
                                            auth.user.id === user.id && (
                                                <div className="absolute bottom-0 right-0">
                                                    <label className="flex items-center justify-center bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                                        <Camera className="w-4 h-4" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleFileSelect
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                    </div>

                                    {selectedFile &&
                                        auth.user &&
                                        auth.user.id === user.id && (
                                            <div className="mt-4 flex justify-center space-x-2">
                                                <Buton
                                                    onClick={handlePhotoUpload}
                                                    disabled={uploading}
                                                    size="sm"
                                                    variant="primary"
                                                >
                                                    {uploading
                                                        ? t(
                                                              "uploading",
                                                              "Yükleniyor..."
                                                          )
                                                        : t("save")}
                                                </Buton>
                                                <Buton
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setPreviewUrl(null);
                                                    }}
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    {t("cancel")}
                                                </Buton>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Kullanıcı Bilgileri */}
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {currentUser.name
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1).toLowerCase()
                                        )
                                        .join(" ")}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    @
                                    {currentUser.username ||
                                        currentUser.name
                                            ?.toLowerCase()
                                            .replace(/\s+/g, "") ||
                                        "user"}
                                </p>
                            </div>

                            {/* Takip İstatistikleri */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {followersCount}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("followers")}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {followingCount}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("following")}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {posts?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("film")}
                                    </div>
                                </div>
                            </div>

                            {/* Takip Butonu - Sadece başka kullanıcının profilinde */}
                            {auth.user && auth.user.id !== currentUser.id && (
                                <div className="mb-6">
                                    <button
                                        onClick={handleFollow}
                                        className={`w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            isFollowing
                                                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                : "bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
                                        }`}
                                    >
                                        {isFollowing
                                            ? t(
                                                  "following_now",
                                                  "Takip Ediliyor"
                                              )
                                            : t("follow")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paylaşımlar - Sağ Taraf */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        user={currentUser}
                                        onLike={() => {}}
                                        onComment={() => {}}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Henüz paylaşım yapmamışsınız.
                                    </p>
                                    <Link
                                        href="/create"
                                        className="mt-4 inline-block"
                                    >
                                        <Buton variant="primary" size="sm">
                                            İlk Paylaşımınızı Yapın
                                        </Buton>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Profil;
