import React, { useState, useRef } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Stream, mockStreams, mockUsers } from "@/data/mockdata";
import { router } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import { formatFollowers } from "@/utils/formatFollowers";
import { useFocusEffect } from 'expo-router';

const { width, height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 80;
const VISIBLE_HEIGHT = height - TAB_BAR_HEIGHT;

export default function LiveStreamApp() {
  // Get all live streams
  const liveStreams = mockStreams.filter((s) => s.isLive);

  // Track following state per stream id
  const [following, setFollowing] = useState<{ [id: string]: boolean }>({});
  const [muted, setMuted] = useState<{ [id: string]: boolean }>({});
  const [paused, setPaused] = useState(false);

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

  const [viewableIndex, setViewableIndex] = useState(0);
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems && viewableItems.length > 0) {
      setViewableIndex(viewableItems[0].index);
    }
  }).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const renderStream = ({ item, index }: { item: Stream, index: number }) => {
    const isFollowing = !!following[item.id];
    const isMuted = !!muted[item.id];
    const streamerUser = mockUsers.find(u => u.username === item.streamer.username);
    const followerCount = streamerUser ? formatFollowers(streamerUser.followers) : "";
    const isVerified = !!(streamerUser && "verified" in streamerUser && streamerUser.verified);
    const viewersCount = item.viewers ? formatFollowers(item.viewers) : "0";
    // Use a sample video URL for demonstration
    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    return (
    <View style={[styles.streamContainer, { height: VISIBLE_HEIGHT }]}>
        <Video
          source={{ uri: videoUrl }}
        style={[styles.video, { height: VISIBLE_HEIGHT }]}
        resizeMode={ResizeMode.COVER}
          shouldPlay={index === viewableIndex && !paused}
          isMuted={isMuted}
          isLooping
      />
        {/* Overlay for info and actions, styled like clips */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.2)", "transparent"]}
        style={[styles.bottomOverlay, { bottom: TAB_BAR_HEIGHT }]}
      >
          <View style={styles.infoRowFull}>
            <View style={styles.leftInfoGroupFull}>
              <View style={styles.nameAndFollowRow}>
                <View style={styles.streamerNameRowLive}>
                  <TouchableOpacity onPress={() => router.push(`/user/${item.streamer.username}`)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.streamerNameLive}>{item.streamer.displayName}</Text>
                    {isVerified && (
                      <MaterialCommunityIcons name="check-decagram" size={18} color="#9147FF" style={{ marginLeft: 2, marginTop: 1 }} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    styles.followBtn,
                    isFollowing && { borderColor: "#9147FF", backgroundColor: "#9147FF22" },
                    styles.followBtnFixed,
                  ]}
                  onPress={() => handleToggleFollow(item.id)}
                >
                  <Feather name="heart" size={16} color={isFollowing ? "#9147FF" : "#fff"} />
                  <Text style={[styles.followText, isFollowing && { color: "#9147FF" }]}>
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
            <View style={styles.rightActionStackLive}>
              <TouchableOpacity onPress={() => router.push(`/stream/${item.id}`)} style={styles.avatarContainerLarge}>
                <Image source={{ uri: item.streamer.avatar }} style={styles.viewerAvatarLarge} />
                {item.isLive && (
                  <View style={styles.liveTagOnAvatar}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
                )}
          </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleMute(item.id)}>
                <Feather name={isMuted ? "volume-x" : "volume-2"} size={22} color="#fff" />
          </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                <Feather name="share-2" size={22} color="#fff" />
            </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                <MoreVertical size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        </View>
      </LinearGradient>
    </View>
  );
  };

  return (
    <FlatList
      data={liveStreams}
      keyExtractor={(item) => item.id}
      renderItem={(props) => renderStream({ ...props, index: props.index })}
      pagingEnabled
      horizontal={false}
      snapToInterval={VISIBLE_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#000" }}
      getItemLayout={(_, index) => ({
        length: VISIBLE_HEIGHT,
        offset: VISIBLE_HEIGHT * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}

const styles = StyleSheet.create({
  streamContainer: {
    width,
    backgroundColor: "#000",
    position: "relative",
    flex: 1,
  },
  video: {
    width: width,
    position: "absolute",
    top: 0,
    left: 0,
    paddingBottom: 200,
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
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
  streamerName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 4,
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
  viewerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  viewerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  viewerCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  streamTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  profileInfo: {
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    gap: 24,
  },
  actionBtn: {
    alignItems: "center",
    marginHorizontal: 18,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 13,
    marginTop: 4,
  },
  profileActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  leftActionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarContainerLarge: {
    position: "relative",
  },
  viewerAvatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#333",
  },
  bottomRightOverlay: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    gap: 12,
    paddingBottom: 4,
  },
  infoRowFull: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  leftInfoGroupFull: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    flex: 1,
    zIndex: 1,
  },
  rightActionStack: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    paddingBottom: 4,
    paddingRight: 4,
    gap: 18,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderTopLeftRadius: 24,
    minWidth: 80,
  },
  streamerRowLive: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
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
    color: "#9147FF",
    fontSize: 16,
  },
  rightActionStackLive: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 2,
    minWidth: 80,
  },
  profileRowLive: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 12,
  },
  nameAndFollowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    flexWrap: "wrap",
    width: 240,
  },
  streamerNameRowLive: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsRowLive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  statsSeparator: {
    color: "#9147FF",
    fontSize: 16,
    marginHorizontal: 6,
    fontWeight: "bold",
  },
});
