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
use Intervention\Image\ImageManager;
use Intervention\Image\Encoders\WebpEncoder;
use Illuminate\Support\Facades\DB;

class UserDashboardController extends Controller
{
    const MAX_ALBUMS_PER_USER = 9;
    const MAX_MEMORIES_PER_ALBUM = 6;
    
    public function index()
    {
        Log::info('User viewing dashboard', ['user_id' => auth()->id()]);

        $user = auth()->user();
        
        // Check if user has paid
        if ($user->is_paid === 0) {
            return Inertia::render('UserDashboard', [
                'auth' => [
                    'user' => [
                        'is_paid' => 0,
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ]
                ],
                'needsPayment' => true,
                'paymentMessage' => 'Please complete your ₱20 payment to unlock all features.',
                'albums' => [],
                'current_music' => null,
                'letter_content' => null,
            ]);
        }

        $setting = Setting::where('user_id', auth()->id())->first();
        $musicSetting = MusicSetting::where('user_id', auth()->id())->first();
        $letter = Letter::where('user_id', auth()->id())->first();

        // Get albums with memories and transform them
        $albums = Album::with(['memories' => function($query) {
            $query->latest();
        }])
        ->where('user_id', auth()->id())
        ->latest()
        ->get()
        ->map(function ($album) {
            // Add preview images (thumbnails)
            $album->preview_images = $album->memories
                ->take(3)
                ->map(function ($memory) {
                    // Use thumbnail if available, otherwise fallback to original
                    $path = $memory->thumbnail_path ?: $memory->image_path;
                    return asset('storage/' . $path);
                })
                ->toArray();
                
            // Add memory count
            $album->memories_count = $album->memories->count();
            
            return $album;
        });

        return Inertia::render('UserDashboard', [
            'albums' => $albums,
            'current_music' => $musicSetting ? asset('storage/' . $musicSetting->file_path) : null,
            'letter_content' => $letter ?: null,
            'auth' => [
                'user' => [
                    'is_paid' => $user->is_paid,
                    'theme' => $setting->theme ?? 'default',
                    'id' => auth()->id(),
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ]
            ],
            'needsPayment' => false,
        ]);
    }

    public function storeAlbum(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to create albums.']);
        }

        $currentAlbumCount = Album::where('user_id', auth()->id())->count();
        if ($currentAlbumCount >= self::MAX_ALBUMS_PER_USER) {
            return back()->withErrors(['title' => 'Maximum ' . self::MAX_ALBUMS_PER_USER . ' albums reached.']);
        }

        $request->validate([
            'title' => 'required|string|max:50',
            'icon' => 'required|string|max:10', 
            'description' => 'nullable|string|max:150',
        ]);

        try {
            $existingAlbum = Album::where('user_id', auth()->id())
                ->where('title', $request->title)
                ->first();
                
            if ($existingAlbum) {
                return back()->withErrors(['title' => 'Album title already exists.']);
            }

            Album::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . Str::random(5),
                'icon' => $request->icon ?? '💖',
                'description' => $request->description,
            ]);

            Log::info('New album created', ['user_id' => auth()->id()]);
            return back()->with('message', 'New collection started! ✨');
        } catch (\Exception $e) {
            Log::error('Album creation failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['title' => 'Could not create album.']);
        }
    }

    public function storeMemory(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to add memories.']);
        }

        $request->validate([
            'album_id' => 'required|exists:albums,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:15000',
            'date_text' => 'required|string|max:30',
            'note' => 'nullable|string|max:500',
        ]);

        $album = Album::where('id', $request->album_id)
                      ->where('user_id', auth()->id())
                      ->firstOrFail();

        if ($album->memories()->count() >= self::MAX_MEMORIES_PER_ALBUM) {
            return back()->withErrors(['album_id' => 'Maximum ' . self::MAX_MEMORIES_PER_ALBUM . ' memories reached.']);
        }

        try {
            // Create directories
            $baseDir = 'memories/' . date('Y/m');
            Storage::disk('public')->makeDirectory($baseDir);
            Storage::disk('public')->makeDirectory($baseDir . '/thumbs');
            
            // Initialize image manager
            $imageManager = ImageManager::gd();
            
            // Process image
            $image = $imageManager->read($request->file('image'));
            
            // Resize if too large (max 1920px width)
            if ($image->width() > 1920) {
                $image->scale(width: 1920);
            }
            
            // Save original as WebP
            $originalFilename = Str::random(20) . '.webp';
            $originalPath = $baseDir . '/' . $originalFilename;
            Storage::disk('public')->put($originalPath, $image->encode(new WebpEncoder(quality: 80)));
            
            // Create thumbnail (400px width)
            $thumbnail = $imageManager->read($request->file('image'));
            $thumbnail->scale(width: 400);
            
            $thumbnailFilename = Str::random(20) . '.webp';
            $thumbnailPath = $baseDir . '/thumbs/' . $thumbnailFilename;
            Storage::disk('public')->put($thumbnailPath, $thumbnail->encode(new WebpEncoder(quality: 75)));

            Memory::create([
                'album_id' => $album->id,
                'image_path' => $originalPath,
                'thumbnail_path' => $thumbnailPath,
                'date_text' => $request->date_text,
                'note' => $request->note,
                'rotation' => rand(-4, 4),
            ]);

            Log::info('Memory stored with thumbnail', [
                'album_id' => $album->id,
                'original' => $originalPath,
                'thumbnail' => $thumbnailPath
            ]);
            return back()->with('message', 'Memory saved! 📸');
        } catch (\Exception $e) {
            Log::error('Memory storage failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['image' => 'Failed to upload image.']);
        }
    }

    public function updateMemory(Request $request, Memory $memory)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to edit memories.']);
        }

        if ($memory->album->user_id !== auth()->id()) abort(403);

        $data = $request->validate([
            'date_text' => 'required|string|max:30',
            'note' => 'nullable|string|max:500',
            'album_id' => 'required|exists:albums,id'
        ]);

        if ($memory->album_id != $request->album_id) {
            $newAlbum = Album::where('id', $request->album_id)
                ->where('user_id', auth()->id())
                ->firstOrFail();
                
            if ($newAlbum->memories()->where('id', '!=', $memory->id)->count() >= self::MAX_MEMORIES_PER_ALBUM) {
                return back()->withErrors(['album_id' => 'Album is full.']);
            }
        }

        $memory->update($data);
        Log::info('Memory updated', ['memory_id' => $memory->id]);
        return back()->with('message', 'Memory updated! ✨');
    }

    public function destroyAlbum(Album $album)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to manage albums.']);
        }

        if ($album->user_id !== auth()->id()) abort(403);

        try {
            foreach ($album->memories as $memory) {
                // Delete original image
                if ($memory->image_path && Storage::disk('public')->exists($memory->image_path)) {
                    Storage::disk('public')->delete($memory->image_path);
                }
                
                // Delete thumbnail
                if ($memory->thumbnail_path && Storage::disk('public')->exists($memory->thumbnail_path)) {
                    Storage::disk('public')->delete($memory->thumbnail_path);
                }
            }
            
            $album->delete();
            Log::info('Album deleted', [
                'album_id' => $album->id,
                'memories_deleted' => $album->memories->count()
            ]);
            return back()->with('message', 'Album deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Album deletion failed', [
                'album_id' => $album->id,
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to delete album.']);
        }
    }

    public function destroyMemory(Memory $memory)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to manage memories.']);
        }

        if ($memory->album->user_id !== auth()->id()) abort(403);

        try {
            // Delete original image
            if ($memory->image_path && Storage::disk('public')->exists($memory->image_path)) {
                Storage::disk('public')->delete($memory->image_path);
            }
            
            // Delete thumbnail
            if ($memory->thumbnail_path && Storage::disk('public')->exists($memory->thumbnail_path)) {
                Storage::disk('public')->delete($memory->thumbnail_path);
            }
            
            $memory->delete();
            Log::info('Memory deleted', ['memory_id' => $memory->id]);
            return back()->with('message', 'Memory deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Memory deletion failed', [
                'memory_id' => $memory->id,
                'error' => $e->getMessage()
            ]);
            return back()->withErrors(['error' => 'Failed to delete memory.']);
        }
    }
public function destroyMusic()
{
    $user = auth()->user();
    $musicSetting = $user->musicSetting()->first();

    if ($musicSetting) {
        // Delete the file from the 'public' disk (storage/app/public)
        if ($musicSetting->file_path) {
            Storage::disk('public')->delete($musicSetting->file_path);
        }

        // Delete the database record
        $musicSetting->delete();
    }

    return back()->with('success', 'Music reset to default.');
}
    public function updateMusic(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to update music.']);
        }

        $request->validate([
            'display_name' => 'nullable|string|max:100',
            'music' => 'nullable|file|mimes:mp3,wav,m4a|max:15000', 
        ]);
        
        try {
            $user = Auth::user();
            $musicSetting = MusicSetting::where('user_id', $user->id)->first();
            
            $data = ['user_id' => $user->id];
            
            if ($request->hasFile('music')) {
                if ($musicSetting && $musicSetting->file_path) {
                    Storage::disk('public')->delete($musicSetting->file_path);
                }
                
                $path = $request->file('music')->store('music', 'public');
                $data['file_path'] = $path;
                $data['file_name'] = $request->display_name ?: pathinfo($request->file('music')->getClientOriginalName(), PATHINFO_FILENAME);
            } elseif ($request->filled('display_name') && $musicSetting) {
                $data['file_name'] = $request->display_name;
            }
            
            if ($musicSetting) {
                $musicSetting->update($data);
                Log::info('Music updated', ['user_id' => $user->id]);
            } elseif (isset($data['file_path'])) {
                MusicSetting::create($data);
                Log::info('Music created', ['user_id' => $user->id]);
            }
            
            return back()->with('message', 'Music settings saved! 🎵');
        } catch (\Exception $e) {
            Log::error('Music update failed', [
                'error' => $e->getMessage(), 
                'user_id' => Auth::id()
            ]);
            return back()->withErrors(['music' => 'Failed to save music.']);
        }
    }

    public function storeLetter(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to save letters.']);
        }

        $data = $request->validate([
            'recipient' => 'required|string|max:50',
            'message'   => 'required|string|max:2000',
            'closing'   => 'required|string|max:50',
            'sender'    => 'required|string|max:50',
        ]);

        try {
            Letter::updateOrCreate(
                ['user_id' => auth()->id()],
                $data
            );

            Log::info('Letter saved', ['user_id' => auth()->id()]);
            return back()->with('message', 'Letter saved! 💌');
        } catch (\Exception $e) {
            Log::error('Letter save failed', [
                'error' => $e->getMessage(), 
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['letter' => 'Failed to save letter.']);
        }
    }

    public function updateTheme(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to change themes.']);
        }

        $request->validate([
            'theme' => 'required|string|in:default,midnight,classy,vintage,nature'
        ]);

        try {
            Setting::updateOrCreate(
                ['user_id' => auth()->id()],
                ['theme' => $request->theme]
            );

            Log::info('Theme updated', [
                'user_id' => auth()->id(),
                'theme' => $request->theme
            ]);
            return back()->with('message', 'Theme updated! 🎨');
        } catch (\Exception $e) {
            Log::error('Theme update failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['theme' => 'Failed to update theme.']);
        }
    }

    /**
     * Verify payment and activate user account
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'payment_screenshot' => 'required|image|mimes:jpeg,png,jpg|max:5000',
            'reference_number' => 'required|string|max:50',
        ]);

        try {
            $user = auth()->user();
            
            // Store payment proof
            $path = $request->file('payment_screenshot')->store('payment-proofs/' . date('Y/m'), 'public');
            
            // Update payment verification status (you might want to create a PaymentVerification model)
            // For now, we'll just update the user
            $user->update([
                'payment_reference' => $request->reference_number,
                'payment_proof_path' => $path,
                'payment_status' => 'pending', // pending, verified, rejected
            ]);

            // Send notification to admin (you can implement this)
            // $this->notifyAdminOfPayment($user);

            Log::info('Payment verification submitted', [
                'user_id' => $user->id,
                'reference' => $request->reference_number
            ]);

            return back()->with('message', 'Payment verification submitted! We will review it within 24 hours.');
        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['payment_screenshot' => 'Failed to submit payment verification.']);
        }
    }

    /**
     * Generate magic login link for partner (only for paid users)
     */
     public function generateMagicLogin(Request $request)
    {
        // Check payment status
        if (auth()->user()->is_paid === 0) {
            return back()->withErrors(['payment' => 'Please complete your ₱20 payment to generate magic links.']);
        }

        try {
            $user = auth()->user();
            
            // Check if user already has a valid magic link (not expired)
            $existingLink = DB::table('magic_links')
                ->where('user_id', $user->id)
                ->where('expires_at', '>', now())
                ->first();
            
            if ($existingLink) {
                // Use existing token instead of generating new one
                $token = $existingLink->token;
                $magicLink = route('magic.login', ['token' => $token]);
                
                Log::info('Existing magic link retrieved', [
                    'user_id' => $user->id,
                    'expires_at' => $existingLink->expires_at
                ]);

                return back()->with([
                    'success' => 'Your existing magic link is ready!',
                    'magic_link' => $magicLink,
                    'magic_link_expires_at' => $existingLink->expires_at
                ]);
            }
            
            // Generate new token only if no valid existing link
            $token = Str::random(60);
            $expiresAt = now()->addDays(30); // Changed from 24 hours to 30 days for better persistence
            
            // Store token in database
            DB::table('magic_links')->updateOrInsert(
                ['user_id' => $user->id],
                [
                    'token' => $token,
                    'expires_at' => $expiresAt,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $magicLink = route('magic.login', ['token' => $token]);
            
            Log::info('New magic link generated', [
                'user_id' => $user->id,
                'expires_at' => $expiresAt
            ]);

            return back()->with([
                'success' => 'Magic link generated! Copy and send it to your partner.',
                'magic_link' => $magicLink,
                'magic_link_expires_at' => $expiresAt
            ]);
            
        } catch (\Exception $e) {
            Log::error('Magic link generation failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['error' => 'Failed to generate magic link.']);
        }
    }

      public function access()
    {
        $user = Auth::user();
        
        // Get or create magic link data using your model's methods
        $magicLinkData = null;
        if ($user->hasValidMagicLink()) {
            $magicLinkData = $user->getMagicLinkData();
        }
        
        return Inertia::render('ShareAccess', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_paid' => $user->is_paid,
                    'magic_link' => $magicLinkData['link'] ?? null,
                    'qr_code_url' => $user->qr_code_url,
                    'magic_link_expires_at' => $user->login_token_expires_at,
                    'days_remaining' => $magicLinkData['days_remaining'] ?? null,
                    'has_link' => $magicLinkData['has_link'] ?? false,
                ]
            ]
        ]);
    }

      /**
     * NEW METHOD: Revoke magic link
     */
    public function revokeMagicLink(Request $request)
    {
        try {
            $user = auth()->user();
            
            DB::table('magic_links')
                ->where('user_id', $user->id)
                ->delete();
            
            Log::info('Magic link revoked', ['user_id' => $user->id]);
            
            return back()->with('success', 'Magic link revoked successfully. Anyone with the old link can no longer access your account.');
            
        } catch (\Exception $e) {
            Log::error('Magic link revocation failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['error' => 'Failed to revoke magic link.']);
        }
    }

    /**
     * NEW METHOD: Get current magic link status (for Inertia share)
     */
    public function getMagicLinkStatus()
    {
        $user = auth()->user();
        
        if (!$user || $user->is_paid === 0) {
            return [
                'has_magic_link' => false,
                'magic_link' => null,
                'expires_at' => null
            ];
        }
        
        $existingLink = DB::table('magic_links')
            ->where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->first();
        
        if ($existingLink) {
            return [
                'has_magic_link' => true,
                'magic_link' => route('magic.login', ['token' => $existingLink->token]),
                'expires_at' => $existingLink->expires_at,
                'days_remaining' => now()->diffInDays($existingLink->expires_at, false)
            ];
        }
        
        return [
            'has_magic_link' => false,
            'magic_link' => null,
            'expires_at' => null
        ];
    }



    /**
     * Handle magic login
     */
     public function magicLogin($token)
    {
        try {
            $magicLink = DB::table('magic_links')
                ->where('token', $token)
                ->where('expires_at', '>', now())
                ->first();

            if (!$magicLink) {
                return redirect('/')->withErrors(['error' => 'Invalid or expired magic link.']);
            }

            // Log in the user
            $user = \App\Models\User::find($magicLink->user_id);
            if ($user) {
                auth()->login($user);
                
                // DON'T delete the token - this allows the link to be reused
                // Only delete if you want one-time use
                // DB::table('magic_links')->where('token', $token)->delete();
                
                Log::info('Magic login successful', [
                    'user_id' => $user->id,
                    'token_used' => substr($token, 0, 8) . '...'
                ]);
                
                // Redirect to partner view or dashboard
                return redirect()->route('partner.view', ['user' => $user->id]);
            }

            return redirect('/')->withErrors(['error' => 'User not found.']);
            
        } catch (\Exception $e) {
            Log::error('Magic login failed', [
                'error' => $e->getMessage(),
                'token' => substr($token, 0, 8) . '...'
            ]);
            return redirect('/')->withErrors(['error' => 'Failed to process magic link.']);
        }
    }

       public function extendMagicLink(Request $request)
    {
        try {
            $user = auth()->user();
            
            $updated = DB::table('magic_links')
                ->where('user_id', $user->id)
                ->update([
                    'expires_at' => now()->addDays(30),
                    'updated_at' => now()
                ]);
            
            if ($updated) {
                Log::info('Magic link extended', ['user_id' => $user->id]);
                return back()->with('success', 'Magic link extended for another 30 days!');
            }
            
            return back()->withErrors(['error' => 'No active magic link found.']);
            
        } catch (\Exception $e) {
            Log::error('Magic link extension failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['error' => 'Failed to extend magic link.']);
        }
    }

    public function saveQRCode(Request $request)
{
    $user = Auth::user();
    $user->magic_link = $request->magic_link;
    $user->qr_code_url = $request->qr_code_url;
    $user->save();
    
    return back()->with('success', 'QR code saved successfully!');
}

}