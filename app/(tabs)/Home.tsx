import Navbar from "@/components/ui/navbar";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Navbar />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Image
          source={require("@/assets/images/ChatGPT Image May 15, 2025, 10_25_26 PM.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text
          style={[
            styles.text,
            {
              textAlign: "center",
              color: "white",
              fontSize: 24,
              fontWeight: "600",
              wordWrap: "break-word",
              marginBottom: 20,
            },
          ]}
        >
          Keep up with your {"\n"}
          favorite creators
        </Text>

        <Text
          style={[
            styles.text,
            {
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "400",
              wordWrap: "break-word",
              marginBottom: 20,
            },
          ]}
        >
          when you follow creators, you’ll see {"\n"} them here
        </Text>

        <Text
          style={[
            styles.text,
            {
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "500",
              wordWrap: "break-word",
              marginBottom: 20,
            },
          ]}
        >
          Discover new channels and find more {"\n"} creators to follow
        </Text>
      </View>
    </>
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
  text: {
    color: "white",
    fontSize: 16,
    justifyContent: "center",
  },
});
