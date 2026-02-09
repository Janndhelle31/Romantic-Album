<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    /**
     * Revised Index: Now ensures setting (music/letter) are sent to AppLayout
     */
public function index()
{
    $user = auth()->user();
    
    // Debug: Check if user has setting relationship
    \Log::info('User ID: ' . $user->id);
    \Log::info('User settings: ', $user->setting()->exists() ? ['exists' => true] : ['exists' => false]);
    
    $setting = $user->setting()->firstOrCreate([
        'user_id' => $user->id
    ], [
        'music_display_name' => 'Our Soundtrack',
        'music_url' => '/music/bg-track.mp3', // Make sure this is a valid path
        'letter_content' => 'Welcome to our memory album. This is where our story begins...'
    ]);
    
    \Log::info('Setting values: ', [
        'music_url' => $setting->music_url,
        'music_display_name' => $setting->music_display_name,
        'letter_content' => $setting->letter_content
    ]);
    

        $albums = Album::where('user_id', $user->id)
            ->with(['memories' => function($query) {
                $query->latest()->select('id', 'album_id', 'image_path');
            }])
            ->withCount('memories')
            ->latest()
            ->get()
            ->map(function ($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'slug' => $album->slug,
                    'description' => $album->description,
                    'icon' => $album->icon,
                    'memories_count' => $album->memories_count,
                    'preview_images' => $album->memories->take(3)->map(function ($memory) {
                        return str_contains($memory->image_path, 'http') 
                            ? $memory->image_path 
                            : asset('storage/' . $memory->image_path);
                    }),
                ];
            });

        return Inertia::render('Dashboard', [
            'albums' => $albums,
            // These props are what AppLayout is looking for:
            'current_music' => [
                'url' => $setting->music_url,
                'display_name' => $setting->music_display_name,
            ],
            'letter_content' => $setting->letter_content,
        ]);
    }


    /**
     * Revised Show: Now passes global setting alongside album-specific data
     */
    public function show(Album $album)
    {
        if ((int) $album->user_id !== (int) auth()->id()) {
            abort(403, 'Unauthorized access.');
        }

        $user = auth()->user();
        $setting = $user->setting; // Assuming relation exists
        $album->load('memories');

        return Inertia::render('AlbumPage', [
            // Global props for AppLayout
            'current_music' => [
                'url' => $setting->music_url ?? '',
                'display_name' => $setting->music_display_name ?? 'Our Soundtrack',
            ],
            'letter_content' => $setting->letter_content ?? '',
            
            // Local props for the Page
            'album' => [
                'id' => 'album_' . $album->id,
                'title' => $album->title,
                'slug' => $album->slug,
                'description' => $album->description,
                'icon' => $album->icon,
                'theme' => $album->theme,
            ],
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

    public function showSample($slug)
    {
        return Inertia::render('AlbumPage', [
            'album' => null,
            'photos' => [],
            'isSample' => true,
            'sampleSlug' => $slug,
            // Fallbacks for samples
            'current_music' => ['url' => '', 'display_name' => 'Sample Track'],
            'letter_content' => 'This is a sample letter.'
        ]);
    }
}