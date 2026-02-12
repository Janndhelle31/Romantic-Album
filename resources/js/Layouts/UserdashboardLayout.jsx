import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserdashboardLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [showRegenerateWarning, setShowRegenerateWarning] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { url, props } = usePage();
    
    const user = props.auth?.user;
    
    // Check if user needs to pay
    const needsPayment = user?.is_paid === 0;
    
    // Check if user has existing magic link
    const hasExistingLink = !!user?.magic_link;
    const existingMagicLink = user?.magic_link || '';
    const existingQRCode = user?.qr_code_url || '';
    
    // Fixed price
    const finalPrice = 180; 
    
    // Get flash message from Inertia
    const flashMessage = props.flash?.success;
    const wasRegenerated = props.flash?.was_regenerated;

    // Show payment modal if user hasn't paid
    useEffect(() => {
        if (needsPayment) {
            const timer = setTimeout(() => {
                setShowPaymentModal(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [needsPayment]);

    // Set existing magic link and QR code if available
    useEffect(() => {
        if (existingMagicLink) {
            // Generate QR code from magic link if exists
            generateQRCode(existingMagicLink);
            
            // If QR code exists in database, use it
            if (existingQRCode) {
                setQrCodeUrl(existingQRCode);
            }
        }
    }, [existingMagicLink, existingQRCode]);

    // Generate QR code URL
    const generateQRCode = (link) => {
        const encodedLink = encodeURIComponent(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedLink}&format=png&qzone=2`;
        setQrCodeUrl(qrUrl);
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

    const safeRoute = (routeName, fallback = '/') => {
        try {
            return route(routeName);
        } catch (error) {
            return fallback;
        }
    };

    const handleLinkClick = (link, e) => {
        if (needsPayment && link.href.includes('manage')) {
            e.preventDefault();
            setShowPaymentModal(true);
            setIsMobileMenuOpen(false);
        } else {
            setIsMobileMenuOpen(false);
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
        },
        {
            group: 'Share',
            items: [
                { 
                    name: 'Share Access', 
                    href: safeRoute('share.access'), 
                    icon: '🔗', 
                    mobile: true,
                    badge: hasExistingLink && !needsPayment ? 'Active' : null,
                    badgeColor: 'green'
                },
            ]
        }
    ];

    const mobileBottomLinks = navLinks.flatMap(group => group.items).filter(item => item.mobile);

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Payment Information
    const paymentDetails = {
        title: "GCash Payment",
        number: "0965 933 4337",
        name: "JA*******E Z.",
        qrCode: "/gcash-qr.png",
        instructions: [
            `Send ₱${finalPrice} to the GCash number above`,
            "Take a screenshot of the transaction",
            "Send screenshot to Facebook Page with your name and email: Larkacer-Nexus IT Solutions",
            "Follow the page for verification",
            "Wait for verification (usually within 24 hours)"
        ]
    };

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
            
            {/* --- REGENERATE WARNING TOAST --- */}
            <AnimatePresence>
                {showRegenerateWarning && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[200] max-w-md w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-lg"
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <span className="text-yellow-600 text-xl">⚠️</span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-yellow-800">
                                    Previous access links revoked
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    The old magic link and QR code are no longer valid. 
                                    Your partner must use this new one.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowRegenerateWarning(false)}
                                className="ml-auto text-yellow-700 hover:text-yellow-900"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- PAYMENT VERIFICATION MODAL --- */}
            <AnimatePresence>
                {showPaymentModal && needsPayment && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Complete Your Payment
                                    </h2>
                                    <button 
                                        onClick={() => setShowPaymentModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    Pay ₱{finalPrice} to unlock all features
                                </p>
                            </div>

                            {/* Payment Details */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        {paymentDetails.title}
                                    </h3>
                                    
                                    <div className="text-center mb-6">
                                        <div className="inline-block p-4 bg-gray-100 rounded-lg mb-4">
                                            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                                                <img 
                                                    src={paymentDetails.qrCode} 
                                                    alt="GCash QR Code"
                                                    className="w-full h-full object-contain rounded-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='100' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3EGCash QR Code%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {paymentDetails.number}
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                {paymentDetails.name}
                                            </p>
                                            <p className="text-lg font-bold text-red-600 mt-2">
                                                Send ₱{finalPrice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="space-y-3 mb-6">
                                        <h4 className="font-semibold text-gray-800">Instructions:</h4>
                                        <ul className="space-y-2">
                                            {paymentDetails.instructions.map((instruction, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="text-blue-500 mt-0.5">•</span>
                                                    <span className="text-gray-700">{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Facebook Page Link */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <span className="text-blue-600 text-xl">📘</span>
                                            <div>
                                                <p className="font-semibold text-gray-800">Facebook Page:</p>
                                                <a 
                                                    href="https://www.facebook.com/LarkacerNexusIT" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Larkacer-Nexus IT Solutions
                                                </a>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Send your payment screenshot here for verification
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                        <p className="font-semibold mb-1">⚠️ Important:</p>
                                        <p>Your account will be activated within an hour after verification. You'll receive an email confirmation.</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        I Understand, Will Pay ₱{finalPrice}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MOBILE TOP HEADER --- */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✨</span>
                    </div>
                    <h2 className="font-semibold text-gray-800">Studio</h2>
                    {needsPayment && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                            Pay ₱{finalPrice}
                        </span>
                    )}
                    {hasExistingLink && !needsPayment && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                            🔗 Shared
                        </span>
                    )}
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
                            {needsPayment && (
                                <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm flex items-center gap-2">
                                        <span>💰</span>
                                        <span>Unlock Premium Features</span>
                                    </p>
                                    <div className="mt-2">
                                        <button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="w-full py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600"
                                        >
                                            Pay ₱{finalPrice}
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                                onClick={(e) => handleLinkClick(link, e)}
                                                className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${
                                                    url === link.href 
                                                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                                                        : needsPayment && link.href.includes('manage')
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{link.icon}</span> 
                                                    <span className="font-medium text-sm">{link.name}</span>
                                                </div>
                                                {link.badge && (
                                                    <span className={`text-xs px-2 py-1 rounded-full bg-${link.badgeColor}-100 text-${link.badgeColor}-800`}>
                                                        {link.badge}
                                                    </span>
                                                )}
                                                {needsPayment && link.href.includes('manage') && (
                                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                        🔒
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
                                    <div className="mt-1 flex gap-1 flex-wrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${needsPayment ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {needsPayment ? `🔒 Pay ₱${finalPrice}` : '✅ Active'}
                                        </span>
                                        {hasExistingLink && !needsPayment && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                🔗 Shared
                                            </span>
                                        )}
                                        {existingQRCode && !needsPayment && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                📱 QR Saved
                                            </span>
                                        )}
                                    </div>
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
                {/* Payment Warning Banner */}
                {needsPayment && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 p-4">
                        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-red-600 text-xl">💰</span>
                                <div>
                                    <p className="font-medium text-red-800">
                                        Unlock Premium Memory Studio
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Pay ₱{finalPrice} to access all features
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {/* Flash Message */}
                    {flashMessage && !needsPayment && (
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
                    const handleMobileLinkClick = (e) => {
                        if (needsPayment && link.href.includes('manage')) {
                            e.preventDefault();
                            setShowPaymentModal(true);
                        }
                    };

                    return (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            onClick={handleMobileLinkClick}
                            className={`flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : needsPayment && link.href.includes('manage') ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            <span className={`text-xl ${isActive ? 'scale-110' : ''}`}>
                                {needsPayment && link.href.includes('manage') ? '🔒' : link.icon}
                            </span>
                            <span className="text-xs font-medium">
                                {link.name.split(' ')[0]}
                            </span>
                        </Link>
                    );
                })}
                
                {/* Payment Button if not paid */}
                {needsPayment && (
                    <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="flex flex-col items-center gap-1 text-red-600"
                    >
                        <span className="text-xl">💰</span>
                        <span className="text-xs font-medium">Pay</span>
                    </button>
                )}
            </div>
        </div>
    );
}