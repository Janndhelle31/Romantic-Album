import React from 'react';
import { Link } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function MusicSettings({ musicSettings, stats }) {
    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Music Files</h1>
                            <p className="text-gray-600 mt-1">Manage all uploaded music files</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total: {stats.total_files} files</p>
                            <p className="text-lg font-bold text-gray-800">{stats.total_size}</p>
                            <p className="text-xs text-gray-500">Avg: {stats.average_size}</p>
                        </div>
                    </div>
                </div>

                {/* Music Files Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Music File</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {musicSettings.data.map((music) => (
                                    <tr key={music.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-600 text-lg">🎵</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{music.display_name}</p>
                                                    <p className="text-sm text-gray-500">Music file</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                href={route('admin.users.detail', music.user.id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {music.user.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{music.user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-mono text-gray-600 truncate max-w-xs">{music.file_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {music.formatted_size}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {music.created_at}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        // Play preview or download
                                                        window.open(`/storage/${music.file_path}`, '_blank');
                                                    }}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                                                >
                                                    Play
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this music file?')) {
                                                            // Add delete functionality
                                                        }
                                                    }}
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
                    {musicSettings.data.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl text-gray-400">🎵</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No music files found</h3>
                            <p className="text-gray-500">No music files have been uploaded yet.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {musicSettings.links && musicSettings.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {musicSettings.from} to {musicSettings.to} of {musicSettings.total} files
                        </div>
                        <nav className="flex gap-2">
                            {musicSettings.links.map((link, index) => (
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