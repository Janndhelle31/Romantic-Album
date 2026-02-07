<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MusicSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_path',
        'file_name',
        'display_name', // Add this
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the display name (fallback to file_name if not set)
     */
    public function getDisplayNameAttribute()
    {
        return $this->attributes['display_name'] ?? $this->attributes['file_name'] ?? 'Unknown';
    }
}