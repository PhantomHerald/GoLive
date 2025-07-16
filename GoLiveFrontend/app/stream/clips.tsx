import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState, useCallback } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign, Feather, MaterialIcons, Entypo } from '@expo/vector-icons';

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
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CLIP_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

export default function ClipsScreen() {
  const videoRefs = useRef<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState<{ [key: number]: boolean }>({});
  const [resizeModes, setResizeModes] = useState<{ [key: number]: ResizeMode }>({});
  const isFocused = useIsFocused();

  // Callback for FlatList to know which item is visible
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // Consider item visible if 80% is visible
  };

  // Effect to play/pause videos based on visibility and focus
  React.useEffect(() => {
    videoRefs.current.forEach((ref, idx) => {
      if (ref) {
        if (idx === currentIndex && isFocused) {
          ref.playAsync && ref.playAsync();
        } else {
          ref.pauseAsync && ref.pauseAsync();
        }
      }
    });
  }, [currentIndex, isFocused]);

  const handleMuteToggle = (index: number) => {
    setMuted((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleResizeToggle = (index: number) => {
    setResizeModes((prev) => ({
      ...prev,
      [index]: prev[index] === ResizeMode.CONTAIN ? ResizeMode.COVER : ResizeMode.CONTAIN,
    }));
  };

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
        resizeMode={resizeModes[index] || ResizeMode.COVER}
        isLooping
        shouldPlay={index === currentIndex && isFocused}
        isMuted={!!muted[index]}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={{ color: "white" }}>just chatting. first test</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <AntDesign name="like2" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Feather name="share" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleMuteToggle(index)}>
            <MaterialIcons name={muted[index] ? "volume-off" : "volume-up"} size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleResizeToggle(index)}>
            <MaterialIcons name={resizeModes[index] === ResizeMode.CONTAIN ? "fullscreen-exit" : "fullscreen"} size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Entypo name="dots-three-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
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
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
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
    width: SCREEN_WIDTH,
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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 18,
  },
  iconButton: {
    padding: 6,
  },
});
