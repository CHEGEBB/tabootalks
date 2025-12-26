/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Brand
  primary: string;
  secondary: string;
  
  // UI
  border: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  
  // Components
  cardBg: string;
  inputBg: string;
  navBg: string;
  modalBg: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
}

const lightTheme: ThemeColors = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
  bgHover: '#e5e7eb',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  primary: '#ff2e2e',
  secondary: '#5e17eb',
  border: '#e5e7eb',
  divider: '#f3f4f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cardBg: '#ffffff',
  inputBg: '#ffffff',
  navBg: '#ffffff',
  modalBg: '#ffffff',
};

const darkTheme: ThemeColors = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#262626',
  bgHover: '#333333',
  textPrimary: '#ffffff',
  textSecondary: '#e5e5e5',
  textTertiary: '#9ca3af',
  primary: '#ff2e2e',
  secondary: '#5e17eb',
  border: '#333333',
  divider: '#262626',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cardBg: '#1a1a1a',
  inputBg: '#262626',
  navBg: '#0a0a0a',
  modalBg: '#1a1a1a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
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