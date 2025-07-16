import api from './api';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  followers: number;
  following: number;
  isStreamer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedUserId?: string;
  relatedStreamId?: string;
}

class UserService {
  // Get current user profile
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/api/users/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }

  // Get user profile by ID
  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(`/api/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  // Update user profile
  async updateProfile(updateRequest: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>('/api/users/profile', updateRequest);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Get user notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>('/api/notifications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await api.put('/api/notifications/read-all');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }

  // Get user's streams
  async getUserStreams(userId: string): Promise<any[]> {
    try {
      const response = await api.get(`/api/users/${userId}/streams`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user streams');
    }
  }

  // Get user's followers
  async getUserFollowers(userId: string): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>(`/api/users/${userId}/followers`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch followers');
    }
  }

  // Get user's following
  async getUserFollowing(userId: string): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>(`/api/users/${userId}/following`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch following');
    }
  }

  // Search users
  async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  }

  // Report a user
  async reportUser(userId: string, reason: string): Promise<void> {
    try {
      await api.post(`/api/reports/user/${userId}`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to report user');
    }
  }

  // Report a stream
  async reportStream(streamId: string, reason: string): Promise<void> {
    try {
      await api.post(`/api/reports/stream/${streamId}`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to report stream');
    }
  }

  // Get user activity
  async getUserActivity(): Promise<any[]> {
    try {
      const response = await api.get('/api/users/activity');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user activity');
    }
  }

  // Delete user account
  async deleteAccount(password: string): Promise<void> {
    try {
      await api.delete('/api/auth/delete-account', { data: { password } });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }
}

export default new UserService(); 