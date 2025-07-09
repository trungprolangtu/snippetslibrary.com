import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  const authCheckRef = useRef<Promise<void> | null>(null);

  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckRef.current) {
      return authCheckRef.current;
    }

    // Don't check again if already initialized and not loading
    if (initialized && !loading) {
      return;
    }

    authCheckRef.current = (async () => {
      try {
        setLoading(true);
        const userData = await api.auth.me();
        setUser(userData.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
        authCheckRef.current = null;
      }
    })();

    return authCheckRef.current;
  }, [initialized, loading]);

  const login = useCallback(async () => {
    try {
      const { url } = await api.auth.login();
      window.location.href = url;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
      setUser(null);
      setInitialized(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      setUser(null);
      setInitialized(false);
    }
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
