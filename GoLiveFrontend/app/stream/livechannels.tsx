import { mockStreams } from "@/data/mockdata";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LiveChannelsScreen() {
  // Get all live streams
  const liveStreams = mockStreams.filter((s) => s.isLive);

  return (
    <SafeAreaView>
      <Text style={styles.header}>Live Channels</Text>
      <FlatList
        data={liveStreams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.channelRow}>
            <Image
              source={{ uri: item.streamer.avatar }}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.displayName}>
                {item.streamer.displayName}
              </Text>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={styles.followingTitle}>No one is live right now</Text>
            <Text style={styles.followingSub}>Come back later!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18181b", padding: 16 },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23232a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    backgroundColor: "#333",
  },
  info: { flex: 1 },
  displayName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    color: "#bdbdbd",
    fontSize: 14,
  },
});
