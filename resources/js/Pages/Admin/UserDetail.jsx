import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function UserDetail({ user, stats, albums, recent_memories }) {
    const handleDeleteUser = () => {
        if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            router.delete(route('admin.users.delete', user.id));
        }
    };

    const togglePaymentStatus = () => {
        const newStatus = user.is_paid ? 0 : 1;
        const action = newStatus === 1 ? 'activate' : 'deactivate';
        
        if (confirm(`Are you sure you want to ${action} payment status for "${user.name}"?`)) {
            router.post(route('admin.users.toggle-payment', user.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success message will be handled by flash
                }
            });
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl text-purple-600">👤</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.is_paid 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.is_paid ? '✅ Paid' : '⏳ Unpaid'}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        Joined: {user.created_at}
                                    </span>
                                    {user.email_verified_at && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            Email Verified
                                        </span>
                                    )}
                                    {user.share_token && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            Has Share Link
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            href={route('admin.users')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Back to Users
                        </Link>
                        <button
                            onClick={togglePaymentStatus}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                user.is_paid 
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {user.is_paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                        >
                            Delete User
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Albums</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.albums_count}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-blue-600 text-2xl">📁</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Memories</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.memories_count}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <span className="text-purple-600 text-2xl">🖼️</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Storage Used</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_storage}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <span className="text-green-600 text-2xl">💾</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-600 text-sm font-medium">Payment Status</p>
                                <p className={`text-2xl font-bold mt-2 ${
                                    user.is_paid ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {user.is_paid ? 'PAID' : 'UNPAID'}
                                </p>
                                <button
                                    onClick={togglePaymentStatus}
                                    className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                                >
                                    Click to toggle
                                </button>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                <span className="text-pink-600 text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Albums Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Albums ({albums.length})</h2>
                            <Link 
                                href={route('admin.albums') + `?user=${user.id}`}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {albums.length > 0 ? (
                                albums.map((album) => (
                                    <div key={album.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: album.theme_color + '20' }}>
                                                    <span className="text-xl" style={{ color: album.theme_color }}>{album.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{album.title}</h3>
                                                    <p className="text-sm text-gray-500">{album.memories_count} memories • Created {album.created_at}</p>
                                                </div>
                                            </div>
                                            <Link 
                                                href={route('albums.show', album.slug)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                                                target="_blank"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl text-gray-400">📁</span>
                                    </div>
                                    <p className="text-gray-500">No albums created yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Memories Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Recent Memories</h2>
                            <Link 
                                href={route('admin.memories') + `?user=${user.id}`}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                                View All →
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recent_memories.length > 0 ? (
                                recent_memories.map((memory) => (
                                    <div key={memory.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-start gap-3">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={`/storage/${memory.image_path}`}
                                                    alt={memory.note}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{memory.date_text}</p>
                                                        <p className="text-sm text-gray-500 truncate">{memory.note || 'No note'}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{memory.formatted_size}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">
                                                        Album: <span className="font-medium">{memory.album_title}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">Added {memory.created_at}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl text-gray-400">🖼️</span>
                                    </div>
                                    <p className="text-gray-500">No memories uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Information */}
                <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Account Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-400">User ID</label>
                                    <p className="font-mono text-sm text-gray-800">{user.id}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Payment Status</label>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            user.is_paid 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.is_paid ? 'Paid (₱250)' : 'Unpaid'}
                                        </span>
                                        <button
                                            onClick={togglePaymentStatus}
                                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                                        >
                                            Toggle
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Theme Preference</label>
                                    <p className="text-sm text-gray-800">{user.theme || 'Default'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Share Token</label>
                                    <p className="font-mono text-sm text-gray-800 break-all">{user.share_token || 'Not generated'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Info</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-400">Email Verified</label>
                                    <p className="text-sm text-gray-800">{user.email_verified_at || 'Not verified'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Has Custom Settings</label>
                                    <p className="text-sm text-gray-800">{stats.has_setting ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Has Letter</label>
                                    <p className="text-sm text-gray-800">{stats.has_letter ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">Payment Reference</label>
                                    <p className="text-sm text-gray-800">{user.payment_reference || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}