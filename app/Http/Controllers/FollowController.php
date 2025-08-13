<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FollowController extends Controller
{
    /**
     * Kullanıcıyı takip et/takibi bırak
     */
    public function toggle(Request $request, User $user): JsonResponse
    {
        $currentUser = auth()->user();

        // Kendini takip edemez
        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Kendinizi takip edemezsiniz.'
            ], 400);
        }

        $follow = Follow::where('follower_id', $currentUser->id)
            ->where('following_id', $user->id)
            ->first();

        if ($follow) {
            // Takibi bırak
            $follow->delete();
            $isFollowing = false;
            $message = 'Takip bırakıldı.';
        } else {
            // Takip et
            Follow::create([
                'follower_id' => $currentUser->id,
                'following_id' => $user->id,
            ]);
            $isFollowing = true;
            $message = 'Takip edildi.';
            
            // Bildirim oluştur
            NotificationController::createFollowNotification($currentUser->id, $user->id);
        }

        return response()->json([
            'success' => true,
            'isFollowing' => $isFollowing,
            'message' => $message,
            'followersCount' => $user->followers()->count(),
            'followingCount' => $user->following()->count(),
        ]);
    }

    /**
     * Kullanıcının takipçilerini getir
     */
    public function followers(User $user): JsonResponse
    {
        $followers = $user->followers()
            ->withCount(['posts', 'followers', 'following'])
            ->paginate(20);

        return response()->json([
            'followers' => $followers,
        ]);
    }

    /**
     * Kullanıcının takip ettiklerini getir
     */
    public function following(User $user): JsonResponse
    {
        $following = $user->following()
            ->withCount(['posts', 'followers', 'following'])
            ->paginate(20);

        return response()->json([
            'following' => $following,
        ]);
    }

    /**
     * Kullanıcının takip durumunu kontrol et
     */
    public function check(User $user): JsonResponse
    {
        $currentUser = auth()->user();
        $isFollowing = $currentUser->isFollowing($user);

        return response()->json([
            'isFollowing' => $isFollowing,
            'followersCount' => $user->followers()->count(),
            'followingCount' => $user->following()->count(),
        ]);
    }
}
