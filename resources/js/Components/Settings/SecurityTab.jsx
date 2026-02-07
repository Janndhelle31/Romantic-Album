import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Simple Eye and Eye-Off Icons
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.789 0 8.601 3.049 9.964 6.678.038.122.038.256 0 .378C20.601 15.951 16.79 19 12 19c-4.789 0-8.601-3.049-9.964-6.678z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);

export default function SecurityTab({ passwordForm, updatePassword }) {
    // Local state to toggle visibility for each field
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-2xl">
                        <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
                        <p className="text-gray-600">Update your password and security preferences</p>
                    </div>
                </div>

                <form onSubmit={updatePassword} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={passwordForm.data.current_password}
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                                className="w-full border border-gray-300 bg-white rounded-xl p-4 pr-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm"
                                placeholder="Enter current password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {passwordForm.errors.current_password && (
                            <p className="mt-2 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={passwordForm.data.password}
                                onChange={e => passwordForm.setData('password', e.target.value)}
                                className="w-full border border-gray-300 bg-white rounded-xl p-4 pr-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showNew ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {passwordForm.errors.password && (
                            <p className="mt-2 text-sm text-red-600">{passwordForm.errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={passwordForm.data.password_confirmation}
                                onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full border border-gray-300 bg-white rounded-xl p-4 pr-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all shadow-sm"
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
                        >
                            {passwordForm.processing ? (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    Update Password
                                    <span className="text-xl">🔐</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Security Tips</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Use a strong password with at least 8 characters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Include numbers, symbols, and both uppercase/lowercase letters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Avoid using personal information in your password</span>
                        </li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}