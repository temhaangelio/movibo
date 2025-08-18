import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import PostCard from "@/components/PostCard";
import Alert from "/ui/Alert";
import Loading from "/ui/Loading";
import { getDisplayInitials } from "/utils/userUtils";

import { Camera, User, X, Users, FlyingSaucer } from "@phosphor-icons/react";

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
            fetch(`/users/${currentUser.username}/follow/check`)
                .then((res) => res.json())
                .then((data) => {
                    setIsFollowing(data.isFollowing);
                    setFollowersCount(data.followersCount);
                    setFollowingCount(data.followingCount);
                })
                .catch((error) => {
                    console.error("Follow check error:", error);
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
            const response = await fetch(
                `/users/${currentUser.username}/follow`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

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
            const response = await fetch(
                `/users/${currentUser.username}/followers`
            );
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
            const response = await fetch(
                `/users/${currentUser.username}/following`
            );
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

            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            if (!csrfToken) {
                throw new Error("CSRF token bulunamadı. Sayfayı yenileyin.");
            }

            const response = await fetch("/profile/photo", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
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
                // Önce response'u text olarak al
                const responseText = await response.text();
                console.error("Server response:", responseText);

                let errorMessage = "Upload failed";

                try {
                    // JSON parse etmeye çalış
                    const errorData = JSON.parse(responseText);
                    errorMessage =
                        errorData.message || errorData.error || "Upload failed";
                } catch (parseError) {
                    // JSON parse edilemezse HTML yanıtı geldi demektir
                    console.error("Response is not JSON:", responseText);
                    errorMessage = "Sunucu hatası. Lütfen tekrar deneyin.";
                }

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setUploading(false);
            setAlert({
                open: true,
                type: "error",
                message:
                    error.message || "Fotoğraf yüklenirken bir hata oluştu.",
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

            <div className="pb-4 mt-4">
                {/* Profil Bilgileri ve Paylaşımlar */}
                <div className="grid grid-cols-1 gap-0">
                    {/* Profil Bilgileri - Sol Taraf */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
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
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto"
                                                style={{
                                                    display:
                                                        currentUser.profile_photo
                                                            ? "none"
                                                            : "flex",
                                                }}
                                            >
                                                {currentUser.name ? (
                                                    <span className="text-2xl font-bold">
                                                        {getDisplayInitials(
                                                            currentUser.name
                                                        )}
                                                    </span>
                                                ) : (
                                                    <User className="w-12 h-12 text-gray-600" />
                                                )}
                                            </div>
                                        )}

                                        {auth.user &&
                                            auth.user.id === user.id && (
                                                <div className="absolute bottom-0 right-0">
                                                    <label className="flex items-center justify-center bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
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
                                <h2 className="text-xl font-bold text-gray-900">
                                    {user.name}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    @{user.username || "user"}
                                </p>
                            </div>

                            {/* Takip İstatistikleri */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {posts?.length || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {t("gonderi")}
                                    </div>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                                    onClick={() => {
                                        setShowFollowersModal(true);
                                        loadFollowers();
                                    }}
                                >
                                    <div className="text-2xl font-bold text-gray-900">
                                        {followersCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {t("followers")}
                                    </div>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                                    onClick={() => {
                                        setShowFollowingModal(true);
                                        loadFollowing();
                                    }}
                                >
                                    <div className="text-2xl font-bold text-gray-900">
                                        {followingCount}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {t("following")}
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
                                                ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                                        } ${
                                            uploading
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loading size="sm" />
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
                                <div className="flex flex-col items-center justify-center space-y-4 py-16">
                                    <FlyingSaucer className="w-24 h-24 mx-auto" />
                                    <p className="text-gray-500 text-lg">
                                        Henüz paylaşım yapmamışsınız.
                                    </p>
                                    <Link
                                        href="/create"
                                        className="inline-block"
                                    >
                                        <Buton variant="primary" size="md">
                                            İlk Paylaşımınızı Yapın!
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
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Takipçiler ({followersCount})
                            </h3>
                            <button
                                onClick={() => setShowFollowersModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-80">
                            {loadingFollowers ? (
                                <div className="flex justify-center items-center text-center py-8">
                                    <Loading size="md" />
                                </div>
                            ) : followers.length > 0 ? (
                                <div className="space-y-3">
                                    {followers.map((follower) => (
                                        <div
                                            key={follower.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                {follower.profile_photo ? (
                                                    <img
                                                        src={`/storage/${follower.profile_photo}`}
                                                        alt={follower.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        {follower.name ? (
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {getDisplayInitials(
                                                                    follower.name
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <User className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {follower.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    @{follower.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
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
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Takip Edilenler ({followingCount})
                            </h3>
                            <button
                                onClick={() => setShowFollowingModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-80">
                            {loadingFollowing ? (
                                <div className="flex justify-center items-center text-center py-8">
                                    <Loading size="md" />
                                </div>
                            ) : following.length > 0 ? (
                                <div className="space-y-3">
                                    {following.map((followed) => (
                                        <div
                                            key={followed.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0">
                                                {followed.profile_photo ? (
                                                    <img
                                                        src={`/storage/${followed.profile_photo}`}
                                                        alt={followed.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        {followed.name ? (
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {getDisplayInitials(
                                                                    followed.name
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <User className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {followed.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    @{followed.username}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        Henüz kimseyi takip etmiyor.
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
