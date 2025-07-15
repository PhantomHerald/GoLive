import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const CLIPS = [
  {
    id: "1",
    uri: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Clip 1",
    streamer: {
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "StreamerOne",
    },
    likes: 12,
    comments: [
      { id: "c1", user: "Alice", text: "Nice clip!" },
      { id: "c2", user: "Bob", text: "Awesome!" },
    ],
  },
  {
    id: "2",
    uri: "https://www.w3schools.com/html/movie.mp4",
    title: "Clip 2",
    streamer: {
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "StreamerTwo",
    },
    likes: 5,
    comments: [{ id: "c3", user: "Charlie", text: "Great moment!" }],
  },
];

const TAB_BAR_HEIGHT = 80; // Adjust to your actual tab bar height
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CLIP_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

export default function ClipsScreen() {
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

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof CLIPS)[0];
    index: number;
  }) => (
    <View style={styles.clipContainer}>
      <Video
        ref={(ref) => {
          videoRefs.current[index] = ref;
        }}
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
      />
      {/* Vertical button stack on left */}
      <View style={styles.leftButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openComments(commentsData[index], item.id, index)}
        >
          <Feather name="message-circle" size={32} color="#fff" />
          <Text style={styles.iconCount}>{commentsData[index].length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleLike(index)}
        >
          {/* Use MaterialCommunityIcons for filled heart, Feather for outline */}
          {liked[index] ? (
            <MaterialCommunityIcons name="heart" size={32} color="#E91916" />
          ) : (
            <Feather name="heart" size={32} color="#fff" />
          )}
          <Text style={styles.iconCount}>{likes[index]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share-2" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Streamer info on right */}
      <View style={styles.rightInfo}>
        <Image source={{ uri: item.streamer.avatar }} style={styles.avatar} />
        <Text style={styles.streamerName}>{item.streamer.name}</Text>
      </View>
      {/* Overlay title */}
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={{ color: "white" }}>just chatting. first test</Text>
      </View>
    </View>
  );

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
  iconButton: {
    marginBottom: 24,
    alignItems: "center",
  },
  iconCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  rightInfo: {
    position: "absolute",
    right: 16,
    bottom: 24,
    alignItems: "center",
    zIndex: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
});
