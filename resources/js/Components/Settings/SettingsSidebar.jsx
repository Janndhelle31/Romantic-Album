import React from 'react';

export default function SettingsSidebar({ activeTab, setActiveTab, auth }) {
    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'password', label: 'Security', icon: '🔒' },
        { id: 'account', label: 'Account', icon: '⚠️' },
    ];

    const getTabClasses = (tabId) => {
        const baseClasses = 'w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3';
        
        if (activeTab === tabId) {
            if (tabId === 'profile') return `${baseClasses} bg-pink-500 text-white shadow-lg shadow-pink-200`;
            if (tabId === 'password') return `${baseClasses} bg-blue-500 text-white shadow-lg shadow-blue-200`;
            if (tabId === 'account') return `${baseClasses} bg-red-500 text-white shadow-lg shadow-red-200`;
        }
        
        return `${baseClasses} text-gray-600 hover:bg-gray-50`;
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <nav className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={getTabClasses(tab.id)}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span className="font-bold">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Account Info</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Member since:</span>
                            <span className="font-bold text-sm">{auth?.user?.created_at}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">User ID:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{auth?.user?.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}