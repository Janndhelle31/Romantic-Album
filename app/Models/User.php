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

    // Add this relationship - albums
    public function albums(): HasMany
    {
        return $this->hasMany(Album::class);
    }

    // Add this relationship - memories (through albums)
    public function memories()
    {
        return $this->hasManyThrough(
            Memory::class, 
            Album::class,
            'user_id', // Foreign key on albums table
            'album_id', // Foreign key on memories table
            'id',       // Local key on users table
            'id'        // Local key on albums table
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

    // Helper method to check if user is admin
    public function isAdmin(): bool
    {
        return $this->role_as == 1;
    }
}