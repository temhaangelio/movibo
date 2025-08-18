import React, { useState, useEffect, useCallback } from "react";
import UserLayout from "/Layouts/UserLayout";
import { useTranslation } from "react-i18next";

import { Head, Link, usePage } from "@inertiajs/react";
import Loading from "/ui/Loading";
import {
    Play,
    Star,
    Users,
    MagnifyingGlass,
    User,
    FlyingSaucer,
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

    // FilmArama bileşeni
    const FilmArama = ({
        onMovieSelect,
        selectedMovie,
        onUserSelect,
        selectedUser,
        placeholder = "Film veya kullanıcı ara...",
        className = "",
    }) => {
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState({
            movies: [],
            users: [],
        });
        const [isSearching, setIsSearching] = useState(false);

        const searchAll = (query) => {
            if (!query.trim()) {
                setSearchResults({ movies: [], users: [] });
                return;
            }

            setIsSearching(true);

            // Film araması
            fetch(`/api/search/movies?query=${encodeURIComponent(query)}`)
                .then((response) => response.json())
                .then((movieData) => {
                    // Kullanıcı araması
                    return fetch(
                        `/api/search/users?query=${encodeURIComponent(query)}`
                    )
                        .then((response) => response.json())
                        .then((userData) => {
                            const results = {
                                movies: movieData.results || [],
                                users: userData.users || [],
                            };
                            setSearchResults(results);
                            setIsSearching(false);
                        });
                })
                .catch((error) => {
                    console.error("Search error:", error);
                    setSearchResults({ movies: [], users: [] });
                    setIsSearching(false);
                });
        };

        const handleInputChange = (e) => {
            const value = e.target.value;
            setSearchQuery(value);

            if (value.trim()) {
                searchAll(value);
            } else {
                setSearchResults({ movies: [], users: [] });
            }
        };

        const handleMovieSelect = (movie) => {
            onMovieSelect(movie);
            setSearchResults({ movies: [], users: [] });
            setSearchQuery("");
        };

        const handleUserSelect = (user) => {
            onUserSelect(user);
            setSearchResults({ movies: [], users: [] });
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loading size="sm" />
                        </div>
                    )}
                </div>

                {/* Arama Sonuçları */}
                {(searchResults.movies.length > 0 ||
                    searchResults.users.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {/* Film Sonuçları */}
                        {searchResults.movies.length > 0 && (
                            <div className="border-b border-gray-100">
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                                    Filmler
                                </div>
                                {searchResults.movies
                                    .slice(0, 3)
                                    .map((movie) => (
                                        <button
                                            key={movie.id}
                                            type="button"
                                            onClick={() =>
                                                handleMovieSelect(movie)
                                            }
                                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
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
                                                    <h4 className="font-medium text-gray-900">
                                                        {movie.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            movie.release_date?.split(
                                                                "-"
                                                            )[0]
                                                        }
                                                    </p>
                                                    {movie.vote_average && (
                                                        <div className="flex items-center mt-1">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-xs text-gray-500 ml-1">
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

                        {/* Kullanıcı Sonuçları */}
                        {searchResults.users.length > 0 && (
                            <div>
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                                    Kullanıcılar
                                </div>
                                {searchResults.users.slice(0, 3).map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => handleUserSelect(user)}
                                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {user.profile_photo ? (
                                                    <img
                                                        src={`/storage/${user.profile_photo}`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    @
                                                    {user.username ||
                                                        user.name
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                ""
                                                            )}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

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

    const fetchMovies = useCallback(async (pageNum = 1, append = false) => {
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

            if (data.success && data.movies && data.movies.length > 0) {
                if (append) {
                    // Yeni filmleri mevcut listeye ekle, duplicate'ları önle
                    setMovies((prev) => {
                        const newMovies = data.movies.filter(
                            (newMovie) =>
                                !prev.some(
                                    (existingMovie) =>
                                        existingMovie.id === newMovie.id
                                )
                        );
                        console.log(
                            `Adding ${newMovies.length} new movies from page ${pageNum}`
                        );
                        return [...prev, ...newMovies];
                    });
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
                if (!data.success) {
                    console.error("API Error:", data.message);
                }
            }
        } catch (error) {
            console.error("Film yükleme hatası:", error);
            setMovies([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        console.log("loadMore called:", { page, loadingMore, hasMore });
        if (!loadingMore && hasMore) {
            console.log("Fetching next page:", page + 1);
            fetchMovies(page + 1, true);
        }
    }, [page, loadingMore, hasMore, fetchMovies]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const triggerElement = document.getElementById("scroll-trigger");

        if (!triggerElement || !hasMore || loadingMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log(
                            "Trigger element is visible, loading more movies..."
                        );
                        loadMore();
                    }
                });
            },
            {
                root: null, // viewport
                rootMargin: "100px", // 100px before the element becomes visible
                threshold: 0.1,
            }
        );

        observer.observe(triggerElement);

        return () => {
            observer.disconnect();
        };
    }, [loadMore, hasMore, loadingMore]);

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
                <div className="py-4 border-b border-gray-200">
                    <FilmArama
                        onMovieSelect={handleMovieSelect}
                        selectedMovie={selectedMovie}
                        onUserSelect={handleUserSelect}
                        selectedUser={selectedUser}
                        placeholder="Film veya kullanıcı ara..."
                    />
                </div>

                {/* Önerilen Filmler */}
                <div className="py-4">
                    {loading ? (
                        <Loading size="lg" centered={true} />
                    ) : movies.length > 0 ? (
                        <>
                            <div className="grid grid-cols-3 gap-0">
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

                            {/* Loading More Indicator */}
                            {loadingMore && (
                                <div className="text-center py-4">
                                    <Loading size="sm" />
                                </div>
                            )}

                            {/* Infinite Scroll Trigger */}
                            {hasMore && !loadingMore && (
                                <div
                                    id="scroll-trigger"
                                    className="h-1 w-full"
                                    style={{ marginTop: "100px" }}
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center justify-center py-48 text-center w-full">
                                <FlyingSaucer className="w-24 h-24" />
                                <h3 className="text-lg font-medium  mb-2">
                                    {t(
                                        "no_content_yet",
                                        "Henüz bir içerik yok!"
                                    )}
                                </h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default Discover;
