"use client";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const FloatingHearts = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const heartData = useMemo(() => {
        // Reduced count even further for mobile
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const count = isMobile ? 6 : 12;
        
        return [...Array(count)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 6 + 18,
            duration: Math.random() * 4 + 12,
            delay: Math.random() * 10,
        }));
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div 
            style={{ 
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden',
                // This forces a dedicated GPU layer for the entire container
                transform: 'translateZ(0)', 
                willChange: 'transform'
            }}
        >
            {heartData.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: "110vh", x: `${heart.left}vw`, opacity: 0 }}
                    animate={{ 
                        y: "-15vh", 
                        opacity: [0, 0.4, 0.4, 0],
                        rotate: 360 // Simple rotation
                    }}
                    transition={{ 
                        duration: heart.duration,
                        repeat: Infinity, 
                        delay: heart.delay,
                        ease: "linear"
                    }}
                    // This is the most important line for scroll performance
                    style={{ position: 'absolute', willChange: 'transform' }}
                >
                    <svg 
                        width={heart.size} 
                        height={heart.size} 
                        viewBox="0 0 24 24" 
                        fill="rgba(244, 114, 182, 0.4)" // Hardcoded opacity in color
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>
            ))}
        </div>,
        document.body
    );
};

export default FloatingHearts;