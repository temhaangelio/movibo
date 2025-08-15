import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import UserLayout from "/Layouts/UserLayout";
import Buton from "/ui/Buton";
import Loading from "/ui/Loading";
import { Shuffle } from "@phosphor-icons/react";

const Rastgele = ({ auth }) => {
    const { t } = useTranslation();
    const [currentMovie, setCurrentMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [movieList, setMovieList] = useState([]);

    // TMDB API anahtarı .env'den alınıyor
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";

    // Debug için API anahtarını kontrol et
    console.log("TMDB API Key:", TMDB_API_KEY);

    // Sayfa yüklendiğinde film listesini al ve rastgele film seç
    useEffect(() => {
        loadMovies();
    }, []);

    // TMDB'den popüler filmleri al
    const loadMovies = async () => {
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=1`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                setMovieList(data.results);
                // İlk filmi rastgele seç
                const randomIndex = Math.floor(
                    Math.random() * data.results.length
                );
                await getMovieDetails(data.results[randomIndex].id);
            }
        } catch (error) {
            console.error("Filmler yüklenirken hata:", error);
        }
    };

    // Film detaylarını al (yönetmen, oyuncular, süre vb.)
    const getMovieDetails = async (movieId) => {
        setLoading(true);
        try {
            const [movieResponse, creditsResponse] = await Promise.all([
                fetch(
                    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=tr-TR`
                ),
                fetch(
                    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=tr-TR`
                ),
            ]);

            const movieData = await movieResponse.json();
            const creditsData = await creditsResponse.json();

            // Film verilerini formatla
            const formattedMovie = {
                id: movieData.id,
                title: movieData.title,
                originalTitle: movieData.original_title,
                year: new Date(movieData.release_date).getFullYear(),
                rating: movieData.vote_average,
                genre: movieData.genres?.map((g) => g.name) || [],
                director:
                    creditsData.crew?.find((c) => c.job === "Director")?.name ||
                    "Bilinmiyor",
                cast: creditsData.cast?.slice(0, 5).map((c) => c.name) || [],
                description: movieData.overview || "Açıklama bulunamadı.",
                poster: movieData.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                    : "https://via.placeholder.com/300x450/666666/FFFFFF?text=Film+Posteri",
                duration: `${movieData.runtime || 0} min`,
                language:
                    movieData.original_language === "tr"
                        ? "Türkçe"
                        : movieData.original_language === "en"
                        ? "İngilizce"
                        : movieData.original_language === "ja"
                        ? "Japonca"
                        : movieData.original_language === "ko"
                        ? "Korece"
                        : movieData.original_language === "es"
                        ? "İspanyolca"
                        : movieData.original_language === "fr"
                        ? "Fransızca"
                        : movieData.original_language === "de"
                        ? "Almanca"
                        : movieData.original_language === "it"
                        ? "İtalyanca"
                        : movieData.original_language === "ru"
                        ? "Rusça"
                        : movieData.original_language === "ar"
                        ? "Arapça"
                        : "Diğer",
            };

            setCurrentMovie(formattedMovie);
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

            <div className="relative min-h-screen">
                {/* Film Görseli - Arka Plan */}
                {currentMovie && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={currentMovie.poster}
                            alt={currentMovie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/1920x1080/666666/FFFFFF?text=Film+Posteri";
                            }}
                        />
                        {/* Karartma Katmanı */}
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    </div>
                )}

                {/* İçerik - Üst Katman */}
                <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            Rastgele Film Keşfi
                        </h1>
                        <p className="text-white/80 text-lg drop-shadow-md">
                            Yeni filmler keşfetmek için rastgele film önerileri
                        </p>
                    </div>

                    {/* Yeni Film Butonu */}
                    <div className="text-center">
                        <Buton
                            onClick={getRandomMovie}
                            variant="primary"
                            size="lg"
                            className="flex items-center space-x-2 mx-auto bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                        >
                            <Shuffle className="w-6 h-6" />
                            <span>Başka Bir Film Öner</span>
                        </Buton>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Rastgele;
