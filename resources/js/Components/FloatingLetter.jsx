import { motion } from "framer-motion";
import { useRef } from "react";

const FloatingLetter = ({ onClick }) => {
    // Reference to constraints (optional, but keeps the letter within the viewport)
    const constraintRef = useRef(null);

    return (
        /* The container acts as the 'fence' for the drag area */
        <div ref={constraintRef} className="fixed inset-0 pointer-events-none z-[200]">
            <motion.button
                // 1. DRAG PROPS
                drag
                dragConstraints={constraintRef} // Keeps the letter inside the screen
                dragElastic={0.2} // Adds a rubber-band effect at the edges
                dragMomentum={true} // Allows it to fly a bit when flicked
                
                // 2. ANIMATION PROPS
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    // The floating bobbing effect
                    y: [0, -12, 0],
                    rotate: [-1, 2, -1] 
                }}
                transition={{
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    y: {
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut"
                    },
                    rotate: {
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut"
                    }
                }}
                
                // 3. INTERACTION PROPS
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, cursor: "grabbing" }}
                onClick={onClick}
                
                // 4. STYLING
                // We use 'pointer-events-auto' because the parent container is 'none'
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 pointer-events-auto cursor-grab outline-none"
            >
                <div className="relative group">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-pink-200 blur-2xl opacity-30 group-hover:opacity-60 transition-opacity rounded-full" />
                    
                    {/* The Envelope */}
                    <div className="relative bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border-2 border-pink-100 shadow-2xl transition-shadow group-active:shadow-inner">
                        <span className="text-3xl md:text-4xl block">✉️</span>
                        
                        {/* Pulse dot */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                        </span>
                    </div>
                </div>
            </motion.button>
        </div>
    );
};

export default FloatingLetter;