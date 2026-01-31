import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  companyName: string;
  gstin: string;
  password: string;
  couponCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    companyName: 'Customer Corp',
    gstin: '29ABCDE1234F1Z5',
    role: 'customer',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Vendor',
    email: 'vendor@example.com',
    companyName: 'Vendor Inc',
    gstin: '29XYZAB5678G2H3',
    role: 'vendor',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    companyName: 'RentFlow',
    gstin: '29ADMIN9999X1Y2',
    role: 'admin',
    createdAt: '2024-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, _password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid credentials');
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      companyName: data.companyName,
      gstin: data.gstin,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('user');
  }, []);

  const forgotPassword = useCallback(async (_email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would send a reset email
  }, []);

  const resetPassword = useCallback(async (_token: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would reset the password
  }, []);

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
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

// Demo login helper
export function getDemoCredentials(role: UserRole): { email: string; password: string } {
  const credentials: Record<UserRole, { email: string; password: string }> = {
    customer: { email: 'customer@example.com', password: 'demo123' },
    vendor: { email: 'vendor@example.com', password: 'demo123' },
    admin: { email: 'admin@example.com', password: 'demo123' },
  };
  return credentials[role];
}
