import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { WifiOff } from "lucide-react-native";
import React, { useState } from "react";
import * as Network from "expo-network";

export default function OfflineState({ onRetry, onRetrySuccess }: { onRetry?: () => void; onRetrySuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    if (onRetry) onRetry();
    setTimeout(async () => {
      const state = await Network.getNetworkStateAsync();
      setLoading(false);
      if (state.isConnected && state.isInternetReachable !== false) {
        if (onRetrySuccess) onRetrySuccess();
      }
      // If still offline, just stay on this screen
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size={48} color="#BF94FE" style={{ marginBottom: 24 }} />
          <WifiOff size={64} color="#BF94FE" style={{ marginBottom: 24, opacity: 0.3 }} />
        </>
      ) : (
        <WifiOff size={64} color="#BF94FE" style={{ marginBottom: 24 }} />
      )}
      <Text style={styles.title}>Offline</Text>
      <Text style={styles.message}>
        {loading ? "Trying to connect to the internet..." : "You are not connected to the internet."}
      </Text>
      {onRetry && !loading && (
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} disabled={loading}>
          <Text style={styles.retryText}>Retry</Text>
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
  retryButton: {
    backgroundColor: "#BF94FE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  retryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
}); 