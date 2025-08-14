import React, { useState, useEffect, useCallback } from "react";
import UserLayout from "/Layouts/UserLayout";
import { useTranslation } from "react-i18next";
import FilmArama from "../../components/FilmArama.jsx";
import { Head, Link, usePage } from "@inertiajs/react";
import Loading from "/ui/Loading";
import {
    Play,
    Star,
    Users,
    MagnifyingGlass,
    User,
} from "@phosphor-icons/react";

const Discover = ({ auth }) => {
    const { t } = useTranslation();
    const { url } = usePage();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    // Film arama state'i
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []); // Component mount olduğunda çalışır

    // Sayfa her açıldığında filmleri yenile
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        fetchMovies();
    }, [url]); // URL değiştiğinde (sayfa açıldığında) filmleri yenile

    const fetchMovies = async (pageNum = 1, append = false) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            console.log(`Fetching movies for page: ${pageNum}`);
            // TheMovieDB API'den popüler filmleri çek
            const response = await fetch(`/api/movies/popular?page=${pageNum}`);
            const data = await response.json();

            console.log(`Response for page ${pageNum}:`, data);

            if (data.movies && data.movies.length > 0) {
                if (append) {
                    // Yeni filmleri mevcut listeye ekle, duplicate'ları önle
                    const newMovies = data.movies.filter(
                        (newMovie) =>
                            !movies.some(
                                (existingMovie) =>
                                    existingMovie.id === newMovie.id
                            )
                    );
                    console.log(
                        `Adding ${newMovies.length} new movies from page ${pageNum}`
                    );
                    setMovies((prev) => [...prev, ...newMovies]);
                } else {
                    setMovies(data.movies);
                }
                setPage(pageNum);
                setHasMore(
                    data.movies.length === 20 &&
                        pageNum < (data.total_pages || 100)
                ); // TMDB genelde 20 film döner
                console.log(
                    `Has more: ${
                        data.movies.length === 20 &&
                        pageNum < (data.total_pages || 100)
                    }`
                );
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Film yükleme hatası:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            fetchMovies(page + 1, true);
        }
    }, [page, loadingMore, hasMore]);

    // Scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMore]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        // Kullanıcı profil sayfasına yönlendir
        window.location.href = `/users/${user.id}`;
    };

    // Film seçimi
    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        // Film detay sayfasına yönlendir
        window.location.href = `/movies/${movie.id}`;
    };

    return (
        <UserLayout auth={auth}>
            <Head title={t("discover", "Keşfet")} />

            <div className="w-full">
                {/* Film ve Kullanıcı Arama */}
                <FilmArama
                    onMovieSelect={handleMovieSelect}
                    selectedMovie={selectedMovie}
                    onUserSelect={handleUserSelect}
                    selectedUser={selectedUser}
                />

                {/* Önerilen Filmler */}
                <div className="py-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <Loading
                                size="lg"
                                showText={true}
                                text={t(
                                    "loading_movies",
                                    "Filmler yükleniyor..."
                                )}
                            />
                        </div>
                    ) : movies.length > 0 ? (
                        <>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-0">
                                {movies.map((movie) => (
                                    <Link
                                        key={movie.id}
                                        href={`/movies/${movie.id}`}
                                        className="aspect-[2/3] overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    >
                                        <img
                                            src={movie.poster_path}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/200x300/cccccc/666666?text=No+Image";
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {/* Load More Section */}
                            {hasMore && (
                                <div className="text-center py-8">
                                    {loadingMore ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loading
                                                size="sm"
                                                showText={false}
                                            />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Daha fazla film yükleniyor...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <button
                                                onClick={loadMore}
                                                className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
                                            >
                                                Daha Fazla Film Yükle
                                            </button>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Sayfa {page} - {movies.length}{" "}
                                                film yüklendi
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tüm filmler yüklendi mesajı */}
                            {!hasMore && movies.length > 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Tüm filmler yüklendi! 🎬
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Film bulunamadı
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Şu anda popüler filmler yüklenemiyor.
                            </p>
                            <button
                                onClick={() => fetchMovies()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default Discover;
