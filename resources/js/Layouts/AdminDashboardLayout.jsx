import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminDashboardLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { url, props } = usePage();
    
    const user = props.auth?.user;
    const flashMessage = props.flash?.success || props.flash?.message;

    const navLinks = [
        { 
            group: 'Dashboard',
            items: [
                { name: 'Overview', href: route('admin.dashboard'), icon: '📊', mobile: true },
            ]
        },
        { 
            group: 'User Management',
            items: [
                { name: 'All Users', href: route('admin.users'), icon: '👥', mobile: true },
                { name: 'User Stats', href: '#', icon: '📈', mobile: false },
            ]
        },
        { 
            group: 'Content',
            items: [
                { name: 'Albums', href: route('admin.albums'), icon: '📁', mobile: true },
                { name: 'Memories', href: route('admin.memories'), icon: '🖼️', mobile: true },
                { name: 'Music Files', href: route('admin.music-settings'), icon: '🎵', mobile: true },
            ]
        },
        {
            group: 'System',
            items: [
                { name: 'Settings', href: route('admin.settings'), icon: '⚙️', mobile: true },
            ]
        }
    ];

    const mobileBottomLinks = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: '📊' },
        { name: 'Users', href: route('admin.users'), icon: '👥' },
        { name: 'Albums', href: route('admin.albums'), icon: '📁' },
        { name: 'Memories', href: route('admin.memories'), icon: '🖼️' },
        { name: 'Menu', href: '#', icon: '☰', action: () => setIsMobileMenuOpen(true) },
    ];

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!props.auth && isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            
            {/* Mobile Top Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">A</span>
                    </div>
                    <h2 className="font-bold text-gray-800">Admin</h2>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar */}
            {(isMobileMenuOpen || (isClient && window.innerWidth >= 768)) && (
                <aside className="fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
                    {/* Logo & Brand */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl">A</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-gray-800">Admin Panel</h1>
                                <p className="text-xs text-gray-500">System Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {navLinks.map((group) => (
                            <div key={group.group}>
                                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
                                    {group.group}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.map((link) => (
                                        <Link 
                                            key={link.name} 
                                            href={link.href} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                                url === link.href 
                                                    ? 'bg-gray-100 text-gray-900 font-medium' 
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                            }`}
                                        >
                                            <span className="text-lg">{link.icon}</span> 
                                            <span>{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* User Profile & Actions */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600">👤</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <Link 
                                href={route('dashboard')} 
                                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg text-sm"
                            >
                                <span>←</span>
                                <span>User Dashboard</span>
                            </Link>
                            
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="w-full flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>
                </aside>
            )}

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {/* Flash Message */}
                    {flashMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm">{flashMessage}</p>
                        </div>
                    )}
                    
                    {/* Page Content */}
                    <div className="bg-white rounded-lg border border-gray-200 min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center">
                {mobileBottomLinks.map((link) => {
                    const isActive = url === link.href;
                    
                    if (link.action) {
                        return (
                            <button
                                key={link.name}
                                onClick={link.action}
                                className={`flex flex-col items-center gap-1 p-2 ${isMobileMenuOpen ? 'text-gray-900' : 'text-gray-600'}`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span className="text-xs">
                                    {link.name}
                                </span>
                            </button>
                        );
                    }
                    
                    return (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className="text-xs">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}