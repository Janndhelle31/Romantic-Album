<?php

use App\Http\Controllers\Couple\ProfileController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Couple\SettingsController;
use App\Http\Controllers\Couple\UserDashboardController;
use App\Http\Controllers\PublicView\PublicController;
use App\Http\Controllers\Admin\AdminController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. LANDING PAGE
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Auth/Login');
});


// Public access route
Route::get('/preview', [PublicController::class, 'preview'])->name('public.preview');

Route::get('/sample-albums/{slug}', [AlbumController::class, 'showSample'])
    ->name('sample-albums.show');

// Regular album routes (keep your existing)
Route::get('/albums/{album}', [AlbumController::class, 'show'])
    ->name('albums.show');
    
// 2. MAGIC LOGIN FOR GF (NO AUTH NEEDED!)
Route::get('/magic-login/{token}', function ($token) {
    $user = User::where('login_token', $token)
        ->where('login_token_expires_at', '>', now())
        ->first();

    if (!$user) {
        return redirect('/login')->with('error', 'Magic link expired or invalid!');
    }

    // LOG HER IN AS YOU!
    Auth::login($user);

    // Redirect to dashboard
    return redirect()->route('dashboard')->with('success', 'Welcome! Auto-logged in successfully!');
})->name('magic.login');

// 3. GENERATE MAGIC LINK (FOR YOU)
Route::post('/generate-magic-login', function () {
    $user = auth()->user();
    $token = $user->generateLoginToken();

    $magicLink = url("/magic-login/{$token}");

    // Store in session flash (will be available in next request)
    session()->flash('success', 'Magic link generated!');
    session()->flash('magic_link', $magicLink);

    // Return back (Inertia will handle the flash messages)
    return back();
})->middleware('auth');

// 4. THE MAIN STORY (Dashboard)
Route::get('/dashboard', [AlbumController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// 5. THE ALBUM DETAILS
Route::get('/albums/{album}', [AlbumController::class, 'show'])
    ->middleware(['auth'])
    ->name('albums.show');

// 6. MANAGEMENT ROUTES
Route::middleware(['auth'])->group(function () {
    Route::get('/manage', [UserDashboardController::class, 'index'])->name('manage.index');
    Route::post('/manage/album', [UserDashboardController::class, 'storeAlbum'])->name('manage.album.store');
    Route::post('/manage/memory', [UserDashboardController::class, 'storeMemory'])->name('manage.memory.store');
    Route::post('/memories/{memory}', [UserDashboardController::class, 'updateMemory'])->name('manage.memory.update');
    Route::post('/manage/letter', [UserDashboardController::class, 'storeLetter'])->name('letter.update');
    Route::post('/manage/music', [UserDashboardController::class, 'updateMusic'])->name('music.update');
    Route::post('/settings/story', [SettingController::class, 'update'])->name('settings.story.update');
});

// 7. SETTINGS ROUTES
Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
Route::put('/profile', [SettingsController::class, 'updateProfile'])->name('settings.updateProfile');
Route::put('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.updatePassword');
Route::delete('/account', [SettingsController::class, 'deleteAccount'])->name('settings.deleteAccount');
Route::post('/settings', [SettingsController::class, 'store'])->name('settings.store');

// 8. PROFILE MANAGEMENT
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/theme/update', [ProfileController::class, 'updateTheme'])->name('theme.update');
});

Route::get('/manage', [ProfileController::class, 'manageIndex'])->name('manage.index');
Route::get('/manage/design', [ProfileController::class, 'designIndex'])->name('manage.design');

// 9. ADMIN ROUTES
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/albums', [AdminController::class, 'storeAlbum'])->name('admin.albums.store');
    Route::post('/memories', [AdminController::class, 'storeMemory'])->name('admin.memories.store');
});

require __DIR__ . '/auth.php';