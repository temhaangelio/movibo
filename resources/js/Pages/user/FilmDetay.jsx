import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import Loading from "/ui/Loading";
import BottomSheet from "/ui/BottomSheet";
import { ArrowLeft, Star, User } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import UserRating from "/ui/UserRating";

const FilmDetay = ({ auth }) => {
    const { t } = useTranslation();
    const { props } = usePage();
    const id = props.id;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`/api/movies/${id}`);
            const data = await response.json();
            if (data.success) {
                setMovie(data.movie);
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        } finally {
            setLoading(false);
        }
    };

    // FilmEkle fonksiyonları
    const handleRatingClick = (rating) => {
        setUserRating(rating);
        setData("user_rating", rating.toString());
    };

    const handleMovieSelectForEkle = (movie) => {
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

    if (loading) {
        return (
            <UserLayout auth={auth}>
                <Head title="Film Yükleniyor..." />
                <div className="flex items-center justify-center min-h-screen">
                    <Loading size="xl" />
                </div>
            </UserLayout>
        );
    }

    if (!movie) {
        return (
            <UserLayout auth={auth}>
                <Head title="Film Bulunamadı" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">
                            Film bulunamadı
                        </h1>
                        <Link href="/discover">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Geri Dön
                            </button>
                        </Link>
                    </div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout auth={auth}>
            <Head title={movie.title} />

            <div className="w-full pt-4 pb-12">
                {/* Film Detayları */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Poster ve Temel Bilgiler */}
                    <div className="relative">
                        {/* Arka plan blur'lu afiş */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src={movie.poster_path}
                                alt=""
                                className="w-full h-full object-cover opacity-50 scale-110"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>

                        {/* Ana poster */}
                        <div className="relative z-10 flex justify-center items-center h-96">
                            <img
                                src={movie.poster_path}
                                alt={movie.title}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/400x600/cccccc/666666?text=No+Image";
                                }}
                            />
                        </div>

                        {/* Geri Butonu */}
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Puan badge */}
                        <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full flex items-center">
                            <Star className="w-4 h-4 mr-1" weight="fill" />
                            {movie.vote_average.toFixed(1)}
                        </div>
                    </div>

                    <div className="p-4">
                        {/* Film Başlığı ve Yıl */}
                        <div className="mb-3">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {movie.title}
                                </h2>
                                <div className="flex items-center text-gray-500 text-sm">
                                    {new Date(movie.release_date).getFullYear()}
                                </div>
                            </div>
                        </div>

                        {/* Film Açıklaması */}
                        <div className="mb-4">
                            <p className="text-gray-600 leading-relaxed">
                                {movie.overview ||
                                    "Bu film için henüz açıklama bulunmuyor."}
                            </p>
                        </div>

                        {/* Ekle Butonu */}
                        <button
                            onClick={() => setIsEkleSheetOpen(true)}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            Ekle
                        </button>
                    </div>
                </div>

                {/* Oyuncular Bölümü */}
                {movie.cast && movie.cast.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Oyuncular
                        </h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                            {movie.cast.map((actor) => (
                                <div
                                    key={actor.id}
                                    className="text-center flex-shrink-0"
                                >
                                    <Link href={`/actors/${actor.id}`}>
                                        <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-200 hover:scale-105 transition-transform cursor-pointer">
                                            {actor.profile_path ? (
                                                <img
                                                    src={actor.profile_path}
                                                    alt={actor.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/64x64/cccccc/666666?text=?";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <User className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <p className="text-sm font-medium text-gray-900 truncate w-16">
                                        {actor.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate w-16">
                                        {actor.character}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ekip Bölümü */}
                {movie.crew && movie.crew.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ekip
                        </h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                            {movie.crew.map((member) => (
                                <div
                                    key={member.id}
                                    className="text-center flex-shrink-0"
                                >
                                    <Link href={`/actors/${member.id}`}>
                                        <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-200 hover:scale-105 transition-transform cursor-pointer">
                                            {member.profile_path ? (
                                                <img
                                                    src={member.profile_path}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/64x64/cccccc/666666?text=?";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <User className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <p className="text-sm font-medium text-gray-900 truncate w-16">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate w-16">
                                        {member.job}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Film Ekleme BottomSheet */}
                <BottomSheet
                    isOpen={isEkleSheetOpen}
                    onClose={() => setIsEkleSheetOpen(false)}
                    title="Film Ekle"
                    maxHeight="max-h-[80vh]"
                >
                    <div className="space-y-3">
                        {/* Seçili Film Bilgileri */}
                        <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
                            <div className="flex items-center space-x-3">
                                {movie.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-12 h-18 object-cover rounded"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-white text-sm">
                                        {movie.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-xs text-neutral-400">
                                        {movie.release_date && (
                                            <span>
                                                {new Date(
                                                    movie.release_date
                                                ).getFullYear()}
                                            </span>
                                        )}
                                        {movie.vote_average && (
                                            <span>
                                                ⭐ {movie.vote_average}/10
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kullanıcı Puanı */}
                        <UserRating
                            value={userRating}
                            onChange={handleRatingClick}
                            label={t("your_rating", "Puanınız")}
                        />

                        {/* Yorum */}
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

                        {/* Paylaş Butonu */}
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
                    </div>
                </BottomSheet>
            </div>
        </UserLayout>
    );
};

export default FilmDetay;
