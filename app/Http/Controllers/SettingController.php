<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Update or create the user's settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'story_title'      => 'required|string|max:50',
            'story_subtitle'   => 'nullable|string|max:255',
            'anniversary_date' => 'required|date',
        ]);

        // Updates the existing record or creates one if it doesn't exist
        $request->user()->setting()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return back()->with('message', 'Story settings updated!');
    }
}