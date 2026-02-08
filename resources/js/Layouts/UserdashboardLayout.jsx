import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserdashboardLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [magicLink, setMagicLink] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const { url, props } = usePage();
    
    const user = props.auth?.user;
    
    // Get flash message and magic link from Inertia
    const flashMessage = props.flash?.success;
    const flashMagicLink = props.flash?.magic_link;

    // Update magic link when flash data arrives
    useEffect(() => {
        if (flashMagicLink) {
            setMagicLink(flashMagicLink);
            copyToClipboard(flashMagicLink);
            // Generate QR code for the magic link
            generateQRCode(flashMagicLink);
        }
    }, [flashMagicLink]);

    // Generate QR code URL with higher quality for saving
    const generateQRCode = (link) => {
        const encodedLink = encodeURIComponent(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedLink}&format=png&qzone=2`;
        setQrCodeUrl(qrUrl);
    };

    // Function to save QR code as image
    const saveQRCode = async () => {
        if (!qrCodeUrl) return;
        
        setDownloading(true);
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            
            const date = new Date();
            const filename = `magic-login-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.png`;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                setDownloading(false);
                alert('✅ QR code downloaded! Send the image to your partner.');
            }, 100);
            
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('❌ Failed to download QR code. Try copying the link instead.');
            setDownloading(false);
        }
    };

    // Alternative download method
    const saveQRCodeAlternative = () => {
        if (!qrCodeUrl) return;
        
        const newWindow = window.open(qrCodeUrl, '_blank');
        if (newWindow) {
            setTimeout(() => {
                alert('QR code opened in new tab. Right-click and "Save Image As..." to download.');
            }, 500);
        } else {
            alert('Please allow popups to download the QR code.');
        }
    };

    const generateMagicLink = async () => {
        setGenerating(true);
        try {
            await router.post('/generate-magic-login', {}, {
                preserveScroll: true,
                preserveState: true,
            });
        } catch (error) {
            alert('Failed to generate magic link');
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('✅ Magic link copied! Send this to your partner!');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Magic link copied! Send this to your partner!');
        }
    };

    const handleCopyMagicLink = async () => {
        if (!magicLink) {
            await generateMagicLink();
            return;
        }
        await copyToClipboard(magicLink);
    };

    const toggleQRCode = () => {
        if (!magicLink) {
            alert('Generate a magic link first!');
            return;
        }
        setShowQR(!showQR);
    };

    const safeRoute = (routeName, fallback = '/') => {
        try {
            return route(routeName);
        } catch (error) {
            return fallback;
        }
    };

    const navLinks = [
        { 
            group: 'Content',
            items: [
                { name: 'View Gallery', href: safeRoute('dashboard'), icon: '🖼️', mobile: true },
                { name: 'Manage Memories', href: safeRoute('manage.index'), icon: '✏️', mobile: true },
            ]
        },
        {
            group: 'Customize',
            items: [
                { name: 'Page Design', href: safeRoute('manage.design'), icon: '🎨', mobile: true }, 
            ]
        }
    ];

    const mobileBottomLinks = navLinks.flatMap(group => group.items).filter(item => item.mobile);

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!props.auth && isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✨</span>
                    </div>
                    <h2 className="font-semibold text-gray-800">Studio</h2>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <AnimatePresence>
                {(isMobileMenuOpen || (isClient && window.innerWidth >= 768)) && (
                    <motion.aside 
                        initial={{ x: -300 }} 
                        animate={{ x: 0 }} 
                        exit={{ x: -300 }}
                        className="fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col"
                    >
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xl">✨</span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">Memory Studio</h2>
                                    <p className="text-xs text-gray-500">Create & Manage</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-6">
                            {navLinks.map((group) => (
                                <div key={group.group}>
                                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                        {group.group}
                                    </h3>
                                    <div className="space-y-1">
                                        {group.items.map((link) => (
                                            <Link 
                                                key={link.name} 
                                                href={link.href} 
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                                    url === link.href 
                                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                                }`}
                                            >
                                                <span className="text-lg">{link.icon}</span> 
                                                <span className="font-medium text-sm">{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* --- SHARE ACCESS --- */}
                            <div className="pt-6 border-t border-gray-100">
                                <button 
                                    onClick={handleCopyMagicLink}
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 mb-3"
                                >
                                    <span>{generating ? '⏳' : '🔗'}</span>
                                    <span className="font-medium text-sm">
                                        {generating ? 'Generating...' : 'Share Access'}
                                    </span>
                                </button>
                                
                                {/* QR Code Button */}
                                {magicLink && (
                                    <button 
                                        onClick={toggleQRCode}
                                        className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-lg">📱</span>
                                        <span className="font-medium text-sm">
                                            {showQR ? 'Hide QR' : 'Show QR Code'}
                                        </span>
                                    </button>
                                )}
                                
                                {/* QR Code Display */}
                                {showQR && qrCodeUrl && (
                                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg text-center">
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="QR Code" 
                                            className="w-40 h-40 mx-auto mb-4"
                                        />
                                        <div className="space-y-2">
                                            <button 
                                                onClick={saveQRCode}
                                                disabled={downloading}
                                                className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 disabled:opacity-50"
                                            >
                                                {downloading ? 'Downloading...' : 'Download QR Code'}
                                            </button>
                                            <button 
                                                onClick={saveQRCodeAlternative}
                                                className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200"
                                            >
                                                Open in New Tab
                                            </button>
                                            <button 
                                                onClick={() => copyToClipboard(magicLink)}
                                                className="w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200"
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Flash Message */}
                                {flashMessage && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 text-sm flex items-center gap-2">
                                            <span>✅</span>
                                            <span>{flashMessage}</span>
                                        </p>
                                    </div>
                                )}
                                
                                {/* Magic Link Preview */}
                                {magicLink && !showQR && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-blue-700 text-xs truncate">{magicLink}</p>
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* User Profile & Logout */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600">👤</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{user?.name || 'You'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                </div>
                            </div>
                            <Link 
                                href={safeRoute('logout')} 
                                method="post" 
                                as="button"
                                className="w-full flex items-center gap-2 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <span>🚪</span>
                                <span>Sign Out</span>
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 h-screen overflow-y-auto">
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {/* Flash Message (Desktop) */}
                    {flashMessage && !isMobileMenuOpen && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm flex items-center gap-2">
                                <span>✅</span>
                                <span>{flashMessage}</span>
                            </p>
                        </div>
                    )}
                    
                    {children}
                </div>
            </main>

            {/* --- MOBILE BOTTOM NAV --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center z-40">
                {mobileBottomLinks.map((link) => {
                    const isActive = url === link.href;
                    return (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className={`flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <span className={`text-xl ${isActive ? 'scale-110' : ''}`}>{link.icon}</span>
                            <span className="text-xs font-medium">
                                {link.name.split(' ')[0]}
                            </span>
                        </Link>
                    );
                })}
                
                {/* Mobile Magic Link Button */}
                <button 
                    onClick={handleCopyMagicLink} 
                    className={`flex flex-col items-center gap-1 ${magicLink ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <span className="text-xl">{generating ? '⏳' : '🔗'}</span>
                    <span className="text-xs font-medium">Share</span>
                </button>
                
                {/* Mobile QR Code Button */}
                {magicLink && (
                    <button 
                        onClick={toggleQRCode} 
                        className="flex flex-col items-center gap-1 text-gray-500"
                    >
                        <span className="text-xl">{showQR ? '📱' : '🔲'}</span>
                        <span className="text-xs font-medium">QR</span>
                    </button>
                )}
            </div>

            {/* --- QR CODE MODAL FOR MOBILE --- */}
            {showQR && qrCodeUrl && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-6 max-w-sm w-full"
                    >
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-800 mb-4">QR Code</h3>
                            <img 
                                src={qrCodeUrl} 
                                alt="QR Code" 
                                className="w-48 h-48 mx-auto mb-4"
                            />
                            <div className="space-y-3 mb-4">
                                <button 
                                    onClick={saveQRCode}
                                    disabled={downloading}
                                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
                                >
                                    {downloading ? 'Downloading...' : 'Download QR Code'}
                                </button>
                                <button 
                                    onClick={saveQRCodeAlternative}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                                >
                                    Open in New Tab
                                </button>
                                <button 
                                    onClick={() => copyToClipboard(magicLink)}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                                >
                                    Copy Link Instead
                                </button>
                            </div>
                            <button 
                                onClick={() => setShowQR(false)}
                                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}