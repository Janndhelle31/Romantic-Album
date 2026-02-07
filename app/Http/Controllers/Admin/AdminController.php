<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Memory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'albums' => Album::where('user_id', auth()->id())->get()
        ]);
    }

    public function storeAlbum(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string',
            'description' => 'nullable|string',
        ]);

        Album::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . rand(100, 999),
            'icon' => $validated['icon'],
            'description' => $validated['description'],
        ]);

        return redirect()->back()->with('message', 'Album created!');
    }

    public function storeMemory(Request $request)
    {
        $request->validate([
            'album_id' => 'required|exists:albums,id',
            'image' => 'required|image|max:5120', // 5MB limit
            'date_text' => 'required|string',
            'note' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('memories', 'public');

        Memory::create([
            'album_id' => $request->album_id,
            'image_path' => $path,
            'date_text' => $request->date_text,
            'note' => $request->note,
            'rotation' => rand(-5, 5),
        ]);

        return redirect()->back()->with('message', 'Memory added!');
    }
}