<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    public function searchMovies(Request $request): JsonResponse
    {
        $query = $request->get('query');

        if (!$query) {
            return response()->json(['results' => []]);
        }

        $apiKey = ApiHelper::getTmdbApiKey();
        $url = ApiHelper::getTmdbBaseUrl() . "/search/movie?api_key={$apiKey}&query=" . urlencode($query);

        try {
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'API request failed'], 500);
        }
    }

    public function searchBooks(Request $request): JsonResponse
    {
        $query = $request->get('query');

        if (!$query) {
            return response()->json(['items' => []]);
        }

        $url = ApiHelper::getGoogleBooksBaseUrl() . "/volumes?q=" . urlencode($query);

        try {
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'API request failed'], 500);
        }
    }

    public function discoverPosts(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Takip edilmeyen kullanıcıların paylaşımlarını getir
        $followingIds = $user->following()->pluck('users.id')->toArray();
        $followingIds[] = $user->id;

        $posts = Post::with(['user', 'likes', 'comments'])
            ->whereNotIn('user_id', $followingIds)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($post) {
                $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;
                return $post;
            });

        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function followingPosts(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Takip edilen kullanıcıların ID'lerini al
        $followingIds = $user->following()->pluck('users.id')->toArray();
        $followingIds[] = $user->id; // Kendi paylaşımlarını da dahil et

        $posts = Post::with(['user', 'likes', 'comments'])
            ->whereIn('user_id', $followingIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;
                return $post;
            });

        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function allPosts(Request $request): JsonResponse
    {
        $posts = Post::with(['user', 'likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;
                return $post;
            });

        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->get('query');
        $currentUser = auth()->user();

        if (!$query || strlen($query) < 2) {
            return response()->json(['users' => []]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('username', 'like', "%{$query}%");
        })
        ->where('id', '!=', $currentUser->id) // Kendini hariç tut
        ->withCount(['followers', 'following', 'posts'])
        ->limit(10)
        ->get()
        ->map(function ($user) use ($currentUser) {
            $user->is_following = $currentUser->isFollowing($user);
            $user->is_followed_by = $currentUser->isFollowedBy($user);
            return $user;
        });

        return response()->json([
            'users' => $users,
        ]);
    }
}