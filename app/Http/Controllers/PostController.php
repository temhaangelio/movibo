<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(['user', 'likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;
                return $post;
            });

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'media_type' => 'required|in:movie,book',
            'media_id' => 'required|string',
            'media_title' => 'required|string',
            'media_description' => 'nullable|string',
            'media_poster' => 'nullable|url',
            'media_release_date' => 'nullable|string',
            'media_rating' => 'nullable|string',
            'media_genre' => 'nullable|string',
            'media_author' => 'nullable|string',
            'media_director' => 'nullable|string',
            'user_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $post = auth()->user()->posts()->create($validated);

        // Post oluşturma aktivitesini logla
        ActivityService::logPostCreate(auth()->user(), $validated, $request);

        return redirect()->route('home.authenticated')->with('success', 'Paylaşım başarıyla oluşturuldu!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        $post->is_liked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        // Post silme aktivitesini logla
        $postData = [
            'media_title' => $post->media_title,
            'media_type' => $post->media_type
        ];
        ActivityService::logPostDelete(auth()->user(), $postData, request());

        $post->delete();

        return redirect()->route('home.authenticated')->with('success', 'Paylaşım başarıyla silindi!');
    }
}
