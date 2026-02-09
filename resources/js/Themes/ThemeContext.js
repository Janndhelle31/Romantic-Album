// Context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [globalTheme, setGlobalTheme] = useState('default');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check both userTheme and previewTheme
    const storedUserTheme = localStorage.getItem('userTheme');
    const storedPreviewTheme = localStorage.getItem('previewTheme');
    
    // Default to previewTheme if in preview context, otherwise userTheme
    const initialTheme = storedPreviewTheme || storedUserTheme || 'default';
    setGlobalTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  const updateGlobalTheme = (newTheme, isPreview = false) => {
    setGlobalTheme(newTheme);
    
    if (isPreview) {
      localStorage.setItem('previewTheme', newTheme);
    } else {
      localStorage.setItem('userTheme', newTheme);
    }
    
    // Apply theme class to html element
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      globalTheme, 
      updateGlobalTheme,
      isInitialized 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};