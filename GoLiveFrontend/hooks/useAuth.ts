import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { AuthRequest, AuthResponse, User } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    token: null,
  });

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await authService.getAuthToken();
      if (token) {
        // Validate token with backend
        const isValid = await authService.isAuthenticated();
        setAuthState({
          isAuthenticated: isValid,
          user: null, // You can fetch user data here if needed
          loading: false,
          token: isValid ? token : null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          token: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        token: null,
      });
    }
  };

  const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await authService.login(credentials);
      
      if (response.token) {
        setAuthState({
          isAuthenticated: true,
          user: null, // You can fetch user data here
          loading: false,
          token: response.token,
        });
      }
      
      return response;
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signup = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await authService.signup(credentials);
      
      if (response.token) {
        setAuthState({
          isAuthenticated: true,
          user: null, // You can fetch user data here
          loading: false,
          token: response.token,
        });
      }
      
      return response;
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        token: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateBio = async (bio: string): Promise<AuthResponse> => {
    try {
      const response = await authService.updateBio(bio);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    updateBio,
    checkAuthStatus,
  };
}; 