<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'profile_photo',
        'terms_accepted',
        'terms_accepted_at',
        'is_admin',
        'is_blocked',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_blocked' => 'boolean',
        ];
    }

    /**
     * Model boot metodu - event listener'ları tanımla
     */
    protected static function boot()
    {
        parent::boot();

        // Kullanıcı silindiğinde ilişkili tüm verileri sil
        static::deleting(function ($user) {
            // Kullanıcının paylaşımlarını sil
            $user->posts()->delete();
            
            // Kullanıcının yorumlarını sil
            $user->comments()->delete();
            
            // Kullanıcının beğenilerini sil
            $user->likes()->delete();
            
            // Follow ilişkilerini temizle
            $user->followers()->detach();
            $user->following()->detach();
            
            // Bildirimleri sil
            $user->notifications()->delete();
            $user->sentNotifications()->delete();
            
            // Profil fotoğrafını sil (eğer varsa)
            if ($user->profile_photo) {
                \Storage::disk('public')->delete($user->profile_photo);
            }
        });
    }

    // İlişkiler
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    // Follow ilişkileri
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id');
    }

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id');
    }

    public function isFollowing(User $user): bool
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    public function isFollowedBy(User $user): bool
    {
        return $this->followers()->where('follower_id', $user->id)->exists();
    }

    // Admin kontrolü
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Kullanıcının aldığı bildirimler
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Kullanıcının gönderdiği bildirimler
     */
    public function sentNotifications()
    {
        return $this->hasMany(Notification::class, 'from_user_id');
    }

    /**
     * Kullanıcının aktivite logları
     */
    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    /**
     * Okunmamış bildirim sayısı
     */
    public function unreadNotificationsCount()
    {
        return $this->notifications()->where('is_read', false)->count();
    }

    /**
     * Route model binding için username kullan
     */
    public function getRouteKeyName()
    {
        return 'username';
    }
}
