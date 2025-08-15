import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import PostCard from "@/components/PostCard";
import Tab from "/ui/Tab";
import Loading from "/ui/Loading";
import { FileText } from "@phosphor-icons/react";

const AnaSayfa = ({ auth, posts, user }) => {
    const { t } = useTranslation();
    const [mediaType, setMediaType] = useState("movie");
    const [activeTab, setActiveTab] = useState("following"); // 'following' veya 'all'
    const [currentPosts, setCurrentPosts] = useState(posts);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        content: "",
        media_type: "movie",
        media_id: "",
        media_title: "",
        media_description: "",
        media_poster: "",
        media_release_date: "",
        media_rating: "",
        media_genre: "",
        media_author: "",
        media_director: "",
    });

    const handleLike = (postId, liked, count) => {
        // Like işlemi sonrası state güncelleme
        setCurrentPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, is_liked: liked, likes_count: count }
                    : post
            )
        );
    };

    const handleComment = (postId) => {
        // Yorum işlemi
        console.log("Comment:", postId);
    };

    const handleDelete = (postId) => {
        setCurrentPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const fetchPosts = async (tabType) => {
        setLoading(true);
        try {
            const endpoint =
                tabType === "following"
                    ? "/api/posts/following"
                    : "/api/posts/all";
            const response = await fetch(endpoint);
            const data = await response.json();
            setCurrentPosts(data.posts);
        } catch (error) {
            console.error("Posts fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(activeTab);
    }, [activeTab]);

    const searchMedia = async (query) => {
        if (!query.trim()) return;

        try {
            const endpoint =
                mediaType === "movie"
                    ? `/api/search/movies?query=${encodeURIComponent(query)}`
                    : `/api/search/books?query=${encodeURIComponent(query)}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (mediaType === "movie") {
                return data.results?.slice(0, 5) || [];
            } else {
                return data.items?.slice(0, 5) || [];
            }
        } catch (error) {
            console.error("Media search error:", error);
            return [];
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("home")} />

            <div className="w-full">
                {/* Tab Navigation */}
                <div className="mb-4">
                    <Tab
                        tabs={[
                            {
                                id: "following",
                                label: t("following_posts", "Takip Ettiklerin"),
                            },
                            {
                                id: "all",
                                label: t("all_posts", "Tüm Paylaşımlar"),
                            },
                        ]}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Paylaşımlar */}
                <div className="pb-4">
                    {loading ? (
                        <Loading size="lg" centered={true} />
                    ) : currentPosts && currentPosts.length > 0 ? (
                        <div className="space-y-3">
                            {currentPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    user={auth.user}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {t("no_content_yet", "Henüz bir içerik yok!")}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Takip ettiğiniz kullanıcılar paylaşım yaptığında
                                burada görünecek
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default AnaSayfa;
