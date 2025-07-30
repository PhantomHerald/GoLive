import api from './api';
import { environment } from '../config/environment';
import * as ImagePicker from 'expo-image-picker';

export interface UploadVideoRequest {
  title: string;
  description: string;
  category?: string;
}

export interface UploadVideoResponse {
  success: boolean;
  message: string;
  recordingId?: number;
  streamId?: number;
  recordingUrl?: string;
  s3Key?: string;
}

export interface VideoInfo {
  key: string;
  presignedUrl: string;
  size: number;
  lastModified: string;
  // Extended properties for mock data
  title?: string;
  game?: string;
  tags?: string[];
  streamer?: {
    avatar: string;
    name: string;
    verified: boolean;
  };
  likes?: number;
  comments?: any[];
}

export interface VideosResponse {
  success: boolean;
  message?: string;
  videos?: VideoInfo[];
}

class UploadService {
  async uploadVideo(
    file: ImagePicker.ImagePickerAsset,
    metadata: UploadVideoRequest
  ): Promise<UploadVideoResponse> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add the file
      const fileInfo = {
        uri: file.uri,
        type: file.type || 'video/mp4',
        name: file.fileName || `video-${Date.now()}.mp4`,
      };
      formData.append('file', fileInfo as any);
      
      // Add metadata
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      if (metadata.category) {
        formData.append('category', metadata.category);
      }

      const response = await api.post('/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload video',
      };
    }
  }

  async pickVideo(): Promise<ImagePicker.ImagePickerAsset | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error picking video:', error);
      return null;
    }
  }

  async getAllVideos(): Promise<VideosResponse> {
    try {
      const response = await api.get('/api/upload/videos');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch videos',
      };
    }
  }
}

export default new UploadService(); 