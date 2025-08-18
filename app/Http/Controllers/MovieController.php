<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{
    public function getPopularMovies(Request $request)
    {
        try {
            $apiKey = config('services.tmdb.api_key');
            $page = (int) $request->get('page', 1);
            
            // Page numarasını kontrol et
            if ($page < 1) {
                $page = 1;
            }
            
            $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
                'api_key' => $apiKey,
                'language' => 'tr-TR',
                'page' => $page
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $movies = $responseData['results'] ?? [];
                $totalPages = $responseData['total_pages'] ?? 1;
                $currentPage = $responseData['page'] ?? $page;
                
                // Film verilerini düzenle
                $formattedMovies = collect($movies)->map(function ($movie) {
                    return [
                        'id' => $movie['id'],
                        'title' => $movie['title'],
                        'original_title' => $movie['original_title'],
                        'overview' => $movie['overview'],
                        'poster_path' => $movie['poster_path'] ? "https://image.tmdb.org/t/p/w500" . $movie['poster_path'] : null,
                        'vote_average' => $movie['vote_average'],
                        'release_date' => $movie['release_date'],
                        'popularity' => $movie['popularity']
                    ];
                })->toArray();

                return response()->json([
                    'success' => true,
                    'movies' => $formattedMovies,
                    'page' => $currentPage,
                    'total_pages' => $totalPages,
                    'total_results' => $responseData['total_results'] ?? 0
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Film verileri alınamadı'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API hatası: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMovieDetails($id)
    {
        try {
            $apiKey = config('services.tmdb.api_key');
            $response = Http::get("https://api.themoviedb.org/3/movie/{$id}", [
                'api_key' => $apiKey,
                'language' => 'tr-TR',
                'append_to_response' => 'credits,videos,images'
            ]);

            if ($response->successful()) {
                $movie = $response->json();
                
                $formattedMovie = [
                    'id' => $movie['id'],
                    'title' => $movie['title'],
                    'original_title' => $movie['original_title'],
                    'overview' => $movie['overview'],
                    'poster_path' => $movie['poster_path'] ? "https://image.tmdb.org/t/p/w500" . $movie['poster_path'] : null,
                    'backdrop_path' => $movie['backdrop_path'] ? "https://image.tmdb.org/t/p/original" . $movie['backdrop_path'] : null,
                    'vote_average' => $movie['vote_average'],
                    'vote_count' => $movie['vote_count'],
                    'release_date' => $movie['release_date'],
                    'runtime' => $movie['runtime'],
                    'genres' => collect($movie['genres'])->pluck('name')->toArray(),
                    'popularity' => $movie['popularity'],
                    'status' => $movie['status'],
                    'tagline' => $movie['tagline'],
                    'cast' => collect($movie['credits']['cast'] ?? [])->take(10)->map(function ($actor) {
                        return [
                            'id' => $actor['id'],
                            'name' => $actor['name'],
                            'character' => $actor['character'],
                            'profile_path' => $actor['profile_path'] ? "https://image.tmdb.org/t/p/w185" . $actor['profile_path'] : null,
                            'order' => $actor['order']
                        ];
                    })->toArray(),
                    'crew' => collect($movie['credits']['crew'] ?? [])->filter(function ($member) {
                        return in_array($member['job'], ['Director', 'Producer', 'Writer', 'Screenplay']);
                    })->take(5)->map(function ($member) {
                        return [
                            'id' => $member['id'],
                            'name' => $member['name'],
                            'job' => $member['job'],
                            'profile_path' => $member['profile_path'] ? "https://image.tmdb.org/t/p/w185" . $member['profile_path'] : null
                        ];
                    })->toArray()
                ];

                return response()->json([
                    'success' => true,
                    'movie' => $formattedMovie
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Film detayları alınamadı'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API hatası: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getActorDetails($id)
    {
        try {
            $apiKey = config('services.tmdb.api_key');
            $response = Http::get("https://api.themoviedb.org/3/person/{$id}", [
                'api_key' => $apiKey,
                'language' => 'tr-TR',
                'append_to_response' => 'movie_credits'
            ]);

            if ($response->successful()) {
                $actor = $response->json();
                
                $formattedActor = [
                    'id' => $actor['id'],
                    'name' => $actor['name'],
                    'biography' => $actor['biography'],
                    'birthday' => $actor['birthday'],
                    'place_of_birth' => $actor['place_of_birth'],
                    'profile_path' => $actor['profile_path'] ? "https://image.tmdb.org/t/p/w500" . $actor['profile_path'] : null,
                    'popularity' => $actor['popularity'],
                    'known_for_department' => $actor['known_for_department']
                ];

                // Oyuncunun filmlerini al
                $movies = collect($actor['movie_credits']['cast'] ?? [])
                    ->sortByDesc('release_date')
                    ->take(20)
                    ->map(function ($movie) {
                        return [
                            'id' => $movie['id'],
                            'title' => $movie['title'],
                            'character' => $movie['character'],
                            'poster_path' => $movie['poster_path'] ? "https://image.tmdb.org/t/p/w185" . $movie['poster_path'] : null,
                            'release_date' => $movie['release_date'],
                            'vote_average' => $movie['vote_average']
                        ];
                    })
                    ->filter(function ($movie) {
                        return $movie['title'] && $movie['release_date'];
                    })
                    ->values()
                    ->toArray();

                return response()->json([
                    'success' => true,
                    'actor' => $formattedActor,
                    'movies' => $movies
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Oyuncu detayları alınamadı'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API hatası: ' . $e->getMessage()
            ], 500);
        }
    }
}
