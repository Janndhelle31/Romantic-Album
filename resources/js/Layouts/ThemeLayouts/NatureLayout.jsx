import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";
import NatureHearts from "@/Components/ThemeComponents/Nature/Hearts";

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
    hideControls = false // ADD THIS PROP
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

    // Auto-show content if hideControls is true (for album pages)
    if (hideControls && !showContent) {
        setShowContent(true);
        if (!isEntryClicked) {
            setIsEntryClicked(true);
        }
    }

    return (
        <div className="font-serif bg-[#F4F9F1] antialiased selection:bg-green-200 min-h-screen relative overflow-x-hidden">
            
            {/* 1. BOTANICAL ELEMENTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {natureElements.map((el) => (
                    <motion.div
                        key={el.id}
                        initial={{ opacity: 0 }}
                        animate={showContent ? { 
                            opacity: 0.5, 
                            y: [0, -30, 0],
                            rotate: [el.rotate, el.rotate + 10, el.rotate]
                        } : { opacity: 0 }}
                        transition={{ duration: 2, y: { repeat: Infinity, duration: el.duration } }}
                        className="absolute text-5xl md:text-6xl"
                        style={{ top: el.top, left: el.left }}
                    >
                        {el.icon}
                    </motion.div>
                ))}
            </div>

            {/* 2. NATURE HEARTS */}
            <AnimatePresence>
                {showContent && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                    >
                        <NatureHearts />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. MUSIC PLAYER - CONDITIONAL RENDER */}
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

            {/* 4. ENTRANCE SCREEN - CONDITIONAL RENDER */}
            {!hideControls && (
                <AnimatePresence>
                    {!isEntryClicked && (
                        <motion.div 
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="fixed inset-0 z-[400] bg-[#E8F3E5] flex flex-col items-center justify-center p-6 text-center"
                        >
                            <motion.h1 className="text-5xl md:text-7xl text-emerald-900 mb-4">Our Secret Garden</motion.h1>
                            <button 
                                onClick={handleEntry}
                                className="px-10 py-4 bg-emerald-700 text-white rounded-full text-xl shadow-xl hover:bg-emerald-800 transition-all"
                            >
                                Enter Our World 🌿
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* 5. MAIN CONTENT */}
            <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 6. LETTER TRIGGER - CONDITIONAL RENDER */}
            <AnimatePresence>
                {showContent && !hideControls && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-10 right-10 z-[200] bg-[#FAF7F2] p-4 rounded-full border-2 border-emerald-100 shadow-2xl"
                    >
                        <span className="text-4xl">🌱</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 7. LETTER MODAL - CONDITIONAL RENDER */}
            {isLetterOpen && !hideControls && (
                <LetterModal 
                    onClose={() => setIsLetterOpen(false)} 
                    data={letter_content} 
                    theme="nature" 
                />
            )}
        </div>
    );
}