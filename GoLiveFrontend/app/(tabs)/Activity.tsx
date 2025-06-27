import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Activity() {
  const tabs = ["Notifications", "Whisper"];
  const [activeTab, setActiveTab] = useState("Notifications");

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Notifications":
        return (
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                You're all caught up. What a pro! {"\n"}
              </Text>
              <Text style={styles.followingSub}>You have no messages.</Text>
            </View>
          </View>
        );
      case "Whisper":
        return (
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                  backgroundColor: "#9147FF",
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
            </View>
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
              onPress={() => setActiveTab(tab)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeText]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: "black",
    padding: 20,
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    marginTop: 4,
    height: 4,
    width: 28,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
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
