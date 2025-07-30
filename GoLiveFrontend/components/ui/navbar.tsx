import ClipsScreen from "@/app/stream/clips";
import ClipsS3Screen from "@/app/stream/clips-s3";
import { mockFollowedChannels, mockStreams } from "@/data/mockdata";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LiveStreamApp from "@/app/stream/live";

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

export default function Navbar({ initialTab = "Live" }: NavbarProps) {
  const tabs = ["Following", "Live", "Clips"];
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabIndex = tabs.indexOf(activeTab);
  const navigation = useNavigation();
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const underlineAnim = React.useRef(new Animated.Value(tabIndex)).current;
  const [isHomeFocused, setIsHomeFocused] = useState(true);

  // Listen for Home tab press and reset to 'Live'
  useFocusEffect(
    React.useCallback(() => {
      setIsHomeFocused(true);
      const unsubscribe = navigation.addListener?.("blur", () => {
        setIsHomeFocused(false);
      });
      return () => {
        setIsHomeFocused(false);
        if (unsubscribe) unsubscribe();
      };
    }, [navigation])
  );

  React.useEffect(() => {
    Animated.spring(underlineAnim, {
      toValue: tabIndex,
      useNativeDriver: false,
      friction: 7,
      tension: 80,
    }).start();
  }, [tabIndex, underlineAnim]);

  const handleTabTextLayout = (tab: string, event: any) => {
    const width = event.nativeEvent.layout.width;
    setTabWidths((prev) => ({ ...prev, [tab]: width }));
  };

  // Swipe gesture logic
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50 && tabIndex < tabs.length - 1) {
        setActiveTab(tabs[tabIndex + 1]);
      } else if (gestureState.dx > 50 && tabIndex > 0) {
        setActiveTab(tabs[tabIndex - 1]);
      }
    },
  });

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Following":
        return (
          <FlatList
            data={mockFollowedChannels || []}
            keyExtractor={(item) => item?.id || Math.random().toString()}
            renderItem={({ item }) =>
              item && item.displayName && item.avatar ? (
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
              ) : null
            }
            contentContainerStyle={{ paddingTop: 60 }}
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
          <View style={{ flex: 1 }}>
            <LiveStreamApp />
          </View>
        );
      /*  return (
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
        );*/
      case "Clips":
        return (
          <View style={{ flex: 1 }}>
            <ClipsS3Screen paused={!isHomeFocused || activeTab !== "Clips"} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar} pointerEvents="box-none">
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(tab)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeText,
                  ]}
                  onLayout={(e) => handleTabTextLayout(tab, e)}
                >
                  {tab}
                </Text>
                {/* Animated underline directly under text */}
                {activeTab === tab && tabWidths[tab] && (
                  <Animated.View
                    style={[
                      styles.underline,
                      {
                        width: tabWidths[tab],
                        backgroundColor: "#006eff",
                        height: 3,
                        marginTop: 2,
                        opacity: 1,
                        transform: [
                          {
                            scaleX: underlineAnim.interpolate({
                              inputRange: [index - 1, index, index + 1],
                              outputRange: [0.7, 1, 0.7],
                              extrapolate: "clamp",
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Stacked Circles (Icon) */}
        <View style={styles.circlesContainer}>
          <View style={[styles.circle, { right: 14 }]} />
          <View style={[styles.circle, { right: 7 }]} />
          <View style={[styles.circle, { right: 0 }]} />
        </View>
      </View>
      <View style={styles.contentContainer} {...panResponder.panHandlers}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    height: 60,
    backgroundColor: "rgba(10,10,20,0.3)", // dark transparent background
    paddingTop: 0,
    elevation: 0,
    shadowOpacity: 1,
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
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "transparent",
    // Removed any paddingTop or marginTop
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
    marginHorizontal: 15,
    bottom: -5,
    backgroundColor: "transparent", // Make container transparent
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(68,68,68,0.8)",
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
