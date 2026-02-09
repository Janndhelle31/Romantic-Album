<?php

namespace App\Http\Controllers\PublicView;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Display a public preview of the application using dummy data.
     */
    public function preview(): Response
    {
        return Inertia::render('Preview', [
            // We pass empty/null to ensure the frontend uses fallback dummy data
            'albums' => [],
            'settings' => null,
        ]);
    }

    /**
     * Display a specific sample album in preview mode.
     */
    public function previewAlbum(string $slug): Response
    {
        return Inertia::render('AlbumPreview', [
            'slug' => $slug,
            'title' => 'Sample Album Preview',
            // Pass minimal data - frontend will load from lib/data.js
            'album' => null,
            'photos' => [],
            'isSample' => true,
        ]);
    }
}