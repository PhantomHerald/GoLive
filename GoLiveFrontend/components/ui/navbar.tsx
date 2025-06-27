import ClipsScreen from "@/app/stream/clips";
import { mockFollowedChannels, mockStreams } from "@/data/mockdata";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NavbarProps = {
  initialTab?: string;
};
// Get only live users
const liveChannels = mockFollowedChannels.filter((ch) => ch.isLive);

// Helper to get the stream title for a user
const getStreamTitle = (username: string) => {
  const stream = mockStreams.find(
    (s) => s.streamer.username === username && s.isLive
  );
  return stream ? stream.title : "";
};

export default function Navbar({ initialTab = "Following" }: NavbarProps) {
  const tabs = ["Following", "Live", "Clips"];
  const [activeTab, setActiveTab] = useState(initialTab);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Following":
        return (
          <FlatList
            data={mockFollowedChannels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.channelRow}>
                <View style={{ position: "relative" }}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  {item.isLive && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "red",
                        borderWidth: 2,
                        borderColor: "#18181b",
                      }}
                    />
                  )}
                </View>
                <View style={styles.info}>
                  <Text style={styles.displayName}>{item.displayName}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Image
                  source={require("@/assets/images/ChatGPT Image May 15, 2025, 10_25_26 PM.png")}
                  style={{ width: 200, height: 200 }}
                />
                <Text style={styles.followingTitle}>
                  Keep up with your {"\n"}
                  favorite creators
                </Text>
                <Text style={styles.followingSub}>
                  when you follow creators, you’ll see {"\n"} them here
                </Text>
                <Text style={styles.followingDiscover}>
                  Discover new channels and find more {"\n"} creators to follow
                </Text>
              </View>
            }
          />
        );
      case "Live":
        return (
          <View>
            <Text
              style={{
                color: "#FFF",
                fontSize: 20,
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: 20,
                width: 141,
                height: 42,
                flexDirection: "column",
                justifyContent: "center",
                flexShrink: 0,
                paddingLeft: 10,
              }}
            >
              Live Now
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/images/nolivesimg.png")}
                style={{
                  width: 200,
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <Text style={styles.followingTitle}>
                They will be back! {"\n"}
              </Text>
              <Text style={styles.followingSub}>
                meanwhile, explore the Live Feed for other {"\n"}content you
                might be interested in!
              </Text>
            </View>
          </View>
        );
      case "Clips":
        return (
          <View style={{ flex: 1 }}>
            <ClipsScreen />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(tab)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeText]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>
        {/* Stacked Circles (Icon) */}
        <View style={styles.circlesContainer}>
          <View style={[styles.circle, { right: 20 }]} />
          <View style={[styles.circle, { right: 10 }]} />
          <View style={[styles.circle, { right: 0 }]} />
        </View>
      </View>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: "transparent",
    padding: 20,
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "transparent",
  },
  tab: {
    marginHorizontal: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tabText: {
    color: "#ccc",
    fontSize: 20,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  underline: {
    marginTop: 4,
    height: 4,
    width: 28,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  followingTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  followingSub: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  followingDiscover: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
  circlesContainer: {
    width: 60,
    height: 40,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    marginLeft: 16,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#444",
    position: "absolute",
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  displayName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  username: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "400",
  },
});
