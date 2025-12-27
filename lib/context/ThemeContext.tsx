/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { applyThemeToDocument, getThemeColors, ThemeColors } from '@/lib/services/themeService';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  mounted: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tabootalks-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);
  const [colors, setColors] = useState(getThemeColors(false));

  // Initialize theme on mount
  useEffect(() => {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        applyTheme(savedTheme);
        setThemeState(savedTheme);
      } else {
        // Check system preference as fallback
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        applyTheme(systemTheme);
        setThemeState(systemTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Fallback to light theme
      applyTheme('light');
      setThemeState('light');
    }
    
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    try {
      const root = document.documentElement;
      const isDark = newTheme === 'dark';
      
      // Apply theme colors
      applyThemeToDocument(isDark);
      
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      
      // Update colors state
      setColors(getThemeColors(isDark));
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    mounted,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}