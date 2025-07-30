import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { X, Upload, Video, Play, Pause } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import uploadService, { UploadVideoRequest } from '@/services/uploadService';
import { router } from 'expo-router';

interface UploadPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const UploadPreviewModal: React.FC<UploadPreviewModalProps> = ({
  visible,
  onClose,
  onSuccess,
  onError,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pickingVideo, setPickingVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const videoRef = useRef<ExpoVideo>(null);

  const handlePickVideo = async () => {
    setPickingVideo(true);
    try {
      const video = await uploadService.pickVideo();
      if (video) {
        setSelectedVideo(video);
        setIsVideoPlaying(false);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      onError?.('Failed to pick video');
    } finally {
      setPickingVideo(false);
    }
  };

  const toggleVideoPlayback = async () => {
    if (!videoRef.current) return;
    
    if (isVideoPlaying) {
      await videoRef.current.pauseAsync();
      setIsVideoPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsVideoPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      onError?.('Please select a video first');
      return;
    }

    if (!title.trim()) {
      onError?.('Please enter a title');
      return;
    }

    if (!description.trim()) {
      onError?.('Please enter a description');
      return;
    }

    setUploading(true);
    try {
      const uploadData: UploadVideoRequest = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || undefined,
      };

      const result = await uploadService.uploadVideo(selectedVideo, uploadData);

      if (result.success) {
        // Stop video playback
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
        onSuccess?.();
        // Navigate to home page
        router.replace('/Home');
      } else {
        onError?.(result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    // Stop video playback
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setSelectedVideo(null);
    setIsVideoPlaying(false);
    onClose();
    // Navigate to home page
    router.replace('/Home');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Video</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Video Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video</Text>
            {!selectedVideo ? (
              <TouchableOpacity
                style={styles.videoPickerButton}
                onPress={handlePickVideo}
                disabled={pickingVideo}
              >
                {pickingVideo ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Video size={24} color="#fff" />
                    <Text style={styles.videoPickerText}>Select Video</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.videoPreviewContainer}>
                {/* Video Preview */}
                <View style={styles.videoPreview}>
                  <ExpoVideo
                    ref={videoRef}
                    source={{ uri: selectedVideo.uri }}
                    style={styles.videoPlayer}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    isLooping={false}
                    isMuted={true}
                    onPlaybackStatusUpdate={(status) => {
                      if (status.isLoaded) {
                        if (status.didJustFinish) {
                          setIsVideoPlaying(false);
                        }
                        if (status.durationMillis && videoDuration === 0) {
                          setVideoDuration(status.durationMillis / 1000);
                        }
                      }
                    }}
                  />
                  {/* Play/Pause Overlay */}
                  <TouchableOpacity
                    style={styles.playPauseOverlay}
                    onPress={toggleVideoPlayback}
                  >
                    {isVideoPlaying ? (
                      <Pause size={32} color="#fff" />
                    ) : (
                      <Play size={32} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
                
                {/* Video Info */}
                <View style={styles.videoInfo}>
                  <View style={styles.videoInfoRow}>
                    <Video size={16} color="#fff" />
                    <Text style={styles.videoFileName} numberOfLines={1}>
                      {selectedVideo.fileName || 'Video'}
                    </Text>
                  </View>
                  <Text style={styles.videoFileSize}>
                    {formatFileSize(selectedVideo.fileSize || 0)}
                    {videoDuration > 0 && ` • ${formatDuration(videoDuration)}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.changeVideoButton}
                    onPress={handlePickVideo}
                    disabled={pickingVideo}
                  >
                    <Text style={styles.changeVideoText}>Change Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter video title"
              placeholderTextColor="#666"
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter video description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category (Optional)</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Enter category"
              placeholderTextColor="#666"
              maxLength={50}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.uploadButton, (!selectedVideo || !title.trim() || !description.trim() || uploading) && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={!selectedVideo || !title.trim() || !description.trim() || uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Upload size={20} color="#fff" />
                <Text style={styles.uploadButtonText}>Upload Video</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  videoPickerButton: {
    backgroundColor: '#28282E',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  videoPickerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  videoPreviewContainer: {
    backgroundColor: '#28282E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPreview: {
    position: 'relative',
    height: 200,
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  videoFileName: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  videoFileSize: {
    color: '#666',
    fontSize: 12,
    marginRight: 10,
  },
  changeVideoButton: {
    backgroundColor: '#006eff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeVideoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#28282E',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  uploadButton: {
    backgroundColor: '#006eff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#333',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UploadPreviewModal; 