import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform, Share, TouchableWithoutFeedback, Animated, Modal, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, router } from "expo-router";
import { mockStreams, mockUsers, mockChatMessages } from "@/data/mockdata";
import { Volume2, VolumeX, Share2, MoreVertical } from "lucide-react-native";
import { formatFollowers } from "@/utils/formatFollowers";
import { Video, ResizeMode } from "expo-av";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

export default function StreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const stream = mockStreams.find((s) => s.id === id);
  const videoRef = useRef<Video>(null);
  const [muted, setMuted] = useState(false);
  const streamerUser = stream ? mockUsers.find(u => u.username === stream.streamer.username) : null;
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(stream ? mockChatMessages(stream.id) : []);
  const scrollViewRef = useRef<ScrollView>(null);
  const [following, setFollowing] = useState(false);
  const handleToggleFollow = () => setFollowing(f => !f);
  const [infoVisible, setInfoVisible] = useState(true);
  const hideInfoTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const infoAnim = useRef(new Animated.Value(0)).current; // 0: visible, 1: hidden
  const infoRowHeight = 120; // px, must match outputRange in infoAnim
  const chatInputRef = useRef<TextInput>(null);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const chatInputModalRef = useRef<TextInput>(null);
  const [joinTime, setJoinTime] = useState<Date | null>(null);
  const [moreModalVisible, setMoreModalVisible] = useState(false);

  // Animate info row in/out
  useEffect(() => {
    Animated.timing(infoAnim, {
      toValue: infoVisible ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [infoVisible]);

  // Auto-hide info after 5 seconds
  useEffect(() => {
    if (infoVisible) {
      if (hideInfoTimeout.current !== null) clearTimeout(hideInfoTimeout.current);
      hideInfoTimeout.current = window.setTimeout(() => setInfoVisible(false), 5000);
    }
    return () => {
      if (hideInfoTimeout.current !== null) clearTimeout(hideInfoTimeout.current);
    };
  }, [infoVisible]);

  // Scroll to bottom on new message or input focus
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  const handleInputFocus = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  // Track when the user joins/views the stream
  useEffect(() => {
    const now = new Date();
    setJoinTime(now);
    // For demonstration, log it
    console.log(`User joined stream ${id} at`, now.toISOString());
  }, []);

  useEffect(() => {
    if (!id || !user?.id) return;
    const now = new Date();
    fetch('https://your-backend.com/api/stream-events/on-join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streamId: id,
        userId: user.id,
        joinedAt: now.toISOString(),
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Optionally handle response
      console.log('Join event sent:', data);
    })
    .catch(error => {
      console.error('Error sending join event:', error);
    });
  }, [id, user?.id]);

  const handleStreamTap = () => {
    setInfoVisible(true);
  };

  const handleMuteToggle = () => {
    setMuted((prev) => !prev);
  };

  const handleShare = async () => {
    if (stream) {
      try {
        await Share.share({
          message: `Check out this stream: ${stream.title}\nhttps://yourapp.com/stream/${stream.id}`,
          url: `https://yourapp.com/stream/${stream.id}`,
          title: stream.title,
        });
      } catch (error) {
        alert("Could not share the stream.");
      }
    }
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now()),
          username: "You",
          message: chatInput,
          badges: [],
          time: new Date(),
        },
      ]);
      setChatInput("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const openInputModal = () => {
    setInputModalVisible(true);
    setTimeout(() => {
      chatInputModalRef.current?.focus();
    }, 200);
  };
  const closeInputModal = () => {
    setInputModalVisible(false);
    Keyboard.dismiss();
  };
  const handleModalSend = () => {
    if (chatInput.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now()),
          username: "You",
          message: chatInput,
          badges: [],
          time: new Date(),
        },
      ]);
      setChatInput("");
      closeInputModal();
    }
  };

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>Live Stream</Text>
        <View style={{ width: 40 }} />
      </View>
      {stream ? (
        <View style={{ flex: 1, width: '100%' }}>
          {/* Stream video with overlay icons */}
          <View style={{ position: 'relative', width: '100%' }}>
            <Video
              ref={videoRef}
              source={{ uri: stream.videoUrl }}
              style={styles.thumbnail}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isMuted={muted}
              isLooping
            />
            <View style={{
              position: 'absolute',
              right: 16,
              bottom: 10,
              gap: 10,
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10,
            }}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleMuteToggle}>
                {muted ? (
                  <VolumeX size={22} color="#fff" />
                ) : (
                  <Volume2 size={22} color="#fff" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                <Share2 size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setMoreModalVisible(true)}>
                <MoreVertical size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
          {/* Info row (no animation, no absolute) */}
          <View style={styles.infoRow}>
            <View style={styles.profileGroupSmall}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: stream.streamer.avatar }} style={styles.avatar} />
                  <View style={styles.liveTag}>
                    <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
                {/* Only streamer name below avatar */}
                <View style={{ marginTop: 6, maxWidth: 90 }}>
                  <Text style={styles.streamerGroup} numberOfLines={2} ellipsizeMode="tail">
                {stream.streamer.displayName}
              </Text>
                </View>
              </View>
            </View>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>{stream.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <TouchableOpacity
                  style={[styles.followBtn, following && { borderColor: "#006eff", backgroundColor: "#006eff22" }, styles.followBtnFixed]}
                  onPress={handleToggleFollow}
                >
                  <Feather name="heart" size={16} color={following ? "#006eff" : "#fff"} />
                  <Text style={[styles.followText, following && { color: "#006eff" }]}> {following ? "Following" : "Follow"}</Text>
                </TouchableOpacity>
                {/* Viewers and Followers count stacked vertically */}
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}>
                  <Text style={{ color: "rgba(0, 120, 255, 0.7)", fontWeight: 'bold' }}>{formatFollowers(stream.viewers)} Viewers</Text>
                  <Text style={{ color: "rgba(0, 120, 255, 0.7)", fontWeight: 'bold' }}>{streamerUser ? formatFollowers(streamerUser.followers) : '0'} Followers</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Comments */}
          <View style={{ flex: 1, width: '100%' }}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatScroll}
              contentContainerStyle={{ paddingBottom: 20 }}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => (
                <View key={msg.id} style={styles.chatMsgRow}>
                  <Text style={styles.chatUsername}>{msg.username}:</Text>
                  <Text style={styles.chatMsg}>{msg.message}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* Input field row */}
          <View style={styles.chatInputRow}>
            <TouchableOpacity style={{ flex: 1 }} onPress={openInputModal} activeOpacity={0.8}>
              <Text style={[styles.chatInput, { color: '#888' }]}>Type a message...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatMoreBtn} onPress={() => setMoreModalVisible(true)}>
              <MoreVertical size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Modal for input field */}
          <Modal
            visible={inputModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeInputModal}
          >
            <TouchableWithoutFeedback onPress={closeInputModal}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
                <TouchableWithoutFeedback>
                  <View style={{ padding: 16, backgroundColor: '#23232a', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        ref={chatInputModalRef}
                        style={styles.chatInput}
                        value={chatInput}
                        onChangeText={setChatInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#888"
                        onSubmitEditing={handleModalSend}
                        returnKeyType="send"
                        autoFocus
                        blurOnSubmit={false}
                      />
                      <TouchableOpacity style={styles.chatMoreBtn} onPress={handleModalSend}>
                        <Feather name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {/* More modal */}
          <Modal
            visible={moreModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMoreModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setMoreModalVisible(false)}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
                <TouchableWithoutFeedback>
                  <View style={{ padding: 16, backgroundColor: '#23232a', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>More Options (Coming Soon)</Text>
                    {/* Add more options here as needed */}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      ) : (
        <Text style={styles.text}>Stream not found.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e10",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
  },
  heading: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  thumbnail: {
    width: width,
    height: Math.round((width * 9) / 16),
    borderRadius: 0,
    backgroundColor: "#222",
    alignSelf: "center",
  },
  profileGroup: {
    width: "100%",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarLiveRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#333",
  },
  liveTag: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#E91916",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#fff",
  },
  liveText: {
    color: "#ccc",
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  profileInfo: {
    justifyContent: "center",
  },
  streamer: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  followers: {
    color: "#aaa",
    fontSize: 14,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 24,
    padding: 10,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  videoContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  verticalActionIcons: {
    position: "absolute",
    right: 16,
    bottom: 0,
    zIndex: 100,
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 8,
    gap: 16,
    backgroundColor: "black",
  },
  profileGroupSmall: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexShrink: 0,
    maxWidth: 90,
    justifyContent: "center",
    alignSelf: "center",
  },
  titleGroup: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 5,
  },
  chatMsgRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  chatUsername: {
    color: "#006eff",
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 15,
  },
  chatMsg: {
    color: "#fff",
    fontSize: 15,
    flexShrink: 1,
  },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 15,
    backgroundColor: "#23232a",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  chatMoreBtn: {
    padding: 10,
    marginLeft: 2,
  },
  streamerGroup: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  followersInline: {
    color: "#aaa",
    fontWeight: "normal",
  },
  followBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  followBtnFixed: {
    width: 100,
    justifyContent: "center",
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
});
