// lib/hooks/useThemeColors.ts
import { useTheme } from '@/lib/context/ThemeContext';

export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}