// lib/services/themeService.ts

export interface ThemeColors {
  // Background colors
  background: string;
  panelBackground: string;
  cardBackground: string;
  inputBackground: string;
  
  // Text colors
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  placeholderText: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Accent colors
  primary: string;       // #ff2e2e
  secondary: string;     // #5e17eb
  success: string;       // #10b981
  warning: string;       // #f59e0b
  danger: string;        // #ff2e2e
  
  // Hover states
  hoverBackground: string;
  activeBackground: string;
  
  // Specific UI elements
  iconColor: string;
  linkColor: string;
}

export const lightThemeColors: ThemeColors = {
  // Background colors - LIGHT MODE
  background: '#ffffff',
  panelBackground: '#f8f9fa',
  cardBackground: '#ffffff',
  inputBackground: '#f1f3f4',
  
  // Text colors - DARK TEXT for visibility
  primaryText: '#000000',
  secondaryText: '#333333',
  tertiaryText: '#666666',
  placeholderText: '#888888',
  
  // Border colors
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  
  // Accent colors (from your palette)
  primary: '#ff2e2e',
  secondary: '#5e17eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ff2e2e',
  
  // Hover states
  hoverBackground: '#f5f5f5',
  activeBackground: '#eeeeee',
  
  // Specific UI elements
  iconColor: '#5e17eb',
  linkColor: '#5e17eb',
};

export const darkThemeColors: ThemeColors = {
  // Background colors - DARK MODE (WhatsApp-like)
  background: '#111b21',
  panelBackground: '#202c33',
  cardBackground: '#202c33',
  inputBackground: '#2a3942',
  
  // Text colors
  primaryText: '#e9edef',
  secondaryText: '#8696a0',
  tertiaryText: '#667781',
  placeholderText: '#8696a0',
  
  // Border colors
  border: '#2a3942',
  borderLight: '#3a4a52',
  
  // Accent colors (from your palette)
  primary: '#ff2e2e',
  secondary: '#5e17eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ff2e2e',
  
  // Hover states
  hoverBackground: '#2a3942',
  activeBackground: '#3a4a52',
  
  // Specific UI elements
  iconColor: '#5e17eb',
  linkColor: '#5e17eb',
};

export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? darkThemeColors : lightThemeColors;
}

export function applyThemeToDocument(isDark: boolean) {
  const colors = getThemeColors(isDark);
  const root = document.documentElement;
  
  // Set CSS custom properties for easy access
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

export function useThemeColors(isDark: boolean): ThemeColors {
  return getThemeColors(isDark);
}