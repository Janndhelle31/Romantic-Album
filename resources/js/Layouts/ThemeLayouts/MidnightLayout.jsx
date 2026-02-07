import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";
import Stars from '@/Components/ThemeComponents/Midnight/Stars'; // Swapped Hearts for Stars

const polaroids = [
    { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15, duration: 25 },
    { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12, duration: 28 },
    { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c68526514460?w=300", top: "65%", left: "5%", rotate: 8, duration: 32 },
    { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=300", top: "80%", left: "80%", rotate: -10, duration: 24 },
    { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=300", top: "60%", left: "70%", rotate: 20, duration: 33 },
];

export default function MidnightLayout({ children, current_music, letter_content }) {
    const [isEntryClicked, setIsEntryClicked] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('bookOpened') === 'true';
        }
        return false;
    });

    const [showContent, setShowContent] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('bookOpened') === 'true';
        }
        return false;
    });

    const [isLetterOpen, setIsLetterOpen] = useState(false);

    const handleEntry = () => {
        setIsEntryClicked(true);
        sessionStorage.setItem('bookOpened', 'true');
    };

    return (
        <div className="font-serif bg-[#0A0A0B] antialiased selection:bg-indigo-900 selection:text-white min-h-screen relative text-gray-200">
            
            {/* 1. SCATTERED BACKGROUND POLAROIDS (Dark Mode Styling) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {polaroids.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={showContent ? { 
                            opacity: 0.2, // Lower opacity for dark theme
                            scale: 1,
                            y: [0, -20, 0],
                            rotate: [p.rotate, p.rotate + 3, p.rotate]
                        } : { opacity: 0 }}
                        transition={{ 
                            opacity: { duration: 1.5, delay: p.id * 0.1 },
                            y: { repeat: Infinity, duration: p.duration, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: p.duration * 1.5, ease: "easeInOut" }
                        }}
                        className="absolute w-32 md:w-48 bg-white/10 p-2 pb-8 shadow-2xl backdrop-blur-md border border-white/10 transform-gpu"
                        style={{ top: p.top, left: p.left, filter: "blur(0.5px)" }}
                    >
                        <div className="w-full h-full bg-black/40 overflow-hidden">
                            <img src={p.src} alt="" className="w-full h-full object-cover grayscale-[60%] contrast-125" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 2. FLOATING STARS (Midnight Exclusive) */}
            <AnimatePresence>
                {showContent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
                        <Stars />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. MUSIC PLAYER */}
            <MusicPlayer 
                url={current_music?.url} 
                displayName={current_music?.display_name}
                skipCountdown={showContent} 
                start={isEntryClicked} 
                onComplete={() => setShowContent(true)} 
                theme="midnight" 
            />

            {/* 4. INITIAL COVER SCREEN (Deep Space Theme) */}
            <AnimatePresence>
                {!isEntryClicked && (
                    <motion.div 
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[400] bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
                        
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl text-white mb-4 tracking-tight"
                        >
                            Written in the Stars
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-handwriting text-3xl text-indigo-300 mb-10"
                        >
                            Our quiet moments under the moon
                        </motion.p>
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEntry}
                            className="px-10 py-4 bg-indigo-600 text-white rounded-full text-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all z-[401] border border-indigo-400/30"
                        >
                            Enter the Night 🌙
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. MAIN CONTENT AREA */}
            <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 6. FLOATING LETTER TRIGGER (Glowing Midnight Style) */}
            <AnimatePresence>
                {showContent && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className="bg-indigo-950/80 backdrop-blur-md p-4 rounded-2xl border border-indigo-500/50 shadow-[0_0_25px_rgba(79,70,229,0.3)] relative group">
                            <span className="text-4xl md:text-5xl">🌌</span>
                            <div className="absolute -top-1 -right-1 bg-indigo-400 w-4 h-4 rounded-full border border-white animate-pulse" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 7. MODAL */}
            <AnimatePresence>
                {isLetterOpen && (
                    <LetterModal 
                        onClose={() => setIsLetterOpen(false)} 
                        data={letter_content}
                        theme="midnight"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}