
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<boolean>; // Password optional for this sim
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password?: string }) => Promise<boolean>;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);


  useEffect(() => {
    // Check for existing logged-in user on app start
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password || ''); // Pass empty string if no password needed for sim
      if (user) {
        setCurrentUser(user);
        return true;
      }
      setError('Invalid credentials.');
      return false;
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password?: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // The password field in userData is for the registration form, 
      // authService might hash it or handle it as per its simulation.
      const user = await authService.register(userData);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      setError('Registration failed. Email might already be in use.');
      return false;
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err) {
      setError('Logout failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, register, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
    