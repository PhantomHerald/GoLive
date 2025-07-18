import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Inbox } from "lucide-react-native";
import React from "react";

export default function EmptyState({ message = "Nothing here yet.", actionLabel, onAction }: { message?: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.container}>
      <Inbox size={64} color="#BF94FE" style={{ marginBottom: 24 }} />
      <Text style={styles.title}>Empty</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#0e0e10",
    padding: 32,
    marginTop: 64,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#BF94FE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  actionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
}); 