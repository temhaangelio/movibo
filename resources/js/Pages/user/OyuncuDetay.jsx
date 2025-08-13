import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Loading from "/ui/Loading";
import { ArrowLeft, Star, Calendar, User, Play } from "@phosphor-icons/react";

const OyuncuDetay = ({ auth }) => {
    const { props } = usePage();
    const id = props.id;
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActorDetails();
    }, [id]);

    const fetchActorDetails = async () => {
        try {
            const response = await fetch(`/api/actors/${id}`);
            const data = await response.json();
            if (data.success) {
                setActor(data.actor);
                setMovies(data.movies || []);
            }
        } catch (error) {
            console.error("Error fetching actor details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <UserLayout auth={auth}>
                <Head title="Oyuncu Yükleniyor..." />
                <div className="flex items-center justify-center min-h-screen">
                    <Loading
                        size="xl"
                        showText={true}
                        text="Oyuncu yükleniyor..."
                    />
                </div>
            </UserLayout>
        );
    }

    if (!actor) {
        return (
            <UserLayout auth={auth}>
                <Head title="Oyuncu Bulunamadı" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Oyuncu bulunamadı
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
            <Head title={actor.name} />

            <div className="w-full">
                {/* Oyuncu Detayları */}
                <div className="p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Profil Fotoğrafı ve Temel Bilgiler */}
                        <div className="relative">
                            {actor.profile_path ? (
                                <img
                                    src={actor.profile_path}
                                    alt={actor.name}
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/400x600/cccccc/666666?text=No+Image";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-80 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <User className="w-32 h-32 text-gray-400 dark:text-gray-500" />
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            {/* Oyuncu Adı */}
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {actor.name}
                                </h2>
                                {actor.birthday && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Doğum Tarihi:{" "}
                                        {new Date(
                                            actor.birthday
                                        ).toLocaleDateString("tr-TR")}
                                    </p>
                                )}
                                {actor.place_of_birth && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Doğum Yeri: {actor.place_of_birth}
                                    </p>
                                )}
                            </div>

                            {/* Oyuncu Biyografisi */}
                            {actor.biography && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Biyografi
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {actor.biography}
                                    </p>
                                </div>
                            )}

                            {/* İstatistikler */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {actor.popularity?.toFixed(0) || "N/A"}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Popülerlik
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {movies.length}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Film Sayısı
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {actor.known_for_department || "Oyuncu"}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Uzmanlık
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filmler Bölümü */}
                    {movies.length > 0 && (
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Oynadığı Filmler
                            </h3>
                            <div className="space-y-3">
                                {movies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Link href={`/movies/${movie.id}`}>
                                            <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                                                {movie.poster_path ? (
                                                    <img
                                                        src={movie.poster_path}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "https://via.placeholder.com/64x96/cccccc/666666?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                        <Play className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/movies/${movie.id}`}>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                                    {movie.title}
                                                </h4>
                                            </Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {movie.character}
                                            </p>
                                            {movie.release_date && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {new Date(
                                                        movie.release_date
                                                    ).getFullYear()}
                                                </p>
                                            )}
                                        </div>
                                        {movie.vote_average && (
                                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Star
                                                    className="w-3 h-3"
                                                    weight="fill"
                                                />
                                                <span>
                                                    {movie.vote_average.toFixed(
                                                        1
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default OyuncuDetay;
