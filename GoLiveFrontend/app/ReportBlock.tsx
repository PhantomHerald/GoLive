import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

export default function ReportBlockPage() {
  const { target } = useLocalSearchParams(); // target could be username or content id
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report or Block</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => alert('Report submitted!')}>
        <Text style={styles.actionText}>Report {target ? `@${target}` : "this content"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => alert('User blocked!')}>
        <Text style={styles.actionText}>Block {target ? `@${target}` : "this user"}</Text>
      </TouchableOpacity>
      <Text style={styles.info}>Reporting or blocking is anonymous. Thank you for helping keep GoLive safe.</Text>
    </View>
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
  subtitle: {
    color: "#BF94FE",
    fontSize: 18,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: "#BF94FE",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 32,
    textAlign: "center",
  },
}); 