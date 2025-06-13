import { Video, ResizeMode } from "expo-av";
import React, { useRef } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";

const CLIPS = [
  {
    id: "1",
    uri: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Clip 1",
  },
  {
    id: "2",
    uri: "https://www.w3schools.com/html/movie.mp4",
    title: "Clip 2",
  },
];

const TAB_BAR_HEIGHT = 60; // Adjust to your actual tab bar height
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CLIP_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

export default function ClipsScreen() {
  const videoRefs = useRef<any[]>([]);

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof CLIPS)[0];
    index: number;
  }) => (
    <View style={styles.clipContainer}>
      <Video
        ref={(ref) => {
          videoRefs.current[index] = ref;
        }}
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={{ color: "white" }}>just chatting. first test</Text>
        <View style={styles.commentsBox}>
          <Text style={{ color: "white" }}>comments</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={CLIPS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={CLIP_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: CLIP_HEIGHT,
        offset: CLIP_HEIGHT * index,
        index,
      })}
      style={{ flex: 1, backgroundColor: "#000" }}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  clipContainer: {
    height: CLIP_HEIGHT,
    width: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: CLIP_HEIGHT,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 100, // Adjust for bottom nav/tab bar
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  commentsBox: {
    position: "absolute",
    right: 24,
    bottom: 100,
  },
});
