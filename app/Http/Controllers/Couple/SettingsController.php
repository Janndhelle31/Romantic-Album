<?php

namespace App\Http\Controllers\Couple;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the user settings page.
     */
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('Settings', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('F j, Y'),
                ]
            ],
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        try {
            $user->update($validated);

            return redirect()->back()->with([
                'message' => 'Profile updated successfully!',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with([
                'message' => 'Failed to update profile. Please try again.',
                'type' => 'error'
            ]);
        }
    }

    /**
     * Update the user's password.
     */
   public function updatePassword(Request $request)
{
    $validated = $request->validate([
        'current_password' => ['required', 'current_password'],
        'password' => ['required', 'confirmed', Password::defaults()],
    ]);

    try {
        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with([
            'message' => 'Password updated successfully!',
            'type' => 'success'
        ]);
    } catch (\Exception $e) {
        return redirect()->back()->with([
            'message' => 'Failed to update password. Please try again.',
            'type' => 'error'
        ]);
    }
}

    /**
     * Delete the user's account.
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        try {
            $user = $request->user();
            
            // Logout the user
            Auth::logout();
            
            // Delete the user
            $user->delete();
            
            // Invalidate session
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect('/')->with([
                'message' => 'Your account has been deleted successfully.',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with([
                'message' => 'Failed to delete account. Please try again.',
                'type' => 'error'
            ]);
        }

        
    }

 public function store(Request $request)
{
    $validated = $request->validate([
        'story_title' => 'required|string|max:255',
        'story_subtitle' => 'nullable|string|max:255',
        'anniversary_date' => 'nullable|date',
    ]);

    try {
        // Use updateOrCreate to ensure only one record per user
        $setting = Setting::updateOrCreate(
            [
                'user_id' => Auth::id() // Search criteria
            ],
            [
                'story_title' => $validated['story_title'],
                'story_subtitle' => $validated['story_subtitle'] ?? null,
                'anniversary_date' => $validated['anniversary_date'] ?? null,
            ]
        );

        // Determine if it was created or updated
        $action = $setting->wasRecentlyCreated ? 'created' : 'updated';
        
        // Log the action
        \Log::info("Settings {$action} successfully", [
            'user_id' => Auth::id(),
            'setting_id' => $setting->id,
            'action' => $action,
            'story_title' => $validated['story_title']
        ]);

        // Return Inertia response
        return redirect()->back()->with([
            'success' => "Settings {$action} successfully!",
            'setting' => $setting
        ]);

    } catch (\Exception $e) {
        // Log error
        \Log::error('Failed to save settings', [
            'user_id' => Auth::id(),
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return back()->withErrors([
            'message' => 'Failed to save settings. Please try again.'
        ]);
    }
}
}