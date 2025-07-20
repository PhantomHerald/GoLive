import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Stream, mockStreams } from "@/data/mockdata";
import { router } from "expo-router";
import { MoreHorizontal } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 80;
const VISIBLE_HEIGHT = height - TAB_BAR_HEIGHT;

export default function LiveStreamApp() {
  // Get all live streams
  const liveStreams = mockStreams.filter((s) => s.isLive);

  // Track following state per stream id
  const [following, setFollowing] = useState<{ [id: string]: boolean }>({});

  const handleToggleFollow = (id: string) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStream = ({ item }: { item: Stream }) => {
    const isFollowing = !!following[item.id];
    return (
      <View style={[styles.streamContainer, { height: VISIBLE_HEIGHT }]}>
        <Image
          source={{ uri: item.thumbnail }}
          style={[styles.video, { height: VISIBLE_HEIGHT }]}
          resizeMode="cover"
        />
        {/* Bottom overlay - now transparent and safe area padded */}
        <SafeAreaView
          edges={["left", "right", "bottom"]}
          style={[
            styles.bottomOverlay,
            {
              bottom: TAB_BAR_HEIGHT,
              backgroundColor: "transparent",
              paddingHorizontal: 20,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/user/[username]",
                  params: { username: item.streamer.displayName },
                })
              }
            >
              <Text style={styles.streamerName}>
                {item.streamer.displayName}
              </Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#9147FF"
              style={{ marginLeft: 4 }}
            />
            <TouchableOpacity
              style={[
                styles.followBtn,
                isFollowing && {
                  borderColor: "#9147FF",
                  backgroundColor: "#9147FF22",
                },
                styles.followBtnFixed,
              ]}
              onPress={() => handleToggleFollow(item.id)}
            >
              <Feather
                name="heart"
                size={16}
                color={isFollowing ? "#9147FF" : "#fff"}
              />
              <Text
                style={[styles.followText, isFollowing && { color: "#9147FF" }]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <View style={styles.viewerBox}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/user/[username]",
                    params: { username: item.streamer.displayName },
                  })
                }
              >
                <Image
                  source={{ uri: item.streamer.avatar }}
                  style={styles.viewerAvatar}
                />
              </TouchableOpacity>
              <Text style={styles.viewerCount}>{item.viewers}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/ReportBlock",
                  params: { target: item.streamer.displayName },
                })
              }
              style={{ marginLeft: 12 }}
            >
              <MoreHorizontal size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Feather name="share-2" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.streamTitle}>{item.title}</Text>
          <View style={styles.categoryRow}>
            <MaterialCommunityIcons name="sword-cross" size={16} color="#fff" />
            <Text style={styles.categoryText}>{item.game}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <FlatList
      data={liveStreams}
      keyExtractor={(item) => item.id}
      renderItem={renderStream}
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
  pipContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 90,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#222",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pip: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
    shadowColor: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    elevation: undefined,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  liveBadge: {
    backgroundColor: "#E91916",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  liveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 12,
    marginRight: 12,
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
  shareBtn: {
    marginLeft: 12,
    padding: 4,
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
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 2,
  },
  categoryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});
