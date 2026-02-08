"use client";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const FloatingNature = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const leafData = useMemo(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const count = isMobile ? 6 : 12; // Lower count for better performance
        const types = ['🍃', '🌿', '🌸', '🍂'];
        
        return [...Array(count)].map((_, i) => ({
            id: i,
            char: types[i % types.length],
            left: Math.random() * 100,
            duration: 10 + Math.random() * 10, // Slower is smoother
            delay: Math.random() * 10,
            size: 18 + Math.random() * 10,
        }));
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ 
                contain: 'strict',
                transform: 'translateZ(0)' // Force GPU layer
            }}
        >
            {leafData.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    initial={{ 
                        opacity: 0, 
                        x: `${leaf.left}vw`, 
                        y: "-10vh",
                        rotate: 0 
                    }}
                    animate={{ 
                        opacity: [0, 0.6, 0.6, 0],
                        y: "110vh",
                        // Using a simple rotation and a straight line is faster.
                        // We can simulate sway using a slight rotate skew instead of x-array.
                        rotate: 360 
                    }}
                    transition={{ 
                        duration: leaf.duration, 
                        repeat: Infinity, 
                        delay: leaf.delay,
                        ease: "linear"
                    }}
                    className="absolute will-change-transform transform-gpu"
                    style={{ fontSize: `${leaf.size}px`, top: 0, left: 0 }}
                >
                    {leaf.char}
                </motion.div>
            ))}
        </div>,
        document.body
    );
};

export default FloatingNature;