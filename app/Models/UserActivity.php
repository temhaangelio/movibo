<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'url',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Kullanıcı ilişkisi
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * IP adresini gizle (güvenlik için)
     */
    public function getMaskedIpAddressAttribute(): string
    {
        if (!$this->ip_address) {
            return 'N/A';
        }

        // IPv4 için son 2 okteti gizle
        if (filter_var($this->ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $this->ip_address);
            if (count($parts) === 4) {
                return $parts[0] . '.' . $parts[1] . '.*.*';
            }
        }

        // IPv6 için son 4 karakteri gizle
        if (filter_var($this->ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return substr($this->ip_address, 0, -4) . '****';
        }

        return 'Unknown';
    }
}
