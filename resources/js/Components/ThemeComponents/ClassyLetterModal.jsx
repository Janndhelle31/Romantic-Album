import { motion } from "framer-motion";

export default function ClassyLetterModal({ onClose, data }) {
    const {
        recipient = "Dearest",
        message = "With utmost sincerity and admiration, I pen these words...",
        closing = "Yours faithfully",
        sender = ""
    } = data || {};

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" 
                onClick={onClose} 
            />

            {/* Letter Container */}
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-2xl z-[510]"
            >
                {/* Envelope flap effect */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-gradient-to-b from-amber-900/20 to-transparent rounded-t-full" />
                
                {/* Paper */}
                <div className="bg-gradient-to-b from-amber-50 to-stone-50 p-12 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
                    
                    {/* Watermark */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                        <span className="text-[300px] font-serif italic">M</span>
                    </div>
                    
                    {/* Crease lines */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-300/20 to-transparent" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
                    
                    {/* Close button */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 text-stone-400 hover:text-amber-700 z-20 bg-white/50 rounded-full p-2 hover:bg-white/80 transition-all"
                    >
                        <span className="text-lg font-light">×</span>
                    </button>

                    {/* Letter content */}
                    <div className="relative z-10">
                        {/* Letterhead */}
                        <div className="flex justify-between items-start mb-12 pb-6 border-b border-amber-300/30">
                            <div>
                                <div className="text-sm text-stone-500 tracking-widest uppercase mb-1">Personal Correspondence</div>
                                <div className="text-2xl font-serif text-stone-800">To: {recipient}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-stone-500">{new Date().toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</div>
                                <div className="text-xs text-stone-400 mt-1">Confidential</div>
                            </div>
                        </div>
                        
                        {/* Message */}
                        <div className="font-serif text-lg leading-loose text-stone-700 space-y-6">
                            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                {message}
                            </p>
                            
                            {/* Closing */}
                            <div className="pt-12">
                                <div className="text-right space-y-4">
                                    <p className="text-stone-600 italic">{closing},</p>
                                    <div className="inline-block relative">
                                        <p className="text-3xl text-stone-800 font-light tracking-wider">{sender}</p>
                                        <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-amber-600 to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seal */}
                        <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-4 border-amber-200/50 flex items-center justify-center">
                            <span className="text-white text-2xl">S</span>
                        </div>
                    </div>
                </div>

                {/* Shadow */}
                <div className="absolute -inset-4 bg-gradient-to-b from-amber-900/10 to-transparent rounded-2xl blur-xl -z-10" />
            </motion.div>
        </div>
    );
}