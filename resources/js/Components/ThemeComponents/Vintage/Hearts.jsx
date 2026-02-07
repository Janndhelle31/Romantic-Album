import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function VintageHearts() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    // A mix of vintage-style heart symbols and floral flourishes
    const vintageSymbols = ["♥", "❦", "❧", "♡"];

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
            {[...Array(12)].map((_, i) => {
                const leftPos = Math.floor(Math.random() * 100);
                const symbol = vintageSymbols[i % vintageSymbols.length];
                
                return (
                    <motion.div
                        key={i}
                        initial={{ 
                            y: "110vh", 
                            x: `${leftPos}%`, 
                            opacity: 0,
                            scale: 0.4,
                            rotate: Math.random() * 360 // Start at a random angle
                        }}
                        animate={{ 
                            y: "-10vh", 
                            opacity: [0, 0.4, 0.4, 0], // Kept faint like an old memory
                            scale: [0.4, 1.1, 0.9],
                            rotate: [0, 90, 180, 270] // Slow, tumbling rotation like falling leaves
                        }}
                        transition={{ 
                            duration: Math.random() * 12 + 10, // Much slower for that "drifting" feel
                            repeat: Infinity, 
                            delay: Math.random() * 15, 
                            ease: "easeInOut"
                        }}
                        // Using brown/sepia colors and a slight blur
                        className="absolute text-[#8B4513] opacity-30 mix-blend-multiply blur-[0.5px]"
                        style={{ 
                            fontSize: `${Math.random() * 15 + 25}px`,
                            fontFamily: 'serif' 
                        }}
                    >
                        {symbol}
                    </motion.div>
                );
            })}
        </div>
    );
}