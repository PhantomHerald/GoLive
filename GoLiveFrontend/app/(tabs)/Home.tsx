import Navbar from "@/components/ui/navbar";
import React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [resetKey, setResetKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      // When Home tab is focused, reset the Navbar
      setResetKey((prev) => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar key={resetKey} />
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
