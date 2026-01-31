import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types';
import { authApi, TokenResponse, UserResponse } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ expiresInMinutes: number }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  loginWithGoogle: () => void;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  businessCategory?: string;
  gstin?: string;
  password: string;
  role: 'customer' | 'vendor';
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapApiUserToUser = (apiUser: UserResponse): User => ({
  id: apiUser.id,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  email: apiUser.email,
  companyName: apiUser.company_name || '',
  businessCategory: apiUser.business_category || '',
  gstin: apiUser.gstin || '',
  role: apiUser.role.toLowerCase() as UserRole,
  createdAt: new Date().toISOString(),
  referralCode: apiUser.referral_code,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const handleAuthResponse = useCallback((response: TokenResponse) => {
    saveTokens(response.access_token, response.refresh_token);
    const user = mapApiUserToUser(response.user);
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(email, password);
      handleAuthResponse(response);
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [handleAuthResponse]);

  const signup = useCallback(async (data: SignupData) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.register({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        company_name: data.companyName,
        business_category: data.businessCategory,
        gstin: data.gstin,
        role: data.role.toUpperCase() as 'CUSTOMER' | 'VENDOR',
        referral_code: data.referralCode,
      });
      handleAuthResponse(response);
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [handleAuthResponse]);

  const logout = useCallback(() => {
    clearTokens();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const response = await authApi.forgotPassword(email);
    return { expiresInMinutes: response.expires_in_minutes };
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    await authApi.verifyOtp(email, otp);
  }, []);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
    await authApi.resetPassword(email, otp, newPassword);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = authApi.getGoogleAuthUrl();
  }, []);

  const handleOAuthCallback = useCallback(async (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken);

    try {
      const userResponse = await authApi.getCurrentUser(accessToken);
      const user = mapApiUserToUser(userResponse);
      localStorage.setItem('user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      clearTokens();
      throw error;
    }
  }, []);

  // Check for stored tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken) {
        try {
          const userResponse = await authApi.getCurrentUser(accessToken);
          const user = mapApiUserToUser(userResponse);
          localStorage.setItem('user', JSON.stringify(user));
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        } catch (error) {
          // Token might be expired, try refresh
          if (refreshToken) {
            try {
              const response = await authApi.refreshToken(refreshToken);
              handleAuthResponse(response);
              return;
            } catch {
              // Refresh failed, clear everything
              clearTokens();
            }
          }
        }
      }

      setState(prev => ({ ...prev, isLoading: false }));
    };

    initAuth();
  }, [handleAuthResponse]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        loginWithGoogle,
        handleOAuthCallback,
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
