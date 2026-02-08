import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";;
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";

const ephemera = [
    { id: 1, content: "📜", top: "8%", left: "12%", rotate: -10, duration: 25 },
    { id: 2, content: "✉️", top: "15%", left: "82%", rotate: 15, duration: 28 },
    { id: 3, content: "🕯️", top: "75%", left: "10%", rotate: -5, duration: 30 },
    { id: 4, content: "🖋️", top: "85%", left: "85%", rotate: 12, duration: 22 },
    { id: 5, content: "🎞️", top: "50%", left: "5%", rotate: -20, duration: 35 },
];

export default function VintageLayout({ 
    children, 
    current_music, 
    letter_content, 
    hideControls = false 
}) {
    const [isEntryClicked, setIsEntryClicked] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('vintageOpened') === 'true';
        return false;
    });

    const [showContent, setShowContent] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('vintageOpened') === 'true';
        return false;
    });

    const [isLetterOpen, setIsLetterOpen] = useState(false);

    const handleEntry = () => {
        setIsEntryClicked(true);
        sessionStorage.setItem('vintageOpened', 'true');
    };

    if (hideControls && !showContent) {
        setShowContent(true);
        if (!isEntryClicked) setIsEntryClicked(true);
    }

    return (
        <div className="font-serif bg-[#EADDCA] text-[#4A3728] antialiased selection:bg-[#C2B280] min-h-screen relative overflow-x-hidden">
            
            {/* 1. VINTAGE OVERLAY (Portaled for hardware acceleration) */}
            {typeof window !== 'undefined' && createPortal(
                <div 
                    className="fixed inset-0 z-[50] pointer-events-none opacity-[0.15] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] transform-gpu" 
                    style={{ willChange: 'transform' }}
                />,
                document.body
            )}

            {/* 2. PORTALED FLOATING EPHEMERA */}
            {typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'layout paint' }}>
                    {ephemera.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={showContent ? { 
                                opacity: 0.35, 
                                y: [0, -15, 0],
                                rotate: [item.rotate, item.rotate + 5, item.rotate]
                            } : { opacity: 0 }}
                            transition={{ 
                                opacity: { duration: 2 }, 
                                y: { repeat: Infinity, duration: item.duration, ease: "linear" } 
                            }}
                            className="absolute text-5xl md:text-6xl transform-gpu will-change-transform"
                            style={{ 
                                top: item.top, 
                                left: item.left,
                                filter: 'sepia(0.4) brightness(0.9)' // Moved from tailwind for cleaner style management
                            }}
                        >
                            {item.content}
                        </motion.div>
                    ))}
                </div>,
                document.body
            )}

            {/* Note: VintageHearts removed. Handled by AppLayout's FloatingVintage particles. */}

            {/* 4. MUSIC PLAYER */}
            {!hideControls && (
                <MusicPlayer 
                    url={current_music?.url} 
                    displayName={current_music?.display_name}
                    skipCountdown={showContent} 
                    start={isEntryClicked} 
                    onComplete={() => setShowContent(true)} 
                    theme="vintage"
                />
            )}

            {/* 5. ENTRANCE SCREEN */}
            {!hideControls && (
                <AnimatePresence mode="wait">
                    {!isEntryClicked && (
                        <motion.div 
                            key="vintage-cover"
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                            className="fixed inset-0 z-[400] bg-[#D2B48C] flex flex-col items-center justify-center p-6 text-center shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="border-2 border-[#8B4513] p-8 md:p-12 relative"
                            >
                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#8B4513]" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#8B4513]" />
                                
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-widest text-[#5D4037]">
                                    Archive of Us
                                </h1>
                                <p className="font-handwriting text-2xl md:text-3xl text-[#8B4513] mb-8">
                                    Est. 2024 — Forever
                                </p>
                                <button 
                                    onClick={handleEntry}
                                    className="px-8 py-3 bg-[#8B4513] text-[#F5DEB3] rounded-sm text-lg hover:bg-[#5D4037] transition-all uppercase tracking-tighter"
                                >
                                    Open the Archives 🗝️
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* 6. MAIN CONTENT */}
            <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 7. WAX SEAL TRIGGER */}
            <AnimatePresence>
                {showContent && !hideControls && (
                    <motion.button
                        initial={{ opacity: 0, rotate: 20 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className="relative group">
                            <div className="bg-[#C19A6B] w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-[#A0522D] relative overflow-hidden">
                                <span className="text-3xl group-hover:scale-110 transition-transform">✉️</span>
                                <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay" />
                            </div>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 8. MODAL */}
            <AnimatePresence>
                {isLetterOpen && !hideControls && (
                    <LetterModal 
                        onClose={() => setIsLetterOpen(false)} 
                        data={letter_content} 
                        theme="vintage" 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}