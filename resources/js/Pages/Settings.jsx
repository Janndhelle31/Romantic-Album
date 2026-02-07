import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/UserdashboardLayout';
import SettingsSidebar from '@/Components/Settings/SettingsSidebar';
import ProfileTab from '@/Components/Settings/ProfileTab';
import SecurityTab from '@/Components/Settings/SecurityTab';
import AccountTab from '@/Components/Settings/AccountTab';
import SuccessMessages from '@/Components/Settings/SuccessMessages';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings({ auth, profile }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteForm, setDeleteForm] = useState({ password: '' });

    const profileForm = useForm({
        name: profile?.name || '',
        email: profile?.email || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.put(route('settings.updateProfile'), {
            preserveScroll: true,
            onSuccess: () => {
                profileForm.reset();
            },
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('settings.updatePassword'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        router.delete(route('settings.deleteAccount'), {
            data: { password: deleteForm.password },
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteConfirm(false);
                setDeleteForm({ password: '' });
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Head title="Account Settings" />
            
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-3">Account Settings</h1>
                <p className="text-gray-600">Manage your profile, security, and account preferences</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <SettingsSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    auth={auth}
                />

                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <ProfileTab 
                                key="profile"
                                profileForm={profileForm}
                                updateProfile={updateProfile}
                            />
                        )}
                        
                        {activeTab === 'password' && (
                            <SecurityTab 
                                key="security"
                                passwordForm={passwordForm}
                                updatePassword={updatePassword}
                            />
                        )}
                        
                        {activeTab === 'account' && (
                            <AccountTab 
                                key="account"
                                showDeleteConfirm={showDeleteConfirm}
                                setShowDeleteConfirm={setShowDeleteConfirm}
                                deleteForm={deleteForm}
                                setDeleteForm={setDeleteForm}
                                handleDeleteAccount={handleDeleteAccount}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <SuccessMessages 
                profileForm={profileForm}
                passwordForm={passwordForm}
            />
        </div>
    );
}

Settings.layout = page => <DashboardLayout children={page} />;