import { motion } from "framer-motion";

export default function MiddleNightLetterModal({ onClose, data }) {
    const {
        recipient = "My Starlight",
        message = "Under the midnight sky, I write these words...",
        closing = "Forever under the same stars",
        sender = "Your Moon"
    } = data || {};

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop with stars */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={onClose} 
            >
                {/* Animated stars in backdrop */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        className="absolute w-[1px] h-[1px] bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            boxShadow: '0 0 6px 1px rgba(255,255,255,0.8)'
                        }}
                    />
                ))}
            </motion.div>

            {/* Letter Container */}
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg z-[510]"
            >
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-8 md:p-14 shadow-2xl rounded-lg border-l-4 border-purple-500 relative max-h-[90vh] overflow-y-auto">
                    
                    {/* Star pattern overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                         style={{
                             backgroundImage: `radial-gradient(circle at 10% 20%, white 1px, transparent 1px),
                                              radial-gradient(circle at 90% 40%, white 1px, transparent 1px),
                                              radial-gradient(circle at 50% 80%, white 1px, transparent 1px)`,
                             backgroundSize: '100px 100px'
                         }} />
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg blur-xl opacity-50" />
                    
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 z-20 bg-gray-800/50 rounded-full p-2 hover:bg-gray-800/80 transition-all"
                    >
                        <span className="text-xl">✕</span>
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 rounded-full border-2 border-purple-400"
                            />
                            <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 italic">
                                {recipient},
                            </h2>
                        </div>
                        
                        <div className="font-sans text-lg leading-relaxed text-gray-200 space-y-6">
                            <p className="whitespace-pre-line border-l-4 border-purple-500/30 pl-4 py-2">
                                {message}
                            </p>
                            
                            <div className="pt-8 text-right">
                                <div className="inline-block border-t border-gray-600 pt-4">
                                    <p className="text-gray-400 italic">{closing},</p>
                                    <p className="text-4xl mt-2 font-light bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        {sender}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wax seal effect */}
                        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 opacity-70 border-2 border-purple-900/50" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}