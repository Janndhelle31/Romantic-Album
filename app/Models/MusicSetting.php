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
        // If display_name is set in database, use it
        if (isset($this->attributes['display_name']) && !empty($this->attributes['display_name'])) {
            return $this->attributes['display_name'];
        }
        
        // Otherwise fall back to file_name
        return $this->attributes['file_name'] ?? 'Unknown';
    }
}