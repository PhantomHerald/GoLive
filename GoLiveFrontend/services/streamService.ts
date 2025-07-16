import api from './api';

export interface Stream {
  id: string;
  title: string;
  description?: string;
  streamer: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  thumbnail?: string;
  game?: string;
  viewers: number;
  tags: string[];
  isLive: boolean;
  startedAt?: Date;
  endedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  viewers: number;
  tags: string[];
}

export interface StreamRequest {
  title: string;
  description?: string;
  game?: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  badges?: string[];
  time: Date;
  streamId: string;
}

export interface CommentRequest {
  content: string;
  streamId: string;
}

class StreamService {
  // Get all streams
  async getStreams(): Promise<Stream[]> {
    try {
      const response = await api.get<Stream[]>('/api/streams');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch streams');
    }
  }

  // Get live streams
  async getLiveStreams(): Promise<Stream[]> {
    try {
      const response = await api.get<Stream[]>('/api/streams/live');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch live streams');
    }
  }

  // Get stream by ID
  async getStreamById(streamId: string): Promise<Stream> {
    try {
      const response = await api.get<Stream>(`/api/streams/${streamId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stream');
    }
  }

  // Get categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('/api/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get streams by category
  async getStreamsByCategory(categoryId: string): Promise<Stream[]> {
    try {
      const response = await api.get<Stream[]>(`/api/categories/${categoryId}/streams`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category streams');
    }
  }

  // Create a new stream
  async createStream(streamRequest: StreamRequest): Promise<Stream> {
    try {
      const response = await api.post<Stream>('/api/streams', streamRequest);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create stream');
    }
  }

  // Start streaming
  async startStream(streamId: string): Promise<Stream> {
    try {
      const response = await api.post<Stream>(`/api/streams/${streamId}/start`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to start stream');
    }
  }

  // End streaming
  async endStream(streamId: string): Promise<Stream> {
    try {
      const response = await api.post<Stream>(`/api/streams/${streamId}/end`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to end stream');
    }
  }

  // Get chat messages for a stream
  async getChatMessages(streamId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get<ChatMessage[]>(`/api/streams/${streamId}/chat`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chat messages');
    }
  }

  // Send a chat message
  async sendChatMessage(streamId: string, message: string): Promise<ChatMessage> {
    try {
      const response = await api.post<ChatMessage>(`/api/streams/${streamId}/chat`, {
        message
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  // Follow a streamer
  async followStreamer(streamerId: string): Promise<void> {
    try {
      await api.post(`/api/follow/${streamerId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to follow streamer');
    }
  }

  // Unfollow a streamer
  async unfollowStreamer(streamerId: string): Promise<void> {
    try {
      await api.delete(`/api/follow/${streamerId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unfollow streamer');
    }
  }

  // Get followed channels
  async getFollowedChannels(): Promise<Stream[]> {
    try {
      const response = await api.get<Stream[]>('/api/follow/following');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch followed channels');
    }
  }

  // Like a stream
  async likeStream(streamId: string): Promise<void> {
    try {
      await api.post(`/api/streams/${streamId}/like`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to like stream');
    }
  }

  // Unlike a stream
  async unlikeStream(streamId: string): Promise<void> {
    try {
      await api.delete(`/api/streams/${streamId}/like`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unlike stream');
    }
  }

  // Add comment to stream
  async addComment(commentRequest: CommentRequest): Promise<void> {
    try {
      await api.post('/api/comments', commentRequest);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  }

  // Get stream comments
  async getStreamComments(streamId: string): Promise<any[]> {
    try {
      const response = await api.get(`/api/streams/${streamId}/comments`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
}

export default new StreamService(); 