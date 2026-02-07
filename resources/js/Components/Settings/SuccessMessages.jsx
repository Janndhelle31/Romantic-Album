import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessMessages({ profileForm, passwordForm }) {
    return (
        <AnimatePresence>
            {profileForm.recentlySuccessful && (
                <motion.div
                    key="profile-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                >
                    Profile updated successfully! ✅
                </motion.div>
            )}
            {passwordForm.recentlySuccessful && (
                <motion.div
                    key="password-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                >
                    Password updated successfully! 🔐
                </motion.div>
            )}
        </AnimatePresence>
    );
}