import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform, Share, TouchableWithoutFeedback, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, router } from "expo-router";
import { mockStreams, mockUsers, mockChatMessages } from "@/data/mockdata";
import { Volume2, VolumeX, Share2, MoreVertical } from "lucide-react-native";
import { formatFollowers } from "@/utils/formatFollowers";
import { Video, ResizeMode } from "expo-av";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function StreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.heading}>Live Stream</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        {stream ? (
          <View style={{ position: 'relative' }}>
            <TouchableWithoutFeedback onPress={handleStreamTap}>
              <View style={{ position: 'relative' }}>
                <Video
                  ref={videoRef}
                  source={{ uri: stream.videoUrl }}
                  style={[styles.thumbnail, { zIndex: 30 }]}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isMuted={muted}
                  isLooping
                />
                <View style={styles.verticalActionIcons}>
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
                  <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
                    <MoreVertical size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
                {/* Animated info row absolutely positioned at bottom of video */}
                <Animated.View
                  style={[
                    styles.infoRowAbsolute,
                    {
                      transform: [
                        {
                          translateY: infoAnim.interpolate({
                            inputRange: [1, 1],
                            outputRange: [infoRowHeight, 0],
                          }),
                        },
                      ],
                      opacity: infoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                      zIndex: 20,
                    },
                  ]}
                  pointerEvents={infoVisible ? 'auto' : 'none'}
                >
                  <View style={styles.infoRow}>
                    <View style={styles.profileGroupSmall}>
                      <View style={styles.avatarColumn}>
                        <View style={styles.avatarContainer}>
                          <Image source={{ uri: stream.streamer.avatar }} style={styles.avatar} />
                          <View style={styles.liveTag}>
                            <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
                        <View style={styles.profileInfoColumn}>
                          <Text style={styles.streamerGroup}>
                {stream.streamer.displayName}
                            {streamerUser ? (
                              <Text style={styles.followersInline}>
                                {` · ${formatFollowers(streamerUser.followers)}`}
              </Text>
                            ) : null}
            </Text>
          </View>
        </View>
                    </View>
                    <View style={styles.titleGroup}>
                      <Text style={styles.title}>{stream.title}</Text>
                      <TouchableOpacity
                        style={[styles.followBtn, following && { borderColor: "#9147FF", backgroundColor: "#9147FF22" }, styles.followBtnFixed]}
                        onPress={handleToggleFollow}
                      >
                        <Feather name="heart" size={16} color={following ? "#9147FF" : "#fff"} />
                        <Text style={[styles.followText, following && { color: "#9147FF" }]}> {following ? "Following" : "Follow"}</Text>
        </TouchableOpacity>
      </View>
                  </View>
                </Animated.View>
        </View>
            </TouchableWithoutFeedback>
            {/* Chat area (messages) */}
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: infoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, infoRowHeight],
                    }),
                  },
                ],
                zIndex: 10,
                flex: 1,
              }}
            >
              {/* Chat Scroll View */}
              <ScrollView
                ref={scrollViewRef}
                style={styles.chatScroll}
                contentContainerStyle={{ paddingBottom: 60 }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {messages.map((msg) => (
                  <View key={msg.id} style={styles.chatMsgRow}>
                    <Text style={styles.chatUsername}>{msg.username}:</Text>
                    <Text style={styles.chatMsg}>{msg.message}</Text>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
            {/* Chat input always at bottom or above keyboard */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.chatInputAvoid}
              keyboardVerticalOffset={80}
            >
              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#888"
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                />
                <TouchableOpacity style={styles.chatMoreBtn}>
                  <MoreVertical size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : (
          <Text style={styles.text}>Stream not found.</Text>
        )}
      </View>
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
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 16,
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
  chatContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "#18181b",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  chatMsgRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  chatUsername: {
    color: "#9147FF",
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
    backgroundColor: "#23232a",
    borderTopWidth: 1,
    borderTopColor: "#222",
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
    padding: 6,
    marginLeft: 2,
  },
  avatarColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  profileInfoColumn: {
    alignItems: "center",
    marginTop: 4,
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
    width: 98,
    justifyContent: "center",
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  infoRowAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  chatInputAvoid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
