const THEME_STORAGE_KEY = 'memory_book_theme';

export const saveTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    // Also update session storage for immediate use
    sessionStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export const getSavedTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(THEME_STORAGE_KEY) || 
           sessionStorage.getItem(THEME_STORAGE_KEY) || 
           'default';
  }
  return 'default';
};

export const clearThemeStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(THEME_STORAGE_KEY);
    sessionStorage.removeItem(THEME_STORAGE_KEY);
  }
};