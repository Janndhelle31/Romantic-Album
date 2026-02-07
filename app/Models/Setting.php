<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'user_id',
        'story_title',
        'story_subtitle',
        'anniversary_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public static function boot()
{
    parent::boot();
    
    static::creating(function ($model) {
        // Ensure only one setting per user
        if (static::where('user_id', $model->user_id)->exists()) {
            throw new \Exception('User already has settings.');
        }
    });
}
}