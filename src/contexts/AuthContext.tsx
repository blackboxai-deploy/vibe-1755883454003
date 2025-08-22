"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'demo@cryptoex.com',
    name: 'Demo User',
    password: 'demo123',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isVerified: true,
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
          lastLogin: new Date(parsedUser.lastLogin),
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const userData = {
        ...userWithoutPassword,
        lastLogin: new Date(),
      };
      
      setUser(userData);
      localStorage.setItem('auth_token', 'mock_jwt_token_' + userData.id);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      toast.success('Login successful!');
      setIsLoading(false);
      return true;
    } else {
      toast.error('Invalid email or password');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      toast.error('User with this email already exists');
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password,
      name,
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: false,
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_token', 'mock_jwt_token_' + newUser.id);
    localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
    
    toast.success('Registration successful!');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    toast.success('Profile updated successfully');
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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