import Navbar from "@/components/ui/navbar";
import React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
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
