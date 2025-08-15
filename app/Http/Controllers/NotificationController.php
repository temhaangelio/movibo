<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of user notifications.
     */
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->with('fromUser')
            ->latest()
            ->get();

        return Inertia::render('user/Bildirimler', [
            'auth' => auth()->user(),
            'notifications' => ['data' => $notifications],
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        // Sadece kendi bildirimlerini işaretleyebilir
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread notifications count.
     */
    public function getUnreadCount()
    {
        $count = Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Create comment notification.
     */
    public static function createCommentNotification($fromUserId, $postId, $commentId)
    {
        $post = \App\Models\Post::find($postId);
        $fromUser = \App\Models\User::find($fromUserId);
        
        if (!$post) {
            return;
        }

        // Kendi paylaşımına yorum yapmazsa bildirim oluştur
        if ($post->user_id !== $fromUserId) {
            Notification::create([
                'user_id' => $post->user_id,
                'from_user_id' => $fromUserId,
                'type' => 'comment',
                'content' => $fromUser ? $fromUser->name . ' paylaşımınıza yorum yaptı' : 'Birisi paylaşımınıza yorum yaptı',
                'data' => [
                    'post_id' => $postId,
                    'comment_id' => $commentId,
                ],
                'is_read' => false,
            ]);
        }
    }

    /**
     * Create like notification.
     */
    public static function createLikeNotification($fromUserId, $postId)
    {
        $post = \App\Models\Post::find($postId);
        $fromUser = \App\Models\User::find($fromUserId);
        
        if (!$post) {
            return;
        }

        // Kendi paylaşımını beğenmezse bildirim oluştur
        if ($post->user_id !== $fromUserId) {
            Notification::create([
                'user_id' => $post->user_id,
                'from_user_id' => $fromUserId,
                'type' => 'like',
                'content' => $fromUser ? $fromUser->name . ' paylaşımınızı beğendi' : 'Birisi paylaşımınızı beğendi',
                'data' => [
                    'post_id' => $postId,
                ],
                'is_read' => false,
            ]);
        }
    }

    /**
     * Create follow notification.
     */
    public static function createFollowNotification($fromUserId, $toUserId)
    {
        // Kendini takip etmezse bildirim oluştur
        if ($fromUserId !== $toUserId) {
            $fromUser = \App\Models\User::find($fromUserId);
            
            Notification::create([
                'user_id' => $toUserId,
                'from_user_id' => $fromUserId,
                'type' => 'follow',
                'content' => $fromUser ? $fromUser->name . ' sizi takip etmeye başladı' : 'Birisi sizi takip etmeye başladı',
                'data' => [
                    'follower_id' => $fromUserId,
                ],
                'is_read' => false,
            ]);
        }
    }
}
