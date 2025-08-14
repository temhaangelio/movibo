<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Post $post)
    {
        $user = auth()->user();

        \Log::info('Like toggle request', [
            'user_id' => $user->id,
            'post_id' => $post->id
        ]);

        $existingLike = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $post->updateLikesCount();
            \Log::info('Like removed', ['count' => $post->likes_count]);
            return response()->json(['liked' => false, 'count' => $post->likes_count]);
        } else {
            Like::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]);
            $post->updateLikesCount();

            // Bildirim oluştur (kendi paylaşımını beğenmezse)
            if ($post->user_id !== $user->id) {
                NotificationController::createLikeNotification($user->id, $post->id);
            }

            \Log::info('Like added', ['count' => $post->likes_count]);
            return response()->json(['liked' => true, 'count' => $post->likes_count]);
        }
    }
}
