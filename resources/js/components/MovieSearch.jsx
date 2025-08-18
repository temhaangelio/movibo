import React, { useState, useEffect } from "react";
import { Star } from "@phosphor-icons/react";
import Loading from "/ui/Loading";

const MovieSearch = ({
    onMovieSelect,
    placeholder = "Film adını yazın...",
    showSelectedMovie = true,
    selectedMovie = null,
    onMovieDeselect = null,
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

    const handleMovieDeselect = () => {
        if (onMovieDeselect) {
            onMovieDeselect();
        }
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
            {searchResults.length > 0 && !selectedMovie && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((movie) => (
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
                                            "https://via.placeholder.com/92x138?text=No+Image";
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">
                                        {movie.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {movie.release_date?.split("-")[0]}
                                    </p>
                                    {movie.vote_average && (
                                        <div className="flex items-center mt-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-xs text-gray-500 ml-1">
                                                {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Seçilen Film */}
            {showSelectedMovie && selectedMovie && (
                <div className="mt-3 bg-gray-100 rounded-lg p-4 border border-gray-300">
                    <div className="flex items-center space-x-3">
                        <img
                            src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/92x138?text=No+Image";
                            }}
                        />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                                {selectedMovie.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {selectedMovie.release_date?.split("-")[0]}
                            </p>
                            {selectedMovie.vote_average && (
                                <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500 ml-1">
                                        {selectedMovie.vote_average.toFixed(1)}
                                    </span>
                                </div>
                            )}
                        </div>
                        {onMovieDeselect && (
                            <button
                                type="button"
                                onClick={handleMovieDeselect}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieSearch;
