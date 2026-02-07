<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $fillable = ['user_id', 'recipient', 'message', 'closing', 'sender'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
