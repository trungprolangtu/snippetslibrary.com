// Base API response type
export type ApiResponse<T = any> = {
  message: string;
  success: boolean;
  data?: T;
}

// User types
export interface User {
  id: string;
  githubId: number;
  username: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  company: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  
  // SEO and customization fields
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoImageUrl: string | null;
  customHeaderTitle: string | null;
  customHeaderDescription: string | null;
  customBrandingColor: string;
  customBrandingLogo: string | null;
  uiTheme: string;
  codeTheme: string;
  profileBannerUrl: string | null;
  socialLinks: Record<string, string>;
  customDomain: string | null;
  isProfilePublic: boolean;
  showGithubStats: boolean;
  showActivityFeed: boolean;
  emailNotifications: boolean;
  enableAnalytics: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// Snippet types
export interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  shareId: string | null;
  userId: string;
  
  // SEO fields for public snippets
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoImageUrl: string | null;
  customSlug: string | null;
  
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CreateSnippetRequest {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateSnippetRequest {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Auth types
export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: Date;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  language?: string;
  tags?: string[];
  userId?: string;
  isPublic?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  response?: any;
}

// API endpoints response types
export interface AuthLoginResponse {
  url: string;
}

export interface ShareSnippetResponse {
  shareId: string;
  shareUrl: string;
}

// Validation types
export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export interface updateProfileRequest {
  username?: string;
  codeTheme?: string;
  uiTheme?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoImageUrl?: string;
  socialLinks?: Record<string, string>;
  customDomain?: string;
  isProfilePublic?: boolean;
  emailNotifications?: boolean;
  enableAnalytics?: boolean;
}