<?php

namespace App\Http\Controllers;

use App\Models\MusicSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Letter;

class ThemeController extends Controller

{
  public function update(Request $request)
{
    $validated = $request->validate([
        'theme' => 'required|in:default,midnight,classy'
    ]);

    // Update user's preference
    Auth::user()->update(['theme' => $validated['theme']]);

    return response()->json(['success' => true, 'theme' => $validated['theme']]);
}
public function index()
{
    return inertia('MemoryBook', [
        'current_music' => MusicSetting::latest()->first(),
        'letter_content' => Letter::latest()->first(),
        'theme' => 'midnight', // or 'classy' based on user preference
    ]);
}
    
}