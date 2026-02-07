// resources/js/Components/ThemeComponents/Nature/Hearts.jsx
import { motion } from "framer-motion";

const NatureHearts = () => {
    const leaves = Array.from({ length: 15 });
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[50]">
            {leaves.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        opacity: 0, 
                        x: Math.random() * window.innerWidth, 
                        y: -100,
                        rotate: 0 
                    }}
                    animate={{ 
                        opacity: [0, 0.7, 0],
                        y: window.innerHeight + 100,
                        x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
                        rotate: 360
                    }}
                    transition={{ 
                        duration: 10 + Math.random() * 10, 
                        repeat: Infinity, 
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                    className="absolute text-2xl"
                >
                    {['🍃', '🌿', '🌸', '🍂'][i % 4]}
                </motion.div>
            ))}
        </div>
    );
};

export default NatureHearts;