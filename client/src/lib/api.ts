const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.snippetslibrary.com/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
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
      const response = await api.request<any>('/auth/login');
      return response.data;
    },

    async me() {
      const response = await api.request<any>('/auth/me');
      return response.data;
    },

    async logout() {
      const response = await api.request<any>('/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('auth-token');
      return response.data;
    },
  },

  // Snippets endpoints
  snippets: {
    async getAll() {
      const response = await api.request<any>('/snippets');
      return response.data;
    },

    async getById(id: string) {
      const response = await api.request<any>(`/snippets/${id}`);
      return response.data;
    },

    async create(snippet: any) {
      const response = await api.request<any>('/snippets', {
        method: 'POST',
        body: JSON.stringify(snippet),
      });
      return response.data;
    },

    async update(id: string, snippet: any) {
      const response = await api.request<any>(`/snippets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(snippet),
      });
      return response.data;
    },

    async delete(id: string) {
      const response = await api.request<any>(`/snippets/${id}`, {
        method: 'DELETE',
      });
      return response.data;
    },

    async share(id: string) {
      const response = await api.request<any>(`/snippets/${id}/share`, {
        method: 'POST',
      });
      return response.data;
    },

    async revokeShare(id: string) {
      const response = await api.request<any>(`/snippets/${id}/share`, {
        method: 'DELETE',
      });
      return response.data;
    },

    async getByShareId(shareId: string) {
      const response = await api.request<any>(`/snippets/share/${shareId}`);
      return response.data;
    },
  },

  // User profile and settings endpoints
  user: {
    async updateProfile(data: Partial<any>) {
      const response = await api.request<any>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    async updateSettings(settings: any) {
      const response = await api.request<any>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return response.data;
    },

    async enable2FA() {
      const response = await api.request<any>('/auth/2fa/enable', {
        method: 'POST',
      });
      return response.data;
    },

    async disable2FA(code: string) {
      const response = await api.request<any>('/auth/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    },

    async verify2FA(code: string) {
      const response = await api.request<any>('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    },

    async uploadImage(file: File, type: 'avatar' | 'banner' | 'seo') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await api.request<any>('/auth/upload', {
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
      const response = await api.request<any>(`/snippets/${snippetId}/seo`);
      return response.data;
    },

    async getAnalytics(timeframe: string = '7d') {
      const response = await api.request<any>(`/analytics?timeframe=${timeframe}`);
      return response.data;
    },

    async getSnippetStats(snippetId: string) {
      const response = await api.request<any>(`/snippets/${snippetId}/stats`);
      return response.data;
    },
  },
};

export { ApiError };
