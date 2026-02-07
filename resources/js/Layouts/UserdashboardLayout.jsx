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
        // Using QR Code Generator API with higher quality for downloading
        const encodedLink = encodeURIComponent(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedLink}&format=png&qzone=2`;
        setQrCodeUrl(qrUrl);
    };

    // Function to save QR code as image (FIXED VERSION)
    const saveQRCode = async () => {
        if (!qrCodeUrl) return;
        
        setDownloading(true);
        try {
            // Fetch the image as blob
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            
            // Create object URL from blob
            const blobUrl = URL.createObjectURL(blob);
            
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = blobUrl;
            
            // Get current date for filename
            const date = new Date();
            const filename = `gf-magic-login-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.png`;
            link.download = filename;
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                setDownloading(false);
                
                // Show success message
                alert('✅ QR code downloaded! Send the image to your GF.');
            }, 100);
            
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('❌ Failed to download QR code. Try copying the link instead.');
            setDownloading(false);
        }
    };

    // Alternative download method for older browsers
    const saveQRCodeAlternative = () => {
        if (!qrCodeUrl) return;
        
        // Open image in new tab for manual save
        const newWindow = window.open(qrCodeUrl, '_blank');
        if (newWindow) {
            setTimeout(() => {
                alert('QR code opened in new tab. Right-click and "Save Image As..." to download.');
            }, 500);
        } else {
            alert('Please allow popups to download the QR code.');
        }
    };

    // Show success message
    useEffect(() => {
        if (flashMessage) {
            console.log(flashMessage);
        }
    }, [flashMessage]);

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
            alert('✅ Magic link copied! Send this to your GF!');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Magic link copied! Send this to your GF!');
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
            group: 'Manage Content',
            items: [
                { name: 'View Gallery', href: safeRoute('dashboard'), icon: '🖼️', mobile: true },
                { name: 'Manage Memories', href: safeRoute('manage.index'), icon: '✍️', mobile: true },
            ]
        },
        {
            group: 'Customization',
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
            <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex flex-col md:flex-row overflow-hidden">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <h2 className="font-serif text-lg text-gray-800">Studio</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 text-xs font-bold uppercase">
                    {isMobileMenuOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {/* --- SIDEBAR --- */}
            <AnimatePresence>
                {(isMobileMenuOpen || (isClient && window.innerWidth >= 768)) && (
                    <motion.aside 
                        initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                        className="fixed md:relative inset-y-0 left-0 z-50 w-72 bg-white md:bg-white/80 backdrop-blur-xl border-r border-pink-100 p-8 flex flex-col"
                    >
                        <div className="hidden md:block mb-10">
                            <span className="text-2xl">✨</span>
                            <h2 className="font-serif text-xl text-gray-800 mt-2">Creator Studio</h2>
                            <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">The Love Archive</p>
                        </div>

                        <nav className="flex-1 space-y-8">
                            {navLinks.map((group) => (
                                <div key={group.group}>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">{group.group}</h3>
                                    <div className="space-y-2">
                                        {group.items.map((link) => (
                                            <Link 
                                                key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${url === link.href ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'hover:bg-pink-50 text-gray-600'}`}
                                            >
                                                <span className="text-xl">{link.icon}</span> 
                                                <span className="font-bold text-sm">{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* --- MAGIC LINK FOR GF --- */}
                            <div className="pt-4">
                                <button 
                                    onClick={handleCopyMagicLink}
                                    disabled={generating}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all group disabled:opacity-50"
                                >
                                    <span className="text-xl group-hover:scale-125 transition-transform">
                                        {generating ? '⏳' : '🔮'}
                                    </span>
                                    <span className="font-bold text-xs uppercase tracking-tighter">
                                        {generating ? 'Generating...' : magicLink ? 'Copy GF Login Link' : 'Generate GF Login Link'}
                                    </span>
                                </button>
                                
                                {/* QR Code Button */}
                                {magicLink && (
                                    <button 
                                        onClick={toggleQRCode}
                                        className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-pink-200 text-pink-500 hover:bg-pink-50 transition-all"
                                    >
                                        <span className="text-xl">📱</span>
                                        <span className="font-bold text-xs uppercase">
                                            {showQR ? 'Hide QR Code' : 'Show QR Code'}
                                        </span>
                                    </button>
                                )}
                                
                                {/* QR Code Display */}
                                {showQR && qrCodeUrl && (
                                    <div className="mt-4 p-4 bg-white rounded-2xl border border-pink-100 shadow-sm text-center">
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="QR Code for Magic Link" 
                                            className="w-40 h-40 mx-auto mb-3"
                                        />
                                        <div className="flex flex-col gap-2 justify-center">
                                            <button 
                                                onClick={saveQRCode}
                                                disabled={downloading}
                                                className="flex items-center justify-center gap-2 py-2 bg-pink-500 text-white text-xs font-bold rounded-lg hover:bg-pink-600 disabled:opacity-50"
                                            >
                                                <span>{downloading ? '⏳' : '💾'}</span>
                                                {downloading ? 'Downloading...' : 'Download QR Code'}
                                            </button>
                                            <button 
                                                onClick={saveQRCodeAlternative}
                                                className="flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200"
                                            >
                                                <span>🖼️</span>
                                                Open QR in New Tab
                                            </button>
                                            <button 
                                                onClick={() => copyToClipboard(magicLink)}
                                                className="flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200"
                                            >
                                                <span>📋</span>
                                                Copy Link Instead
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2">
                                            Download QR and send to GF. She can scan with phone camera.
                                        </p>
                                    </div>
                                )}
                                
                                {/* Show success message if available */}
                                {flashMessage && (
                                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                        <p className="text-[10px] text-green-600 font-bold">
                                            ✓ {flashMessage}
                                        </p>
                                    </div>
                                )}
                                
                                <p className="text-[9px] text-gray-400 mt-2 px-2">
                                    Send this to your GF! She will be auto-logged into your account.
                                </p>
                                
                                {magicLink && !showQR && (
                                    <div className="mt-3 p-2 bg-pink-50 rounded-lg">
                                        <p className="text-[8px] text-gray-500 break-all">
                                            {magicLink}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </nav>

                        <div className="mt-auto pt-6 border-t border-pink-50">
                            <div className="mb-4 px-3">
                                <p className="text-xs text-gray-600 font-bold">{user?.name || 'You'}</p>
                                <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
                            </div>
                            <Link href={safeRoute('logout')} method="post" as="button" className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest">
                                🚪 Sign Out
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 h-screen overflow-y-auto relative">
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 p-4 md:p-12 pb-32 md:pb-12 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

            {/* --- MOBILE BOTTOM NAV --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pink-100 px-6 py-3 flex justify-between items-center z-40 pb-8">
                {mobileBottomLinks.map((link) => {
                    const isActive = url === link.href;
                    return (
                        <Link key={link.name} href={link.href} className={`flex flex-col items-center gap-1 ${isActive ? 'text-pink-500' : 'text-gray-400'}`}>
                            <span className={`text-2xl ${isActive ? 'scale-110' : 'opacity-70'}`}>{link.icon}</span>
                            <span className={`text-[10px] font-bold uppercase ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                {link.name.split(' ')[1] || link.name}
                            </span>
                        </Link>
                    );
                })}
                {/* Mobile Magic Link Button */}
                <button onClick={handleCopyMagicLink} className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="text-2xl">{generating ? '⏳' : '🔮'}</span>
                    <span className="text-[10px] font-bold uppercase">GF Login</span>
                </button>
                {/* Mobile QR Code Button */}
                {magicLink && (
                    <button onClick={toggleQRCode} className="flex flex-col items-center gap-1 text-gray-400">
                        <span className="text-2xl">{showQR ? '📱' : '📲'}</span>
                        <span className="text-[10px] font-bold uppercase">QR</span>
                    </button>
                )}
            </div>

            {/* --- QR CODE MODAL FOR MOBILE --- */}
            {showQR && qrCodeUrl && (
                <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-sm w-full"
                    >
                        <div className="text-center">
                            <h3 className="font-serif text-xl text-gray-800 mb-4">Scan QR Code</h3>
                            <img 
                                src={qrCodeUrl} 
                                alt="QR Code" 
                                className="w-56 h-56 mx-auto mb-4"
                            />
                            <div className="flex flex-col gap-3 mb-4">
                                <button 
                                    onClick={saveQRCode}
                                    disabled={downloading}
                                    className="py-3 bg-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <span>{downloading ? '⏳' : '💾'}</span>
                                    {downloading ? 'Downloading...' : 'Download QR Code'}
                                </button>
                                <button 
                                    onClick={saveQRCodeAlternative}
                                    className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <span>🖼️</span>
                                    Open in New Tab (Manual Save)
                                </button>
                                <button 
                                    onClick={() => copyToClipboard(magicLink)}
                                    className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <span>📋</span>
                                    Copy Link Instead
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Download and send to your GF
                            </p>
                            <p className="text-xs text-gray-400 mb-4">
                                She can scan with phone camera
                            </p>
                            <button 
                                onClick={() => setShowQR(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
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