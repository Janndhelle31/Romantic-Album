import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function Users({ users, filters, total_stats }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDeleteUser = (userId, userName) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This will delete all their albums, memories, and files.`)) {
            router.delete(route('admin.users.delete', userId));
        }
    };

    const togglePaymentStatus = (userId, currentStatus, userName) => {
        const action = currentStatus ? 'mark as unpaid' : 'mark as paid';
        if (confirm(`Are you sure you want to ${action} "${userName}"?`)) {
            router.post(route('admin.users.toggle-payment', userId), {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Success message will be shown from backend flash
                }
            });
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                            <p className="text-gray-600 mt-2">Manage all users and their content</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{total_stats.total_users}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm font-medium">Total Albums</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{total_stats.total_albums}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 text-xl">📁</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 text-sm font-medium">Total Memories</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{total_stats.total_memories}</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 text-xl">🖼️</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium">Music Files</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{total_stats.total_music_files}</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 text-xl">🎵</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-600 text-sm font-medium">Paid Users</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{total_stats.paid_users}</p>
                                </div>
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <span className="text-emerald-600 text-xl">💰</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-600 text-sm font-medium">Unpaid Users</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{total_stats.unpaid_users}</p>
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-orange-600 text-xl">⏳</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors"
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(route('admin.users'));
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Albums</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Memories</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Music File</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                                    <span className="text-purple-600">👤</span>
                                                </div>
                                                <div>
                                                    <Link 
                                                        href={route('admin.users.detail', user.id)}
                                                        className="font-medium text-gray-800 hover:text-purple-600 transition-colors"
                                                    >
                                                        {user.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">{user.email}</p>
                                                    {user.has_share_token && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                            Share Link Active
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePaymentStatus(user.id, user.is_paid, user.name)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    user.is_paid 
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                                } transition-colors`}
                                            >
                                                {user.is_paid ? (
                                                    <>
                                                        <span className="mr-1">✅</span> Paid
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="mr-1">⏳</span> Unpaid
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {user.albums_count} albums
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                {user.memories_count} memories
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.music_setting ? (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-800">{user.music_setting.display_name}</p>
                                                    <p className="text-xs text-gray-500">{user.music_setting.formatted_size}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">No music</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.created_at}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('admin.users.detail', user.id)}
                                                    className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl text-gray-400">👥</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {search ? 'Try a different search term' : 'No users have signed up yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {users.from} to {users.to} of {users.total} users
                        </div>
                        <nav className="flex gap-2">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        link.active
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
}