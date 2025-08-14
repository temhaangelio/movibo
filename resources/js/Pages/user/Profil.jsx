import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import PostCard from "@/components/PostCard";
import Alert from "/ui/Alert";

import { Camera, User, X, Users } from "@phosphor-icons/react";

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
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

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

        setUploading(true);

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

                // Başarı mesajı göster
                setAlert({
                    open: true,
                    type: "success",
                    message: data.message,
                });
            } else {
                // Hata mesajı göster
                setAlert({
                    open: true,
                    type: "error",
                    message: data.message || "Bir hata oluştu.",
                });
            }
        } catch (error) {
            console.error("Follow error:", error);
            setAlert({
                open: true,
                type: "error",
                message: "Bir hata oluştu. Lütfen tekrar deneyin.",
            });
        } finally {
            setUploading(false);
        }
    };

    const loadFollowers = async () => {
        setLoadingFollowers(true);
        try {
            const response = await fetch(`/users/${currentUser.id}/followers`);
            const data = await response.json();
            setFollowers(data.followers.data || []);
        } catch (error) {
            console.error("Followers error:", error);
        } finally {
            setLoadingFollowers(false);
        }
    };

    const loadFollowing = async () => {
        setLoadingFollowing(true);
        try {
            const response = await fetch(`/users/${currentUser.id}/following`);
            const data = await response.json();
            setFollowing(data.following.data || []);
        } catch (error) {
            console.error("Following error:", error);
        } finally {
            setLoadingFollowing(false);
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
                                    {user.name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    @{user.username || "user"}
                                </p>
                            </div>

                            {/* Takip İstatistikleri */}
                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
                                    onClick={() => {
                                        setShowFollowersModal(true);
                                        loadFollowers();
                                    }}
                                >
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {followersCount}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("followers")}
                                    </div>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
                                    onClick={() => {
                                        setShowFollowingModal(true);
                                        loadFollowing();
                                    }}
                                >
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
                                        disabled={uploading}
                                        className={`w-full px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            isFollowing
                                                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                                : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md"
                                        } ${
                                            uploading
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-4 h-4 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                                                <span>
                                                    {isFollowing
                                                        ? "Takip Bırakılıyor..."
                                                        : "Takip Ediliyor..."}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    {isFollowing
                                                        ? "Takibi Bırak"
                                                        : "Takip Et"}
                                                </span>
                                            </>
                                        )}
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

            {/* Takipçiler Modal */}
            {showFollowersModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Takipçiler ({followersCount})
                            </h3>
                            <button
                                onClick={() => setShowFollowersModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-80">
                            {loadingFollowers ? (
                                <div className="text-center py-8">
                                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        Yükleniyor...
                                    </p>
                                </div>
                            ) : followers.length > 0 ? (
                                <div className="space-y-3">
                                    {followers.map((follower) => (
                                        <div
                                            key={follower.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                {follower.profile_photo ? (
                                                    <img
                                                        src={`/storage/${follower.profile_photo}`}
                                                        alt={follower.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {follower.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    @{follower.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Henüz takipçi yok
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Takip Edilenler Modal */}
            {showFollowingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Takip Edilenler ({followingCount})
                            </h3>
                            <button
                                onClick={() => setShowFollowingModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-80">
                            {loadingFollowing ? (
                                <div className="text-center py-8">
                                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        Yükleniyor...
                                    </p>
                                </div>
                            ) : following.length > 0 ? (
                                <div className="space-y-3">
                                    {following.map((followed) => (
                                        <div
                                            key={followed.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                {followed.profile_photo ? (
                                                    <img
                                                        src={`/storage/${followed.profile_photo}`}
                                                        alt={followed.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {followed.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    @{followed.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Henüz kimseyi takip etmiyor
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default Profil;
