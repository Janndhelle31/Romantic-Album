import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminDashboardLayout from '@/Layouts/AdminDashboardLayout';

export default function Settings({ site_stats }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: 'Memory Album',
        site_description: 'Create beautiful memory albums',
        maintenance_mode: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
                    <p className="text-gray-600 mt-1">System configuration and settings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{site_stats.total_users}</p>
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
                                <p className="text-2xl font-bold text-gray-800 mt-1">{site_stats.total_albums}</p>
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
                                <p className="text-2xl font-bold text-gray-800 mt-1">{site_stats.total_memories}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">🖼️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">System Settings</h2>
                    
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                {errors.site_name && <p className="text-red-500 text-sm mt-1">{errors.site_name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Description
                                </label>
                                <textarea
                                    value={data.site_description}
                                    onChange={e => setData('site_description', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    rows="3"
                                />
                                {errors.site_description && <p className="text-red-500 text-sm mt-1">{errors.site_description}</p>}
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="maintenance_mode"
                                    checked={data.maintenance_mode}
                                    onChange={e => setData('maintenance_mode', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="maintenance_mode" className="ml-2 text-sm text-gray-700">
                                    Maintenance Mode
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-red-800 mb-4">Danger Zone</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-red-700 mb-2">Clear all system caches</p>
                            <button
                                onClick={() => {
                                    if (confirm('Clear all caches? This may temporarily slow down the system.')) {
                                        // Add cache clear functionality
                                    }
                                }}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                            >
                                Clear Cache
                            </button>
                        </div>
                        
                        <div>
                            <p className="text-red-700 mb-2">Reset all user statistics</p>
                            <button
                                onClick={() => {
                                    if (confirm('This will reset all user statistics. Continue?')) {
                                        // Add reset functionality
                                    }
                                }}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                            >
                                Reset Statistics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}