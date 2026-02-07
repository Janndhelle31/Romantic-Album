// import { useState } from 'react';

// export default function ThemeSelector({ currentTheme, onThemeChange }) {
//     const [isOpen, setIsOpen] = useState(false);
    
//     const themes = [
//         { id: 'default', name: 'Sunshine', icon: '☀️', color: 'bg-yellow-100' },
//         { id: 'midnight', name: 'Midnight', icon: '🌙', color: 'bg-indigo-900' },
//         { id: 'classy', name: 'Classy', icon: '👔', color: 'bg-gray-800' },
//         { id: 'vintage', name: 'Vintage', icon: '📜', color: 'bg-amber-50' },
//     ];
    
//     const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow"
//             >
//                 <span className="text-xl">{currentThemeObj.icon}</span>
//                 <span className="font-medium">{currentThemeObj.name}</span>
//                 <span className="text-gray-400">▼</span>
//             </button>
            
//             {isOpen && (
//                 <>
//                     <div 
//                         className="fixed inset-0 z-40" 
//                         onClick={() => setIsOpen(false)}
//                     />
//                     <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-xl p-2 min-w-[200px]">
//                         {themes.map((theme) => (
//                             <button
//                                 key={theme.id}
//                                 onClick={() => {
//                                     onThemeChange(theme.id);
//                                     setIsOpen(false);
//                                 }}
//                                 className={`flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-gray-50 transition-colors ${
//                                     currentTheme === theme.id ? 'bg-gray-100' : ''
//                                 }`}
//                             >
//                                 <span className="text-xl">{theme.icon}</span>
//                                 <span className="font-medium">{theme.name}</span>
//                                 {currentTheme === theme.id && (
//                                     <span className="ml-auto text-green-500">✓</span>
//                                 )}
//                             </button>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }