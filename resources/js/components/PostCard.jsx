import React, { useState, useEffect, useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import TimeAgo from "/ui/TimeAgo";
import Confirm from "/ui/Confirm";

import CommentDropdown from "@/components/CommentDropdown";
import {
    Star,
    Heart,
    ChatCircle,
    PaperPlaneTilt,
    Trash,
    User,
    DotsThree,
} from "@phosphor-icons/react";

const PostCard = ({ post, onComment, user, onDelete, onLike = () => {} }) => {
    const { t } = useTranslation();
    const [isLiked, setIsLiked] = useState(post.is_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [commentDropdownOpen, setCommentDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const { delete: deletePost, processing: deleteProcessing } = useForm();
    const { post: likePost, processing: likeProcessing } = useForm();

    // Click outside handler for menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    // Takip durumunu kontrol et
    useEffect(() => {
        if (user && post.user && user.id !== post.user.id) {
            fetch(`/users/${post.user.id}/follow/check`)
                .then((res) => res.json())
                .then((data) => {
                    setIsFollowing(data.isFollowing);
                });
        }
    }, [user, post.user]);

    const handleFollow = async () => {
        if (!user || !post.user || user.id === post.user.id) return;

        try {
            const response = await fetch(`/users/${post.user.id}/follow`, {
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
            }
        } catch (error) {
            console.error("Follow error:", error);
        }
    };

    const handleLike = () => {
        console.log("Like button clicked for post:", post.id);
        console.log("Current like state:", isLiked);
        console.log("Current likes count:", likesCount);

        // Hemen UI'yi güncelle
        const newLikedState = !isLiked;
        const newCount = isLiked ? likesCount - 1 : likesCount + 1;

        console.log("New like state:", newLikedState);
        console.log("New count:", newCount);

        setIsLiked(newLikedState);
        setLikesCount(newCount);

        // AnaSayfa'daki state'i güncelle
        if (onLike) {
            onLike(post.id, newLikedState, newCount);
        }

        // Arka planda API çağrısı yap
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfMeta ? csrfMeta.getAttribute("content") : "";
        fetch(`/posts/${post.id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            credentials: "same-origin",
        })
            .then((response) => response.json())
            .then((data) => {
                // API'den gelen gerçek veriyi kullan
                setIsLiked(data.liked);
                setLikesCount(data.count);

                // AnaSayfa'daki state'i güncelle
                if (onLike) {
                    onLike(post.id, data.liked, data.count);
                }
            })
            .catch((error) => {
                console.error("Like error:", error);
                // Hata durumunda UI'yi geri al
                setIsLiked(!newLikedState);
                setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);

                // AnaSayfa'daki state'i de geri al
                if (onLike) {
                    onLike(
                        post.id,
                        !newLikedState,
                        newLikedState ? likesCount + 1 : likesCount - 1
                    );
                }
            });
    };

    const handleShare = async () => {
        const shareData = {
            title: `${post.user?.name} - ${post.media_title}`,
            text: post.content || `${post.media_title} hakkında yorum yaptı`,
            url: `${window.location.origin}/posts/${post.id}`,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Web Share API desteklenmiyorsa URL'yi kopyala
                await navigator.clipboard.writeText(shareData.url);
            }
        } catch (error) {
            console.error("Share error:", error);
            // Hata durumunda URL'yi kopyala
            try {
                await navigator.clipboard.writeText(shareData.url);
            } catch (copyError) {
                console.error("Copy error:", copyError);
            }
        }
    };

    const handleDelete = () => {
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        deletePost(`/posts/${post.id}`, {
            onSuccess: () => {
                if (onDelete) onDelete(post.id);
            },
            onError: (errors) => {
                alert(
                    t("delete_error", "Paylaşım silinirken bir hata oluştu.")
                );
            },
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Kullanıcı Bilgisi */}
            <div className="flex items-center p-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                        {post.user?.name
                            .split(" ")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                    </p>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <TimeAgo date={post.created_at} />
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {user && post.user && user.id !== post.user.id && (
                        <button
                            onClick={handleFollow}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                isFollowing
                                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                            }`}
                        >
                            {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                        </button>
                    )}

                    {/* Üç Noktalı Menü */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <DotsThree className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menü */}
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            handleShare();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <PaperPlaneTilt className="w-4 h-4 mr-3" />
                                        {t("share_post")}
                                    </button>

                                    {user && post.user_id === user.id && (
                                        <button
                                            onClick={() => {
                                                handleDelete();
                                                setMenuOpen(false);
                                            }}
                                            disabled={deleteProcessing}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                        >
                                            <Trash className="w-4 h-4 mr-3" />
                                            {t("delete_post")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Media Bilgisi */}
            <div className="p-4">
                <div className="mb-3">
                    <Link href={`/movies/${post.media_id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                            {post.media_title}
                        </h3>
                    </Link>
                    {post.media_poster && (
                        <div className="relative">
                            <Link href={`/movies/${post.media_id}`}>
                                <img
                                    src={post.media_poster}
                                    alt={post.media_title}
                                    className="w-full h-48 object-cover rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </Link>
                            {/* Film Puanı - Sağ Üst */}
                            {post.media_rating && (
                                <div className="absolute top-2 right-2 bg-black/70 dark:bg-gray-800/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <span className="flex items-center text-sm">
                                        <Star
                                            className="w-4 h-4 text-white mr-1"
                                            weight="fill"
                                        />
                                        <span className="text-white">
                                            {post.media_rating}
                                        </span>
                                    </span>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 dark:from-gray-800/70 to-transparent p-3 rounded-b-lg">
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-sm font-medium">
                                        {post.media_release_date?.split("-")[0]}
                                    </span>
                                    {(post.user_rating ||
                                        post.user_rating === 0) && (
                                        <span className="flex items-center text-sm bg-black/70 dark:bg-gray-800/70 px-2 py-1 rounded-full">
                                            <Star
                                                className="w-3 h-3 text-white mr-1"
                                                weight="fill"
                                            />
                                            {post.user_rating}/5
                                            <span className="ml-1 text-xs opacity-90">
                                                {t("my_rating")}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kullanıcı Yorumu */}
                <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {post.content}
                    </p>
                </div>
            </div>

            {/* Etkileşim Butonları */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        disabled={likeProcessing}
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
                    >
                        <Heart
                            className={`w-5 h-5 ${
                                isLiked ? "text-red-500" : ""
                            }`}
                            weight={isLiked ? "fill" : "regular"}
                        />
                        <span className="text-sm font-medium">
                            {likesCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setCommentDropdownOpen(true)}
                        className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ChatCircle
                            className={`w-5 h-5 ${
                                commentDropdownOpen
                                    ? "text-gray-900 dark:text-white"
                                    : ""
                            }`}
                            weight={commentDropdownOpen ? "fill" : "regular"}
                        />
                        <span className="text-sm font-medium">
                            {post.comments_count || 0}
                        </span>
                    </button>
                </div>
            </div>
            <Confirm
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={t("delete_post")}
                message={t("delete_post_confirm")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
            />
            {commentDropdownOpen && (
                <CommentDropdown
                    open={commentDropdownOpen}
                    onClose={() => setCommentDropdownOpen(false)}
                    post={post}
                    user={user}
                />
            )}
        </div>
    );
};

export default PostCard;
