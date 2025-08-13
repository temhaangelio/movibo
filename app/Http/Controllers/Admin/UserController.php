<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::withCount(['posts', 'comments', 'likes'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // User stats
        $userStats = [
            'totalPosts' => $user->posts()->count(),
            'totalComments' => $user->comments()->count(),
            'totalLikes' => $user->likes()->count(),
        ];

        // Recent posts with counts
        $userPosts = $user->posts()
            ->withCount(['likes', 'comments'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'userStats' => $userStats,
            'userPosts' => $userPosts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Kullanıcı başarıyla güncellendi!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Admin kendini silemesin
        if ($user->isAdmin()) {
            return redirect()->back()->with('error', 'Admin kullanıcısı silinemez!');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Kullanıcı başarıyla silindi!');
    }
}
