type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app-theme';

export const themeService = {
  // Get saved theme from localStorage
  getTheme: (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  },

  // Save theme to localStorage
  setTheme: (theme: ThemeMode): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  },

  // Remove theme from localStorage
  removeTheme: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(THEME_STORAGE_KEY);
  },

  // Get system preference
  getSystemTheme: (): ThemeMode => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  // Apply theme to document
  applyTheme: (theme: ThemeMode): void => {
    if (typeof window === 'undefined') return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Initialize theme (checks saved preference, then system preference)
  initTheme: (): ThemeMode => {
    const savedTheme = themeService.getTheme();
    if (savedTheme) {
      themeService.applyTheme(savedTheme);
      return savedTheme;
    }
    
    const systemTheme = themeService.getSystemTheme();
    themeService.applyTheme(systemTheme);
    return systemTheme;
  },

  // Toggle between light and dark
  toggleTheme: (currentTheme: ThemeMode): ThemeMode => {
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    themeService.setTheme(newTheme);
    themeService.applyTheme(newTheme);
    return newTheme;
  },
};