import { useEffect, useCallback, useMemo } from 'react';
import { useUserSettings } from './useUserSettings';
import { useAuth } from '../contexts/AuthContext';

export function useTheme() {
  const { settings, updateSettings } = useUserSettings();
  const { user } = useAuth();

  // Helper functions
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  const getContrastColor = useCallback((hexColor: string): string => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#ffffff';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }, [hexToRgb]);

  // Memoize the effective theme and branding color to avoid unnecessary recalculations
  const effectiveTheme = useMemo(() => {
    return (user?.uiTheme || settings.uiTheme) as 'light' | 'dark' | 'system';
  }, [user?.uiTheme, settings.uiTheme]);

  const brandingColor = useMemo(() => {
    return user?.customBrandingColor || settings.customBrandingColor;
  }, [user?.customBrandingColor, settings.customBrandingColor]);

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    // Apply theme
    applyTheme(effectiveTheme);

    // Apply custom branding color if available
    if (brandingColor && brandingColor !== '#3b82f6') {
      root.style.setProperty('--primary', brandingColor);
      root.style.setProperty('--primary-foreground', getContrastColor(brandingColor));
    } else {
      // Reset to default
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
    }

    // Listen for system theme changes when using system theme
    if (effectiveTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [effectiveTheme, brandingColor, getContrastColor]);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    updateSettings({ uiTheme: theme });
  }, [updateSettings]);

  return {
    theme: effectiveTheme,
    setTheme,
  };
}
