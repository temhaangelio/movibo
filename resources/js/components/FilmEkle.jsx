import React from "react";
import MovieSearch from "./MovieSearch";

const FilmEkle = ({
    onMovieSelect,
    selectedMovie,
    placeholder = "Film adını yazın...",
}) => {
    return (
        <div className="mb-4">
            <MovieSearch
                onMovieSelect={onMovieSelect}
                selectedMovie={selectedMovie}
                placeholder={placeholder}
            />
        </div>
    );
};

export default FilmEkle;
