import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform">
                        <div className="relative">
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-xs">✨</span>
                            </div>
                        </div>
                    </Link>
                    <div className="mt-4">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600 font-medium">Welcome to our cozy corner</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl p-8 shadow-xl shadow-rose-100/30">
                    {children}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 mb-2">
                        Made with <span className="text-rose-300 animate-pulse">♥</span> for lovely humans
                    </p>
                    <p className="text-xs text-gray-300">
                        &copy; {new Date().getFullYear()} Cozy Portal • All pawsitive vibes reserved
                    </p>
                </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="fixed top-10 left-10 w-6 h-6 rounded-full bg-amber-100/50 animate-float"></div>
            <div className="fixed bottom-20 right-10 w-4 h-4 rounded-full bg-rose-100/50 animate-float" style={{animationDelay: '1s'}}></div>
            <div className="fixed top-1/3 right-20 w-3 h-3 rounded-full bg-emerald-100/50 animate-float" style={{animationDelay: '2s'}}></div>
            
            {/* Add animation keyframes */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}