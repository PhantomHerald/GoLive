import api from './api';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface FollowResponse {
  success: boolean;
  message?: string;
  isFollowing?: boolean;
  stats?: FollowStats;
  following?: any[];
  followers?: any[];
  followersCount?: number;
  followingCount?: number;
}

class FollowService {
  async followUser(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.post(`/api/follow/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Follow error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to follow user',
      };
    }
  }

  async unfollowUser(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.delete(`/api/follow/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Unfollow error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unfollow user',
      };
    }
  }

  async checkIfFollowing(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.get(`/api/follow/check/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Check following error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check following status',
      };
    }
  }

  async getFollowStats(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.get(`/api/follow/stats/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get follow stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get follow stats',
      };
    }
  }

  async getFollowing(): Promise<FollowResponse> {
    try {
      console.log('Calling getFollowing API...');
      const response = await api.get('/api/follow/following');
      console.log('GetFollowing response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get following error:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get following list',
      };
    }
  }

  async getFollowers(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.get(`/api/follow/followers/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get followers error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get followers list',
      };
    }
  }

  async getFollowingByUserId(userId: number): Promise<FollowResponse> {
    try {
      const response = await api.get(`/api/follow/following/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get following by user ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get following list',
      };
    }
  }

  async testAuth(): Promise<FollowResponse> {
    try {
      console.log('Testing authentication...');
      const response = await api.get('/api/follow/test-auth');
      console.log('Auth test response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Auth test error:', error);
      console.error('Auth test error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Authentication test failed',
      };
    }
  }
}

export default new FollowService(); 