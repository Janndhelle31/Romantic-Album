import React from 'react';
import { Link } from '@inertiajs/react'; // Add this import
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout'; // Make sure this is the correct path

export default function Dashboard({ stats, recent_users, recent_memories, recent_albums }) {
    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">System statistics and recent activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_users}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">👥</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Albums</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_albums}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">📁</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Memories</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_memories}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">🖼️</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Music Files</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_music_files}</p>
                                <p className="text-xs text-gray-500">{stats.total_music_size}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">🎵</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-800">Recent Users</h2>
                            <Link 
                                href={route('admin.users')}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                View All
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recent_users?.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{user.albums_count} albums</p>
                                        <p className="text-xs text-gray-500">{user.memories_count} memories</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Albums */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-800">Recent Albums</h2>
                            <Link 
                                href={route('admin.albums')}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                View All
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recent_albums?.map((album) => (
                                <div key={album.id} className="p-2 hover:bg-gray-50 rounded">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{album.icon}</span>
                                        <p className="font-medium text-gray-800">{album.title}</p>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>By {album.user_name}</span>
                                        <span>{album.memories_count} memories</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Memories */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-800">Recent Memories</h2>
                            <Link 
                                href={route('admin.memories')}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                View All
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recent_memories?.map((memory) => (
                                <div key={memory.id} className="p-2 hover:bg-gray-50 rounded">
                                    <p className="font-medium text-gray-800">{memory.date_text}</p>
                                    <p className="text-sm text-gray-600 truncate">{memory.note}</p>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Album: {memory.album_title}</span>
                                        <span>By {memory.user_name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}