import React, { useState, useEffect } from "react";
import UserLayout from "/Layouts/UserLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Loading from "/ui/Loading";
import BottomSheet from "/ui/BottomSheet";
import FilmEkle from "../../components/FilmEkle";
import { ArrowLeft, Star, User } from "@phosphor-icons/react";

const FilmDetay = ({ auth }) => {
    const { props } = usePage();
    const id = props.id;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEkleSheetOpen, setIsEkleSheetOpen] = useState(false);

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`/api/movies/${id}`);
            const data = await response.json();
            if (data.success) {
                setMovie(data.movie);
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <UserLayout auth={auth}>
                <Head title="Film Yükleniyor..." />
                <div className="flex items-center justify-center min-h-screen">
                    <Loading size="xl" />
                </div>
            </UserLayout>
        );
    }

    if (!movie) {
        return (
            <UserLayout auth={auth}>
                <Head title="Film Bulunamadı" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">
                            Film bulunamadı
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
            <Head title={movie.title} />

            <div className="w-full pt-4">
                {/* Film Detayları */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Poster ve Temel Bilgiler */}
                    <div className="relative">
                        {/* Arka plan blur'lu afiş */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src={movie.poster_path}
                                alt=""
                                className="w-full h-full object-cover opacity-50 scale-110"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>

                        {/* Ana poster */}
                        <div className="relative z-10 flex justify-center items-center h-96">
                            <img
                                src={movie.poster_path}
                                alt={movie.title}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/400x600/cccccc/666666?text=No+Image";
                                }}
                            />
                        </div>

                        {/* Geri Butonu */}
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Puan badge */}
                        <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full flex items-center">
                            <Star className="w-4 h-4 mr-1" weight="fill" />
                            {movie.vote_average.toFixed(1)}
                        </div>
                    </div>

                    <div className="p-4">
                        {/* Film Başlığı ve Yıl */}
                        <div className="mb-3">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {movie.title}
                                </h2>
                                <div className="flex items-center text-gray-500 text-sm">
                                    {new Date(movie.release_date).getFullYear()}
                                </div>
                            </div>
                        </div>

                        {/* Film Açıklaması */}
                        <div className="mb-4">
                            <p className="text-gray-600 leading-relaxed">
                                {movie.overview ||
                                    "Bu film için henüz açıklama bulunmuyor."}
                            </p>
                        </div>

                        {/* Ekle Butonu */}
                        <button
                            onClick={() => setIsEkleSheetOpen(true)}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            Ekle
                        </button>
                    </div>
                </div>

                {/* Oyuncular Bölümü */}
                {movie.cast && movie.cast.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Oyuncular
                        </h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {movie.cast.map((actor) => (
                                <div
                                    key={actor.id}
                                    className="text-center flex-shrink-0"
                                >
                                    <Link href={`/actors/${actor.id}`}>
                                        <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-200 hover:scale-105 transition-transform cursor-pointer">
                                            {actor.profile_path ? (
                                                <img
                                                    src={actor.profile_path}
                                                    alt={actor.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/64x64/cccccc/666666?text=?";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <User className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <p className="text-sm font-medium text-gray-900 truncate w-16">
                                        {actor.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate w-16">
                                        {actor.character}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ekip Bölümü */}
                {movie.crew && movie.crew.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ekip
                        </h3>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {movie.crew.map((member) => (
                                <div
                                    key={member.id}
                                    className="text-center flex-shrink-0"
                                >
                                    <Link href={`/actors/${member.id}`}>
                                        <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-200 hover:scale-105 transition-transform cursor-pointer">
                                            {member.profile_path ? (
                                                <img
                                                    src={member.profile_path}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/64x64/cccccc/666666?text=?";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <User className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <p className="text-sm font-medium text-gray-900 truncate w-16">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate w-16">
                                        {member.job}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Film Ekleme BottomSheet */}
                <BottomSheet
                    isOpen={isEkleSheetOpen}
                    onClose={() => setIsEkleSheetOpen(false)}
                    title="Film Ekle"
                    maxHeight="max-h-[80vh]"
                >
                    <FilmEkle
                        initialMovie={movie}
                        onMovieSelect={(selectedMovie) => {
                            // Film paylaşımı yapıldıktan sonra BottomSheet'i kapat
                            setIsEkleSheetOpen(false);
                        }}
                    />
                </BottomSheet>
            </div>
        </UserLayout>
    );
};

export default FilmDetay;
