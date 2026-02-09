"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSelector({ 
  selectedTheme = 'default', 
  onThemeChange,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Theme configurations
  const themeConfigs = {
    default: {
      name: 'Default',
      icon: '🎨',
      description: 'Clean & Modern',
      bgColor: 'bg-white',
      textColor: 'text-zinc-900',
      borderColor: 'border-zinc-200',
      accentColor: 'zinc',
      buttonBg: 'bg-gradient-to-r from-zinc-900 to-zinc-800',
      badgeBg: 'bg-gradient-to-r from-zinc-50 to-zinc-100'
    },
    midnight: {
      name: 'Midnight',
      icon: '🌙',
      description: 'Dark & Dramatic',
      bgColor: 'bg-zinc-900',
      textColor: 'text-zinc-100',
      borderColor: 'border-zinc-700',
      accentColor: 'indigo',
      buttonBg: 'bg-gradient-to-r from-indigo-700 to-purple-800',
      badgeBg: 'bg-gradient-to-r from-indigo-900/40 to-purple-900/30'
    },
    classy: {
      name: 'Classy',
      icon: '🤵',
      description: 'Elegant & Sophisticated',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-200',
      accentColor: 'amber',
      buttonBg: 'bg-gradient-to-r from-amber-600 to-amber-700',
      badgeBg: 'bg-gradient-to-r from-amber-100 to-amber-50'
    },
    vintage: {
      name: 'Vintage',
      icon: '📜',
      description: 'Nostalgic & Warm',
      bgColor: 'bg-stone-50',
      textColor: 'text-stone-800',
      borderColor: 'border-stone-300',
      accentColor: 'stone',
      buttonBg: 'bg-gradient-to-r from-stone-600 to-stone-700',
      badgeBg: 'bg-gradient-to-r from-stone-100 to-stone-50'
    },
    nature: {
      name: 'Nature',
      icon: '🌿',
      description: 'Fresh & Organic',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-200',
      accentColor: 'emerald',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
      badgeBg: 'bg-gradient-to-r from-emerald-100 to-emerald-50'
    }
  };

  const currentTheme = themeConfigs[selectedTheme];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Get current theme badge gradient
  const getBadgeGradient = (theme) => {
    const gradients = {
      default: 'from-zinc-100 to-zinc-200',
      midnight: 'from-indigo-900/40 to-purple-900/30',
      classy: 'from-amber-100 to-amber-200',
      vintage: 'from-stone-100 to-stone-200',
      nature: 'from-emerald-100 to-emerald-200'
    };
    return `bg-gradient-to-r ${gradients[theme]}`;
  };

  return (
    <div className={`theme-selector relative ${className}`}>
      {/* Main theme selector button - BIG & NOTICEABLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${currentTheme.borderColor} ${currentTheme.buttonBg} text-white font-medium group`}
        aria-label="Change theme"
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <span className="text-sm font-semibold hidden sm:inline">Theme:</span>
        <span className="text-sm font-bold hidden sm:inline">{currentTheme.name}</span>
        <span className="text-xs opacity-80 group-hover:rotate-180 transition-transform duration-300">▼</span>
      </button>

      {/* Current theme indicator for mobile */}
      <div className={`sm:hidden absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 ${currentTheme.borderColor} ${currentTheme.buttonBg} flex items-center justify-center text-white text-xs font-bold`}>
        {currentTheme.icon}
      </div>

      {/* Dropdown - LARGE & VISIBLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute right-0 mt-3 w-72 sm:w-80 ${currentTheme.bgColor} backdrop-blur-xl rounded-2xl border-2 ${currentTheme.borderColor} shadow-2xl py-4 z-50`}
            style={{ 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <div className={`px-4 pb-3 mb-3 border-b ${currentTheme.borderColor}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎭</span>
                <div>
                  <p className={`text-sm font-bold ${currentTheme.textColor}`}>Preview Themes</p>
                  <p className={`text-xs ${currentTheme.textColor} opacity-70 mt-1`}>Try different styles for your story</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 px-3 max-h-80 overflow-y-auto">
              {Object.entries(themeConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    onThemeChange(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${selectedTheme === key ? 'border-2 scale-[1.02]' : 'border'} ${config.borderColor} ${selectedTheme === key ? `${getBadgeGradient(key)} font-bold` : `hover:scale-[1.01] ${currentTheme.textColor}`}`}
                >
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${selectedTheme === key ? currentTheme.textColor : ''}`}>{config.name}</div>
                    <div className={`text-xs ${currentTheme.textColor} opacity-70 mt-0.5`}>{config.description}</div>
                  </div>
                  {selectedTheme === key && (
                    <span className={`text-lg font-bold ${currentTheme.textColor}`}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Theme preview mini display */}
            <div className={`mt-4 px-3`}>
              <div className={`h-12 rounded-lg border ${currentTheme.borderColor} grid grid-cols-6 gap-1 p-2`}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`rounded ${
                    selectedTheme === 'midnight' ? 'bg-indigo-500' : 
                    selectedTheme === 'classy' ? 'bg-amber-300' : 
                    selectedTheme === 'vintage' ? 'bg-stone-300' : 
                    selectedTheme === 'nature' ? 'bg-emerald-300' : 
                    'bg-zinc-300'
                  }`}></div>
                ))}
              </div>
            </div>

            <div className={`px-4 pt-4 mt-4 border-t ${currentTheme.borderColor}`}>
              <p className={`text-xs ${currentTheme.textColor} opacity-60 italic text-center`}>
                ✨ Full customization in premium version
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}