<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Memory;
use App\Models\User;
use App\Models\MusicSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Dashboard - GET /admin/dashboard
    public function index()
    {
        // Get total statistics
        $totalUsers = User::where('role_as', '!=', 1)->count();
        $totalAlbums = Album::count();
        $totalMemories = Memory::count();
        $totalMusicFiles = MusicSetting::count();
        
        // Payment statistics
        $paidUsers = User::where('is_paid', 1)->where('role_as', '!=', 1)->count();
        $unpaidUsers = User::where('is_paid', 0)->where('role_as', '!=', 1)->count();
        
        // Calculate total music file size
        $totalMusicSize = MusicSetting::get()
            ->sum(function($music) {
                return Storage::disk('public')->exists($music->file_path) 
                    ? Storage::disk('public')->size($music->file_path) 
                    : 0;
            });
        
        // Format music size
        $formattedMusicSize = $this->formatBytes($totalMusicSize);

        // Recent users (5 latest)
        $recentUsers = User::withCount(['albums', 'memories'])
            ->where('role_as', '!=', 1)
            ->latest()
            ->take(5)
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_paid' => $user->is_paid,
                    'created_at' => $user->created_at->format('M d, Y'),
                    'albums_count' => $user->albums_count,
                    'memories_count' => $user->memories_count,
                ];
            });

        // Recent memories (5 latest)
        $recentMemories = Memory::with('album.user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($memory) {
                return [
                    'id' => $memory->id,
                    'image_path' => $memory->image_path,
                    'date_text' => $memory->date_text,
                    'note' => Str::limit($memory->note, 50),
                    'user_name' => $memory->album->user->name ?? 'Unknown',
                    'album_title' => $memory->album->title,
                ];
            });

        // Recent albums (5 latest)
        $recentAlbums = Album::with(['user', 'memories'])
            ->withCount('memories')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'slug' => $album->slug,
                    'icon' => $album->icon,
                    'theme_color' => $album->theme_color,
                    'user_name' => $album->user->name,
                    'user_paid' => $album->user->is_paid,
                    'memories_count' => $album->memories_count,
                    'created_at' => $album->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_albums' => $totalAlbums,
                'total_memories' => $totalMemories,
                'total_music_files' => $totalMusicFiles,
                'total_music_size' => $formattedMusicSize,
                'paid_users' => $paidUsers,
                'unpaid_users' => $unpaidUsers,
            ],
            'recent_users' => $recentUsers,
            'recent_memories' => $recentMemories,
            'recent_albums' => $recentAlbums,
        ]);
    }

    // Users List - GET /admin/users
    public function users(Request $request)
    {
        $query = User::withCount(['albums', 'memories'])
            ->with(['musicSetting'])
            ->where('role_as', '!=', 1)
            ->latest();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        // Transform data for Inertia
        $users->getCollection()->transform(function($user) {
            // Calculate music file size for each user
            $musicSize = 0;
            if ($user->musicSetting) {
                $musicSize = Storage::disk('public')->exists($user->musicSetting->file_path) 
                    ? Storage::disk('public')->size($user->musicSetting->file_path) 
                    : 0;
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_paid' => $user->is_paid,
                'payment_status' => $user->payment_status,
                'payment_reference' => $user->payment_reference,
                'created_at' => $user->created_at->format('M d, Y'),
                'updated_at' => $user->updated_at->format('M d, Y'),
                'albums_count' => $user->albums_count,
                'memories_count' => $user->memories_count,
                'music_setting' => $user->musicSetting ? [
                    'id' => $user->musicSetting->id,
                    'display_name' => $user->musicSetting->display_name,
                    'file_name' => $user->musicSetting->file_name,
                    'file_path' => $user->musicSetting->file_path,
                    'file_size' => $musicSize,
                    'formatted_size' => $this->formatBytes($musicSize),
                ] : null,
                'has_share_token' => !empty($user->share_token),
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search']),
            'total_stats' => [
                'total_users' => User::where('role_as', '!=', 1)->count(),
                'total_albums' => Album::count(),
                'total_memories' => Memory::count(),
                'total_music_files' => MusicSetting::count(),
                'paid_users' => User::where('is_paid', 1)->where('role_as', '!=', 1)->count(),
                'unpaid_users' => User::where('is_paid', 0)->where('role_as', '!=', 1)->count(),
            ]
        ]);
    }

    // User Detail - GET /admin/users/{user}
    public function userDetail(User $user)
    {
        // Prevent viewing admin users
        if ($user->role_as == 1) {
            abort(404);
        }
        
        // Load user with all relationships
        $user->loadCount(['albums', 'memories']);
        
        $user->load([
            'albums' => function($query) {
                $query->withCount('memories')->latest();
            },
            'memories' => function($query) {
                $query->with('album')
                    ->latest('memories.created_at')
                    ->take(20);
            },
            'musicSetting',
            'setting',
            'letter',
        ]);

        // Calculate music file size
        $musicSize = 0;
        if ($user->musicSetting && $user->musicSetting->file_path) {
            $musicSize = Storage::disk('public')->exists($user->musicSetting->file_path) 
                ? Storage::disk('public')->size($user->musicSetting->file_path) 
                : 0;
        }

        // Calculate total storage used by user (memories + music)
        $totalStorage = $user->memories->sum(function($memory) {
            return Storage::disk('public')->exists($memory->image_path) 
                ? Storage::disk('public')->size($memory->image_path) 
                : 0;
        }) + $musicSize;

        return Inertia::render('Admin/UserDetail', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_paid' => $user->is_paid,
                'payment_status' => $user->payment_status,
                'payment_reference' => $user->payment_reference,
                'created_at' => $user->created_at->format('M d, Y'),
                'email_verified_at' => $user->email_verified_at?->format('M d, Y H:i'),
                'share_token' => $user->share_token,
                'theme' => $user->theme,
            ],
            'stats' => [
                'albums_count' => $user->albums_count,
                'memories_count' => $user->memories_count,
                'total_storage' => $this->formatBytes($totalStorage),
                'music_file' => $user->musicSetting ? [
                    'id' => $user->musicSetting->id,
                    'display_name' => $user->musicSetting->display_name,
                    'file_name' => $user->musicSetting->file_name,
                    'file_path' => $user->musicSetting->file_path,
                    'file_size' => $musicSize,
                    'formatted_size' => $this->formatBytes($musicSize),
                ] : null,
                'has_letter' => !is_null($user->letter),
                'has_setting' => !is_null($user->setting),
            ],
            'albums' => $user->albums->map(function($album) {
                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'slug' => $album->slug,
                    'icon' => $album->icon,
                    'theme_color' => $album->theme_color,
                    'description' => $album->description,
                    'memories_count' => $album->memories_count,
                    'created_at' => $album->created_at->format('M d, Y'),
                ];
            }),
            'recent_memories' => $user->memories->take(10)->map(function($memory) {
                $size = Storage::disk('public')->exists($memory->image_path) 
                    ? Storage::disk('public')->size($memory->image_path) 
                    : 0;

                return [
                    'id' => $memory->id,
                    'image_path' => $memory->image_path,
                    'date_text' => $memory->date_text,
                    'note' => $memory->note,
                    'album_title' => $memory->album->title,
                    'album_slug' => $memory->album->slug,
                    'file_size' => $size,
                    'formatted_size' => $this->formatBytes($size),
                    'created_at' => $memory->created_at->format('M d, Y H:i'),
                ];
            }),
        ]);
    }

    /**
     * Toggle user payment status
     */
   public function togglePaymentStatus(Request $request, User $user)
{
    // Prevent toggling admin users
    if ($user->role_as == 1) {
        Log::warning('Attempted to toggle payment status for admin user', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'attempted_by' => auth()->id(),
            'attempted_at' => now()->toDateTimeString()
        ]);
        
        return back()->with('error', 'Cannot toggle payment status for admin users.');
    }
    
    $oldStatus = $user->is_paid;
    $newStatus = $user->is_paid ? 0 : 1;
    
    Log::debug('Before update - User payment status', [
        'user_id' => $user->id,
        'is_paid_from_model' => $user->is_paid,
        'is_paid_from_db' => DB::table('users')->where('id', $user->id)->value('is_paid'),
        'new_status_to_set' => $newStatus
    ]);
    
    // Try direct DB update as a test
    $updated = DB::table('users')
        ->where('id', $user->id)
        ->update(['is_paid' => $newStatus]);
    
    // Refresh the model from database
    $user->refresh();
    
    Log::info('User payment status toggled', [
        'user_id' => $user->id,
        'user_email' => $user->email,
        'old_status' => $oldStatus,
        'new_status' => $newStatus,
        'changed_by' => auth()->id(),
        'changed_at' => now()->toDateTimeString(),
        'db_update_successful' => $updated ? 'yes' : 'no',
        'is_paid_after_refresh' => $user->is_paid,
        'is_paid_in_db' => DB::table('users')->where('id', $user->id)->value('is_paid')
    ]);
    
    $statusText = $newStatus ? 'paid' : 'unpaid';
    
    return back()->with('success', "User payment status updated to {$statusText}.");
}
    // Albums List - GET /admin/albums
    public function albums()
    {
        $albums = Album::with(['user', 'memories'])
            ->withCount('memories')
            ->latest()
            ->paginate(15)
            ->through(function($album) {
                // Calculate total album size
                $albumSize = $album->memories->sum(function($memory) {
                    return Storage::disk('public')->exists($memory->image_path) 
                        ? Storage::disk('public')->size($memory->image_path) 
                        : 0;
                });

                return [
                    'id' => $album->id,
                    'title' => $album->title,
                    'slug' => $album->slug,
                    'icon' => $album->icon,
                    'theme_color' => $album->theme_color,
                    'description' => $album->description,
                    'created_at' => $album->created_at->format('M d, Y'),
                    'user' => [
                        'id' => $album->user->id,
                        'name' => $album->user->name,
                        'email' => $album->user->email,
                        'is_paid' => $album->user->is_paid,
                    ],
                    'memories_count' => $album->memories_count,
                    'total_size' => $this->formatBytes($albumSize),
                ];
            });

        return Inertia::render('Admin/Albums', [
            'albums' => $albums,
        ]);
    }

    // Memories List - GET /admin/memories
    public function memories()
    {
        $memories = Memory::with(['album.user'])
            ->latest()
            ->paginate(20)
            ->through(function($memory) {
                $size = Storage::disk('public')->exists($memory->image_path) 
                    ? Storage::disk('public')->size($memory->image_path) 
                    : 0;

                return [
                    'id' => $memory->id,
                    'image_path' => $memory->image_path,
                    'date_text' => $memory->date_text,
                    'note' => $memory->note,
                    'rotation' => $memory->rotation,
                    'created_at' => $memory->created_at->format('M d, Y H:i'),
                    'file_size' => $size,
                    'formatted_size' => $this->formatBytes($size),
                    'album' => [
                        'id' => $memory->album->id,
                        'title' => $memory->album->title,
                        'slug' => $memory->album->slug,
                        'icon' => $memory->album->icon,
                    ],
                    'user' => [
                        'id' => $memory->album->user->id,
                        'name' => $memory->album->user->name,
                        'email' => $memory->album->user->email,
                        'is_paid' => $memory->album->user->is_paid,
                    ],
                ];
            });

        return Inertia::render('Admin/Memories', [
            'memories' => $memories,
        ]);
    }

    // Music Settings List - GET /admin/music-settings
    public function musicSettings()
    {
        $musicSettings = MusicSetting::with('user')
            ->latest()
            ->paginate(15)
            ->through(function($music) {
                $size = Storage::disk('public')->exists($music->file_path) 
                    ? Storage::disk('public')->size($music->file_path) 
                    : 0;

                return [
                    'id' => $music->id,
                    'display_name' => $music->display_name,
                    'file_name' => $music->file_name,
                    'file_path' => $music->file_path,
                    'created_at' => $music->created_at->format('M d, Y H:i'),
                    'file_size' => $size,
                    'formatted_size' => $this->formatBytes($size),
                    'user' => [
                        'id' => $music->user->id,
                        'name' => $music->user->name,
                        'email' => $music->user->email,
                        'is_paid' => $music->user->is_paid,
                    ],
                ];
            });

        // Calculate total statistics
        $totalFiles = MusicSetting::count();
        $totalSize = MusicSetting::get()
            ->sum(function($music) {
                return Storage::disk('public')->exists($music->file_path) 
                    ? Storage::disk('public')->size($music->file_path) 
                    : 0;
            });

        return Inertia::render('Admin/MusicSettings', [
            'musicSettings' => $musicSettings,
            'stats' => [
                'total_files' => $totalFiles,
                'total_size' => $this->formatBytes($totalSize),
                'average_size' => $totalFiles > 0 ? $this->formatBytes($totalSize / $totalFiles) : '0 B',
            ]
        ]);
    }

    // Admin Settings - GET /admin/settings
    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'site_stats' => [
                'total_users' => User::where('role_as', '!=', 1)->count(),
                'total_albums' => Album::count(),
                'total_memories' => Memory::count(),
                'paid_users' => User::where('is_paid', 1)->where('role_as', '!=', 1)->count(),
                'unpaid_users' => User::where('is_paid', 0)->where('role_as', '!=', 1)->count(),
            ]
        ]);
    }

    // Update Settings - POST /admin/settings
    public function updateSettings(Request $request)
    {
        // Add your settings update logic here
        return redirect()->back()->with('success', 'Settings updated successfully!');
    }

    // Delete User - DELETE /admin/users/{user}/delete
    public function deleteUser(User $user)
    {
        // Prevent deleting admin users
        if ($user->role_as == 1) {
            return redirect()->back()->with('error', 'Cannot delete admin users.');
        }
        
        try {
            // Delete user's memories (and their files)
            foreach ($user->memories as $memory) {
                if (Storage::disk('public')->exists($memory->image_path)) {
                    Storage::disk('public')->delete($memory->image_path);
                }
                if ($memory->thumbnail_path && Storage::disk('public')->exists($memory->thumbnail_path)) {
                    Storage::disk('public')->delete($memory->thumbnail_path);
                }
                $memory->delete();
            }

            // Delete user's albums
            $user->albums()->delete();

            // Delete user's music file
            if ($user->musicSetting && $user->musicSetting->file_path) {
                if (Storage::disk('public')->exists($user->musicSetting->file_path)) {
                    Storage::disk('public')->delete($user->musicSetting->file_path);
                }
                $user->musicSetting()->delete();
            }

            // Delete other related data
            $user->setting()->delete();
            $user->letter()->delete();
            
            // Delete payment proof if exists
            if ($user->payment_proof_path && Storage::disk('public')->exists($user->payment_proof_path)) {
                Storage::disk('public')->delete($user->payment_proof_path);
            }

            // Finally delete the user
            $user->delete();

            return redirect()->route('admin.users')->with('success', 'User and all associated data deleted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete user: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete user. Please try again.');
        }
    }

    // Delete Memory - DELETE /admin/memories/{memory}
    public function deleteMemory(Memory $memory)
    {
        try {
            // Check if memory exists
            if (!$memory) {
                return redirect()->back()->with('error', 'Memory not found.');
            }

            // Delete the image file from storage
            if ($memory->image_path && Storage::disk('public')->exists($memory->image_path)) {
                Storage::disk('public')->delete($memory->image_path);
            }
            
            // Delete thumbnail if exists
            if ($memory->thumbnail_path && Storage::disk('public')->exists($memory->thumbnail_path)) {
                Storage::disk('public')->delete($memory->thumbnail_path);
            }

            // Delete the memory record
            $memory->delete();

            return redirect()->back()->with('success', 'Memory deleted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete memory: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete memory. Please try again.');
        }
    }

    // Delete Album - DELETE /admin/albums/{album}
    public function deleteAlbum(Album $album)
    {
        try {
            // Check if album exists
            if (!$album) {
                return redirect()->back()->with('error', 'Album not found.');
            }

            // Delete all memories and their files
            foreach ($album->memories as $memory) {
                if ($memory->image_path && Storage::disk('public')->exists($memory->image_path)) {
                    Storage::disk('public')->delete($memory->image_path);
                }
                if ($memory->thumbnail_path && Storage::disk('public')->exists($memory->thumbnail_path)) {
                    Storage::disk('public')->delete($memory->thumbnail_path);
                }
                $memory->delete();
            }

            // Delete the album
            $album->delete();

            return redirect()->back()->with('success', 'Album deleted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete album: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete album. Please try again.');
        }
    }

    // Delete Music Setting - DELETE /admin/music-settings/{musicSetting}
    public function deleteMusicSetting(MusicSetting $musicSetting)
    {
        try {
            // Delete the music file
            if (Storage::disk('public')->exists($musicSetting->file_path)) {
                Storage::disk('public')->delete($musicSetting->file_path);
            }

            $musicSetting->delete();

            return redirect()->back()->with('success', 'Music setting deleted successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete music setting: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete music setting. Please try again.');
        }
    }

    // Make user admin - POST /admin/users/{user}/make-admin
    public function makeAdmin(User $user)
    {
        $user->update(['role_as' => 1]);
        return redirect()->back()->with('success', 'User promoted to admin successfully.');
    }

    // Remove admin role - POST /admin/users/{user}/remove-admin
    public function removeAdmin(User $user)
    {
        $user->update(['role_as' => 0]);
        return redirect()->back()->with('success', 'Admin role removed from user.');
    }

    // Store Album - POST /admin/albums (for compatibility)
    public function storeAlbum(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string',
            'description' => 'nullable|string',
            'theme_color' => 'nullable|string',
        ]);

        Album::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . rand(100, 999),
            'icon' => $validated['icon'],
            'description' => $validated['description'],
            'theme_color' => $validated['theme_color'] ?? '#3B82F6',
        ]);

        return redirect()->back()->with('success', 'Album created successfully!');
    }

    // Store Memory - POST /admin/memories (for compatibility)
    public function storeMemory(Request $request)
    {
        $request->validate([
            'album_id' => 'required|exists:albums,id',
            'image' => 'required|image|max:5120', // 5MB limit
            'date_text' => 'required|string',
            'note' => 'nullable|string',
        ]);

        $album = Album::find($request->album_id);
        
        $path = $request->file('image')->store('memories', 'public');

        Memory::create([
            'album_id' => $request->album_id,
            'image_path' => $path,
            'date_text' => $request->date_text,
            'note' => $request->note,
            'rotation' => rand(-5, 5),
        ]);

        return redirect()->back()->with('success', 'Memory added successfully!');
    }

    /**
     * Helper function to format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}