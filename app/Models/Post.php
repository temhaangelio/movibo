<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'media_type',
        'media_id',
        'media_title',
        'media_description',
        'media_poster',
        'media_release_date',
        'media_rating',
        'media_genre',
        'media_author',
        'media_director',
        'user_rating',
        'likes_count',
        'comments_count',
    ];

    protected $casts = [
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    // İlişkiler
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    // Kullanıcının bu postu beğenip beğenmediğini kontrol et
    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    // Beğeni sayısını güncelle
    public function updateLikesCount(): void
    {
        $this->update(['likes_count' => $this->likes()->count()]);
    }

    // Yorum sayısını güncelle
    public function updateCommentsCount(): void
    {
        $this->update(['comments_count' => $this->comments()->count()]);
    }
}
