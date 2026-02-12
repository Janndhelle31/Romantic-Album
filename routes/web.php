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
        ? redirect()->route('dashboard') // This goes to user dashboard
        : Inertia::render('Auth/Login');
});




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

// ============================
// USER ROUTES (Regular Users)
// ============================
Route::middleware(['auth', 'verified'])->group(function () {
    // 4. THE MAIN STORY (User Dashboard)
    Route::get('/dashboard', [AlbumController::class, 'index'])->name('dashboard');
    
    // 5. THE ALBUM DETAILS
    Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');
    
    // 6. MANAGEMENT ROUTES
    Route::get('/manage', [UserDashboardController::class, 'index'])->name('manage.index');
    Route::post('/manage/album', [UserDashboardController::class, 'storeAlbum'])->name('manage.album.store');
    Route::post('/manage/memory', [UserDashboardController::class, 'storeMemory'])->name('manage.memory.store');
    Route::post('/memories/{memory}', [UserDashboardController::class, 'updateMemory'])->name('manage.memory.update');
    Route::post('/manage/letter', [UserDashboardController::class, 'storeLetter'])->name('letter.update');
    Route::post('/manage/music', [UserDashboardController::class, 'updateMusic'])->name('music.update');
Route::delete('/music-settings', action: [UserDashboardController::class, 'destroyMusic'])->name('music.destroy');
    Route::post('/settings/story', [SettingController::class, 'update'])->name('settings.story.update');
        Route::delete('manage/memory/{memory}', [UserDashboardController::class, 'destroyMemory'])
        ->name('manage.memory.destroy');
Route::post('/save-qr-code', [UserDashboardController::class, 'saveQRCode'])->middleware('auth');

Route::get('/manage/share-access', [UserDashboardController::class, 'access'])->name('share.access');

        
    // 7. SETTINGS ROUTES
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('/profile', [SettingsController::class, 'updateProfile'])->name('settings.updateProfile');
    Route::put('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.updatePassword');
    Route::delete('/account', [SettingsController::class, 'deleteAccount'])->name('settings.deleteAccount');
    Route::post('/settings', [SettingsController::class, 'store'])->name('settings.store');
    
    // 8. PROFILE MANAGEMENT
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/theme/update', [ProfileController::class, 'updateTheme'])->name('theme.update');
    
    Route::get('/manage/design', [ProfileController::class, 'designIndex'])->name('manage.design');
});

// ============================
// PUBLIC ROUTES (No Auth Needed)
// ============================
Route::get('/preview', [PublicController::class, 'preview'])->name('public.preview');
Route::get('/preview/album/{slug}', [PublicController::class, 'previewAlbum'])
    ->name('preview.album.show');
Route::get('/sample-albums/{slug}', [AlbumController::class, 'showSample'])
    ->name('sample-albums.show');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard - ACCESS AT: /admin/dashboard
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/{user}', [AdminController::class, 'userDetail'])->name('users.detail');
    Route::delete('/users/{user}/delete', [AdminController::class, 'deleteUser'])->name('users.delete');
    Route::post('/users/{user}/toggle-payment', [AdminController::class, 'togglePaymentStatus'])->name('users.toggle-payment');
    Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');

    // Content Management
    Route::get('/albums', [AdminController::class, 'albums'])->name('albums');
    Route::delete('/albums/{album}', [AdminController::class, 'deleteAlbum'])->name('albums.delete');
    
    Route::get('/memories', [AdminController::class, 'memories'])->name('memories');
    Route::delete('/memories/{memory}', [AdminController::class, 'deleteMemory'])->name('memories.delete');
    
    // Music Settings Management
    Route::get('/music-settings', [AdminController::class, 'musicSettings'])->name('music-settings');
    Route::delete('/music-settings/{musicSetting}', [AdminController::class, 'deleteMusicSetting'])->name('music-settings.delete');
    
    // Admin Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    
    // Old routes for compatibility
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::post('/albums', [AdminController::class, 'storeAlbum'])->name('albums.store');
    Route::post('/memories', [AdminController::class, 'storeMemory'])->name('memories.store');
    
    // Optional: Role management routes
    Route::post('/users/{user}/make-admin', [AdminController::class, 'makeAdmin'])->name('users.make-admin');
    Route::post('/users/{user}/remove-admin', [AdminController::class, 'removeAdmin'])->name('users.remove-admin');
});

require __DIR__ . '/auth.php';