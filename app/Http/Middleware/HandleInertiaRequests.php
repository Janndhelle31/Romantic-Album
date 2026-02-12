<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{


  public function __invoke($token)
    {
        $user = User::where('magic_link_token', $token)->first();

        if (!$user) {
            return redirect()->route('login')
                ->with('error', 'Invalid or expired magic link.');
        }

        // Log the user in
        Auth::login($user);

        // Optional: Log the access
        $user->update([
            'last_magic_link_access' => now(),
            'magic_link_access_count' => ($user->magic_link_access_count ?? 0) + 1
        ]);

        // Redirect to dashboard
        return redirect()->route('dashboard');
    }
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Load relationships to avoid N+1 issues
        if ($user) {
            $user->load(['musicSetting', 'letter', 'setting']);
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'theme' => $user->theme,
                    'share_token' => $user->share_token,
                ] : null,
            ],

            // Flash messages for notifications
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
                'magic_link' => fn() => $request->session()->get('magic_link'),
            ],

            // Shared Music Data
            'current_music' => $user?->musicSetting ? [
                'url' => asset('storage/' . $user->musicSetting->file_path),
                'display_name' => $user->musicSetting->file_name,
            ] : null,

            // Shared Letter Data
            'letter_content' => $user?->letter ? [
                'recipient' => $user->letter->recipient,
                'message' => $user->letter->message,
                'closing' => $user->letter->closing,
                'sender' => $user->letter->sender,
            ] : null,

            // Shared Settings Data
            'settings' => $user?->setting ? [
                'story_title' => $user->setting->story_title,
                'story_subtitle' => $user->setting->story_subtitle,
                'anniversary_date' => $user->setting->anniversary_date,
                'theme' => $user->setting->theme,
            ] : null,
        ]);
    }
}