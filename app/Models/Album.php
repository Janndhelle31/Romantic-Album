<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Album extends Model
{
    // Allows mass assignment for these fields
protected $fillable = ['user_id', 'slug', 'title', 'icon', 'description', 'theme_color'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function photos(): HasMany
    {
        // Make sure 'Memory' is the correct name of your photo model
        return $this->hasMany(Memory::class); 
    }
    public function memories(): HasMany
    {
        return $this->hasMany(Memory::class);
    }

    public function getRouteKeyName()
{
    return 'slug';
}
}