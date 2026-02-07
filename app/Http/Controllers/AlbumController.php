<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Setting;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AlbumController extends Controller
{
    /**
     * This handles the Main Library (Dashboard.jsx)
     */
    public function index()
    {
        $user = Auth::user();

        // Get settings (will be null if not created yet)
        $settings = $user->setting;

        // Don't auto-create settings - let user create them via settings page
        // This prevents any hardcoded dates

        return Inertia::render('Dashboard', [
            'albums' => Album::where('user_id', $user->id)
                ->withCount('memories')
                ->get(),
            'settings' => $settings ? [
                'story_title' => $settings->story_title,
                'story_subtitle' => $settings->story_subtitle,
                'anniversary_date' => $settings->anniversary_date,
            ] : null
        ]);
    }
    /**
     * This handles the specific Album details (AlbumPage.jsx)
     */
    public function show(Album $album)
    {
        // Use != instead of !== to avoid string/integer type mismatches
        // Or cast both to (int)
        if ((int) $album->user_id !== (int) auth()->id()) {
            abort(403, 'Unauthorized access to this memory.');
        }

        $album->load('memories');

        return Inertia::render('AlbumPage', [
            'album' => $album,
            'photos' => $album->memories->map(fn($m) => [
                'id' => $m->id,
                'img' => str_contains($m->image_path, 'http')
                    ? $m->image_path
                    : asset('storage/' . $m->image_path),
                'date' => $m->date_text,
                'note' => $m->note,
                'rot' => $m->rotation,
            ])
        ]);
    }
}