<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Kullanıcının bildirimlerini listele
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $notifications = $user->notifications()
            ->with('fromUser')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $user->notifications()->where('is_read', false)->count(),
        ]);
    }

    /**
     * Bildirimi okundu olarak işaretle
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $user = auth()->user();
        
        // Sadece kendi bildirimlerini işaretleyebilir
        if ($notification->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bu bildirimi işaretleyemezsiniz.'
            ], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Bildirim okundu olarak işaretlendi.'
        ]);
    }

    /**
     * Tüm bildirimleri okundu olarak işaretle
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();
        
        $user->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Tüm bildirimler okundu olarak işaretlendi.'
        ]);
    }

    /**
     * Bildirim oluştur (yardımcı metod)
     */
    public static function createNotification($userId, $fromUserId, $type, $content, $data = null)
    {
        return Notification::create([
            'user_id' => $userId,
            'from_user_id' => $fromUserId,
            'type' => $type,
            'content' => $content,
            'data' => $data,
        ]);
    }

    /**
     * Takip bildirimi oluştur
     */
    public static function createFollowNotification($followerId, $followingId)
    {
        $follower = User::find($followerId);
        $following = User::find($followingId);
        
        return self::createNotification(
            $followingId,
            $followerId,
            'follow',
            "{$follower->name} sizi takip etmeye başladı.",
            ['follower_id' => $followerId]
        );
    }

    /**
     * Beğeni bildirimi oluştur
     */
    public static function createLikeNotification($likerId, $postId)
    {
        $liker = User::find($likerId);
        $post = \App\Models\Post::with('user')->find($postId);
        
        if ($post && $post->user_id !== $likerId) {
            return self::createNotification(
                $post->user_id,
                $likerId,
                'like',
                "{$liker->name} paylaşımınızı beğendi.",
                ['post_id' => $postId]
            );
        }
        
        return null;
    }

    /**
     * Yorum bildirimi oluştur
     */
    public static function createCommentNotification($commenterId, $postId, $commentId)
    {
        $commenter = User::find($commenterId);
        $post = \App\Models\Post::with('user')->find($postId);
        
        if ($post && $post->user_id !== $commenterId) {
            return self::createNotification(
                $post->user_id,
                $commenterId,
                'comment',
                "{$commenter->name} paylaşımınıza yorum yaptı.",
                ['post_id' => $postId, 'comment_id' => $commentId]
            );
        }
        
        return null;
    }
}
