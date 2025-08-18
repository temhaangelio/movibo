import React, { useState, useEffect } from "react";
import { Star, User } from "@phosphor-icons/react";
import Loading from "/ui/Loading";

const FilmArama = ({
    onMovieSelect,
    selectedMovie,
    onUserSelect,
    selectedUser,
    placeholder = "Film veya kullanıcı ara...",
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
        <div className="py-4 border-b border-gray-200">
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
                <div
                    className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    style={{ zIndex: 9999 }}
                >
                    {/* Film Sonuçları */}
                    {searchResults.movies.length > 0 && (
                        <div className="border-b border-gray-100">
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                                Filmler
                            </div>
                            {searchResults.movies.slice(0, 5).map((movie) => (
                                <button
                                    key={movie.id}
                                    type="button"
                                    onClick={() => handleMovieSelect(movie)}
                                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-12 h-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='138' viewBox='0 0 92 138'%3E%3Crect width='92' height='138' fill='%23cccccc'/%3E%3Ctext x='46' y='69' text-anchor='middle' dy='.3em' fill='%23666666' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
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
                                                    <Star className="w-4 h-4 text-black fill-current" />
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
                            {searchResults.users.slice(0, 5).map((user) => (
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
                                                        .replace(/\s+/g, "")}
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

export default FilmArama;
