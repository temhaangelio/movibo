import React, { useState } from "react";
import MovieSearch from "./MovieSearch";
import { useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Buton from "/ui/Buton";
import UserRating from "/ui/UserRating";

const FilmEkle = ({
    onMovieSelect,
    selectedMovie,
    placeholder = "Film adını yazın...",
    initialMovie = null,
}) => {
    const { t } = useTranslation();
    const [selectedMedia, setSelectedMedia] = useState(initialMovie);
    const [userRating, setUserRating] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: "",
        media_type: "movie",
        media_id: initialMovie?.id?.toString() || "",
        media_title: initialMovie?.title || "",
        media_description: initialMovie?.overview || "",
        media_poster: initialMovie?.poster_path
            ? `https://image.tmdb.org/t/p/w500${initialMovie.poster_path}`
            : "",
        media_release_date: initialMovie?.release_date || "",
        media_rating: initialMovie?.vote_average?.toString() || "",
        media_genre: initialMovie?.genre_ids?.join(", ") || "",
        media_author: "",
        media_director: "",
        user_rating: "",
    });

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
                if (onMovieSelect) {
                    onMovieSelect(selectedMedia);
                }
            },
        });
    };

    return (
        <div className="space-y-2">
            {/* Film Arama */}
            {!selectedMedia && !initialMovie && (
                <div>
                    <MovieSearch
                        onMovieSelect={handleMovieSelect}
                        selectedMovie={selectedMedia}
                        placeholder={placeholder}
                    />
                </div>
            )}

            {/* Seçili Film Bilgileri */}
            {selectedMedia && (
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
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
                            <h4 className="font-medium text-gray-900 text-sm">
                                {selectedMedia.title}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                {selectedMedia.release_date && (
                                    <span>
                                        {new Date(
                                            selectedMedia.release_date
                                        ).getFullYear()}
                                    </span>
                                )}
                                {selectedMedia.vote_average && (
                                    <span>
                                        ⭐ {selectedMedia.vote_average}/10
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.content && (
                            <p className="text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                        <p
                            className={`text-sm ml-auto ${
                                data.content.length > 200
                                    ? "text-red-500"
                                    : "text-gray-500"
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
    );
};

export default FilmEkle;
