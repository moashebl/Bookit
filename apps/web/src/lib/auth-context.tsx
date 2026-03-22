'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@bookit/shared';
import { removeToken } from './api';

/** Auth context state shape */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

/**
 * Auth context provider.
 * Wraps the application and provides authentication state globally.
 * Persists user data in localStorage to survive page refreshes.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bookit_user');
    const storedToken = localStorage.getItem('bookit_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid stored data — clear it
        localStorage.removeItem('bookit_user');
        removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('bookit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bookit_user');
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
    localStorage.removeItem('bookit_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access the auth context */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
