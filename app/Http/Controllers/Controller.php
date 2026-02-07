<?php

namespace App\Http\Controllers;
use App\Models\Music;
use App\Models\Letter;


abstract class Controller
{
public function showMemoryBook()
{
    return inertia('MemoryBook', [
        'current_music' => Music::current(),
        'letter_content' => Letter::latest()->first(),
        // Optionally pass available themes
        'available_themes' => [
            'default',
            'midnight', 
            'classy',
            'nature'
        ]
    ]);
}}
