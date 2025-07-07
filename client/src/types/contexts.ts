// Context-related types and interfaces

import type { User } from 'shared';

// AuthContext types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

// UserSettingsContext types
export interface UserSettings {
  username: string;
  codeTheme: string;
  uiTheme: 'light' | 'dark' | 'system';
  
  // SEO settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoImageUrl: string;
  
  // Customization settings
  customHeaderTitle: string;
  customHeaderDescription: string;
  customBrandingColor: string;
  customBrandingLogo: string;
  profileBannerUrl: string;
  socialLinks: Record<string, string>;
  customDomain: string;
  
  // Privacy settings
  isProfilePublic: boolean;
  showGithubStats: boolean;
  showActivityFeed: boolean;
  emailNotifications: boolean;
  enableAnalytics: boolean;
  twoFactorEnabled: boolean;
}

export interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  isLoading: boolean;
  getEffectiveCodeTheme: () => string;
  getEffectiveUiTheme: () => 'light' | 'dark';
}

export interface UserSettingsProviderProps {
  children: React.ReactNode;
}
