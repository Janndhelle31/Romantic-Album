<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'theme',
        'share_token',
        'login_token',
        'login_token_expires_at',
        'role_as',
        'is_paid',
        'payment_reference',
        'payment_proof_path',
        'payment_status',
        'last_magic_login_at',
        'qr_code_url',
        'magic_link',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (!$user->share_token) {
                $user->share_token = Str::random(32);
            }
        });
    }

    protected $hidden = [
        'password',
        'remember_token',
        'login_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'login_token_expires_at' => 'datetime',
            'role_as' => 'integer',
            'is_paid' => 'integer',
            'last_magic_login_at' => 'datetime',
        ];
    }

    /**
     * Generate a new login token (30 days expiration)
     */
    public function generateLoginToken()
    {
        $token = Str::random(64);

        $this->update([
            'login_token' => $token,
            'login_token_expires_at' => now()->addDays(30)
        ]);

        return $token;
    }

    /**
     * Get existing magic link or create new one
     */
    public function getOrCreateMagicLink()
    {
        // Check if token exists and is still valid
        if ($this->login_token && $this->login_token_expires_at && $this->login_token_expires_at->isFuture()) {
            return route('magic.login', ['token' => $this->login_token]);
        }
        
        // Generate new token if none exists or expired
        $token = $this->generateLoginToken();
        return route('magic.login', ['token' => $token]);
    }

    /**
     * Get or create QR code URL
     */
    public function getOrCreateQRCode()
    {
        if ($this->qr_code_url) {
            return $this->qr_code_url;
        }
        
        $link = $this->getOrCreateMagicLink();
        $encodedLink = urlencode($link);
        $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={$encodedLink}&format=png&qzone=2";
        
        $this->update(['qr_code_url' => $qrUrl]);
        
        return $qrUrl;
    }

    /**
     * Revoke magic link
     */
    public function revokeMagicLink()
    {
        $this->update([
            'login_token' => null,
            'login_token_expires_at' => null,
            'qr_code_url' => null,
        ]);
    }

    /**
     * Extend magic link expiration
     */
    public function extendMagicLink()
    {
        if ($this->login_token) {
            $this->update([
                'login_token_expires_at' => now()->addDays(30)
            ]);
            return true;
        }
        return false;
    }

    /**
     * Check if user has valid magic link
     */
    public function hasValidMagicLink(): bool
    {
        return $this->login_token && 
               $this->login_token_expires_at && 
               $this->login_token_expires_at->isFuture();
    }

    /**
     * Get magic link data
     */
    public function getMagicLinkData(): ?array
    {
        if (!$this->hasValidMagicLink()) {
            return null;
        }

        return [
            'link' => route('magic.login', ['token' => $this->login_token]),
            'expires_at' => $this->login_token_expires_at,
            'days_remaining' => now()->diffInDays($this->login_token_expires_at, false),
            'qr_code_url' => $this->qr_code_url,
            'has_link' => true,
        ];
    }

    // Relationships
    public function albums(): HasMany
    {
        return $this->hasMany(Album::class);
    }

    public function memories()
    {
        return $this->hasManyThrough(
            Memory::class, 
            Album::class,
            'user_id',
            'album_id',
            'id',
            'id'
        );
    }

    public function musicSetting(): HasOne
    {
        return $this->hasOne(MusicSetting::class);
    }

    public function letter(): HasOne
    {
        return $this->hasOne(Letter::class);
    }

    public function setting(): HasOne
    {
        return $this->hasOne(Setting::class);
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role_as == 1;
    }

    public function isPaid(): bool
    {
        return $this->is_paid == 1;
    }
}