import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import Buton from "/ui/Buton";
import Loading from "/ui/Loading";
import { Shuffle, Play } from "@phosphor-icons/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";

const Rastgele = ({ auth }) => {
    const { t } = useTranslation();
    const [currentMovie, setCurrentMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [movieList, setMovieList] = useState([]);

    // Backend API endpoint'leri kullanılıyor

    // Sayfa yüklendiğinde film listesini al ve rastgele film seç
    useEffect(() => {
        loadMovies();
    }, []);

    // Backend'den popüler filmleri al
    const loadMovies = async () => {
        try {
            const response = await fetch(`/api/movies/popular?page=1`);
            const data = await response.json();

            if (data.success && data.movies && data.movies.length > 0) {
                setMovieList(data.movies);
                // İlk filmi rastgele seç
                const randomIndex = Math.floor(
                    Math.random() * data.movies.length
                );
                await getMovieDetails(data.movies[randomIndex].id);
            }
        } catch (error) {
            console.error("Filmler yüklenirken hata:", error);
        }
    };

    // Backend'den film detaylarını al
    const getMovieDetails = async (movieId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/movies/${movieId}`);
            const data = await response.json();

            if (data.success && data.movie) {
                const movieData = data.movie;

                // Film verilerini formatla
                const formattedMovie = {
                    id: movieData.id,
                    title: movieData.title,
                    originalTitle: movieData.original_title,
                    year: new Date(movieData.release_date).getFullYear(),
                    rating: movieData.vote_average,
                    genre: movieData.genres || [],
                    director: Array.isArray(movieData.crew)
                        ? movieData.crew.find((c) => c.job === "Director")
                              ?.name || "Bilinmiyor"
                        : "Bilinmiyor",
                    cast: Array.isArray(movieData.cast)
                        ? movieData.cast.slice(0, 5).map((c) => c.name) || []
                        : [],
                    description: movieData.overview || "Açıklama bulunamadı.",
                    poster:
                        movieData.poster_path ||
                        "https://via.placeholder.com/300x450/666666/FFFFFF?text=Film+Posteri",
                    duration: `${movieData.runtime || 0} min`,
                    language:
                        movieData.original_language === "tr"
                            ? "Türkçe"
                            : "Diğer",
                };

                setCurrentMovie(formattedMovie);
            }
        } catch (error) {
            console.error("Film detayları alınırken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRandomMovie = async () => {
        if (movieList.length === 0) {
            await loadMovies();
            return;
        }

        const randomIndex = Math.floor(Math.random() * movieList.length);
        await getMovieDetails(movieList[randomIndex].id);
    };

    const goToMovieDetail = () => {
        if (currentMovie) {
            router.visit(`/movies/${currentMovie.id}`);
        }
    };

    if (loading) {
        return (
            <UserLayout auth={auth}>
                <Head title="Rastgele Film" />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loading size="lg" />
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout auth={auth}>
            <Head title="Rastgele Film" />

            <div className="relative pt-4">
                {/* Film Görseli - Arka Plan */}
                {currentMovie && (
                    <img
                        src={currentMovie.poster}
                        alt={currentMovie.title}
                        className="w-full"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/1920x1080/666666/FFFFFF?text=Film+Posteri";
                        }}
                    />
                )}
                {/* Butonlar - Görselin Üstünde */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center items-center space-x-4">
                    {currentMovie && (
                        <Buton
                            onClick={goToMovieDetail}
                            variant="primary"
                            size="lg"
                            className="flex items-center space-x-2 bg-black text-gray-900 hover:bg-gray-100 shadow-lg"
                        >
                            <Play className="w-5 h-5" />
                            <span>Filme Git</span>
                        </Buton>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center">
                <Buton
                    onClick={getRandomMovie}
                    variant="ghost"
                    size="lg"
                    className="flex items-center space-x-2"
                >
                    <FontAwesomeIcon icon={faDice} className="w-10 h-10" />
                    <span>Başka Bir Film Öner</span>
                </Buton>
            </div>
        </UserLayout>
    );
};

export default Rastgele;
