<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'from_user_id',
        'type',
        'content',
        'data',
        'is_read',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
    ];

    /**
     * Bildirimi alan kullanıcı
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Bildirimi gönderen kullanıcı
     */
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    /**
     * Bildirimi okundu olarak işaretle
     */
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Bildirim türüne göre renk döndür
     */
    public function getTypeColor()
    {
        return match($this->type) {
            'follow' => 'text-gray-900 dark:text-gray-100',
            'like' => 'text-gray-900 dark:text-gray-100',
            'comment' => 'text-gray-900 dark:text-gray-100',
            'post' => 'text-gray-900 dark:text-gray-100',
            default => 'text-gray-600 dark:text-gray-400',
        };
    }

    /**
     * Bildirim türüne göre ikon döndür
     */
    public function getTypeIcon()
    {
        return match($this->type) {
            'follow' => 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            'like' => 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
            'comment' => 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            'post' => 'M12 4v16m8-8H4',
            default => 'M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.81 1.1L1 7v10a2 2 0 002 2h14a2 2 0 002-2V7l-1.38-1.9A2 2 0 0015.81 4H4.19z',
        };
    }
}
