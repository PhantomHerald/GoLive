import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.profileContainer}>
        <View style={styles.avatar} />
        <Text style={styles.username}>jsisjjais</Text>
        <Text style={styles.status}>Offline</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Stream Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          {["Home", "About", "Clips", "Videos", "Schedule"].map((tab, i) => (
            <Text key={i} style={[styles.tabItem, i === 0 && styles.activeTab]}>
              {tab}
            </Text>
          ))}
        </View>

        <View style={styles.emptyContent}>
          <Image
            source={require("@/assets/images/favicon.png")} // Add a similar PNG or SVG to your assets
            style={styles.icon}
          />
          <Text style={styles.noContentText}>This channel has no content</Text>
          <Text style={styles.quietText}>It's quiet... too quiet...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e10" },
  header: {
    height: 100,
    backgroundColor: "#9147ff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  avatar: {
    backgroundColor: "#d5ff00",
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  status: {
    color: "gray",
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#2e2e32",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "#9147ff",
    borderBottomWidth: 2,
    marginTop: 15,
    width: "100%",
  },
  tabItem: {
    color: "#ccc",
    fontSize: 14,
    paddingBottom: 8,
  },
  activeTab: {
    color: "#9147ff",
    fontWeight: "bold",
  },
  emptyContent: {
    marginTop: 50,
    alignItems: "center",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  noContentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quietText: {
    color: "gray",
    fontSize: 14,
  },
});
