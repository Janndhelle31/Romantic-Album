<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Memory extends Model
{
protected $fillable = ['album_id', 'image_path', 'date_text', 'note', 'rotation'];
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}