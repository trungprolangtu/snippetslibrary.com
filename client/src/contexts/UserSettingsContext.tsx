import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { UserSettings, UserSettingsContextType, UserSettingsProviderProps } from '../types';

// Default code themes for light/dark UI themes
const DEFAULT_CODE_THEMES = {
  light: 'github-light',
  dark: 'github-dark',
} as const;

const DEFAULT_SETTINGS: UserSettings = {
  username: '',
  codeTheme: 'auto', // 'auto' means use default based on UI theme
  uiTheme: 'system',
  
  // SEO settings
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  seoImageUrl: '',
  
  // Customization settings
  customHeaderTitle: '',
  customHeaderDescription: '',
  customBrandingColor: '#3b82f6',
  customBrandingLogo: '',
  profileBannerUrl: '',
  socialLinks: {},
  customDomain: '',
  
  // Privacy settings
  isProfilePublic: true,
  showGithubStats: true,
  showActivityFeed: true,
  emailNotifications: true,
  enableAnalytics: false,
  twoFactorEnabled: false,
};

export const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: UserSettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Save to localStorage
      try {
        localStorage.setItem('userSettings', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save user settings:', error);
      }
      return updated;
    });
  }, []);

  const getEffectiveUiTheme = useCallback((): 'light' | 'dark' => {
    if (settings.uiTheme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.uiTheme;
  }, [settings.uiTheme]);

  const getEffectiveCodeTheme = useCallback((): string => {
    // If user has set a custom code theme, use that
    if (settings.codeTheme && settings.codeTheme !== 'auto') {
      return settings.codeTheme;
    }
    // Otherwise use default based on UI theme
    const uiTheme = getEffectiveUiTheme();
    return DEFAULT_CODE_THEMES[uiTheme];
  }, [settings.codeTheme, getEffectiveUiTheme]);

  const value = useMemo(() => ({
    settings,
    updateSettings,
    isLoading,
    getEffectiveCodeTheme,
    getEffectiveUiTheme,
  }), [settings, updateSettings, isLoading, getEffectiveCodeTheme, getEffectiveUiTheme]);

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}
