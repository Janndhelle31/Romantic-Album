import { createContext, useState, useContext, useEffect } from 'react';
import { themes } from './themeConfig';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('default');
  const themeConfig = themes[theme] || themes.default;

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved && themes[saved]) {
      setTheme(saved);
    }
  }, []);

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}