import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/Layouts/UserdashboardLayout';

export default function ShareAccess() {
    const { props } = usePage();
    const [magicLink, setMagicLink] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [savingQR, setSavingQR] = useState(false);
    const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(false);
    
    const user = props.auth?.user;
    const hasExistingLink = !!user?.magic_link;
    const existingMagicLink = user?.magic_link || '';
    const existingQRCode = user?.qr_code_url || '';
    
    const flashMessage = props.flash?.success;
    const flashMagicLink = props.flash?.magic_link;
    const wasRegenerated = props.flash?.was_regenerated;

    // Generate QR code from link
    const generateQRCode = (link) => {
        if (!link) return;
        const encodedLink = encodeURIComponent(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedLink}&format=png&qzone=2`;
        setQrCodeUrl(qrUrl);
        setShowQR(true);
    };

    // Initialize with existing data
    useEffect(() => {
        if (existingMagicLink) {
            setMagicLink(existingMagicLink);
            if (existingQRCode) {
                setQrCodeUrl(existingQRCode);
                setShowQR(true);
            } else {
                generateQRCode(existingMagicLink);
            }
        }
    }, [existingMagicLink, existingQRCode]);

    // Handle flash messages
    useEffect(() => {
        if (flashMagicLink) {
            setMagicLink(flashMagicLink);
            generateQRCode(flashMagicLink);
            setActiveTab('overview');
            
            if (hasExistingLink || wasRegenerated) {
                setShowRegenerateWarning(true);
                setTimeout(() => setShowRegenerateWarning(false), 5000);
            }
        }
    }, [flashMagicLink, hasExistingLink, wasRegenerated]);

    // Auto-hide copy notification
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const saveQRCodeToAccount = async () => {
        if (!qrCodeUrl || !magicLink) return;
        setSavingQR(true);
        try {
            await router.post('/save-qr-code', {
                magic_link: magicLink,
                qr_code_url: qrCodeUrl
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('✅ QR code saved to account!');
                },
                onError: () => {
                    alert('❌ Failed to save QR code. Please try again.');
                }
            });
        } finally {
            setSavingQR(false);
        }
    };

    const saveQRCode = async () => {
        if (!qrCodeUrl) return;
        setDownloading(true);
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `magic-login-${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            
            if (!existingQRCode) {
                setTimeout(() => {
                    if (confirm('✅ Downloaded! Would you like to save this QR code to your account for easy access later?')) {
                        saveQRCodeToAccount();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('❌ Failed to download QR code. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const generateMagicLink = async () => {
        if (hasExistingLink) {
            if (!confirm('⚠️ WARNING: This will immediately invalidate your old link. Your partner will need a new one. Continue?')) {
                return;
            }
        }
        setGenerating(true);
        router.post('/generate-magic-login', {}, {
            onFinish: () => setGenerating(false),
            onError: () => {
                alert('❌ Failed to generate magic link. Please try again.');
            }
        });
    };

    const handleCopyMagicLink = async () => {
        if (!magicLink) {
            alert('Generate a link first.');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(magicLink);
            setCopied(true);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = magicLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
        }
    };

    const shareViaWhatsApp = () => {
        if (!magicLink) {
            alert('Generate a link first.');
            return;
        }
        const text = encodeURIComponent(`Here's our special memory gallery! ✨\n\n${magicLink}\n\nCan't wait to share our memories with you! 💕`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareViaMessenger = () => {
        if (!magicLink) {
            alert('Generate a link first.');
            return;
        }
        // Facebook Messenger share URL
        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(magicLink)}&app_id=YOUR_FB_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin)}`, '_blank');
    };

    const shareViaEmail = () => {
        if (!magicLink) {
            alert('Generate a link first.');
            return;
        }
        const subject = encodeURIComponent('Our Memory Gallery Access');
        const body = encodeURIComponent(`Hi love! 💕\n\nHere's the link to our special memory gallery:\n\n${magicLink}\n\nI can't wait for you to see all our beautiful memories together! ✨\n\nWith love,\n${user?.name || 'Your partner'}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <DashboardLayout>
            <Head title="Share Access" />
            

            
            {/* Copy Success Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
                    >
                        <span>✅</span>
                        <span>Magic link copied to clipboard!</span>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Regenerate Warning Toast */}
            <AnimatePresence>
                {showRegenerateWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-bold mb-1">Previous Link Revoked!</p>
                                <p className="text-sm opacity-90">
                                    The old magic link is no longer valid. Your partner must use this new one.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowRegenerateWarning(false)}
                                className="text-white hover:text-yellow-100"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* FULL SCREEN QR MODAL */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6"
                    >
                        <button 
                            onClick={() => setIsFullScreen(false)}
                            className="absolute top-8 right-8 text-white text-4xl p-4 hover:scale-110 transition-transform hover:text-gray-300"
                            aria-label="Close full screen"
                        >
                            ✕
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full"
                        >
                            <h2 className="text-black text-xl font-bold mb-6">Scan to Access Gallery</h2>
                            {qrCodeUrl ? (
                                <img 
                                    src={qrCodeUrl} 
                                    alt="QR Code" 
                                    className="w-full aspect-square mb-6 rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='100' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3EQR Code Error%3C/text%3E%3C/svg%3E";
                                    }}
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-gray-500">Loading QR Code...</span>
                                </div>
                            )}
                            <p className="text-gray-500 text-sm text-center">
                                Point your partner's camera at this screen to instantly log them in.
                            </p>
                        </motion.div>
                        
                        <button 
                            onClick={() => setIsFullScreen(false)}
                            className="mt-8 px-8 py-3 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                        >
                            Close Full Screen
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Share Access</h1>
                        <p className="text-gray-600 mt-1">Generate secure access for your partner</p>
                    </div>
                    
                    <button
                        onClick={generateMagicLink}
                        disabled={generating}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        <span>{generating ? '⏳' : '🔗'}</span>
                        <span className="font-medium">{generating ? 'Generating...' : 'Generate New Link'}</span>
                    </button>
                </div>

                {/* Flash Message */}
                {flashMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-700 text-sm flex items-center gap-2">
                            <span>✅</span>
                            <span>{flashMessage}</span>
                        </p>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/50 flex">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                                activeTab === 'overview' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Active Access
                            {activeTab === 'overview' && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('generate')}
                            className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                                activeTab === 'generate' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Settings & Revoke
                            {activeTab === 'generate' && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                />
                            )}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {magicLink ? (
                                    <>
                                        {/* Access Statistics */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-sm text-blue-600 font-medium mb-1">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                                    <p className="text-lg font-bold text-gray-800">Active</p>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                                                <p className="text-sm text-purple-600 font-medium mb-1">QR Code</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {qrCodeUrl ? 'Ready' : 'Generating...'}
                                                </p>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                                                <p className="text-sm text-amber-600 font-medium mb-1">Created</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {user?.magic_link_created_at ? new Date(user.magic_link_created_at).toLocaleDateString() : 'Today'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Left: Link Details */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">Your Magic Link</h3>
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Copy this link and send it to your partner via text, email, or messenger.
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Shareable Link
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs break-all">
                                                            {magicLink}
                                                        </div>
                                                        <button 
                                                            onClick={handleCopyMagicLink} 
                                                            className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all hover:shadow-md group relative"
                                                            title="Copy to clipboard"
                                                        >
                                                            <span className="text-lg group-hover:scale-110 transition-transform inline-block">
                                                                {copied ? '✅' : '📋'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Share Buttons */}
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Quick Share
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={shareViaWhatsApp}
                                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                                        >
                                                            <span>📱</span>
                                                            WhatsApp
                                                        </button>
                                                        <button
                                                            onClick={shareViaMessenger}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                                        >
                                                            <span>💬</span>
                                                            Messenger
                                                        </button>
                                                        <button
                                                            onClick={shareViaEmail}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                                        >
                                                            <span>📧</span>
                                                            Email
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                                    <button 
                                                        onClick={saveQRCode} 
                                                        disabled={downloading || !qrCodeUrl}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span>{downloading ? '⏳' : '⬇️'}</span>
                                                        {downloading ? 'Downloading...' : 'Download QR Code'}
                                                    </button>
                                                    <button 
                                                        onClick={() => setIsFullScreen(true)} 
                                                        disabled={!qrCodeUrl}
                                                        className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span>🔍</span> Full Screen Scan
                                                    </button>
                                                    {!existingQRCode && qrCodeUrl && (
                                                        <button 
                                                            onClick={saveQRCodeToAccount}
                                                            disabled={savingQR}
                                                            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1 disabled:opacity-50"
                                                        >
                                                            <span>{savingQR ? '⏳' : '💾'}</span>
                                                            {savingQR ? 'Saving...' : 'Save QR to Account'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: QR Preview */}
                                            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                                                <div className="relative group cursor-pointer" onClick={() => setIsFullScreen(true)}>
                                                    {qrCodeUrl ? (
                                                        <img 
                                                            src={qrCodeUrl} 
                                                            alt="QR Code" 
                                                            className="w-48 h-48 bg-white p-2 rounded-lg shadow-md transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <span className="text-gray-500 text-sm">Generating QR...</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/0 transition-colors rounded-lg">
                                                        <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Click to Enlarge
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-4 text-center">
                                                    Scan with phone camera for instant access
                                                </p>
                                                <button 
                                                    onClick={() => setIsFullScreen(true)}
                                                    disabled={!qrCodeUrl}
                                                    className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <span>📷</span>
                                                    Open Scan Mode
                                                </button>
                                            </div>
                                        </div>

                                        {/* Instructions */}
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <span className="text-blue-600">ℹ️</span>
                                                How to share access:
                                            </h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-blue-500 mt-0.5">1.</span>
                                                    <span>Copy the magic link above and send it to your partner</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-blue-500 mt-0.5">2.</span>
                                                    <span>They can also scan the QR code with their phone camera</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-blue-500 mt-0.5">3.</span>
                                                    <span>The link will automatically log them into your shared gallery</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-blue-500 mt-0.5">4.</span>
                                                    <span>You can revoke access anytime by generating a new link</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">🔗</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Link Found</h3>
                                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                            Generate a magic link to give your partner secure access to your shared gallery.
                                        </p>
                                        <button 
                                            onClick={generateMagicLink}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                                        >
                                            <span>✨</span>
                                            Create Magic Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'generate' && (
                            <div className="max-w-2xl mx-auto py-8">
                                <div className="bg-gradient-to-br from-amber-50 to-red-50 border border-red-200 rounded-xl p-8 text-center">
                                    <div className="text-5xl mb-4">⚠️</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Revoke Current Access</h3>
                                    <p className="text-red-600 mb-6">
                                        <strong>Warning:</strong> Generating a new link will immediately invalidate the current one.
                                        Your partner will need the new link to access the gallery.
                                    </p>
                                    
                                    {hasExistingLink && (
                                        <div className="bg-white/50 rounded-lg p-4 mb-6 text-left">
                                            <p className="text-sm text-gray-600 mb-2">Current link status:</p>
                                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                                <span className="font-medium">Active</span>
                                            </div>
                                            <p className="text-xs text-gray-500 break-all bg-gray-50 p-2 rounded">
                                                {existingMagicLink}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={generateMagicLink}
                                        disabled={generating}
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {generating ? (
                                            <>
                                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                Generating New Link...
                                            </>
                                        ) : (
                                            <>
                                                <span>🔄</span>
                                                {hasExistingLink ? 'Revoke Current & Create New' : 'Create New Magic Link'}
                                            </>
                                        )}
                                    </button>
                                    
                                    <p className="text-xs text-gray-500 mt-4">
                                        This action cannot be undone. Make sure to share the new link with your partner.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Additional Info Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">🔒</div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Secure & Private</h3>
                            <p className="text-sm text-gray-600">
                                Magic links are encrypted and provide one-click access without passwords. 
                                Only people with the link can view your gallery. You can revoke access anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}