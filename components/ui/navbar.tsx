import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Navbar() {
  const tabs = ["Following", "Live", "Clips"];
  const [activeTab, setActiveTab] = useState("Live");

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab)}
            style={styles.tab}
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

      {/* Stacked Circles (Icon) */}
      <View style={styles.circlesContainer}>
        <View style={[styles.circle, { right: 20 }]} />
        <View style={[styles.circle, { right: 10 }]} />
        <View style={[styles.circle, { right: 0 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    padding: 20,
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
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
  circlesContainer: {
    width: 60,
    height: 40,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#444",
    position: "absolute",
  },
});
