import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
  TextInput,
  Share,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uploadService, { VideoInfo } from "@/services/uploadService";
import { CLIPS } from "@/data/mockdata";

const TAB_BAR_HEIGHT = 70;
const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CLIP_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

// Utility to capitalize first letter
function capitalizeFirst(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility to format file size
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'posted just now';
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `posted ${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInHours / 24);
    return `posted ${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default function ClipsS3Screen({ paused = false }: { paused?: boolean }) {
  const videoRefs = useRef<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const [activeComments, setActiveComments] = useState<any[]>([]);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [likes, setLikes] = useState<number[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [commentsData, setCommentsData] = useState<any[][]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [viewableIndex, setViewableIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [resizeMode, setResizeMode] = useState<ResizeMode>(ResizeMode.COVER);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [initialIndex, setInitialIndex] = useState<number | null>(null);
  const commentInputRef = useRef<TextInput>(null);
  const commentsScrollRef = useRef<ScrollView>(null);
  const [showPlayPause, setShowPlayPause] = useState<{ visible: boolean; isPlaying: boolean }>({ visible: false, isPlaying: true });
  const playPauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  
  // S3 Videos state
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from S3
  const fetchVideos = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingVideos(true);
    }
    
    try {
      const result = await uploadService.getAllVideos();
      if (result.success && result.videos && result.videos.length > 0) {
        // Use S3 videos but with mock metadata
        const videosWithMockData = result.videos.map((video, index) => {
          const mockClip = CLIPS[index % CLIPS.length]; // Cycle through mock data
          return {
            ...video,
            title: mockClip.title,
            game: mockClip.game,
            tags: mockClip.tags,
            streamer: {
              avatar: mockClip.streamer.avatar,
              name: mockClip.streamer.name,
              verified: mockClip.streamer.verified,
            },
            likes: mockClip.likes,
            comments: mockClip.comments,
          };
        });
        
        setVideos(videosWithMockData);
        setLikes(videosWithMockData.map(() => Math.floor(Math.random() * 100) + 10));
        setLiked(videosWithMockData.map(() => false));
        setCommentsData(videosWithMockData.map(() => []));
        setError(null);
        console.log('📹 Using S3 videos with mock metadata:', videosWithMockData.length);
      } else {
        // Fall back to mock data when no S3 videos
        console.log('📹 No S3 videos found, using mock data');
        const mockVideos: VideoInfo[] = CLIPS.map((clip, index) => ({
          key: `mock-${clip.id}`,
          presignedUrl: clip.uri,
          size: Math.floor(Math.random() * 50000000) + 10000000, // Random file size
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
          title: clip.title,
          game: clip.game,
          tags: clip.tags,
          streamer: {
            avatar: clip.streamer.avatar,
            name: clip.streamer.name,
            verified: clip.streamer.verified,
          },
          likes: clip.likes,
          comments: clip.comments,
        }));
        
        setVideos(mockVideos);
        setLikes(mockVideos.map(() => Math.floor(Math.random() * 100) + 10));
        setLiked(mockVideos.map(() => false));
        setCommentsData(mockVideos.map(() => []));
        setError(null);
      }
    } catch (err) {
      // Fall back to mock data on error
      console.log('📹 Error fetching S3 videos, using mock data');
              const mockVideos: VideoInfo[] = CLIPS.map((clip, index) => ({
          key: `mock-${clip.id}`,
          presignedUrl: clip.uri,
          size: Math.floor(Math.random() * 50000000) + 10000000,
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          title: clip.title,
          game: clip.game,
          tags: clip.tags,
          streamer: {
            avatar: clip.streamer.avatar,
            name: clip.streamer.name,
            verified: clip.streamer.verified,
          },
          likes: clip.likes,
          comments: clip.comments,
        }));
      
      setVideos(mockVideos);
      setLikes(mockVideos.map(() => Math.floor(Math.random() * 100) + 10));
      setLiked(mockVideos.map(() => false));
      setCommentsData(mockVideos.map(() => []));
      setError(null);
      console.error('Error fetching videos:', err);
    } finally {
      setLoadingVideos(false);
      setRefreshing(false);
    }
  };

  // Load videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Persist mute state across tabs and restore last index
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("CLIPS_MUTED");
      if (stored !== null) setIsMuted(stored === "true");
      const lastIndex = await AsyncStorage.getItem("CLIPS_LAST_INDEX");
      if (lastIndex !== null && !isNaN(Number(lastIndex))) {
        setViewableIndex(Number(lastIndex));
        setInitialIndex(Number(lastIndex));
      } else {
        setInitialIndex(0);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("CLIPS_MUTED", isMuted ? "true" : "false");
  }, [isMuted]);

  useEffect(() => {
    AsyncStorage.setItem("CLIPS_LAST_INDEX", String(viewableIndex));
  }, [viewableIndex]);

  // Pause all videos when paused prop is true
  useEffect(() => {
    videoRefs.current.forEach((ref, idx) => {
      if (ref && ref.pauseAsync) {
        ref.pauseAsync();
      }
    });
  }, [paused]);

  // Play/pause videos based on viewable index
  useEffect(() => {
    videoRefs.current.forEach((ref, idx) => {
      if (ref && ref.pauseAsync && ref.playAsync) {
        if (!paused && idx === viewableIndex) {
          ref.playAsync();
        } else {
          ref.pauseAsync();
        }
      }
    });
  }, [viewableIndex, paused]);

  // Sync mute state to all videos as you scroll
  useEffect(() => {
    videoRefs.current.forEach((ref) => {
      if (ref && ref.setIsMutedAsync) {
        ref.setIsMutedAsync(isMuted);
      }
    });
  }, [isMuted, viewableIndex]);

  useEffect(() => {
    if (modalVisible && commentsScrollRef.current) {
      commentsScrollRef.current.scrollToEnd({ animated: true });
    }
  }, [activeComments, modalVisible]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setViewableIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleShare = (video: VideoInfo) => {
    Share.share({
      message: `Check out this video: ${video.presignedUrl}`,
      url: video.presignedUrl,
      title: `Video from ${video.key}`,
    });
  };

  const toggleResizeMode = () => {
    setResizeMode((prev) =>
      prev === ResizeMode.COVER ? ResizeMode.CONTAIN : ResizeMode.COVER
    );
  };

  const openComments = (comments: any[], videoKey: string, index: number, focusInput = false) => {
    setActiveComments(commentsData[index]);
    setActiveClip(videoKey);
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (focusInput && commentInputRef.current) {
        commentInputRef.current.focus();
      }
    });
  };

  const closeComments = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleLike = (index: number) => {
    setLiked((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
    setLikes((prev) => {
      const updated = [...prev];
      updated[index] += liked[index] ? -1 : 1;
      return updated;
    });
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim() || activeClip === null) return;
    const index = videos.findIndex((video) => video.key === activeClip);
    const newComment = {
      id: `c${Date.now()}`,
      user: "You",
      text: commentInput.trim(),
    };
    setCommentsData((prev) => {
      const updated = [...prev];
      updated[index] = [...updated[index], newComment];
      return updated;
    });
    setActiveComments((prev) => [...prev, newComment]);
    setCommentInput("");
  };

  const handleVideoPress = () => {
    setIsPlaying((prev) => {
      const newPlaying = !prev;
      setShowPlayPause({ visible: true, isPlaying: newPlaying });
      if (playPauseTimeout.current) clearTimeout(playPauseTimeout.current);
      playPauseTimeout.current = setTimeout(() => setShowPlayPause((s) => ({ ...s, visible: false })), 700);
      return newPlaying;
    });
  };

  const onRefresh = () => {
    fetchVideos(true);
  };

  const renderItem = ({ item, index }: { item: VideoInfo; index: number; }) => {
    const fileName = item.key.split('/').pop() || 'Video';
    const postedAgo = formatDate(item.lastModified);
    const title = item.title || fileName;
    const streamerName = item.streamer?.name || 'Unknown Streamer';
    const streamerAvatar = item.streamer?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';
    const isVerified = item.streamer?.verified || false;
    
    return (
      <View style={styles.clipContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleVideoPress}
          style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 36, zIndex: 0 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Video
              ref={(ref) => { videoRefs.current[index] = ref as any; }}
              source={{ uri: item.presignedUrl }}
              style={{ width: '100%', height: CLIP_HEIGHT+40 }}
              resizeMode={resizeMode}
              shouldPlay={isPlaying && index === viewableIndex && !paused}
              isMuted={isMuted}
              isLooping
              onLoadStart={() => {
                if (isPlaying && index === viewableIndex && !paused) setLoading(true);
              }}
              onReadyForDisplay={() => {
                setLoading(false);
              }}
              onPlaybackStatusUpdate={(status) => {
                if (!status.isLoaded) return;
                if (status.isBuffering && isPlaying && index === viewableIndex && !paused) {
                  setLoading(true);
                } else if (status.isPlaying && !status.isBuffering) {
                  setLoading(false);
                }
                if (status.didJustFinish) setLoading(false);
                if (!status.isPlaying) setLoading(false);
              }}
            />
            {loading && isPlaying && index === viewableIndex && !paused && (
              <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -35 }, { translateY: -36 }], opacity: 0.5 }}>
                <ActivityIndicator size={62} color="#fff" />
              </View>
            )}
            {showPlayPause.visible && index === viewableIndex && (
              <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -40 }, { translateY: -42 }], opacity: 0.5 }}>
                <MaterialCommunityIcons
                  name={showPlayPause.isPlaying ? 'pause-circle' : 'play-circle'}
                  size={72}
                  color="#fff"
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        {/* Left info group */}
        <View style={styles.leftInfoGroup}>
          <View style={styles.streamerNameRow}>
            <Text style={styles.streamerNameText}>{streamerName}</Text>
            {isVerified && (
              <MaterialCommunityIcons name="check-decagram" size={16} color="#006eff" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.postedAgoContainer}>
            <Text style={styles.postedAgoText}>{postedAgo}</Text>
          </View>
          <Text style={styles.extraInfoText}>
            {formatFileSize(item.size)}
          </Text>
        </View>
        
        {/* Right icon group */}
        <View style={styles.rightIconGroup}>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image source={{ uri: streamerAvatar }} style={styles.avatarImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleLike(index)}>
            {liked[index] ? (
              <MaterialCommunityIcons name="heart" size={26} color="#006eff" />
            ) : (
              <Feather name="heart" size={26} color="#fff" />
            )}
            <Text style={styles.iconCount}>{likes[index]}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => openComments(commentsData[index], item.key, index, true)}>
            <Feather name="message-circle" size={26} color="#fff" />
            <Text style={styles.iconCount}>{commentsData[index]?.length || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleResizeMode}>
            {resizeMode === ResizeMode.COVER ? (
              <MaterialCommunityIcons name="arrow-expand" size={26} color="#fff" />
            ) : (
              <MaterialCommunityIcons name="arrow-collapse" size={26} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsMuted((m) => !m)}>
            {isMuted ? (
              <Feather name="volume-x" size={26} color="#fff" />
            ) : (
              <Feather name="volume-2" size={26} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(item)}>
            <Feather name="share-2" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Show loading state
  if (loadingVideos) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006eff" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchVideos()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show empty state
  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="video-off" size={64} color="#666" />
        <Text style={styles.emptyText}>No videos uploaded yet</Text>
        <Text style={styles.emptySubtext}>Upload your first video to see it here</Text>
      </View>
    );
  }

  // Only render FlatList after initialIndex is loaded and videos are available
  if (initialIndex === null || videos.length === 0) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={CLIP_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: CLIP_HEIGHT,
          offset: CLIP_HEIGHT * index,
          index,
        })}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={videos.length > 0 && initialIndex !== null ? Math.min(initialIndex, videos.length - 1) : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#006eff"
            colors={["#006eff"]}
          />
        }
      />
      
      {/* Animated Comments Modal */}
      <Modal visible={modalVisible} transparent animationType="none">
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
            opacity: modalAnim,
            transform: [
              {
                translateY: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [CLIP_HEIGHT, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={closeComments}>
              <Feather name="x" size={28} color="#fff" />
            </TouchableOpacity>
            <ScrollView
              ref={commentsScrollRef}
              style={{ maxHeight: 220, width: "100%" }}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={true}
            >
              {activeComments.length === 0 ? (
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  No comments yet.
                </Text>
              ) : (
                activeComments.map((c) => (
                  <View key={c.id} style={styles.commentRow}>
                    <Text style={styles.commentUser}>{c.user}:</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            {/* Comment input */}
            <View style={styles.inputRow}>
              <Text style={{ color: "#fff", fontWeight: "bold", marginRight: 8 }}>
                You:
              </Text>
              <View style={{ flex: 1 }}>
                <TextInput
                  ref={commentInputRef}
                  style={styles.input}
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholder="Type a comment..."
                  placeholderTextColor="#888"
                  onSubmitEditing={handleCommentSubmit}
                  returnKeyType="send"
                />
              </View>
              <TouchableOpacity onPress={handleCommentSubmit} style={styles.sendBtn}>
                <Feather name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#006eff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  clipContainer: {
    height: CLIP_HEIGHT,
    width: width,
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  avatar: {
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#006eff",
  },
  modalContent: {
    backgroundColor: "#222",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: 400,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  commentUser: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
  commentText: {
    color: "#fff",
    fontSize: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    flex: 1,
  },
  sendBtn: {
    marginLeft: 8,
    padding: 8,
  },
  avatarBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#006eff",
  },
  rightIconGroup: {
    position: "absolute",
    right: 16,
    bottom: 40,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
    justifyContent: "flex-end",
    gap: 6,
    paddingVertical: 8,
    minHeight: 180,
    maxHeight: '50%',
  },
  iconButton: {
    marginTop: 5,
    alignItems: "center",
    paddingVertical: 2,
  },
  iconCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 2,
  },
  leftInfoGroup: {
    position: "absolute",
    left: 16,
    bottom: 50,
    flexDirection: "column",
    alignItems: "flex-start",
    zIndex: 2,
    justifyContent: "flex-end",
    maxWidth: '100%',
    gap: 5,
  },
  streamerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  streamerNameText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  postedAgoText: {
    color: "#006eff",
    fontSize: 18,
    marginBottom: 2,
  },
  extraInfoText: {
    color: "#fff",
    fontSize: 20,
    opacity: 0.85,
    fontWeight: "500",
    width: 250,
  },
  titleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 2,
  },
  postedAgoContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: "#006eff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  streamerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
}); 