import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function FollowingList() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Following</Text>
      <Text style={styles.placeholder}>This is a placeholder for the following list.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e10",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },
  backText: {
    color: "#BF94FE",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  placeholder: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
}); 