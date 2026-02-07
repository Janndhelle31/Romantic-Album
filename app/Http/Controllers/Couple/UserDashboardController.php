<?php

namespace App\Http\Controllers\Couple;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Memory;
use App\Models\Setting;
use App\Models\Letter;
use App\Models\MusicSetting;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


class UserDashboardController extends Controller
{
    /**
     * Display the main dashboard with all data.
     */
    public function index()
    {
        Log::info('User viewing dashboard', ['user_id' => auth()->id()]);

        // Get user's setting
        $setting = Setting::where('user_id', auth()->id())->first();
        
        // Get user's music setting
        $musicSetting = MusicSetting::where('user_id', auth()->id())->first();

        return Inertia::render('UserDashboard', [
            'albums' => Album::with(['memories' => function ($query) {
                $query->latest(); 
            }])
            ->where('user_id', auth()->id())
            ->latest()
            ->get(),

            // Music from MusicSetting model
            'current_music' => $musicSetting 
                ? asset('storage/' . $musicSetting->file_path) 
                : null,

            // Letter from user's letter_settings JSON column
            'letter_content' => auth()->user()->letter_settings ?: null,
            
            // Theme from Setting model
            'auth' => [
                'user' => [
                    'theme' => $setting->theme ?? 'default', // Get theme from Setting model
                    // Add other user data if needed
                    'id' => auth()->id(),
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ]
            ]
        ]);
    }

    /**
     * Create a new Album.
     */
    public function storeAlbum(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:50',
            'icon' => 'required|string|max:10', 
            'description' => 'nullable|string|max:150',
        ]);

        try {
            $album = Album::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . strtolower(Str::random(5)),
                'icon' => $request->icon ?? '💖',
                'description' => $request->description,
            ]);

            Log::info('New album created', ['user_id' => auth()->id(), 'album_id' => $album->id]);
            return back()->with('message', 'New collection started! ✨');
        } catch (\Exception $e) {
            Log::error('Album creation failed', ['user_id' => auth()->id(), 'error' => $e->getMessage()]);
            return back()->withErrors(['title' => 'Could not create album.']);
        }
    }

    /**
     * Store a new Memory.
     */
    public function storeMemory(Request $request)
    {
        $request->validate([
            'album_id' => 'required|exists:albums,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:15000',
            'date_text' => 'required|string|max:30',
            'note' => 'nullable|string|max:500',
        ]);

        $album = Album::where('id', $request->album_id)
                      ->where('user_id', auth()->id())
                      ->firstOrFail();

        try {
            $path = $request->file('image')->store('memories', 'public');

            $memory = Memory::create([
                'album_id' => $album->id,
                'image_path' => $path,
                'date_text' => $request->date_text,
                'note' => $request->note,
                'rotation' => rand(-4, 4),
            ]);

            Log::info('Memory stored', ['memory_id' => $memory->id, 'path' => $path]);
            return back()->with('message', 'Memory safely tucked away! 📸');
        } catch (\Exception $e) {
            Log::error('Memory storage failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['image' => 'Failed to upload image.']);
        }
    }

    /**
     * Update an existing Memory.
     */
    public function updateMemory(Request $request, Memory $memory)
    {
        if ($memory->album->user_id !== auth()->id()) {
            abort(403);
        }

        $data = $request->validate([
            'date_text' => 'required|string|max:30',
            'note' => 'nullable|string|max:500',
            'album_id' => 'required|exists:albums,id'
        ]);

        $memory->update($data);
        Log::info('Memory updated', ['memory_id' => $memory->id]);

        return back()->with('message', 'Memory updated! ✨');
    }

    /**
     * Remove a Memory and its associated file.
     */
    public function destroyMemory(Memory $memory)
    {
        if ($memory->album->user_id !== auth()->id()) {
            Log::warning('Unauthorized deletion attempt', ['user_id' => auth()->id()]);
            abort(403);
        }

        try {
            if (Storage::disk('public')->exists($memory->image_path)) {
                Storage::disk('public')->delete($memory->image_path);
            }
            $memory->delete();
            return back()->with('message', 'Memory removed 🌸');
        } catch (\Exception $e) {
            Log::error('Memory deletion failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Could not remove memory.']);
        }
    }

    /**
     * Update Music Settings.
     */
        public function updateMusic(Request $request)
        {
            $request->validate([
                'display_name' => 'nullable|string|max:100',
                'music' => 'nullable|file|mimes:mp3,wav,m4a|max:10240', // 10MB max
            ]);
            
            try {
                $user = Auth::user();
                $musicSetting = MusicSetting::where('user_id', $user->id)->first();
                
                $data = [
                    'user_id' => $user->id,
                ];
                
                // Handle display name
                if ($request->filled('display_name')) {
                    $data['display_name'] = $request->display_name;
                }
                
                // Handle file upload
                if ($request->hasFile('music')) {
                    // Delete old file if exists
                    if ($musicSetting && $musicSetting->file_path) {
                        Storage::disk('public')->delete($musicSetting->file_path);
                    }
                    
                    $file = $request->file('music');
                    $path = $file->store('music', 'public');
                    
                    $data['file_path'] = $path;
                    $data['file_name'] = $file->getClientOriginalName();
                    
                    // If no display name provided and no existing display name, use file name
                    if (!isset($data['display_name']) && (!$musicSetting || !$musicSetting->display_name)) {
                        $data['display_name'] = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                    }
                }
                
                // Update or create music setting
                if ($musicSetting) {
                    $musicSetting->update($data);
                    Log::info('Music updated', ['user_id' => $user->id]);
                } else {
                    // If creating new and no display name set, use file name or default
                    if (!isset($data['display_name']) && isset($data['file_name'])) {
                        $data['display_name'] = pathinfo($data['file_name'], PATHINFO_FILENAME);
                    }
                    MusicSetting::create($data);
                    Log::info('Music created', ['user_id' => $user->id]);
                }
                
                return back()->with('message', 'Music settings saved! 🎵');
            } catch (\Exception $e) {
                Log::error('Music update failed', [
                    'error' => $e->getMessage(), 
                    'user_id' => Auth::id()
                ]);
                return back()->withErrors(['music' => 'Failed to save music settings.']);
            }
        }

    /**
     * Update the Virtual Letter content (store in user's letter_settings JSON).
     */
  public function storeLetter(Request $request)
{
    $data = $request->validate([
        'recipient' => 'required|string|max:50',
        'message'   => 'required|string|max:2000',
        'closing'   => 'required|string|max:50',
        'sender'    => 'required|string|max:50',
    ]);

    try {
        // Store letter in Letter model (correct model)
        Letter::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'recipient' => $data['recipient'],
                'message'   => $data['message'],
                'closing'   => $data['closing'],
                'sender'    => $data['sender'],
            ]
        );

        Log::info('Letter saved successfully', ['user_id' => auth()->id()]);
        
        return back()->with('message', 'Letter saved! 💌');
    } catch (\Exception $e) {
        Log::error('Letter save failed', ['error' => $e->getMessage(), 'user_id' => auth()->id()]);
        return back()->withErrors(['letter' => 'Failed to save letter.']);
    }
}

    /**
     * Update user theme preference in Setting model.
     */
    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:default,midnight,classy,vintage,nature'
        ]);

        try {
            $user = auth()->user();
            
            // Update or create setting record
            Setting::updateOrCreate(
                ['user_id' => $user->id],
                ['theme' => $request->theme]
            );

            Log::info('Theme updated', [
                'user_id' => $user->id,
                'theme' => $request->theme
            ]);
            
            return back()->with('message', 'Theme updated! 🎨');
        } catch (\Exception $e) {
            Log::error('Theme update failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['theme' => 'Failed to update theme.']);
        }
    }
}