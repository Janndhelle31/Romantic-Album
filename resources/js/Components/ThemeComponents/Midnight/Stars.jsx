import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Stars() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const starColors = [
        "text-white",
        "text-indigo-200",
        "text-blue-100",
        "text-purple-200",
        "text-cyan-100",
    ];

    // Different star symbols for variety
    const starShapes = ["✦", "✧", "★", "✷", "•"];

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent">
            
            {/* 1. DRIFTING COSMIC ORBS (Floating Upward) */}
            {[...Array(25)].map((_, i) => {
                const size = Math.random() * 12 + 8; 
                const color = starColors[Math.floor(Math.random() * starColors.length)];
                const shape = starShapes[Math.floor(Math.random() * starShapes.length)];
                const leftPos = Math.random() * 100;
                const isGlow = Math.random() > 0.5;
                
                return (
                    <motion.div
                        key={`drift-${i}`}
                        initial={{ 
                            y: "110vh", 
                            x: `${leftPos}%`, 
                            opacity: 0,
                            scale: 0.2
                        }}
                        animate={{ 
                            y: "-10vh", 
                            opacity: [0, isGlow ? 0.8 : 0.4, 0],
                            scale: [0.5, 1.2, 0.5],
                            rotate: 360
                        }}
                        transition={{ 
                            duration: Math.random() * 20 + 15, // Very slow cosmic drift
                            repeat: Infinity, 
                            delay: Math.random() * 20,
                            ease: "linear"
                        }}
                        className={`absolute ${color} ${isGlow ? 'drop-shadow-[0_0_8px_rgba(199,210,254,0.8)]' : ''}`}
                        style={{ fontSize: `${size}px` }}
                    >
                        {shape}
                    </motion.div>
                );
            })}
            
            {/* 2. STATIC TWINKLING BACKGROUND STARS */}
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={`static-${i}`}
                    className="absolute w-[2px] h-[2px] bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        boxShadow: '0 0 6px 1px #fff'
                    }}
                    animate={{ 
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                />
            ))}

            {/* 3. SHOOTING STARS (Occasional streak) */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`shooting-${i}`}
                    initial={{ x: "-10%", y: "20%", opacity: 0, scaleX: 0 }}
                    animate={{ 
                        x: "110%", 
                        y: "60%", 
                        opacity: [0, 1, 0],
                        scaleX: [0, 1, 0] 
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 8 + Math.random() * 10,
                        delay: i * 5,
                        ease: "easeIn"
                    }}
                    className="absolute w-24 h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-white origin-left -rotate-[25deg]"
                />
            ))}
        </div>
    );
}