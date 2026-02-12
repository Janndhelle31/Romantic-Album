import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import UserdashboardLayout from '@/Layouts/UserdashboardLayout';

export default function ShareAccess() {
    const { props } = usePage();
    const [magicLink, setMagicLink] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false); // New state for Full Screen
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [savingQR, setSavingQR] = useState(false);
    const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    const user = props.auth?.user;
    const hasExistingLink = !!user?.magic_link;
    const existingMagicLink = user?.magic_link || '';
    const existingQRCode = user?.qr_code_url || '';
    
    const flashMessage = props.flash?.success;
    const flashMagicLink = props.flash?.magic_link;
    const wasRegenerated = props.flash?.was_regenerated;

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

    useEffect(() => {
        if (flashMagicLink) {
            setMagicLink(flashMagicLink);
            generateQRCode(flashMagicLink);
            setShowQR(true);
            setActiveTab('overview');
            
            if (hasExistingLink || wasRegenerated) {
                setShowRegenerateWarning(true);
                setTimeout(() => setShowRegenerateWarning(false), 5000);
            }
        }
    }, [flashMagicLink, hasExistingLink, wasRegenerated]);

    const generateQRCode = (link) => {
        const encodedLink = encodeURIComponent(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodedLink}&format=png&qzone=2`;
        setQrCodeUrl(qrUrl);
    };

    const saveQRCodeToAccount = async () => {
        if (!qrCodeUrl || !magicLink) return;
        setSavingQR(true);
        try {
            await router.post('/save-qr-code', {
                magic_link: magicLink,
                qr_code_url: qrCodeUrl
            }, {
                preserveScroll: true,
                onSuccess: () => alert('✅ QR code saved to account!'),
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
                if (confirm('✅ Downloaded! Save to account for later?')) saveQRCodeToAccount();
            }
        } finally {
            setDownloading(false);
        }
    };

    const generateMagicLink = async () => {
        if (hasExistingLink) {
            if (!confirm('⚠️ WARNING: This will immediately invalidate your old link. Continue?')) return;
        }
        setGenerating(true);
        router.post('/generate-magic-login', {}, {
            onFinish: () => setGenerating(false)
        });
    };

    const handleCopyMagicLink = async () => {
        if (!magicLink) return alert('Generate a link first.');
        await navigator.clipboard.writeText(magicLink);
        alert('✅ Copied to clipboard!');
    };

    return (
        <UserdashboardLayout>
            <Head title="Share Access" />
            
            {/* FULL SCREEN QR MODAL */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
                    >
                        <button 
                            onClick={() => setIsFullScreen(false)}
                            className="absolute top-8 right-8 text-white text-4xl p-4 hover:scale-110 transition-transform"
                        >
                            ✕
                        </button>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full">
                            <h2 className="text-black text-xl font-bold mb-6">Scan to Access Gallery</h2>
                            <img 
                                src={qrCodeUrl} 
                                alt="QR Code" 
                                className="w-full aspect-square mb-6"
                            />
                            <p className="text-gray-500 text-sm text-center">
                                Point your partner's camera at this screen to instantly log them in.
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setIsFullScreen(false)}
                            className="mt-12 px-8 py-3 bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-colors"
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
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        <span>{generating ? '⏳' : '🔗'}</span>
                        <span className="font-medium">{generating ? 'Generating...' : 'Generate New Link'}</span>
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 flex">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active Access
                        </button>
                        <button 
                            onClick={() => setActiveTab('generate')}
                            className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === 'generate' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Settings & Revoke
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {magicLink ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left: Link Details */}
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                                                    <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">Link is Active</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Your Magic Link</h3>
                                                <p className="text-gray-500 text-sm">Copy this link and send it via text or WhatsApp.</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <code className="flex-1 p-3 bg-gray-100 rounded-lg text-xs font-mono break-all border border-gray-200">
                                                    {magicLink}
                                                </code>
                                                <button onClick={handleCopyMagicLink} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                                                    📋
                                                </button>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                                <button onClick={saveQRCode} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                    <span>⬇️</span> Download PNG
                                                </button>
                                                <button onClick={() => setIsFullScreen(true)} className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                                    <span>🔍</span> Full Screen Scan
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right: QR Preview */}
                                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                                            <div className="relative group cursor-pointer" onClick={() => setIsFullScreen(true)}>
                                                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm transition-transform group-hover:scale-105" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/0 transition-colors rounded-lg">
                                                    <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Click to Enlarge</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setIsFullScreen(true)}
                                                className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2"
                                            >
                                                📷 Open Scan Mode
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">No active link found.</p>
                                        <button onClick={generateMagicLink} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Create One Now</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'generate' && (
                            <div className="max-w-md mx-auto py-8 text-center">
                                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">
                                    <strong>Warning:</strong> Generating a new link will break the current link immediately.
                                </div>
                                <button
                                    onClick={generateMagicLink}
                                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                >
                                    Revoke Current & Create New
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserdashboardLayout>
    );
}