import React from 'react';
import { motion } from 'framer-motion';

export default function AccountTab({ 
    showDeleteConfirm, 
    setShowDeleteConfirm, 
    deleteForm, 
    setDeleteForm, 
    handleDeleteAccount 
}) {
    return (
        <motion.div
            key="account"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-2xl">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Account Management</h2>
                        <p className="text-gray-600">Manage your account preferences</p>
                    </div>
                </div>

                <div className="mb-10 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                    <h3 className="text-xl font-bold text-amber-800 mb-3">Export Your Data</h3>
                    <p className="text-amber-700 mb-4">
                        Download all your memories, letters, and settings in a single archive.
                    </p>
                    <button
                        type="button"
                        className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
                    >
                        <span>📥</span>
                        Export All Data
                    </button>
                </div>

                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-3">Delete Account</h3>
                    <p className="text-red-700 mb-4">
                        This action cannot be undone. All your data including memories, letters, and settings will be permanently deleted.
                    </p>
                    
                    {!showDeleteConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <span>🗑️</span>
                            Delete My Account
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-red-700 mb-2">
                                    Confirm your password to delete account:
                                </label>
                                <input
                                    type="password"
                                    value={deleteForm.password}
                                    onChange={e => setDeleteForm({ password: e.target.value })}
                                    className="w-full border border-red-300 bg-white rounded-xl p-4 text-base focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all shadow-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <span>⚠️</span>
                                    Confirm Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteForm({ password: '' });
                                    }}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <span className="text-blue-500 text-xl">ℹ️</span>
                        <div>
                            <h4 className="font-bold text-blue-700 mb-1">Need Help?</h4>
                            <p className="text-blue-600 text-sm">
                                If you're having issues with your account, please contact support before taking any irreversible actions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}