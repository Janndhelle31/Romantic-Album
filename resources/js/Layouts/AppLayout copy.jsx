import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";
import { usePage } from "@inertiajs/react";

const polaroids = [
    { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15, duration: 25 },
    { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12, duration: 28 },
    { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=300", top: "65%", left: "5%", rotate: 8, duration: 32 },
    { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=300", top: "80%", left: "80%", rotate: -10, duration: 24 },
    { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=300", top: "60%", left: "70%", rotate: 20, duration: 33 },
];

export default function AppLayout({ children }) {
    // Extract both music and letter content from shared Inertia props
    const { current_music, letter_content } = usePage().props;
    
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
        <div className="font-serif bg-[#FFFBF0] antialiased selection:bg-yellow-100 min-h-screen">
            
            {/* 1. SCATTERED BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {polaroids.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={showContent ? { 
                            opacity: 0.35, 
                            scale: 1,
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                            rotate: [p.rotate, p.rotate + 3, p.rotate]
                        } : { opacity: 0 }}
                        transition={{ 
                            opacity: { duration: 1.5, delay: p.id * 0.1 },
                            y: { repeat: Infinity, duration: p.duration, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: p.duration * 1.5, ease: "easeInOut" }
                        }}
                        className="absolute w-32 md:w-48 bg-white p-2 pb-8 shadow-lg border border-gray-100 transform-gpu"
                        style={{ top: p.top, left: p.left, filter: "blur(1px)" }}
                    >
                        <div className="w-full h-full bg-gray-50 overflow-hidden">
                            <img src={p.src} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 2. MUSIC PLAYER */}
            <MusicPlayer 
                url={current_music?.url} 
                displayName={current_music?.display_name}
                skipCountdown={showContent} 
                start={isEntryClicked} 
                onComplete={() => setShowContent(true)} 
            />

            {/* 3. INITIAL COVER SCREEN */}
            <AnimatePresence>
                {!isEntryClicked && (
                    <motion.div 
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[400] bg-[#FFFBF0] flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl text-gray-800 mb-4"
                        >
                            For My Favorite Person
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-handwriting text-3xl text-pink-400 mb-10"
                        >
                            A collection of our sunshine moments
                        </motion.p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEntry}
                            className="px-10 py-4 bg-yellow-400 text-white rounded-full text-xl shadow-xl hover:bg-yellow-500 transition-all"
                        >
                            Open Memory Book 🎁
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. MAIN CONTENT AREA */}
            <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 5. FLOATING LETTER TRIGGER */}
            <AnimatePresence>
                {showContent && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -15, 0], rotate: [-12, -8, -12] }}
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        onClick={() => setIsLetterOpen(true)}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className="bg-white p-4 rounded-2xl border-2 border-pink-100 shadow-2xl relative group">
                            <span className="text-4xl md:text-5xl">✉️</span>
                            {/* Decorative badge to show it's from "you" */}
                            <div className="absolute -top-2 -right-2 bg-pink-400 w-6 h-6 rounded-full border-2 border-white" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 6. MODAL WITH REAL DATA */}
            <AnimatePresence>
                {isLetterOpen && (
                    <LetterModal 
                        onClose={() => setIsLetterOpen(false)} 
                        data={letter_content} // This passes the database data!
                    />
                )}
            </AnimatePresence>
        </div>
    );
}