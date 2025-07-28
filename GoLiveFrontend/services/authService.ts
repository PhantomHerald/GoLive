import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../config/environment';

export interface AuthRequest {
  username?: string;
  email?: string;
  password: string;
  birthMonth?: number;
  birthDay?: number;
  birthYear?: number;
}

export interface AuthResponse {
  message: string;
  token: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  roles: string[];
}

export interface BioUpdateRequest {
  bio: string;
}

class AuthService {
  // Sign up a new user
  async signup(request: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/signup', request);
      if (response.data.token) {
        await this.storeAuthToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  // Login with email or username
  async login(request: AuthRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login with:', { email: request.email, username: request.username });
      console.log('🌐 API Base URL:', environment.API_BASE_URL);
      
      const response = await api.post<AuthResponse>('/api/auth/login', request);
      console.log('✅ Login response:', response.data);
      
      if (response.data.token) {
        await this.storeAuthToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Login with username only
  async loginWithUsername(request: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login/username', request);
      if (response.data.token) {
        await this.storeAuthToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Validate token
  async validateToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/validate');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token validation failed');
    }
  }

  // Update user bio
  async updateBio(bio: string): Promise<AuthResponse> {
    try {
      const response = await api.put<AuthResponse>('/api/auth/update-bio', { bio });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Bio update failed');
    }
  }

  // Test endpoint
  async test(): Promise<string> {
    try {
      const response = await api.get<string>('/api/auth/test');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Test failed');
    }
  }

  // Store auth token in AsyncStorage
  private async storeAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  // Get stored auth token
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Clear auth token and user data
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['authToken', 'user']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;
      
      // Validate token with backend
      await this.validateToken();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService(); 