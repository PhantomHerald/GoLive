import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Image
        source={require("@/assets/images/ChatGPT Image May 15, 2025, 10_25_26 PM.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text>keep up with your favorite creators</Text>
      <Text>when you follow creators, you’ll see them here</Text>
      <Text>Discover new channels and find more creators to follow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
