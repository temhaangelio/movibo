<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalPosts' => Post::count(),
            'totalComments' => Comment::count(),
            'totalLikes' => Like::count(),
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentPosts = Post::with(['user', 'likes', 'comments'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->take(5)
            ->get();
        $recentComments = Comment::with('user')->latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
        ]);
    }
}
