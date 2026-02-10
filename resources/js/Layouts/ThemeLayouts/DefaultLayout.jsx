import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "@/Components/MusicPlayer";
import LetterModal from "@/Components/LetterModal";
import FloatingLetter from "@/Components/FloatingLetter";

const polaroids = [
    { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15, duration: 25 },
    { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12, duration: 28 },
    { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=300", top: "65%", left: "5%", rotate: 8, duration: 32 },
    { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=300", top: "80%", left: "80%", rotate: -10, duration: 24 },
    { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=300", top: "60%", left: "70%", rotate: 20, duration: 33 },
];

export default function DefaultLayout({ children, current_music, letter_content, hideControls = false }) {
    const [mounted, setMounted] = useState(false);
    const [isEntryClicked, setIsEntryClicked] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isLetterOpen, setIsLetterOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasOpened = sessionStorage.getItem('bookOpened') === 'true';
        if (hasOpened || hideControls) {
            setIsEntryClicked(true);
            setShowContent(true);
        }
    }, [hideControls]);

    const handleEntry = () => {
        setIsEntryClicked(true);
        sessionStorage.setItem('bookOpened', 'true');
    };

    if (!mounted) return <div className="bg-[#FFFBF0] min-h-screen" />;

    return (
        <div className="font-serif bg-[#FFFBF0] antialiased selection:bg-yellow-100 min-h-screen relative overflow-x-hidden">
            
            {/* 1. SCATTERED BACKGROUND POLAROIDS */}
            {createPortal(
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {polaroids.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={showContent ? { opacity: 0.25, y: [0, -20, 0] } : { opacity: 0 }}
                            transition={{ y: { repeat: Infinity, duration: p.duration, ease: "linear" } }}
                            className="absolute w-32 md:w-48 bg-white p-2 pb-8 shadow-md transform-gpu"
                            style={{ top: p.top, left: p.left, rotate: p.rotate }}
                        >
                            <img src={p.src} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                        </motion.div>
                    ))}
                </div>,
                document.body
            )}

            {/* 2. MUSIC PLAYER */}
            {!hideControls && (
                <MusicPlayer 
                    url={current_music?.url} 
                    displayName={current_music?.display_name}
                    skipCountdown={showContent}
                    start={isEntryClicked} 
                    onComplete={() => setShowContent(true)} 
                    theme="default"
                />
            )}

            {/* 3. INITIAL COVER SCREEN */}
            <AnimatePresence>
                {!isEntryClicked && !hideControls && (
                    <motion.div 
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[400] bg-[#FFFBF0] flex flex-col items-center justify-center p-6 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl text-gray-800 mb-4">For My Favorite Person</h1>
                        <p className="font-handwriting text-3xl text-pink-400 mb-10">A collection of our sunshine moments</p>
                        <button onClick={handleEntry} className="px-10 py-4 bg-yellow-400 text-white rounded-full text-xl shadow-xl hover:bg-yellow-500 transition-all active:scale-95">
                            Open Memory Book 🎁
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. MAIN CONTENT AREA */}
            {/* pb-32 ensures the floating letter doesn't block the last bit of content on mobile */}
            <main className={`relative z-10 transition-opacity duration-1000 pb-32 md:pb-12 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {children}
            </main>

            {/* 5. FLOATING LETTER */}
            <AnimatePresence>
                {showContent && !hideControls && (
                    <FloatingLetter onClick={() => setIsLetterOpen(true)} />
                )}
            </AnimatePresence>

            {/* 6. MODAL */}
            <AnimatePresence>
                {isLetterOpen && (
                    <LetterModal onClose={() => setIsLetterOpen(false)} data={letter_content} theme="default" />
                )}
            </AnimatePresence>
        </div>
    );
}