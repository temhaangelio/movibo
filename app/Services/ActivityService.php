<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityService
{
    /**
     * Kullanıcı aktivitesini kaydet
     */
    public static function log(string $action, string $description = null, array $metadata = [], Request $request = null): void
    {
        if (!Auth::check()) {
            return; // Giriş yapmamış kullanıcılar için log tutma
        }

        $request = $request ?? request();
        $user = Auth::user();

        try {
            UserActivity::create([
                'user_id' => $user->id,
                'action' => $action,
                'description' => $description,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'metadata' => $metadata,
            ]);
        } catch (\Exception $e) {
            // Log hatası olsa bile ana işlemi etkilemesin
            \Log::error('Activity logging failed', [
                'action' => $action,
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Login aktivitesi
     */
    public static function logLogin(User $user, Request $request = null): void
    {
        self::log('login', 'Kullanıcı giriş yaptı', [
            'login_method' => 'email',
            'timestamp' => now()->toISOString()
        ], $request);
    }

    /**
     * Logout aktivitesi
     */
    public static function logLogout(User $user, Request $request = null): void
    {
        self::log('logout', 'Kullanıcı çıkış yaptı', [
            'logout_method' => 'manual',
            'timestamp' => now()->toISOString()
        ], $request);
    }

    /**
     * Kullanıcı silme aktivitesi
     */
    public static function logUserDelete(User $deletedUser, User $adminUser, Request $request = null): void
    {
        self::log('user_delete', 'Kullanıcı silindi', [
            'deleted_user_id' => $deletedUser->id,
            'deleted_user_email' => $deletedUser->email,
            'deleted_by_admin' => $adminUser->id,
            'deletion_reason' => 'admin_action'
        ], $request);
    }

    /**
     * Kullanıcı bloklama aktivitesi
     */
    public static function logUserBlock(User $blockedUser, User $adminUser, bool $isBlocked, Request $request = null): void
    {
        $action = $isBlocked ? 'user_block' : 'user_unblock';
        $description = $isBlocked ? 'Kullanıcı bloklandı' : 'Kullanıcı bloktan çıkarıldı';

        self::log($action, $description, [
            'blocked_user_id' => $blockedUser->id,
            'blocked_user_email' => $blockedUser->email,
            'action_by_admin' => $adminUser->id,
            'block_status' => $isBlocked
        ], $request);
    }

    /**
     * Profil güncelleme aktivitesi
     */
    public static function logProfileUpdate(User $user, array $changes, Request $request = null): void
    {
        self::log('profile_update', 'Profil güncellendi', [
            'updated_fields' => array_keys($changes),
            'changes_count' => count($changes)
        ], $request);
    }

    /**
     * Post oluşturma aktivitesi
     */
    public static function logPostCreate(User $user, array $postData, Request $request = null): void
    {
        self::log('post_create', 'Yeni paylaşım oluşturuldu', [
            'post_title' => $postData['media_title'] ?? 'N/A',
            'media_type' => $postData['media_type'] ?? 'N/A',
            'user_rating' => $postData['user_rating'] ?? null
        ], $request);
    }

    /**
     * Post silme aktivitesi
     */
    public static function logPostDelete(User $user, array $postData, Request $request = null): void
    {
        self::log('post_delete', 'Paylaşım silindi', [
            'post_title' => $postData['media_title'] ?? 'N/A',
            'media_type' => $postData['media_type'] ?? 'N/A'
        ], $request);
    }

    /**
     * Yorum ekleme aktivitesi
     */
    public static function logCommentCreate(User $user, array $commentData, Request $request = null): void
    {
        self::log('comment_create', 'Yorum eklendi', [
            'post_id' => $commentData['post_id'] ?? 'N/A',
            'comment_length' => strlen($commentData['content'] ?? ''),
            'post_title' => $commentData['post_title'] ?? 'N/A'
        ], $request);
    }

    /**
     * Yorum silme aktivitesi
     */
    public static function logCommentDelete(User $user, array $commentData, Request $request = null): void
    {
        self::log('comment_delete', 'Yorum silindi', [
            'post_id' => $commentData['post_id'] ?? 'N/A',
            'comment_length' => strlen($commentData['content'] ?? ''),
            'post_title' => $commentData['post_title'] ?? 'N/A'
        ], $request);
    }

    /**
     * Beğeni ekleme aktivitesi
     */
    public static function logLikeCreate(User $user, array $likeData, Request $request = null): void
    {
        self::log('like_create', 'Beğeni eklendi', [
            'post_id' => $likeData['post_id'] ?? 'N/A',
            'post_title' => $likeData['post_title'] ?? 'N/A',
            'like_type' => $likeData['like_type'] ?? 'post'
        ], $request);
    }

    /**
     * Beğeni kaldırma aktivitesi
     */
    public static function logLikeDelete(User $user, array $likeData, Request $request = null): void
    {
        self::log('like_delete', 'Beğeni kaldırıldı', [
            'post_id' => $likeData['post_id'] ?? 'N/A',
            'post_title' => $likeData['post_title'] ?? 'N/A',
            'like_type' => $likeData['like_type'] ?? 'post'
        ], $request);
    }

    /**
     * Takip etme aktivitesi
     */
    public static function logFollowCreate(User $user, User $followedUser, Request $request = null): void
    {
        self::log('follow_create', 'Kullanıcı takip edildi', [
            'followed_user_id' => $followedUser->id,
            'followed_user_name' => $followedUser->name,
            'followed_user_username' => $followedUser->username
        ], $request);
    }

    /**
     * Takibi bırakma aktivitesi
     */
    public static function logFollowDelete(User $user, User $unfollowedUser, Request $request = null): void
    {
        self::log('follow_delete', 'Kullanıcı takipten çıkarıldı', [
            'unfollowed_user_id' => $unfollowedUser->id,
            'unfollowed_user_name' => $unfollowedUser->name,
            'unfollowed_user_username' => $unfollowedUser->username
        ], $request);
    }

    /**
     * Arama aktivitesi
     */
    public static function logSearch(User $user, string $query, Request $request = null): void
    {
        self::log('search', 'Arama yapıldı', [
            'search_query' => $query,
            'query_length' => strlen($query)
        ], $request);
    }

    /**
     * Sayfa ziyaret aktivitesi
     */
    public static function logPageVisit(User $user, string $page, Request $request = null): void
    {
        self::log('page_visit', 'Sayfa ziyaret edildi', [
            'page_name' => $page,
            'full_url' => $request ? $request->fullUrl() : 'N/A'
        ], $request);
    }
}
