import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider — manages dark/light mode state across the app.
 * - Persists choice to localStorage
 * - Respects system `prefers-color-scheme` on first visit
 * - Syncs `.dark` / `.light` class on <html> for CSS variable switching
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('minta-theme');
      if (saved) return saved === 'dark';
      // Respect system preference on first visit
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Sync theme class on <html> and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('minta-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme — hook to access theme state from any component.
 * Throws if used outside ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
