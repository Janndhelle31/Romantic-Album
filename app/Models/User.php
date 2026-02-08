<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail; // Import this
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    public function musicSetting()
    {
        return $this->hasOne(MusicSetting::class);
    }

    public function letter()
    {
        return $this->hasOne(Letter::class);
    }

public function setting(): HasOne
    {
        return $this->hasOne(Setting::class);
    }
}