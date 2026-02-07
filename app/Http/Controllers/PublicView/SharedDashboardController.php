<?php


namespace App\Http\Controllers\PublicView;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class SharedDashboardController extends Controller
{
    public function show($token)
    {
        // Find the user who owns this token
        $user = User::where('share_token', $token)->firstOrFail();

        // Return a special "Public" view or your existing Album view
        // but passing the specific user's data instead of auth()->user()
        return Inertia::render('Public/DashboardView', [
            'owner' => $user->name,
            'albums' => $user->albums()->with('memories')->get(),
            'settings' => $user->settings, // if you have a settings relationship
        ]);
    }
}