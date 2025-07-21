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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import { CLIPS } from "@/data/mockdata";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TAB_BAR_HEIGHT = 80; // Adjust to your actual tab bar height
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CLIP_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

// Utility to capitalize first letter
function capitalizeFirst(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ClipsScreen({ paused = false }: { paused?: boolean }) {
  const videoRefs = useRef<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const [activeComments, setActiveComments] = useState<
    (typeof CLIPS)[0]["comments"]
  >([]);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [likes, setLikes] = useState(CLIPS.map((clip) => clip.likes));
  const [liked, setLiked] = useState(CLIPS.map(() => false));
  const [commentsData, setCommentsData] = useState(
    CLIPS.map((clip) => clip.comments)
  );
  const [commentInput, setCommentInput] = useState("");
  const [viewableIndex, setViewableIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Initial state: unmuted
  const [resizeMode, setResizeMode] = useState<ResizeMode>(ResizeMode.COVER);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true); // For tap-to-pause/play
  const [initialIndex, setInitialIndex] = useState<number | null>(null);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setViewableIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleShare = (clip: (typeof CLIPS)[0]) => {
    Share.share({
      message: `Check out this clip: ${clip.uri}`,
      url: clip.uri,
      title: clip.title,
    });
  };

  const toggleResizeMode = () => {
    setResizeMode((prev) =>
      prev === ResizeMode.COVER ? ResizeMode.CONTAIN : ResizeMode.COVER
    );
  };

  const openComments = (comments: any[], clipId: string, index: number) => {
    setActiveComments(commentsData[index]);
    setActiveClip(clipId);
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
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
    const index = CLIPS.findIndex((clip) => clip.id === activeClip);
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
    setIsPlaying((prev) => !prev);
    const ref = videoRefs.current[viewableIndex];
    if (ref) {
      if (isPlaying) {
        ref.pauseAsync && ref.pauseAsync();
      } else {
        ref.playAsync && ref.playAsync();
      }
    }
  };

  const renderItem = ({ item, index }: { item: typeof CLIPS[0]; index: number; }) => {
    const isVerified = typeof item.streamer.verified === 'boolean' ? item.streamer.verified : false;
    const postedAgo = item.id === "1" ? "posted 2 days ago" : "posted 1 week ago";
    // Only show tags (not game) in the extra info
    const extraInfoArr = (item.tags || []).filter(Boolean);
    const extraInfo = extraInfoArr.join(", ");
    return (
      <View style={styles.clipContainer}>
        <TouchableOpacity style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} activeOpacity={1} onPress={handleVideoPress}>
          <Video
            ref={(ref) => {
              videoRefs.current[index] = ref;
            }}
            source={{ uri: item.uri }}
            style={resizeMode === ResizeMode.CONTAIN ? styles.videoFullScreen : styles.video}
            resizeMode={resizeMode}
            shouldPlay={isPlaying && !paused && index === viewableIndex}
            isMuted={isMuted}
            isLooping={true}
          />
        </TouchableOpacity>
        {/* Left info group, bottom-aligned, fills left side */}
        <View style={styles.leftInfoGroup}>
          <View style={styles.streamerNameRow}>
            <TouchableOpacity onPress={() => router.push(`/user/${item.streamer.name}`)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.streamerNameText}>{capitalizeFirst(item.streamer.name)}</Text>
              {isVerified && (
                <MaterialCommunityIcons name="check-decagram" size={18} color="#9147FF" style={{ marginLeft: 2, marginTop: 1 }} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.titleText}>{capitalizeFirst(item.title)}</Text>
          <View style={styles.postedAgoContainer}>
            <Text style={styles.postedAgoText}>{capitalizeFirst(postedAgo)}</Text>
          </View>
          <Text
            style={styles.extraInfoText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {capitalizeFirst(extraInfo)}
          </Text>
        </View>
        {/* Right icon group, bottom-aligned, with profile pic and more */}
        <View style={styles.rightIconGroup}>
          <TouchableOpacity onPress={() => router.push(`/user/${item.streamer.name}`)} style={styles.avatarBtn}>
            <Image source={{ uri: item.streamer.avatar }} style={[styles.avatar, { width: 60, height: 60 }]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleLike(index)}>
            {liked[index] ? (
              <MaterialCommunityIcons name="heart" size={26} color="#9147FF" />
            ) : (
              <Feather name="heart" size={26} color="#fff" />
            )}
            <Text style={styles.iconCount}>{likes[index]}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => openComments(commentsData[index], item.id, index)}>
            <Feather name="message-circle" size={26} color="#fff" />
            <Text style={styles.iconCount}>{commentsData[index].length}</Text>
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
          <TouchableOpacity onPress={() => router.push({ pathname: "/ReportBlock", params: { target: item.streamer.name } })} style={[styles.iconButton, { marginTop: 0 }]}>
            <MoreVertical size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Only render FlatList after initialIndex is loaded
  if (initialIndex === null) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        data={CLIPS}
        keyExtractor={(item) => item.id}
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
        initialScrollIndex={initialIndex}
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
            <View style={{ maxHeight: 220, width: "100%" }}>
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
            </View>
            {/* Comment input */}
            <View style={styles.inputRow}>
              <Text
                style={{ color: "#fff", fontWeight: "bold", marginRight: 8 }}
              >
                You:
              </Text>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholder="Type a comment..."
                  placeholderTextColor="#888"
                  onSubmitEditing={handleCommentSubmit}
                  returnKeyType="send"
                />
              </View>
              <TouchableOpacity
                onPress={handleCommentSubmit}
                style={styles.sendBtn}
              >
                <Feather name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeComments}>
              <Feather name="x" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  clipContainer: {
    height: CLIP_HEIGHT,
    width: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: CLIP_HEIGHT,
  },
  overlay: {
    position: "absolute",
    bottom: 24,
    left: 80,
    right: 80,
    width: undefined,
    paddingHorizontal: 24,
    paddingBottom: 0,
    zIndex: 1,
  },
  leftButtons: {
    position: "absolute",
    left: 16,
    bottom: 24,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },
  rightInfo: {
    position: "absolute",
    right: 16,
    bottom: 24,
    alignItems: "center",
    zIndex: 2,
  },
  avatar: {
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  streamerName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
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
  leftButtonsFull: {
    position: "absolute",
    left: 16,
    bottom: 24,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
    justifyContent: "flex-end",
    height: "60%",
  },
  rightInfoFull: {
    position: "absolute",
    right: 16,
    bottom: 24,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
    justifyContent: "flex-end",
    height: "60%",
  },
  avatarBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlayFull: {
    position: "absolute",
    bottom: 24,
    left: 120,
    right: 120,
    width: undefined,
    paddingHorizontal: 24,
    paddingBottom: 0,
    zIndex: 1,
    alignItems: "center",
  },
  titleFull: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  rightIconGroup: {
    position: "absolute",
    right: 16,
    bottom: 24,
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
    marginBottom: 0,
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
    bottom: 34,
    flexDirection: "column",
    alignItems: "flex-start",
    zIndex: 2,
    justifyContent: "flex-end",
    maxWidth: 200,
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
    color: "#9147FF",
    fontSize: 18,
    marginBottom: 2,
    fontWeight: "600",
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
    width: '100%',
    borderWidth: 2,
    borderColor: "#9147FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  videoFullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: SCREEN_HEIGHT - TAB_BAR_HEIGHT,
    zIndex: 0,
  },
  streamerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
});
