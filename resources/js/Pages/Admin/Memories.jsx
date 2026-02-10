import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function Memories({ memories }) {
    const handleDelete = (memoryId, memoryNote) => {
        if (confirm(`Delete memory "${memoryNote}"? This action cannot be undone.`)) {
            router.delete(route('admin.memories.delete', memoryId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show toast notification or message
                },
                onError: (errors) => {
                    alert('Failed to delete memory. Please try again.');
                }
            });
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">All Memories</h1>
                    <p className="text-gray-600 mt-1">Manage all memory photos in the system</p>
                </div>

                {/* Memories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {memories.data.map((memory) => (
                        <div key={memory.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="h-48 bg-gray-100 overflow-hidden">
                                <img 
                                    src={`/storage/${memory.image_path}`}
                                    alt={memory.note || 'Memory photo'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <p className="font-medium text-gray-800">{memory.date_text}</p>
                                <p className="text-sm text-gray-600 mt-1 truncate">{memory.note || 'No note'}</p>
                                
                                <div className="mt-4 text-sm text-gray-500">
                                    <div className="flex justify-between">
                                        <span>Size: {memory.formatted_size}</span>
                                        <span>{memory.created_at}</span>
                                    </div>
                                    
                                    <div className="mt-2">
                                        <p>Album: <Link href={`/albums/${memory.album.slug}`} className="text-blue-600 hover:underline">
                                            {memory.album.title}
                                        </Link></p>
                                        <p>User: <Link href={route('admin.users.detail', memory.user.id)} className="text-blue-600 hover:underline">
                                            {memory.user.name}
                                        </Link></p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(memory.id, memory.note || memory.date_text)}
                                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {memories.data.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-gray-400">🖼️</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No memories found</h3>
                        <p className="text-gray-500">No memories have been uploaded yet.</p>
                    </div>
                )}

                {/* Pagination */}
                {memories.links && memories.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {memories.from} to {memories.to} of {memories.total} memories
                        </div>
                        <nav className="flex gap-2">
                            {memories.links.map((link, index) => (
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