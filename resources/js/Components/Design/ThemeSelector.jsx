import React from 'react';
import { motion } from 'framer-motion';

const ThemeSelector = ({ 
    themes, 
    selectedTheme, 
    themeLoading, 
    onThemeChange, 
    getThemeName,
    isThemeActive,
    userTheme
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {themes.map((theme) => {
                const isActive = isThemeActive(theme.id);
                const isSelected = selectedTheme === theme.id;
                const isPending = themeLoading && selectedTheme === theme.id;
                
                return (
                    <motion.div
                        key={theme.id}
                        whileHover={!themeLoading ? { y: -5 } : {}}
                        whileTap={!themeLoading ? { scale: 0.98 } : {}}
                        className={`relative cursor-pointer overflow-hidden rounded-2xl border-3 transition-all duration-300 ${
                            isActive 
                                ? 'ring-4 ring-green-400 ring-opacity-30 border-green-400 shadow-xl' 
                                : isSelected && !isActive
                                ? 'ring-2 ring-pink-300 ring-opacity-30 border-pink-300'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                        } ${isPending ? 'opacity-70' : ''}`}
                        onClick={() => !themeLoading && onThemeChange(theme.id)}
                    >
                        <div className={`p-6 ${theme.bgPreview} relative overflow-hidden`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-14 h-14 rounded-full ${theme.color} flex items-center justify-center text-2xl shadow-lg`}>
                                    {theme.emoji}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {isActive && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                                        >
                                            ACTIVE
                                        </motion.span>
                                    )}
                                    {isPending && (
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                                        >
                                            SAVING...
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className={`text-xl font-bold mb-2 ${isActive ? theme.textColor : 'text-gray-800'}`}>
                                {theme.name}
                            </h3>
                            
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {theme.description}
                            </p>
                            
                            {isActive && (
                                <div className="mt-3">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        Your Current Theme
                                    </span>
                                </div>
                            )}
                            
                            {isPending && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
                                        <span className="text-sm text-pink-600 font-medium">Applying theme...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-gray-500">
                                    {isActive ? '✓ Active' : isSelected ? 'Selected' : 'Click to select'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ThemeSelector;