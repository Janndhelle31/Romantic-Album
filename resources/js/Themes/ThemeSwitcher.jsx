import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { themes } from "./themeConfig";

export default function ThemeSwitcher() {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Only show theme switcher if we have multiple themes
  const availableThemes = Object.keys(themes);
  if (availableThemes.length <= 1) return null;

  return (
    <div className="fixed top-4 right-4 z-[1000]">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-2xl">🎨</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Choose Theme</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(themes).map(([key, config]) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                    theme === key 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: config.colors.primary,
                        color: config.colors.text
                      }}
                    >
                      <span className="text-sm">
                        {key === 'midnight' ? '🌙' : 
                         key === 'classy' ? '🎩' : 
                         key === 'nature' ? '🌿' : '📖'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{config.name}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  {theme === key && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Current theme preview */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Current Theme:</p>
              <div 
                className="h-12 rounded-lg flex items-center justify-center font-medium"
                style={{ 
                  backgroundColor: themeConfig.colors.background,
                  color: themeConfig.colors.text,
                  border: `2px solid ${themeConfig.colors.accent}`
                }}
              >
                {themeConfig.name}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}