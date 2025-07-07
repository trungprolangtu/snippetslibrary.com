import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'shared';
import type { AuthContextType, AuthProviderProps } from '../types';
import { api } from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const { url } = await api.auth.login();
      window.location.href = url;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      setUser(null);
    }
  };

  useEffect(() => {
    // Check for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const errorStatus = urlParams.get('error');
    
    if (authStatus === 'success') {
      // Remove auth params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      checkAuth();
    } else if (errorStatus) {
      // Handle auth error
      console.error('Authentication error:', errorStatus);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
    } else {
      // Normal auth check
      checkAuth();
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
