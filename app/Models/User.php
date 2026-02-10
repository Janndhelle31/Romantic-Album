<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'referral_code',
        'referred_by',
        'referral_count',
        'referral_earnings',
        'is_paid',
        'payment_reference',
        'payment_proof_path',
        'payment_status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (!$user->share_token) {
                $user->share_token = Str::random(32);
            }
            
            // Generate referral code if not exists
            if (!$user->referral_code) {
                $user->referral_code = self::generateReferralCode();
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
            'referral_count' => 'integer',
            'referral_earnings' => 'decimal:2',
        ];
    }

    public function generateLoginToken()
    {
        $token = Str::random(64);

        $this->update([
            'login_token' => $token,
            'login_token_expires_at' => now()->addDays(30)
        ]);

        return $token;
    }

    // Generate unique referral code
    public static function generateReferralCode()
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (self::where('referral_code', $code)->exists());
        
        return $code;
    }

    // Get available discount amount
    public function getAvailableDiscount()
    {
        $completedReferrals = $this->referrals()
            ->whereHas('referredUser', function($query) {
                $query->where('is_paid', 1);
            })
            ->where('discount_applied', true)
            ->count();
        
        return min($completedReferrals * 50, 100); // Max ₱100 discount
    }

    // Get final price after discount
    public function getFinalPrice()
    {
        $originalPrice = 250;
        $discount = $this->getAvailableDiscount();
        return max($originalPrice - $discount, 150); // Minimum ₱150
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

    // Referral relationships
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    public function referredUsers(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referralStats()
    {
        return [
            'referral_code' => $this->referral_code,
            'referral_link' => url('/register?ref=' . $this->referral_code),
            'completed_referrals' => $this->referrals()
                ->whereHas('referredUser', function($query) {
                    $query->where('is_paid', 1);
                })
                ->where('discount_applied', true)
                ->count(),
            'pending_referrals' => $this->referrals()
                ->whereHas('referredUser', function($query) {
                    $query->where('is_paid', 0);
                })
                ->count(),
            'total_referrals' => $this->referral_count,
            'discount_amount' => $this->getAvailableDiscount(),
            'original_price' => 250,
            'final_price' => $this->getFinalPrice(),
        ];
    }

    // Helper method to check if user is admin
    public function isAdmin(): bool
    {
        return $this->role_as == 1;
    }
}