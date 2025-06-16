import { mockChatMessages, mockStreams } from "@/data/mockdata";
import { HeaderBackButton } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Minimal ChatMessage component definition
type ChatMessageProps = {
  username: string;
  message: string;
  badges?: string[];
  time?: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  username,
  message,
  badges,
  time,
}) => (
  <View
    style={{ flexDirection: "row", marginVertical: 4, alignItems: "center" }}
  >
    <Text style={{ color: "#fff", fontWeight: "bold", marginRight: 6 }}>
      {username}
    </Text>
    <Text style={{ color: "#fff" }}>{message}</Text>
    {time && (
      <Text style={{ color: "#aaa", marginLeft: 8, fontSize: 10 }}>{time}</Text>
    )}
  </View>
);

export default function StreamScreen() {
  //get stream id
  const { id } = useLocalSearchParams<{ id: string }>();
  const stream = mockStreams.find((s) => s.id === "stream-1");

  // State for follow functionality
  const [isFollowing, setIsFollowing] = useState(false);

  //get chat messages
  const ChatMessages = mockChatMessages(id);

  // this is to handle goiing back
  const handleBack = () => {
    router.back();
  };
  // handle follow functionality
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log("Follow functionality is not implemented yet.");
  };

  // this is used to hnddle the share functionality at the moment it isset to console.log
  const handleShare = () => {
    console.log("Share functionality is not implemented yet.");
  };

  // handling send messages
  const handleSendMessage = (message: string) => {
    console.log("Send message functionality is not implemented yet.", message);
  };

  if (!stream) {
    // Show the Navbar with the "Following" tab active
    return (
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        <View style={styles.header}>
          <HeaderBackButton onPress={handleBack} tintColor="#fff" />
          <Text style={[styles.header, { color: "#fff", marginTop: 50 }]}>
            Stream not found
          </Text>
        </View>
      </View>
    );
  } else {
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: "" }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.header}>
        <HeaderBackButton onPress={handleBack} tintColor="#fff" />
        <Text style={{ color: "white" }}> {stream.streamer.displayName}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.sharebutton} onPress={handleShare}>
            <Text> share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.streamcontainer}>
        <Image
          source={{ uri: stream.thumbnail }}
          style={styles.streamthumbnail}
          resizeMode="cover"
        />
        <View style={styles.viewerscount}>
          <Text style={styles.viewerIcon}>viwericon</Text>
          <Text style={styles.viewertext}>{stream.viewers}</Text>
        </View>
      </View>

      <View style={styles.infocontainer}>
        <View style={styles.streamInfo}>
          <Image
            source={{ uri: stream.streamer.avatar }}
            style={styles.avatar}
          />
          <View style={styles.streamInfo}>
            <Text style={[styles.streamTitle, { color: "white" }]}>
              {stream.title}
            </Text>
            <Text style={[styles.streamerName, { color: "white" }]}>
              {stream.streamer.displayName}
            </Text>
            <Text style={[styles.gameText, { color: "white" }]}>
              {stream.game}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={[{ color: "white" }, styles.followText]}>
            {isFollowing ? "following" : "follow"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatTitle, { color: "white" }]}>
            stream chat
          </Text>
        </View>
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {ChatMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              username={message.username}
              message={message.message}
              badges={message.badges}
              time={message.time ? message.time.toString() : undefined}
            />
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>; // remember to use react nat
    // ive navigation to finish off and also use the sharebutton rom reactnative and also use lucide icons
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    backgroundColor: "#9147ff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRight: {
    position: "absolute",
    right: 10,
    top: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  sharebutton: {
    backgroundColor: "#d5ff00",
    padding: 10,
    borderRadius: 20,
    marginLeft: 16,
  },
  streamcontainer: {
    position: "relative",
    aspectRatio: 16 / 9,
  },
  streamthumbnail: {
    width: "100%",
    height: "100%",
  },
  viewerscount: {
    position: "absolute",
    left: 16,
    top: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewerIcon: {
    marginRight: 4,
  },
  viewertext: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
  infocontainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  streamerInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  streamInfo: {
    flex: 1,
  },
  streamTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  streamerName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    marginBottom: 2,
  },
  gameText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  followIcon: {
    marginRight: 6,
  },
  followText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  chatHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2D",
  },
  chatTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2D",
  },
  chatInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1F1F23",
    borderRadius: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chatLoginPrompt: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2D",
  },
  chatLoginText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginBottom: 12,
  },
  chatLoginButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chatLoginButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
});
