import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import ApplicationLogo from "/ui/Logo";
import BottomSheet from "/ui/BottomSheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { Star } from "@phosphor-icons/react";
import Loading from "/ui/Loading";
import Buton from "/ui/Buton";
import UserRating from "/ui/UserRating";
import {
    Gear,
    House,
    MagnifyingGlass,
    Plus,
    Bell,
    User,
    Shield,
} from "@phosphor-icons/react";

const UserLayout = ({ children, auth }) => {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isEkleSheetOpen, setIsEkleSheetOpen] = useState(false);

    // FilmEkle state'leri
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
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
        user_rating: "",
    });

    // Auth prop'u yoksa usePage'den al
    const userAuth = auth || usePage().props.auth;
    const { url } = usePage();

    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode =
                document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
        };

        checkTheme();

        // Tema değişikliklerini dinle
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem("theme") || "auto";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        // Doğrudan DOM manipülasyonu
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", newTheme);
        setIsDark(newTheme === "dark");
    };

    // FilmArama bileşeni
    const FilmArama = ({
        onMovieSelect,
        selectedMovie,
        placeholder = "Film adını yazın...",
        className = "",
    }) => {
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [isSearching, setIsSearching] = useState(false);

        const searchMovies = async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const endpoint = `/api/search/movies?query=${encodeURIComponent(
                    query
                )}`;
                const response = await fetch(endpoint);
                const data = await response.json();

                setSearchResults(data.results?.slice(0, 5) || []);
            } catch (error) {
                console.error("Movie search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const handleInputChange = (e) => {
            const value = e.target.value;
            setSearchQuery(value);

            if (value.trim()) {
                searchMovies(value);
            } else {
                setSearchResults([]);
            }
        };

        const handleMovieSelect = (movie) => {
            onMovieSelect(movie);
            setSearchResults([]);
            setSearchQuery("");
        };

        return (
            <div className={`relative ${className}`}>
                {/* Arama Input'u */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-md shadow-sm bg-neutral-800 border border-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loading size="sm" />
                        </div>
                    )}
                </div>

                {/* Arama Sonuçları */}
                {searchResults.length > 0 && !selectedMovie && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((movie) => (
                            <button
                                key={movie.id}
                                type="button"
                                onClick={() => handleMovieSelect(movie)}
                                className="w-full p-3 text-left hover:bg-neutral-700 border-b border-neutral-700 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-12 h-16 object-cover rounded"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://via.placeholder.com/92x138?text=No+Image";
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white">
                                            {movie.title}
                                        </h4>
                                        <p className="text-sm text-neutral-400">
                                            {movie.release_date?.split("-")[0]}
                                        </p>
                                        {movie.vote_average && (
                                            <div className="flex items-center mt-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-xs text-neutral-400 ml-1">
                                                    {movie.vote_average.toFixed(
                                                        1
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Okunmamış bildirim sayısını al
    useEffect(() => {
        fetch("/api/notifications/unread-count")
            .then((response) => response.json())
            .then((data) => setUnreadCount(data.count))
            .catch((error) =>
                console.error("Bildirim sayısı alınamadı:", error)
            );
    }, []);

    // FilmEkle fonksiyonları
    const handleRatingClick = (rating) => {
        setUserRating(rating);
        setData("user_rating", rating.toString());
    };

    const handleMovieSelect = (movie) => {
        setSelectedMedia(movie);
        setData({
            content: data.content,
            media_type: "movie",
            media_id: movie.id.toString(),
            media_title: movie.title || "",
            media_description: movie.overview || "",
            media_poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            media_release_date: movie.release_date || "",
            media_rating: movie.vote_average?.toString() || "",
            media_genre: movie.genre_ids?.join(", ") || "",
            media_author: "",
            media_director: "",
            user_rating: "",
        });
        setUserRating(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/posts", {
            onSuccess: () => {
                reset();
                setSelectedMedia(null);
                setUserRating(0);
                // Home sayfasına yönlendir
                router.visit("/home");
                setIsEkleSheetOpen(false);
            },
        });
    };

    return (
        <div className="min-h-screen h-screen max-w-md mx-auto bg-gray-100 flex flex-col">
            {/* Mobile Header */}
            <header className="bg-black sticky top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/home" className="flex items-center">
                            <ApplicationLogo className="text-white text-2xl" />
                        </Link>
                        <div className="flex items-center space-x-2">
                            {userAuth?.user?.is_admin && (
                                <Link
                                    href="/panel"
                                    className="p-2 text-gray-300 transition-colors"
                                    title="Admin Panel"
                                >
                                    <Shield className="w-6 h-6" />
                                </Link>
                            )}
                            <Link
                                href="/notifications"
                                className="p-2 text-gray-300 transition-colors relative"
                                title="Bildirimler"
                            >
                                <div className="relative">
                                    <Bell className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <Link
                                href="/settings"
                                className="p-2 text-gray-300 transition-colors"
                                title={t("settings")}
                            >
                                <Gear className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-28 px-4">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-10 left-0 max-w-sm mx-auto right-0 bg-black z-50 shadow-lg pb-safe rounded-full">
                <div className="flex justify-around  items-center py-1">
                    {/* Ana Sayfa */}
                    <Link
                        href="/home"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/home")
                                ? "text-white"
                                : "text-white hover:text-neutral-500"
                        }`}
                    >
                        <House
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/home") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Keşfet */}
                    <Link
                        href="/discover"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/discover")
                                ? "text-white"
                                : "text-white hover:text-neutral-500"
                        }`}
                    >
                        <MagnifyingGlass
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/discover") ? "fill" : "regular"
                            }
                        />
                    </Link>

                    {/* Yeni Paylaşım */}
                    <button
                        onClick={() => setIsEkleSheetOpen(true)}
                        className="flex flex-col items-center py-2 px-3"
                    >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                            <Plus
                                className="w-6 h-6 text-white"
                                weight="bold"
                            />
                        </div>
                    </button>

                    {/* Rastgele */}
                    <Link
                        href="/rastgele"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/rastgele")
                                ? "text-white"
                                : "text-white hover:text-neutral-500"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={faDice}
                            className={`w-6 h-6 ${
                                url.startsWith("/rastgele")
                                    ? "text-white"
                                    : "text-white hover:text-neutral-500"
                            }`}
                        />
                    </Link>

                    {/* Profil */}
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            url.startsWith("/profile")
                                ? "text-white"
                                : "text-white hover:text-neutral-500"
                        }`}
                    >
                        <User
                            className="w-6 h-6"
                            weight={
                                url.startsWith("/profile") ? "fill" : "regular"
                            }
                        />
                    </Link>
                </div>
            </nav>

            {/* Film Ekleme BottomSheet */}
            <BottomSheet
                isOpen={isEkleSheetOpen}
                onClose={() => setIsEkleSheetOpen(false)}
                title="Film Ekle"
            >
                <div className="space-y-3">
                    {/* Film Arama */}
                    {!selectedMedia && (
                        <div>
                            <FilmArama
                                onMovieSelect={handleMovieSelect}
                                selectedMovie={selectedMedia}
                                placeholder="Film adını yazın..."
                            />
                        </div>
                    )}

                    {/* Seçili Film Bilgileri */}
                    {selectedMedia && (
                        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
                            <div className="flex items-center space-x-3">
                                {selectedMedia.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`}
                                        alt={selectedMedia.title}
                                        className="w-12 h-18 object-cover rounded"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-white text-sm">
                                        {selectedMedia.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-xs text-neutral-400">
                                        {selectedMedia.release_date && (
                                            <span>
                                                {new Date(
                                                    selectedMedia.release_date
                                                ).getFullYear()}
                                            </span>
                                        )}
                                        {selectedMedia.vote_average && (
                                            <span>
                                                ⭐ {selectedMedia.vote_average}
                                                /10
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kullanıcı Puanı */}
                    {selectedMedia && (
                        <UserRating
                            value={userRating}
                            onChange={handleRatingClick}
                            label={t("your_rating", "Puanınız")}
                        />
                    )}

                    {/* Yorum */}
                    {selectedMedia && (
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                {t("comment", "Yorum")}
                            </label>
                            <textarea
                                value={data.content}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 250) {
                                        setData("content", value);
                                    }
                                }}
                                placeholder={t(
                                    "comment_placeholder",
                                    "Filminiz hakkında düşüncelerinizi paylaşın..."
                                )}
                                rows={2}
                                className="w-full px-2 py-1 border border-neutral-700 rounded-md shadow-sm placeholder:text-neutral-400 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400"
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.content && (
                                    <p className="text-sm text-red-400">
                                        {errors.content}
                                    </p>
                                )}
                                <p
                                    className={`text-sm ml-auto ${
                                        data.content.length > 200
                                            ? "text-red-400"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    {data.content.length}/250
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Paylaş Butonu */}
                    {selectedMedia && (
                        <div className="pt-2">
                            <Buton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                                size="lg"
                                onClick={handleSubmit}
                            >
                                {processing
                                    ? t("sharing", "Paylaşılıyor...")
                                    : t("share", "Paylaş")}
                            </Buton>
                        </div>
                    )}
                </div>
            </BottomSheet>
        </div>
    );
};

export default UserLayout;
