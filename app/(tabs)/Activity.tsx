import { Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { View } from "react-native";

export default function Activity() {
  return (
    <>
      <View
        style={{
          display: "flex",
          backgroundColor: "transparent",
          flexDirection: "row",
          gap: "2px",
        }}
      >
        <Link
          href="/Notificationsscreen"
          style={{
            color: "white",
            flex: 1,
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 20,
            padding: 0,
          }}
        >
          Notifications
        </Link>

        <Link
          href="/Whisperscreen"
          style={{
            color: "white",
            flex: 1,
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 20,
            padding: 0,
          }}
        >
          Whisper
        </Link>
      </View>
      <View></View>
    </>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "white",
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    padding: 0,
  },
});
