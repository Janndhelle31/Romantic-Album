<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Setting;
use App\Models\MusicSetting;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
public function index()
{
    $user = auth()->user();

    // 1. Handle Letter Settings
    $setting = $user->setting()->firstOrCreate(
        ['user_id' => $user->id],
        [
            'letter_recipient' => 'My Dearest',
            'letter_message'   => 'Welcome to our memory album. This is where our story begins...',
            'letter_closing'   => 'Forever yours',
            'letter_sender'    => $user->name ?? 'Me',
            'letter_theme'     => 'default'
        ]
    );

    // 2. Handle Music Settings with Public Fallback
    $musicSetting = $user->musicSetting()->first();

    // If musicSetting exists and has a path, use it from storage. 
    // Otherwise, point to the public/music/bg-track.mp3 file.
    $musicUrl = ($musicSetting && $musicSetting->file_path)
        ? asset('storage/' . $musicSetting->file_path)
        : asset('music/bg-track.mp3');

    $musicData = [
        'url'         => $musicUrl,
        'displayName' => $musicSetting->display_name ?? 'Our Soundtrack',
        'theme'       => $setting->letter_theme,
    ];

    // 3. Build Letter Data
    $letterData = [
        'recipient' => $setting->letter_recipient,
        'message'   => $setting->letter_message ?: $setting->letter_content,
        'closing'   => $setting->letter_closing,
        'sender'    => $setting->letter_sender,
    ];

    // 4. Fetch Albums and Preview Images
    $albums = Album::where('user_id', $user->id)
        ->with(['memories' => function ($query) {
            $query->latest()->select('id', 'album_id', 'image_path', 'thumbnail_path');
        }])
        ->withCount('memories')
        ->latest()
        ->get()
        ->map(function ($album) {
            return [
                'id'             => $album->id,
                'title'          => $album->title,
                'slug'           => $album->slug,
                'description'    => $album->description,
                'icon'           => $album->icon,
                'memories_count' => $album->memories_count,
                'preview_images' => $album->memories->take(3)->map(function ($memory) {
                    $path = $memory->thumbnail_path ?: $memory->image_path;
                    return str_contains($path, 'http') 
                        ? $path 
                        : asset('storage/' . $path);
                }),
            ];
        });

    // 5. Return to Inertia
    return Inertia::render('Dashboard', [
        'albums'       => $albums,
        'music'        => $musicData,
        'letter_data'  => $letterData,
        'letter_theme' => $setting->letter_theme,
    ]);
}

   public function show(Album $album)
{
    // 1. Authorization Check
    if ((int) $album->user_id !== (int) auth()->id()) {
        abort(403, 'Unauthorized access.');
    }

    $user = auth()->user();
    
    // 2. Fetch Letter Settings
    $setting = $user->setting()->firstOrCreate(
        ['user_id' => $user->id],
        [
            'letter_recipient' => 'My Dearest',
            'letter_message' => 'Welcome to our memory album. This is where our story begins...',
            'letter_closing' => 'Forever yours',
            'letter_sender' => $user->name ?? 'Me',
            'letter_theme' => 'default'
        ]
    );

    // 3. Handle Music Settings with Public Fallback
    $musicSetting = $user->musicSetting()->first();

    // Determine URL: Use storage if user uploaded a file, otherwise use public default
    $musicUrl = ($musicSetting && $musicSetting->file_path)
        ? asset('storage/' . $musicSetting->file_path)
        : asset('music/bg-track.mp3');

    // 4. Build Letter Data
    $letterData = [
        'recipient' => $setting->letter_recipient,
        'message' => $setting->letter_message ?: $setting->letter_content,
        'closing' => $setting->letter_closing,
        'sender' => $setting->letter_sender,
    ];

    // 5. Load Memories and Map Photos
    $album->load('memories');

    $photos = $album->memories->map(fn($m) => [
        'id' => $m->id,
        'img' => str_contains($m->image_path, 'http')
            ? $m->image_path
            : asset('storage/' . $m->image_path),
        'date' => $m->date_text,
        'note' => $m->note,
        'rot' => $m->rotation,
    ]);

    return Inertia::render('AlbumPage', [
        'music' => [
            'url' => $musicUrl,
            'displayName' => $musicSetting->display_name ?? 'Our Soundtrack',
            'theme' => $setting->letter_theme,
        ],
        'letter_data' => $letterData,
        'letter_theme' => $setting->letter_theme,
        'album' => [
            'id' => 'album_' . $album->id,
            'title' => $album->title,
            'slug' => $album->slug,
            'description' => $album->description,
            'icon' => $album->icon,
            'theme' => $album->theme,
        ],
        'photos' => $photos
    ]);
}

    public function showSample($slug)
    {
        // Sample letter data
        $letterData = [
            'recipient' => 'Dear Visitor',
            'message' => 'This is a sample album showcasing the features of our memory book application. Feel free to explore!',
            'closing' => 'Warmly',
            'sender' => 'The Team',
        ];

        return Inertia::render('AlbumPage', [
            'album' => null,
            'photos' => [],
            'isSample' => true,
            'sampleSlug' => $slug,
            // Music data for sample
            'music' => [
                'url' => '/music/sample.mp3',
                'displayName' => 'Sample Love Song', // Custom display name
                'theme' => 'default',
            ],
            'letter_data' => $letterData,
            'letter_theme' => 'default'
        ]);
    }
}