import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
            
            <div className="w-full max-w-md relative z-10">
                {/* Header & Navigation */}
                <div className="text-center mb-10">
             
                    
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                System Secure
                            </span>
                        </div>

                        {/* PREVIEW BUTTON: For visitors who want to see the dummy data */}
                        <Link 
                            href={route('public.preview')} 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors group"
                        >
                            <span>Not ready to sign in? View Demo</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
                    {children}
                </div>
                
                {/* Professional Footer */}
                <div className="mt-10 text-center space-y-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-medium">
                        &copy; {new Date().getFullYear()} Digital Archive
                    </p>
                    <div className="flex justify-center gap-4 text-[10px] text-zinc-300">
                        <span>Reliability</span>
                        <span>•</span>
                        <span>Security</span>
                        <span>•</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </div>

            {/* Subtle Structural Background Element */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-zinc-100/50 rounded-full blur-3xl"></div>
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-zinc-100/50 rounded-full blur-3xl"></div>
        </div>
    );
}