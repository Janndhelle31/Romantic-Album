import React from 'react';
import { motion } from 'framer-motion';

export default function ProfileTab({ profileForm, updateProfile }) {
    return (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-2xl">
                        <span className="text-2xl">👤</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                        <p className="text-gray-600">Update your personal details</p>
                    </div>
                </div>

                <form onSubmit={updateProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profileForm.data.name}
                            onChange={e => profileForm.setData('name', e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-xl p-4 text-base focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all shadow-sm"
                            placeholder="Your name"
                            required
                        />
                        {profileForm.errors.name && (
                            <p className="mt-2 text-sm text-red-600">{profileForm.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profileForm.data.email}
                            onChange={e => profileForm.setData('email', e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-xl p-4 text-base focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all shadow-sm"
                            placeholder="you@example.com"
                            required
                        />
                        {profileForm.errors.email && (
                            <p className="mt-2 text-sm text-red-600">{profileForm.errors.email}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
                        >
                            {profileForm.processing ? (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Changes
                                    <span className="text-xl">💾</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}