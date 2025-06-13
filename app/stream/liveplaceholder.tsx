import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Video from "react-native-video";

const chatMessages = [
  "WHY ARE YOU WEARING A NIKE FOOTBALL JERSEY AREN'T U WITH ADIDAS?",
  "call his phone Ray",
  "ihop",
  "rakai been dancing in the bathroom instead of taking a bath",
  "waffel house",
];

const LiveStreamApp = () => {
  return (
    <View style={styles.container}>
      {/* Live Stream Video */}
      <Video
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        style={styles.video}
        resizeMode="cover"
        paused={true} // Set to false to auto-play
      />

      {/* Chat Overlay */}
      <View style={styles.chatOverlay}>
        <FlatList
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.chatText}>{item}</Text>}
        />
      </View>

      {/* Live Badge and Viewer Count */}
      <View style={styles.liveBadge}>
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          style={styles.avatar}
        />
        <View style={styles.liveContainer}>
          <Text style={styles.liveText}>LIVE</Text>
          <Text style={styles.viewerCount}>20K</Text>
        </View>
      </View>

      {/* Title and Username */}
      <View style={styles.titleBar}>
        <Text style={styles.username}>rayasianboy ✅</Text>
        <Text style={styles.title}>RAY X TOTA X RAKAI CHAINED TOGETHER ⛓⛓</Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height * 0.6,
  },
  timerOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#000000a0",
    padding: 10,
    borderRadius: 10,
  },
  timerTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  timerCountdown: {
    color: "#fff",
    fontSize: 18,
  },
  chatOverlay: {
    position: "absolute",
    top: height * 0.3,
    right: 10,
    backgroundColor: "#1118",
    padding: 10,
    borderRadius: 10,
    maxHeight: height * 0.3,
    width: width * 0.4,
  },
  chatText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
  },
  liveBadge: {
    position: "absolute",
    bottom: 100,
    right: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  liveContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  liveText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  viewerCount: {
    color: "#fff",
    fontSize: 12,
  },
  titleBar: {
    position: "absolute",
    bottom: 30,
    left: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    color: "#ccc",
    fontSize: 12,
  },
});

export default LiveStreamApp;
