import React, { useState, useRef, useEffect } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Stream, mockStreams, mockUsers } from "@/data/mockdata";
import { router, useFocusEffect } from "expo-router";
import { MoreVertical, EyeOff, UserX, Flag } from "lucide-react-native";
import { formatFollowers } from "@/utils/formatFollowers";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 70;
const VISIBLE_HEIGHT = height-TAB_BAR_HEIGHT;

export default function LiveStreamApp() {
  const { token: authToken } = useAuth();
  // Fetch all live streams from backend
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingStreams(true);
    fetch("https://5e6ffe7f3715.ngrok-free.app/api/streams/live"/*, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
    }*/)
      .then(res => res.json())
      .then(data => {
        setLiveStreams(data);
        setLoadingStreams(false);
      })
      .catch(err => {
        setError("Failed to load live streams");
        setLoadingStreams(false);
      });
  }, [authToken]);

  // Track following state per stream id
  const [following, setFollowing] = useState<{ [id: string]: boolean }>({});
  const [muted, setMuted] = useState<{ [id: string]: boolean }>({});
  const [paused, setPaused] = useState(false);
  const [resizeModes, setResizeModes] = useState<{ [id: string]: ResizeMode }>({});
  const [loading, setLoading] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [videoError, setVideoError] = useState<{ [id: string]: boolean }>({});

  useFocusEffect(
    React.useCallback(() => {
      setPaused(false); // Not paused when focused
      return () => {
        setPaused(true); // Pause when unfocused
      };
    }, [])
  );

  const handleToggleFollow = (id: string) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMute = (id: string) => {
    setMuted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleResize = (id: string) => {
    setResizeModes((prev) => ({
      ...prev,
      [id]: prev[id] === ResizeMode.CONTAIN ? ResizeMode.COVER : ResizeMode.CONTAIN,
    }));
  };

  const [viewableIndex, setViewableIndex] = useState(0);
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems && viewableItems.length > 0) {
      setViewableIndex(viewableItems[0].index);
    }
  }).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const renderStream = ({ item, index }: { item: any, index: number }) => {
    const isFollowing = !!following[item.id];
    const isMuted = !!muted[item.id];
    const streamerUser = mockUsers.find(u => u.username === item.streamer.username);
    const followerCount = streamerUser ? formatFollowers(streamerUser.followers) : "";
    const isVerified = !!(streamerUser && "verified" in streamerUser && streamerUser.verified);
    const viewersCount = item.viewers ? formatFollowers(item.viewers) : "0";
    const videoUrl = item.muxPlaybackId ? `https://stream.mux.com/${item.muxPlaybackId}.m3u8` : null;
    const resizeMode = resizeModes[item.id] || ResizeMode.COVER;
    return (
      <View style={[styles.streamContainer, { height: VISIBLE_HEIGHT, top: 0, left: 0, right: 0, bottom: 0 }]}> 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {!videoError[item.id] ? (
            <Video
              source={videoUrl ? { uri: videoUrl } : undefined}
              style={[styles.video, { height: VISIBLE_HEIGHT }]}
              resizeMode={resizeMode}
              shouldPlay={index === viewableIndex && !paused}
              isMuted={isMuted}
              isLooping
              onLoadStart={() => {
                if (!paused && index === viewableIndex) setLoading(true);
              }}
              onReadyForDisplay={() => {
                setLoading(false);
              }}
              onPlaybackStatusUpdate={(status) => {
                if (!status.isLoaded) return;
                if (status.isBuffering && !paused && index === viewableIndex) {
                  setLoading(true);
                } else if (status.isPlaying && !status.isBuffering) {
                  setLoading(false);
                }
                if (status.didJustFinish) setLoading(false);
                if (!status.isPlaying) setLoading(false);
              }}
              onError={() => setVideoError(prev => ({ ...prev, [item.id]: true }))}
            />
          ) : videoUrl ? (
            <WebView
              style={{ width: '100%', height: VISIBLE_HEIGHT, backgroundColor: '#000' }}
              source={{ html: `
                <html><body style='margin:0;background:#000;'>
                <video id='video' controls autoplay style='width:100vw;height:100vh;background:#000' playsinline></video>
                <script src='https://cdn.jsdelivr.net/npm/hls.js@latest'></script>
                <script>
                  var video = document.getElementById('video');
                  if (Hls.isSupported()) {
                    var hls = new Hls();
                    hls.loadSource('${videoUrl}');
                    hls.attachMedia(video);
                  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = '${videoUrl}';
                  }
                </script>
                </body></html>
              ` }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
            />
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Unable to play this stream.</Text>
          )}
          {loading && !paused && index === viewableIndex && (
            <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -35 }, { translateY: -36 }], opacity: 0.5 }}>
              <ActivityIndicator size={62} color="#fff" />
            </View>
          )}
        </View>
        {/* Right icon group, vertical stack, with profile pic and live tag, OUTSIDE gradient */}
        <View style={[styles.rightActionStackLive, { position: 'absolute', right: 5, bottom: 50, zIndex: 10 }]}> 
          <TouchableOpacity onPress={() => router.push(`/stream/${item.id}`)} style={styles.avatarContainerLarge}>
            <Image source={{ uri: item.streamer.avatar }} style={styles.viewerAvatarLarge} />
            {item.isLive && (
              <View style={styles.liveTagOnAvatar}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", marginHorizontal: 18 }} onPress={() => handleToggleMute(item.id)}>
            <Feather name={isMuted ? "volume-x" : "volume-2"} size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", marginHorizontal: 18 }} onPress={() => handleToggleResize(item.id)}>
            {resizeMode === ResizeMode.COVER ? (
              <MaterialCommunityIcons name="arrow-expand" size={26} color="#fff" />
            ) : (
              <MaterialCommunityIcons name="arrow-collapse" size={26} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", marginHorizontal: 18 }} onPress={() => {}}>
            <Feather name="share-2" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", marginHorizontal: 18 }} onPress={() => setMoreModalVisible(true)}>
            <MoreVertical size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Overlay for info and actions, styled like clips */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)", "transparent"]}
          style={styles.bottomOverlay}
      >
          <View style={styles.infoRowFull}>
            <View style={styles.leftInfoGroupFull}>
              <View style={styles.nameAndFollowRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => router.push(`/user/${item.streamer.username}`)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.streamerNameLive}>{item.streamer.displayName}</Text>
                    {isVerified && (
                      <MaterialCommunityIcons name="check-decagram" size={18} color="#006eff" style={{ marginLeft: 2, marginTop: 1 }} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    styles.followBtn,
                    isFollowing && { borderColor: "#006eff", backgroundColor: "#006eff22" },
                    styles.followBtnFixed,
                  ]}
                  onPress={() => handleToggleFollow(item.id)}
                >
                  <Feather name="heart" size={16} color={isFollowing ? "#006eff" : "#fff"} />
                  <Text style={[styles.followText, isFollowing && { color: "#006eff" }]}>
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.titleLive}>{item.title}</Text>
              <View style={styles.categoryRowLive}>
                <MaterialCommunityIcons name="sword-cross" size={16} color="#fff" />
                <Text style={styles.categoryTextLive}>{item.game}</Text>
              </View>
              <View style={styles.statsRowLive}>
                <Text style={styles.followersLive}>{viewersCount} Viewers</Text>
                <Text style={styles.statsSeparator}>|</Text>
                <Text style={styles.followersLive}>{followerCount} Followers</Text>
              </View>
            </View>
            {/* Right icon group, vertical stack, with profile pic and live tag */}
            {/* This block is now moved outside the LinearGradient */}
          </View>
        </LinearGradient>
        {/* Bottom Sheet Modal for More Options */}
        <Modal
          visible={moreModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMoreModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMoreModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingBottom: 20, paddingTop: 12, alignItems: 'center', minHeight: 260 }}>
                  {/* Not Interested */}
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', alignSelf: 'center', paddingVertical: 15, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#23232a', borderRadius: 10, marginBottom: 15, backgroundColor: '#23232a' }}
                    activeOpacity={0.7}
                    onPress={() => setMoreModalVisible(false)}
                  >
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>Not Interested</Text>
                    <EyeOff size={24} color="#fff" />
                  </TouchableOpacity>
                  {/* Block and Report (closer together) */}
                  <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#23232a', borderRadius: 10, backgroundColor: '#23232a', marginBottom: 2 }}
                      activeOpacity={0.7}
                      onPress={() => setMoreModalVisible(false)}
                    >
                      <Text style={{ color: '#ff4d4f', fontSize: 18, fontWeight: '500' }}>Block {item.streamer.displayName}</Text>
                      <UserX size={24} color="#ff4d4f" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#23232a', marginTop: 0 }}
                      activeOpacity={0.7}
                      onPress={() => setMoreModalVisible(false)}
                    >
                      <Text style={{ color: '#ff4d4f', fontSize: 18, fontWeight: '500' }}>Report {item.streamer.displayName}</Text>
                      <Flag size={24} color="#ff4d4f" />
                    </TouchableOpacity>
                  </View>
                  {/* Cancel */}
                  <TouchableOpacity
                    style={{ width: '80%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 10, backgroundColor: '#23232a', marginTop: 10 }}
                    activeOpacity={0.7}
                    onPress={() => setMoreModalVisible(false)}
                  >
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  streamContainer: {
    height: VISIBLE_HEIGHT,
    width: '100%',
    backgroundColor: '#000',
    position: 'relative',
    flex: 1,
    marginTop: 0, // ensure no vertical margin
    marginBottom: 0, // ensure no vertical margin
    paddingTop: 0, // ensure no vertical padding
    paddingBottom: 0, // ensure no vertical padding
  },
  video: {
    width: width,
    position: "absolute",
    top: 0,
    left: 0,
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 45,
    paddingHorizontal: 10,
    paddingBottom: 0,
    paddingTop: 16,
    backgroundColor: "transparent",
    shadowColor: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    elevation: undefined,
  },
  liveTagOnAvatar: {
    position: "absolute",
    bottom: -6,
    left: 5,
    right: 5,
    backgroundColor: "#E91916",
    borderRadius: 6,
    paddingHorizontal: 0,
    paddingVertical: 2,
    alignItems: "center",
    zIndex: 2,
  },
  liveText: {
    color: "#ccc",
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  followBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  avatarContainerLarge: {
    position: "relative",
  },
  viewerAvatarLarge: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#006eff",
    borderRadius: 32,
    backgroundColor: "#333",
  },
  infoRowFull: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "90%",
    left: 5,
  },
  leftInfoGroupFull: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    flex: 1,
    zIndex: 1,
    paddingRight: 70,
  },
  streamerNameLive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  titleLive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },
  categoryRowLive: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  categoryTextLive: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  followersLive: {
    color: "#006eff",
    fontSize: 16,
  },
  rightActionStackLive: {
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    zIndex: 2,
    minWidth: 80,
},
  nameAndFollowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    flexWrap: "wrap",
    width: '100%',
  },
  statsRowLive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 2,
  },
  statsSeparator: {
    color: "#aaa",
    fontSize: 16,
    marginHorizontal: 6,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
}
)};