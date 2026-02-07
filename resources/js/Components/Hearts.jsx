import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hearts() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        y: -20, 
                        x: `${Math.random() * 100}%`, 
                        opacity: 0 
                    }}
                    animate={{ 
                        y: "110vh", 
                        opacity: [0, 1, 1, 0],
                        rotate: 360 
                    }}
                    transition={{ 
                        duration: Math.random() * 5 + 5, 
                        repeat: Infinity, 
                        delay: Math.random() * 5 
                    }}
                    className="absolute text-pink-200 text-2xl"
                >
                    ♥
                </motion.div>
            ))}
        </div>
    );
}