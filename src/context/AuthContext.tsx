'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = [
  {
    id: '1',
    username: 'bidder1',
    password: 'password123',
    email: 'bidder1@example.com',
  },
  {
    id: '2',
    username: 'bidder2',
    password: 'password123',
    email: 'bidder2@example.com',
  },
  {
    id: '3',
    username: 'bidder3',
    password: 'password123',
    email: 'bidder3@example.com',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auctionUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const login = (username: string, password: string): boolean => {
    const foundUser = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userToStore = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      };
      setUser(userToStore);
      localStorage.setItem('auctionUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auctionUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
