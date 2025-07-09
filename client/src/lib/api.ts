import { ApiResponse, CreateSnippetRequest, updateProfileRequest, UpdateSnippetRequest } from "shared";

// Use environment variable for API URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: ApiResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

const getCacheKey = (url: string, options: RequestInit = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

const getCachedResponse = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  return null;
};

const setCachedResponse = (key: string, data: unknown, ttl: number = 5000) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}, cacheTtl?: number): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const cacheKey = getCacheKey(url, options);
    
    // Check cache for GET requests
    if ((!options.method || options.method === 'GET') && cacheTtl !== undefined) {
      const cached = getCachedResponse(cacheKey);
      if (cached) {
        return cached as T;
      }
    }
    
    const config: RequestInit = {
      credentials: 'include', // This ensures cookies are sent
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'An error occurred',
          response.status,
          data
        );
      }

      // Cache successful GET responses
      if ((!options.method || options.method === 'GET') && cacheTtl !== undefined) {
        setCachedResponse(cacheKey, data, cacheTtl);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0);
    }
  },

  // Auth endpoints
  auth: {
    async login(): Promise<{ url: string }> {
      const response = await api.request<ApiResponse>('/auth/login');
      return response.data;
    },

    async me() {
      // Cache auth check for 30 seconds to prevent multiple requests
      const response = await api.request<ApiResponse>('/auth/me', {}, 30000);
      return response.data;
    },

    async logout() {
      const response = await api.request<ApiResponse>('/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('auth-token');
      // Clear cache on logout
      apiCache.clear();
      return response.data;
    },
  },

  // Snippets endpoints
  snippets: {
    async getAll() {
      const response = await api.request<ApiResponse>('/snippets');
      return response.data;
    },

    async getById(id: string) {
      const response = await api.request<ApiResponse>(`/snippets/${id}`);
      return response.data;
    },

    async create(snippet: CreateSnippetRequest) {
      const response = await api.request<ApiResponse>('/snippets', {
        method: 'POST',
        body: JSON.stringify(snippet),
      });
      return response.data;
    },

    async update(id: string, snippet: UpdateSnippetRequest) {
      const response = await api.request<ApiResponse>(`/snippets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(snippet),
      });
      return response.data;
    },

    async delete(id: string) {
      const response = await api.request<ApiResponse>(`/snippets/${id}`, {
        method: 'DELETE',
      });
      return response.data;
    },

    async share(id: string) {
      const response = await api.request<ApiResponse>(`/snippets/${id}/share`, {
        method: 'POST',
      });
      return response.data;
    },

    async revokeShare(id: string) {
      const response = await api.request<ApiResponse>(`/snippets/${id}/share`, {
        method: 'DELETE',
      });
      return response.data;
    },

    async getByShareId(shareId: string) {
      const response = await api.request<ApiResponse>(`/snippets/share/${shareId}`);
      return response.data;
    },
  },

  // User profile and settings endpoints
  user: {
    async updateProfile(data: Partial<updateProfileRequest>) {
      const response = await api.request<ApiResponse>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    async updateSettings(settings: updateProfileRequest) {
      const response = await api.request<ApiResponse>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return response.data;
    },

    async enable2FA() {
      const response = await api.request<ApiResponse>('/auth/2fa/enable', {
        method: 'POST',
      });
      return response.data;
    },

    async disable2FA(code: string) {
      const response = await api.request<ApiResponse>('/auth/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    },

    async verify2FA(code: string) {
      const response = await api.request<ApiResponse>('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    },

    async uploadImage(file: File, type: 'avatar' | 'banner' | 'seo') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await api.request<ApiResponse>('/auth/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Remove Content-Type to let the browser set it for FormData
      });
      return response.data;
    },
  },

  // SEO and analytics endpoints
  seo: {
    async generateMetaTags(snippetId: string) {
      const response = await api.request<ApiResponse>(`/snippets/${snippetId}/seo`);
      return response.data;
    },

    async getAnalytics(timeframe: string = '7d') {
      const response = await api.request<ApiResponse>(`/analytics?timeframe=${timeframe}`);
      return response.data;
    },

    async getSnippetStats(snippetId: string) {
      const response = await api.request<ApiResponse>(`/snippets/${snippetId}/stats`);
      return response.data;
    },
  },
};

export { ApiError };
