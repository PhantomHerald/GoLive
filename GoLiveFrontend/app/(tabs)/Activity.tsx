import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Animated, ScrollView as RNScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Bell } from "lucide-react-native";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "follow",
    message: "Alice started following you.",
    time: "2m",
  },
  {
    id: 2,
    type: "like",
    message: "Bob liked your stream.",
    time: "10m",
  },
  {
    id: 3,
    type: "comment",
    message: "Charlie commented: 'Great stream!'",
    time: "1h",
  },
  {
    id: 4,
    type: "follow",
    message: "Alice started following you.",
    time: "2m",
  },
  {
    id: 5,
    type: "like",
    message: "Bob liked your stream.",
    time: "10m",
  },
  {
    id: 6,
    type: "comment",
    message: "Charlie commented: 'Great stream!'",
    time: "1h",
  },
];

const mockWhispers = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  from: `User${i + 1}`,
  message: `This is a whisper message #${i + 1}.`,
  time: `${2 + i}m`,
}));

export default function Activity() {
  const tabs = React.useMemo(() => ["Notifications", "Whisper"], []);
  const params = useLocalSearchParams();
  const initialTab = typeof params.tab === 'string' && tabs.includes(params.tab) ? params.tab : "Notifications";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const underlineAnim = useRef(new Animated.Value(tabs.indexOf(activeTab))).current;
  const scrollRef = useRef<RNScrollView>(null);

  React.useEffect(() => {
    Animated.spring(underlineAnim, {
      toValue: tabs.indexOf(activeTab),
      useNativeDriver: false,
      friction: 7,
      tension: 80,
    }).start();
  }, [activeTab, tabs, underlineAnim]);

  // When tab is pressed, scroll to the correct page
  const handleTabPress = (tab: string, index: number) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ x: index * 1000, animated: true });
  };

  // When swiped, update the active tab
  const handleScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / 1000);
    if (tabs[index] && tabs[index] !== activeTab) {
      setActiveTab(tabs[index]);
    }
  };

  const handleTabTextLayout = (tab: string, event: any) => {
    const width = event.nativeEvent.layout.width;
    setTabWidths((prev) => ({ ...prev, [tab]: width }));
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Notifications":
        return (
          <View style={{ flex: 1 }}>
            {mockNotifications.length === 0 ? (
              <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                  You&apos;re all caught up. What a pro! {"\n"}
                </Text>
                <Text style={styles.followingSub}>You have no notifications.</Text>
              </ScrollView>
            ) : (
              <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                {mockNotifications.map((notif) => (
                  <View
                    key={notif.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#18181b",
                      borderRadius: 10,
                      width: '100%',
                      paddingHorizontal: 16,
                      marginBottom: 12,
                      padding: 14,
                    }}
                  >
                    <Bell size={24} color="#006eff" style={{ marginRight: 14 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#fff", fontSize: 16 }}>{notif.message}</Text>
                      <Text style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}>{notif.time} ago</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        );
      case "Whisper":
        return (
          <View style={{ flex: 1 }}>
            {mockWhispers.length === 0 ? (
              <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require("@/assets/images/nolivesimg.png")} ///remember to change the image to the correct on and reduce the size
                  style={{
                    width: 200,
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <Text style={styles.followingTitle}>
                  No Whispers Available!{"\n"}
                </Text>
                <Text style={styles.followingSub}>
                  See something cool in a stream? Tell{"\n"}
                  someone about it!
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#006eff",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Add your button action here
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Start a conversation
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                {mockWhispers.map((whisper) => (
                  <View
                    key={whisper.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#18181b",
                      borderRadius: 10,
                      width: '100%',
                      paddingHorizontal: 16,
                      marginBottom: 12,
                      padding: 14,
                    }}
                  >
                    <Image
                      source={require("@/assets/images/favicon.png")}
                      style={{ width: 32, height: 32, borderRadius: 16, marginRight: 14, backgroundColor: "#333" }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#fff", fontSize: 16 }}>
                        <Text style={{ color: "#006eff", fontWeight: "bold" }}>{whisper.from}: </Text>
                        {whisper.message}
                      </Text>
                      <Text style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}>{whisper.time} ago</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
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
              onPress={() => handleTabPress(tab, index)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[styles.tabText, activeTab === tab && styles.activeText]}
                  onLayout={(e) => handleTabTextLayout(tab, e)}
                >
                  {tab}
                </Text>
                {activeTab === tab && tabWidths[tab] && (
                  <Animated.View
                    style={[
                      styles.underline,
                      {
                        width: tabWidths[tab],
                        backgroundColor: "#006eff",
                        height: 3,
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
      </View>
      {/* Only show the active tab's content, no horizontal scroll */}
      <View style={{ flex: 1, width: '100%' }}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: "black",
    padding: 15,
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
  },
  tab: {
    marginHorizontal: 12,
    alignItems: "center",
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
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
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
});
