import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { mockUsers, mockStreams } from "@/data/mockdata";
import { Avatar } from "@/components/ui/Avatar";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { formatFollowers } from "@/utils/formatFollowers";

const TABS = ["Home", "About", "Clips", "Chats"];

const MOCK_HOME_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Stream Highlight #${i + 1}`,
  desc: `This is a highlight from stream #${i + 1}. Enjoy the best moments!`,
}));

export default function OtherUserProfile() {
  const { username } = useLocalSearchParams();
  let user = mockUsers.find(u => u.username.toLowerCase() === String(username).toLowerCase());
  if (!user) {
    user = mockUsers[0]; // Always show the first mock user if not found
  }

  // Check if user is live (any stream with this username and isLive true)
  const isLive = mockStreams.some(
    s => s.streamer.username.toLowerCase() === user.username.toLowerCase() && s.isLive
  );

  const [activeTab, setActiveTab] = useState("Home");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // The tab bar will be the 4th child (index 4) in the ScrollView
  // 0: profileRowOuterCenter, 1: bio, 2: stats, 3: buttons, 4: tabBar
  const STICKY_INDEX = 4;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      stickyHeaderIndices={[STICKY_INDEX]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileRowOuterCenter}>
        <View style={styles.profileRowHorizontalCentered}>
          <View style={styles.avatarHorizontal}>
            {Avatar ? (
              <Avatar source={{ uri: user.avatar }} size="xl" borderColor="primary" />
            ) : (
              <Image source={{ uri: user.avatar }} style={styles.avatarFallback} />
            )}
          </View>
          <View style={styles.nameBlockHorizontalCentered}>
            <View style={styles.nameRowHorizontal}>
              <Text style={styles.displayName}>{user.displayName}</Text>
              {isLive && <View style={styles.liveTag}><Text style={styles.liveText}>LIVE</Text></View>}
            </View>
            <Text style={styles.username}>@{user.username}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bioContainerCentered}>
        <Text style={styles.bioText}>{user.bio || "No bio available."}</Text>
      </View>
      <View style={styles.statsContainerCentered}>
        <Text style={styles.statNumber}>{formatFollowers(user.followers)}</Text>
        <Text style={styles.statLabel}> followers</Text>
      </View>
      <View style={styles.buttonRowCentered}>
        <TouchableOpacity
          style={[styles.actionBtn, isFollowing && styles.actionBtnActive]}
          onPress={() => setIsFollowing(f => !f)}
        >
          <View style={styles.iconTextRowCentered}>
            <Icon
              name={isFollowing ? "heart" : "heart-outline"}
              size={20}
              color={isFollowing ? "#9147FF" : "#fff"}
              style={styles.iconLeft}
            />
            <Text style={[styles.actionBtnText, isFollowing && styles.actionBtnTextActive]}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.subscribeBtn, isSubscribed && styles.subscribeBtnActive]}
          onPress={() => setIsSubscribed(s => !s)}
        >
          <View style={styles.iconTextRowCentered}>
            <Icon
              name={isSubscribed ? "star" : "star-outline"}
              size={20}
              color={isSubscribed ? "#F43D5C" : "#fff"}
              style={styles.iconLeft}
            />
            <Text style={[styles.actionBtnText, styles.subscribeBtnText, isSubscribed && styles.subscribeBtnTextActive]}>
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Sticky tab bar as a direct child */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBarScroll}
        contentContainerStyle={styles.tabBarScrollContent}
      >
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Tab content below */}
      <View style={styles.tabContent}>
        {activeTab === "Home" && (
          <>
            {MOCK_HOME_ITEMS.map(item => (
              <View key={item.id} style={styles.homeItem}>
                <Text style={styles.homeItemTitle}>{item.title}</Text>
                <Text style={styles.homeItemDesc}>{item.desc}</Text>
              </View>
            ))}
          </>
        )}
        {activeTab === "About" && <Text style={styles.tabContentText}>About content (bio, info, etc.)</Text>}
        {activeTab === "Clips" && <Text style={styles.tabContentText}>Clips content (user's clips)</Text>}
        {activeTab === "Chats" && <Text style={styles.tabContentText}>Chats content (chat history, etc.)</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0e0e10",
    alignItems: "center",
    padding: 24,
    paddingTop: 0,
  },
  profileHeaderCentered: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 8,
  },
  avatarCentered: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#222",
  },
  nameBlockCentered: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nameRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  displayName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  liveTag: {
    backgroundColor: "#F43D5C",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignSelf: "center",
  },
  liveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  username: {
    color: "#BF94FE",
    fontSize: 16,
    marginTop: 2,
  },
  bioContainerCentered: {
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bioText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainerCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 8,
    marginTop: 2,
    paddingLeft: 2,
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 15,
    marginLeft: 2,
  },
  buttonRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
    gap: 12,
    paddingLeft: 2,
  },
  actionBtn: {
    flex: 1,
    minWidth: 120,
    maxWidth: 180,
    backgroundColor: "#9147FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnActive: {
    backgroundColor: "#2A2929",
    borderWidth: 1.5,
    borderColor: "#9147FF",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionBtnTextActive: {
    color: "#9147FF",
  },
  subscribeBtn: {
    backgroundColor: "#F43D5C",
    marginRight: 0,
    marginLeft: 0,
  },
  subscribeBtnActive: {
    backgroundColor: "#2A2929",
    borderWidth: 1.5,
    borderColor: "#F43D5C",
  },
  subscribeBtnText: {
    color: "#fff",
  },
  subscribeBtnTextActive: {
    color: "#F43D5C",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginBottom: 12,
    marginTop: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#9147FF",
  },
  tabText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 24,
    minHeight: 120,
  },
  tabContentText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.85,
  },
  profileRowHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
  },
  avatarHorizontal: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  nameBlockHorizontal: {
    flex: 1,
    justifyContent: "center",
  },
  nameRowHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  profileRowOuterCenter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 8,
  },
  profileRowHorizontalCentered: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  nameBlockHorizontalCentered: {
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: "left",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconTextRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconLeft: {
    marginRight: 8,
  },
  tabBarScroll: {
    backgroundColor: "#0e0e10",
    width: "100%",
    zIndex: 10,
    // Remove marginTop/marginBottom to avoid shifting
  },
  tabBarScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  homeItem: {
    backgroundColor: "#18181B",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  homeItemTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  homeItemDesc: {
    color: "#aaa",
    fontSize: 14,
  },
}); 