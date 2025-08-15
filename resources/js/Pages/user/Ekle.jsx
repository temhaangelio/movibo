import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import UserRating from "/ui/UserRating";
import FilmEkle from "../../components/FilmEkle.jsx";
import { X } from "@phosphor-icons/react";

const Create = ({ auth }) => {
    const { t } = useTranslation();
    const { props } = usePage();
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

    // URL parametrelerinden film bilgilerini al
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get("movie");
        const movieTitle = urlParams.get("title");

        if (movieId && movieTitle) {
            // Film bilgilerini API'den al
            fetchMovieDetails(movieId);
        }
    }, []);

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(`/api/movies/${movieId}`);
            const result = await response.json();

            if (result.success) {
                const movie = result.movie;
                setSelectedMedia(movie);
                setData({
                    content: "",
                    media_type: "movie",
                    media_id: movie.id.toString(),
                    media_title: movie.title || "",
                    media_description: movie.overview || "",
                    media_poster: movie.poster_path || "",
                    media_release_date: movie.release_date || "",
                    media_rating: movie.vote_average?.toString() || "",
                    media_genre: movie.genres?.join(", ") || "",
                    media_author: "",
                    media_director: "",
                    user_rating: "",
                });
                setUserRating(0);
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const handleRatingClick = (rating) => {
        setUserRating(rating);
        setData("user_rating", rating.toString());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/posts", {
            onSuccess: () => {
                reset();
                setSelectedMedia(null);
                setUserRating(0);
            },
        });
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

    const handleMovieDeselect = () => {
        setSelectedMedia(null);
        setData({
            content: data.content,
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
        setUserRating(0);
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("new_post", "Yeni Paylaşım")} />

            <div className="w-full pt-4">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Film Ekle */}
                    {!selectedMedia && (
                        <div>
                            <FilmEkle
                                onMovieSelect={handleMovieSelect}
                                selectedMovie={selectedMedia}
                            />
                        </div>
                    )}

                    {/* Seçili Film Bilgileri */}
                    {selectedMedia && (
                        <div className="flex flex-col border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleMovieDeselect}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center space-x-4">
                                {selectedMedia.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`}
                                        alt={selectedMedia.title}
                                        className="w-16 h-24 object-cover rounded"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {selectedMedia.title}
                                    </h4>
                                    {selectedMedia.release_date && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(
                                                selectedMedia.release_date
                                            ).getFullYear()}
                                        </p>
                                    )}
                                    {selectedMedia.vote_average && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            ⭐ {selectedMedia.vote_average}
                                            /10
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kullanıcı Puanı */}
                    {selectedMedia && (
                        <UserRating
                            value={userRating}
                            onChange={handleRatingClick}
                            label={t("your_rating")}
                        />
                    )}

                    {/* Yorum */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("comment")}
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 250) {
                                    setData("content", value);
                                }
                            }}
                            placeholder={t("comment_placeholder")}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400"
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.content && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.content}
                                </p>
                            )}
                            <p
                                className={`text-sm ml-auto ${
                                    data.content.length > 200
                                        ? "text-red-500"
                                        : "text-gray-500 dark:text-gray-400"
                                }`}
                            >
                                {data.content.length}/250
                            </p>
                        </div>
                    </div>

                    {/* Paylaş Butonu */}
                    <div className="pt-4">
                        <Buton
                            type="submit"
                            disabled={processing || !selectedMedia}
                            className="w-full"
                            size="lg"
                        >
                            {processing
                                ? t("sharing", "Paylaşılıyor...")
                                : t("share")}
                        </Buton>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
};

export default Create;
