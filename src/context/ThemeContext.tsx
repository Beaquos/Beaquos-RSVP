import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void; // cycles auto -> dark -> light -> auto or toggles
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_STORAGE_KEY = 'korza_theme_mode';
const LEGACY_THEME_KEY = 'korza_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mode can be 'light', 'dark', or 'auto' (device preference)
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const savedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
      if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto') {
        return savedMode;
      }
      const legacy = localStorage.getItem(LEGACY_THEME_KEY) || localStorage.getItem('theme');
      if (legacy === 'light' || legacy === 'dark') {
        return legacy;
      }
    } catch {
      // fallback
    }
    return 'auto';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to OS/Device preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute resolved active theme ('light' or 'dark')
  const resolvedTheme: ResolvedTheme = mode === 'auto' ? (systemIsDark ? 'dark' : 'light') : mode;

  // Apply to document root
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      localStorage.setItem(LEGACY_THEME_KEY, resolvedTheme);
      localStorage.setItem('theme', resolvedTheme);
    } catch {
      // ignore localStorage errors
    }
  }, [mode, resolvedTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  // Cycling through modes: light -> dark -> auto -> light
  const toggleTheme = () => {
    setModeState((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: resolvedTheme, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
