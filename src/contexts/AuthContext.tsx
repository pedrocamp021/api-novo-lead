import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getSession, saveSession, clearSession, validateUser, getStoredUsers } from '../utils/localStorage';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const userId = getSession();
    if (userId) {
      const users = getStoredUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = validateUser(email, password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      saveSession(user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};