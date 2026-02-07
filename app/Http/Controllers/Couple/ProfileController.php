<?php


namespace App\Http\Controllers\Couple;

use App\Http\Controllers\Controller;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\Album;
use App\Models\Memory;
use App\Models\Setting;
use App\Models\MusicSetting;
use App\Models\Letter; // Add this import
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

public function designIndex()
{
    if (!Auth::check()) {
        return redirect()->route('login');
    }
    
    $user = Auth::user();
    
    // Get user's records
    $setting = Setting::where('user_id', $user->id)->first();
    $musicSetting = MusicSetting::where('user_id', $user->id)->first();
    $letter = Letter::where('user_id', $user->id)->first();
    
    // User theme is the ONLY source of truth
    $userTheme = $user->theme ?? 'default';

    return Inertia::render('DesignSettings', [
        'letter_content' => $letter ? [
            'recipient' => $letter->recipient ?? '',
            'message' => $letter->message ?? '',
            'closing' => $letter->closing ?? '',
            'sender' => $letter->sender ?? $user->name ?? '',
            'letter_id' => $letter->id,
        ] : null,
        
        'music_data' => $musicSetting ? [
            'id' => $musicSetting->id,
            'file_path' => $musicSetting->file_path,
            'file_name' => $musicSetting->file_name,
            'url' => $musicSetting->file_path ? asset('storage/' . $musicSetting->file_path) : null,
        ] : null,
        
        // Settings no longer has theme column
        'settings' => $setting ? [
            'id' => $setting->id,
            'user_id' => $setting->user_id,
            'story_title' => $setting->story_title,
            'story_subtitle' => $setting->story_subtitle,
            'anniversary_date' => $setting->anniversary_date,
        ] : null,
        
        'auth' => [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'theme' => $userTheme, // SINGLE source of truth
            ]
        ]
    ]);
}


    public function manageIndex()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $user = Auth::user();
        
        return Inertia::render('UserDashboard', [
            // Fetch albums with their memories for the current user
            'albums' => Album::where('user_id', $user->id)
                ->with('memories')
                ->get(),
                
            // Also pass data to dashboard if needed
            'letter_content' => Letter::where('user_id', $user->id)->first(),
            'music_setting' => MusicSetting::where('user_id', $user->id)->first(),
            'theme' => $user->theme ?? 'default',
        ]);
    }

    public function updateTheme(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $validated = $request->validate([
            'theme' => 'required|in:default,midnight,classy,vintage,nature'
        ]);

        $user = Auth::user();
        $user->update(['theme' => $validated['theme']]);

        return Redirect::back()->with('message', 'Theme updated successfully!');
    }
    
    public function show($id)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $user = Auth::user();
        $memory = Memory::findOrFail($id);
        
        // Check if memory belongs to current user
        if ($memory->album->user_id !== $user->id) {
            abort(403);
        }
        
        // Get user settings
        $musicSetting = MusicSetting::where('user_id', $user->id)->first();
        $letter = Letter::where('user_id', $user->id)->first();
        
        return inertia('MemoryBook/Show', [
            'memory' => $memory,
            'current_music' => $musicSetting ? asset('storage/' . $musicSetting->file_path) : null,
            'letter_content' => $letter ? [
                'recipient' => $letter->recipient ?? '',
                'message' => $letter->message ?? '',
                'closing' => $letter->closing ?? '',
                'sender' => $letter->sender ?? $user->name ?? '',
            ] : null,
            'theme' => $user->theme ?? 'default',
        ]);
    }
    
   
    
   
}