import Navbar from "@/components/ui/navbar";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, Button, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar initialTab="Live" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      android: { marginTop: 30 },
      default: {},
    }),
  },
});
