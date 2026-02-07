import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hearts() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        // Increased Z-index to 50 to ensure it's above the background
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
            {[...Array(15)].map((_, i) => {
                // Generate random horizontal start position
                const leftPos = Math.floor(Math.random() * 100);
                
                return (
                    <motion.div
                        key={i}
                        initial={{ 
                            y: "110vh", // Start below the screen
                            x: `${leftPos}%`, 
                            opacity: 0,
                            scale: 0.5
                        }}
                        animate={{ 
                            y: "-10vh", // Float up to above the screen
                            opacity: [0, 0.7, 0.7, 0], // Fade in, stay, fade out
                            scale: [0.5, 1.2, 0.8],
                            rotate: [0, 45, -45, 0] // Gentle swaying
                        }}
                        transition={{ 
                            duration: Math.random() * 8 + 7, // Slower, more romantic speed
                            repeat: Infinity, 
                            delay: Math.random() * 10, // Staggered start
                            ease: "linear"
                        }}
                        className="absolute text-pink-300 drop-shadow-sm"
                        style={{ fontSize: `${Math.random() * 20 + 20}px` }} // Varying sizes
                    >
                        ♥
                    </motion.div>
                );
            })}
        </div>
    );
}