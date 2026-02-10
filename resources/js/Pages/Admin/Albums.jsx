import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function Albums({ albums }) {
    const handleDeleteAlbum = (albumId, albumTitle) => {
        if (confirm(`Delete album "${albumTitle}" and all its memories? This action cannot be undone.`)) {
            router.delete(route('admin.albums.delete', albumId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show success message or reload
                },
                onError: (errors) => {
                    alert('Failed to delete album. Please try again.');
                }
            });
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">All Albums</h1>
                    <p className="text-gray-600 mt-1">Manage all albums in the system</p>
                </div>

                {/* Albums Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memories</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {albums.data.map((album) => (
                                    <tr key={album.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                                                     style={{ backgroundColor: album.theme_color + '20' }}>
                                                    <span style={{ color: album.theme_color }}>{album.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{album.title}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">{album.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                href={route('admin.users.detail', album.user.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {album.user.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{album.user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {album.memories_count} memories
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {album.total_size}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {album.created_at}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/albums/${album.slug}`}
                                                    target="_blank"
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteAlbum(album.id, album.title)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
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
                    {albums.data.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl text-gray-400">📁</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
                            <p className="text-gray-500">No albums have been created yet.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {albums.links && albums.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {albums.from} to {albums.to} of {albums.total} albums
                        </div>
                        <nav className="flex gap-2">
                            {albums.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
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