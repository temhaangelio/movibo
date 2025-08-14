<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::withCount(['posts', 'comments', 'likes', 'activities'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Kullanıcı başarıyla oluşturuldu!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        
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
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
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
    public function destroy($id)
    {
        try {
            \Log::info('User delete attempt', ['user_id' => $id, 'admin_user' => auth()->user()->id]);
            
            $user = User::findOrFail($id);
            
            // Admin kendini silemesin (sadece kendini koru)
            if ($user->id === auth()->user()->id) {
                \Log::warning('Self-deletion attempt blocked', ['user_id' => $id]);
                return redirect()->back()->with('error', 'Kendinizi silemezsiniz!');
            }

            // Kullanıcı silme aktivitesini logla
            ActivityService::logUserDelete($user, auth()->user(), request());

            // Kullanıcıyı sil - event listener'lar otomatik olarak ilişkili verileri silecek
            $user->delete();
            
            \Log::info('User deleted successfully', ['user_id' => $id]);

            return redirect()->route('admin.users.index')->with('success', 'Kullanıcı ve tüm ilişkili verileri başarıyla silindi!');
        } catch (\Exception $e) {
            \Log::error('User deletion failed', [
                'user_id' => $id, 
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Kullanıcı silinirken bir hata oluştu: ' . $e->getMessage());
        }
    }

    /**
     * Toggle user block status
     */
    public function toggleBlock($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Admin kendini bloklayamaz
            if ($user->id === auth()->user()->id) {
                return redirect()->back()->with('error', 'Kendinizi bloklayamazsınız!');
            }

            $oldBlockStatus = $user->is_blocked;
            $user->is_blocked = !$user->is_blocked;
            $user->save();
            
            // Kullanıcı bloklama aktivitesini logla
            ActivityService::logUserBlock($user, auth()->user(), $user->is_blocked, request());
            
            $action = $user->is_blocked ? 'bloklandı' : 'bloktan çıkarıldı';
            \Log::info('User block status toggled', [
                'user_id' => $id, 
                'admin_user' => auth()->user()->id,
                'new_status' => $user->is_blocked
            ]);

            return redirect()->back()->with('success', "Kullanıcı başarıyla {$action}!");
        } catch (\Exception $e) {
            \Log::error('User block toggle failed', [
                'user_id' => $id, 
                'error' => $e->getMessage()
            ]);
            
            return redirect()->back()->with('error', 'Kullanıcı bloklama durumu değiştirilirken bir hata oluştu!');
        }
    }

    /**
     * Display user activities
     */
    public function activities($id)
    {
        $user = User::findOrFail($id);
        $activities = $user->activities()
            ->with('user')
            ->latest()
            ->paginate(50);

        return Inertia::render('Admin/Users/Activities', [
            'user' => $user,
            'activities' => $activities,
        ]);
    }

    /**
     * Display all user activities
     */
    public function allActivities()
    {
        $activities = \App\Models\UserActivity::with('user')
            ->latest()
            ->paginate(100);

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
        ]);
    }
}
