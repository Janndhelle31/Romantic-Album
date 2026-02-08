import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";
import ClassyHearts from "@/Components/ThemeComponents/Classy/Hearts";

// Focus: Intimacy, connection, and timeless moments
const couplePolaroids = [
    { 
        id: 1, 
        src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=500", // Soft embrace
        top: "5%", left: "4%", rotate: -8, duration: 20 
    },
    { 
        id: 2, 
        src: "https://images.unsplash.com/photo-1522673607200-164883efeca1?w=500", // Holding hands/Detail
        top: "10%", left: "75%", rotate: 6, duration: 24 
    },
    { 
        id: 3, 
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500", // Flowers/Wedding feel
        top: "65%", left: "2%", rotate: 10, duration: 22 
    },
    { 
        id: 4, 
        src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=500", // Sunset couple silhouette
        top: "70%", left: "78%", rotate: -5, duration: 26 
    },
];

export default function ClassyLayout({ 
    children, 
    current_music, 
    letter_content, 
    hideControls = false // ADD THIS PROP
}) {
    const [isEntryClicked, setIsEntryClicked] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('classyOpened') === 'true';
        return false;
    });

    const [showContent, setShowContent] = useState(() => {
        if (typeof window !== 'undefined') return sessionStorage.getItem('classyOpened') === 'true';
        return false;
    });

    const [isLetterOpen, setIsLetterOpen] = useState(false);

    const handleEntry = () => {
        setIsEntryClicked(true);
        sessionStorage.setItem('classyOpened', 'true');
    };

    // Auto-show content if hideControls is true (for album pages)
    if (hideControls && !showContent) {
        setShowContent(true);
        if (!isEntryClicked) {
            setIsEntryClicked(true);
        }
    }

    return (
        <div className="font-serif bg-[#FAF9F6] text-[#1A1A1A] antialiased selection:bg-[#E5D3B3] min-h-screen relative overflow-x-hidden">
            
            {/* 1. FLOATING MEMORIES BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {couplePolaroids.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={showContent ? { 
                            opacity: 0.25, 
                            scale: 1,
                            y: [0, -15, 0],
                            rotate: [p.rotate, p.rotate + 1, p.rotate]
                        } : { opacity: 0 }}
                        transition={{ 
                            duration: 2,
                            y: { repeat: Infinity, duration: p.duration, ease: "easeInOut" }
                        }}
                        className="absolute w-48 md:w-72 bg-white p-3 pb-14 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-gray-100/50"
                        style={{ top: p.top, left: p.left }}
                    >
                        <div className="w-full h-full bg-gray-50 overflow-hidden sepia-[0.2] contrast-[0.9] hover:sepia-0 transition-all duration-1000">
                            <img src={p.src} alt="Memory" className="w-full h-full object-cover" />
                        </div>
                        {/* Elegant "handwritten" date placeholder */}
                        <div className="absolute bottom-4 left-0 right-0 text-center opacity-40">
                            <span className="font-handwriting text-xs italic tracking-widest text-gray-400">Our Forever</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showContent && <ClassyHearts />}
            </AnimatePresence>

            {/* 2. MUSIC PLAYER - CONDITIONAL RENDER */}
            {!hideControls && (
                <MusicPlayer 
                    url={current_music?.url} 
                    displayName={current_music?.display_name}
                    skipCountdown={showContent} 
                    start={isEntryClicked} 
                    onComplete={() => setShowContent(true)} 
                    theme="classy"
                />
            )}

            {/* 3. EDITORIAL ENTRANCE - CONDITIONAL RENDER */}
            {!hideControls && (
                <AnimatePresence>
                    {!isEntryClicked && (
                        <motion.div 
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="fixed inset-0 z-[400] bg-white flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="relative group p-20">
                                {/* Fine Detail Lines */}
                                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute top-0 left-0 right-0 h-[1px] bg-[#E5D3B3] origin-left" />
                                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E5D3B3] origin-right" />
                                
                                <motion.span 
                                    initial={{ opacity: 0, letterSpacing: "0.8em" }}
                                    animate={{ opacity: 1, letterSpacing: "0.5em" }}
                                    className="block mb-8 text-[10px] uppercase font-light text-[#A68966]"
                                >
                                    A Private Collection
                                </motion.span>
                                
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-6xl md:text-8xl font-light italic mb-12 tracking-tighter"
                                >
                                    Two Souls, One Story
                                </motion.h1>

                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handleEntry}
                                    className="relative z-10 px-14 py-4 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-[0.5em] overflow-hidden group transition-all"
                                >
                                    <span className="relative z-10">Curate the Memories</span>
                                    <div className="absolute inset-0 bg-[#A68966] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* 4. MAIN CONTENT (DASHBOARD) */}
            <main className={`relative z-10 transition-opacity duration-[2000ms] ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 5. REFINED LETTER TRIGGER - CONDITIONAL RENDER */}
            <AnimatePresence>
                {showContent && !hideControls && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-12 right-12 z-[200] flex flex-col items-center group"
                    >
                        <span className="text-[8px] uppercase tracking-[0.5em] text-[#A68966] mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700">Open Note</span>
                        <div className="w-14 h-14 bg-white border border-[#E5D3B3] flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-700">
                            <span className="text-xl font-light text-[#1A1A1A]">✉</span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 6. LETTER MODAL - CONDITIONAL RENDER */}
            {isLetterOpen && !hideControls && (
                <LetterModal 
                    onClose={() => setIsLetterOpen(false)} 
                    data={letter_content} 
                    theme="classy" 
                />
            )}
        </div>
    );
}