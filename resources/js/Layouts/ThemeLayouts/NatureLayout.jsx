import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";

const natureElements = [
    { id: 1, icon: "🍃", top: "10%", left: "10%", rotate: 45, duration: 20 },
    { id: 2, icon: "🌸", top: "15%", left: "80%", rotate: -20, duration: 25 },
    { id: 3, icon: "🌿", top: "70%", left: "15%", rotate: 15, duration: 22 },
    { id: 4, icon: "🌼", top: "85%", left: "75%", rotate: -10, duration: 28 },
];

export default function NatureLayout({ 
    children, 
    current_music, 
    letter_content, 
    hideControls = false 
}) {
    const [isEntryClicked, setIsEntryClicked] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('natureOpened') === 'true';
        return false;
    });

    const [showContent, setShowContent] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('natureOpened') === 'true';
        return false;
    });

    const [isLetterOpen, setIsLetterOpen] = useState(false);

    const handleEntry = () => {
        setIsEntryClicked(true);
        sessionStorage.setItem('natureOpened', 'true');
    };

    if (hideControls && !showContent) {
        setShowContent(true);
        if (!isEntryClicked) setIsEntryClicked(true);
    }

    return (
        <div className="font-serif bg-[#F4F9F1] antialiased selection:bg-green-200 min-h-screen relative overflow-x-hidden">
            
            {/* 1. PORTALED BOTANICAL ELEMENTS */}
            {typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'layout paint' }}>
                    {natureElements.map((el) => (
                        <motion.div
                            key={el.id}
                            initial={{ opacity: 0 }}
                            animate={showContent ? { 
                                opacity: 0.4, 
                                y: [0, -30, 0],
                                rotate: [el.rotate, el.rotate + 10, el.rotate]
                            } : { opacity: 0 }}
                            transition={{ 
                                opacity: { duration: 2 },
                                y: { repeat: Infinity, duration: el.duration, ease: "linear" } 
                            }}
                            className="absolute text-5xl md:text-6xl transform-gpu will-change-transform"
                            style={{ top: el.top, left: el.left }}
                        >
                            {el.icon}
                        </motion.div>
                    ))}
                </div>,
                document.body
            )}

            {/* Note: NatureHearts removed. Handled globally by AppLayout. */}

            {/* 2. MUSIC PLAYER */}
            {!hideControls && (
                <MusicPlayer 
                    url={current_music?.url} 
                    displayName={current_music?.display_name}
                    skipCountdown={showContent} 
                    start={isEntryClicked} 
                    onComplete={() => setShowContent(true)} 
                    theme="nature"
                />
            )}

            {/* 3. ENTRANCE SCREEN */}
            {!hideControls && (
                <AnimatePresence mode="wait">
                    {!isEntryClicked && (
                        <motion.div 
                            key="nature-cover"
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="fixed inset-0 z-[400] bg-[#E8F3E5] flex flex-col items-center justify-center p-6 text-center"
                        >
                            <motion.h1 
                                initial={{ y: 10, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                className="text-5xl md:text-7xl text-emerald-900 mb-8 font-light"
                            >
                                Our Secret Garden
                            </motion.h1>
                            <motion.button 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEntry}
                                className="px-10 py-4 bg-emerald-700 text-white rounded-full text-xl shadow-xl hover:bg-emerald-800 transition-all"
                            >
                                Enter Our World 🌿
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* 4. MAIN CONTENT */}
            <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 5. LETTER TRIGGER */}
            <AnimatePresence>
                {showContent && !hideControls && (
                    <motion.button
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-10 right-10 z-[200] bg-white p-4 rounded-full border-2 border-emerald-50 shadow-2xl"
                    >
                        <span className="text-4xl">🌱</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 6. MODAL */}
            <AnimatePresence>
                {isLetterOpen && !hideControls && (
                    <LetterModal 
                        onClose={() => setIsLetterOpen(false)} 
                        data={letter_content} 
                        theme="nature" 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}